/**
 * Meal photo -> dish identification, via a vision-language model on Hugging Face.
 *
 * This runs server-side so HF_API_KEY never reaches the browser. The client
 * posts a downscaled JPEG data URL; we return a normalised JSON result.
 */

const HF_ROUTER = "https://router.huggingface.co/v1/chat/completions";

// Chosen by testing real South Indian dishes through this exact prompt:
//   235B-A22B  -> idli OK, masala dosa OK, ~2.1s
//   72B        -> idli OK, ~2.5s
//   30B-A3B    -> called a platter of idli "medu vada" (twice), and spiked to 15.8s
// Smaller is not safer here. Fall back to "Qwen/Qwen2.5-VL-72B-Instruct" if this
// model stops being served; avoid the 30B.
const HF_MODEL = "Qwen/Qwen3-VL-235B-A22B-Instruct";

// Netlify's synchronous functions cut off around 10s, so give the upstream
// call a shorter budget and fail cleanly rather than being killed mid-flight.
const UPSTREAM_TIMEOUT_MS = 8500;

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const ALLOWED_MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp"];

const SYSTEM_PROMPT = `You identify meals from photographs for a diabetes care app used in Coimbatore, Tamil Nadu, India. Most meals you see will be South Indian home cooking (idli, dosa, vada, pongal, upma, sambar, rasam, curd rice, lemon rice, poori, parotta, biryani), but you may also see North Indian, Western, or restaurant food.

Identify the dish and estimate its carbohydrate and calorie content for the portion actually visible in the photo.

Rules:
- Judge portion size from visible references: plate diameter, katori/bowl size, spoons, hands.
- Name the dish the way a local would (e.g. "medu vada", "curd rice", "masala dosa with sambar").
- If several items share the plate, name the combination and give totals for everything visible.
- Be honest about uncertainty. Set confidence to "low" when the portion is ambiguous, the photo is unclear, or the dish is hard to place. Do not guess confidently.
- If the image is not food, set is_food to false and leave the other fields at zero/empty.

Reply with ONE JSON object and nothing else. No markdown, no code fences, no commentary.

{"is_food": boolean, "food": string, "carbs_g": number, "calories": number, "confidence": "high" | "medium" | "low", "notes": string}

"notes" is one short sentence naming the portion assumption you made (e.g. "Assumed 2 medium idli and about 100ml sambar").`;

type AnalysisResult = {
  is_food: boolean;
  food: string;
  carbs_g: number;
  calories: number;
  confidence: "high" | "medium" | "low";
  notes: string;
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/** Pull the JSON object out of a model reply that may be fenced or padded with prose. */
function extractJson(raw: string): unknown {
  const trimmed = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try {
    return JSON.parse(trimmed);
  } catch {
    // Fall back to the outermost {...} span.
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start === -1 || end <= start) return null;
    try {
      return JSON.parse(trimmed.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}

/** Coerce the model's reply into our shape, or return null if it is unusable. */
function normalise(parsed: unknown): AnalysisResult | null {
  if (typeof parsed !== "object" || parsed === null) return null;
  const o = parsed as Record<string, unknown>;

  const food = typeof o.food === "string" ? o.food.trim() : "";
  const isFood = o.is_food !== false && food !== "";
  if (!isFood) {
    return { is_food: false, food: "", carbs_g: 0, calories: 0, confidence: "low", notes: "" };
  }

  const num = (v: unknown): number => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) && n >= 0 ? Math.round(n) : 0;
  };

  const confidence =
    o.confidence === "high" || o.confidence === "medium" || o.confidence === "low"
      ? o.confidence
      : "low";

  return {
    is_food: true,
    food,
    carbs_g: num(o.carbs_g),
    calories: num(o.calories),
    confidence,
    notes: typeof o.notes === "string" ? o.notes.trim() : "",
  };
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const apiKey = process.env.HF_API_KEY;
  if (!apiKey) {
    return json(
      { error: "server_not_configured", message: "HF_API_KEY is not set." },
      500,
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const image = (body as Record<string, unknown> | null)?.image;
  if (typeof image !== "string" || !image.startsWith("data:")) {
    return json(
      { error: "invalid_image", message: "Expected { image: 'data:image/...;base64,...' }" },
      400,
    );
  }

  const mediaType = image.slice(5, image.indexOf(";"));
  if (!ALLOWED_MEDIA_TYPES.includes(mediaType)) {
    return json(
      { error: "unsupported_media_type", message: `Got ${mediaType || "unknown"}.` },
      415,
    );
  }

  // base64 is ~4/3 the byte size of the original.
  const base64Length = image.length - image.indexOf(",") - 1;
  if (base64Length * 0.75 > MAX_IMAGE_BYTES) {
    return json({ error: "image_too_large" }, 413);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  let upstream: Response;
  try {
    upstream = await fetch(HF_ROUTER, {
      method: "POST",
      signal: controller.signal,
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: HF_MODEL,
        max_tokens: 400,
        temperature: 0.2,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: image } },
              { type: "text", text: "Identify this meal and estimate its carbs." },
            ],
          },
        ],
      }),
    });
  } catch (err) {
    clearTimeout(timer);
    const aborted = err instanceof Error && err.name === "AbortError";
    return json(
      {
        error: aborted ? "upstream_timeout" : "upstream_unreachable",
        message: aborted
          ? "The model did not respond in time. It may be starting up — try again."
          : "Could not reach Hugging Face.",
      },
      504,
    );
  }
  clearTimeout(timer);

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    // 503 from HF usually means the model is cold-starting; it is worth retrying.
    return json(
      {
        error: upstream.status === 503 ? "model_loading" : "upstream_error",
        status: upstream.status,
        message: detail.slice(0, 300),
      },
      upstream.status === 503 ? 503 : 502,
    );
  }

  const payload = (await upstream.json().catch(() => null)) as {
    choices?: { message?: { content?: unknown } }[];
  } | null;

  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || content.trim() === "") {
    return json({ error: "empty_response" }, 502);
  }

  const result = normalise(extractJson(content));
  if (!result) {
    return json(
      { error: "unparseable_response", message: content.slice(0, 300) },
      502,
    );
  }

  if (!result.is_food) {
    return json(
      { error: "not_food", message: "That does not look like a meal." },
      422,
    );
  }

  return json({ ...result, model: HF_MODEL }, 200);
};
