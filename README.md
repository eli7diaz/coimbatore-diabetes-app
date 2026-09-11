# India Care — Diabetes Platform

A diabetes care web app for Coimbatore, Tamil Nadu. Patients log glucose
readings, sync devices, and photograph meals to estimate carbohydrate content;
providers get a clinic dashboard. Next.js 16 (static export) + Firebase, with
meal photo identification running on a Hugging Face vision model.

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create your `.env`

```bash
cp .env.example .env
```

### 3. Add your Hugging Face API key

Open `.env` and paste your token after `HF_API_KEY=`:

```
HF_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Get one at **https://huggingface.co/settings/tokens** — a **Read** token is
enough. Without it, meal analysis returns `500 server_not_configured`.

> `.env` is git-ignored. Never commit it, and never rename `HF_API_KEY` to
> `NEXT_PUBLIC_*` — that would ship the token to every visitor in the JS
> bundle.

Firebase keys go in the same file (see `.env.example`). The app runs without
them, but readings and meal logs won't persist.

### 4. Run it

```bash
npm run dev
```

Open **http://localhost:3000**.

---

## Why `npm run dev` and not `next dev`

The app is a static export (`output: "export"` in `next.config.js`), so Next
has no server at runtime and cannot host an API route. Meal analysis therefore
runs as a **Netlify function** (`netlify/functions/analyze-meal.ts`), which
`next dev` doesn't serve.

`npm run dev` runs `netlify dev`, which serves the app *and* the function on
one origin — so local behaves exactly like production. Next runs on port 3001
underneath; you don't need to visit it.

| Command | URL | Meal analysis |
| --- | --- | --- |
| `npm run dev` | http://localhost:3000 | works |
| `npm run dev:no-functions` | http://localhost:3000 | 404s — UI-only work |

If the analyzer shows *"The analysis service isn't running"*, you started Next
directly. Stop it and use `npm run dev`.

---

## Deploying

Pushes deploy to Netlify. `.env` is not in the repo, so set the key in the
dashboard once:

**Site configuration → Environment variables → Add `HF_API_KEY`**

Without it the site builds fine but meal analysis fails at runtime.

---

## How meal analysis works

1. The browser downscales the photo to 1024px / JPEG q0.8 — small enough for
   Firestore's 1MiB document limit and cheap to send.
2. It POSTs to `/.netlify/functions/analyze-meal`.
3. The function calls `Qwen/Qwen3-VL-235B-A22B-Instruct` via Hugging Face's
   router, prompted for South Indian cuisine, and returns the dish, estimated
   carbs and calories, a confidence level, and the portion assumption it made.

To change model, edit `HF_MODEL` at the top of the function. Test any
replacement on real dishes first — a smaller model (`Qwen3-VL-30B-A3B`)
identified a platter of idli as "medu vada" with high confidence.

> **Carb estimates are approximate.** On one test photo, different models
> returned 45g, 60g, 65g, and 120g. Treat the number as a starting point to
> confirm, not a measurement — especially where it feeds the insulin
> calculator.

---

## Scripts

| Script | Does |
| --- | --- |
| `npm run dev` | App + functions on :3000 |
| `npm run dev:no-functions` | Next only, no meal analysis |
| `npm run build` | Static export to `out/` |
| `npm run lint` | ESLint |
