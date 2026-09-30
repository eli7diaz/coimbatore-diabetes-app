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

Your main job is to say what is on the plate and how much of it. The app looks up carbohydrate from its own nutrition table, so your counts matter far more than your nutrition knowledge.

Alongside each food, also give your best estimate of the carbohydrate and calories in ONE unit of it. These are a FALLBACK, used only when a food is missing from the app's table; for foods the app already knows, your figures are ignored. Give realistic per-unit numbers for the unit you counted in, not for the whole plate.

For each distinct food visible, report its name and how many units of it there are:
- Countable foods (idli, dosa, vada, poori, chapati, parotta, appam, idiyappam): count the actual pieces. 6 idli is {"name": "idli", "count": 6}.
- Served foods (sambar, rasam, rice, curd rice, pongal, upma, biryani): count servings, where 1 means one normal bowl or plate. Two small katoris of sambar is {"name": "sambar", "count": 2}.
- Condiments (chutney, pickle): count tablespoons.

Rules:
- Name each food plainly and on its own: "idli", "sambar", "coconut chutney". Do not merge them into one name like "idli with sambar", and do not add descriptions.
- Count what you can actually see. If idli are stacked or overlapping, count the ones visible and say so in notes.
- Judge serving size against visible references: plate diameter, katori size, spoons, hands.
- Set confidence to "low" when pieces are hard to count, the photo is unclear, or you are unsure what a dish is. Be honest; a low confidence is more useful than a confident guess.
- If the image is not food, set is_food to false and return an empty items array.

Reply with ONE JSON object and nothing else. No markdown, no code fences, no commentary.

{"is_food": boolean, "items": [{"name": string, "count": number, "est_carbs_per_unit": number, "est_calories_per_unit": number}], "confidence": "high" | "medium" | "low", "notes": string}

"notes" is one short sentence on what you counted and anything that made it hard (e.g. "Counted 10 idli around the rim; the two at the back may be partly hidden").`;

type AnalysedItem = {
  name: string;
  count: number;
  /** Fallback figures, used by the client only when the nutrition table has no match. */
  est_carbs_per_unit: number;
  est_calories_per_unit: number;
};

type AnalysisResult = {
  is_food: boolean;
  items: AnalysedItem[];
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

  const confidence =
    o.confidence === "high" || o.confidence === "medium" || o.confidence === "low"
      ? o.confidence
      : "low";
  const notes = typeof o.notes === "string" ? o.notes.trim() : "";

  const rawItems = Array.isArray(o.items) ? o.items : [];
  const items: AnalysedItem[] = [];

  for (const raw of rawItems) {
    if (typeof raw !== "object" || raw === null) continue;
    const r = raw as Record<string, unknown>;

    const name = typeof r.name === "string" ? r.name.trim() : "";
    if (!name) continue;

    // A missing or unusable count means "one of it" rather than zero — zero
    // would silently drop food off the plate and understate the dose.
    const parsedCount = typeof r.count === "number" ? r.count : Number(r.count);
    const count =
      Number.isFinite(parsedCount) && parsedCount > 0 ? Math.round(parsedCount * 10) / 10 : 1;

    const nonNegative = (v: unknown): number => {
      const n = typeof v === "number" ? v : Number(v);
      return Number.isFinite(n) && n >= 0 ? Math.round(n * 10) / 10 : 0;
    };

    items.push({
      name,
      count,
      est_carbs_per_unit: nonNegative(r.est_carbs_per_unit),
      est_calories_per_unit: nonNegative(r.est_calories_per_unit),
    });
  }

  if (o.is_food === false || items.length === 0) {
    return { is_food: false, items: [], confidence: "low", notes };
  }

  return { is_food: true, items, confidence, notes };
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
