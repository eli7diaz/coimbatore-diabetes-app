/**
 * Carbohydrate and calorie reference for the meal analyzer.
 *
 * The vision model identifies the dish and counts portions; it does NOT report
 * carbs. Carbs and calories are computed here, from this table, so the numbers
 * are consistent, auditable, and correctable in one place.
 *
 * ── WHERE THESE NUMBERS COME FROM ────────────────────────────────────────────
 *
 * "INDB"  Indian Nutrient Databank (Jaacks et al., 2024) — open-access, derived
 *         from ICMR-NIN Indian Food Composition Tables 2017/2004. Per-serving
 *         values taken directly from INDB.xlsx.
 *         https://github.com/lindsayjaacks/Indian-Nutrient-Databank-INDB-
 *
 * "Dr. Mohan's"  Dr. Mohan's Diabetes Specialities Centre, Chennai — published
 *         per-piece figures for South Indian tiffin items.
 *
 * "approximate"  Commonly cited values, used where INDB has no entry or where
 *         its entry is demonstrably wrong (see below). These are the least
 *         reliable figures in this file.
 *
 * ── WHY SOME INDB VALUES WERE REJECTED ───────────────────────────────────────
 *
 * INDB's composite-recipe figures are sound for steamed and griddled dishes but
 * wrong for deep-fried ones: it appears to count the full frying-oil quantity as
 * part of the food, which inflates energy and dilutes carbohydrate per 100 g.
 *   Poori       738 kcal/100 g and  8.2 g carb   (a wheat poori is ~350 / ~35)
 *   Medu vada   745 kcal/100 g and  7.7 g carb
 * Entries affected by this carry source "approximate" and a note.
 *
 * ── IMPORTANT ────────────────────────────────────────────────────────────────
 *
 * Every entry is `verified: false`. These figures feed an insulin bolus
 * calculation and NONE of them has been checked by a dietitian or clinician.
 * Reviewing this file is a prerequisite to any clinical use. Set `verified` to
 * true per entry as it is signed off, and the UI will stop flagging it.
 *
 * Portion weights are stated in `unit` because they drive everything: an idli
 * at 25 g and an idli at 40 g differ by more than half a unit of insulin across
 * a typical breakfast.
 */

export type NutritionEntry = {
    /** Stable key, also used as the React list key. */
    id: string;
    /** Name shown in the UI. */
    label: string;
    /** Other spellings the vision model may return. Matched case-insensitively. */
    aliases: string[];
    /** What one unit is, including the assumed weight. Shown to the user. */
    unit: string;
    /** Grams of carbohydrate in one unit. */
    carbsPerUnit: number;
    /** Kilocalories in one unit. */
    caloriesPerUnit: number;
    /** Provenance of the two figures above. */
    source: string;
    /** True only once a clinician has signed the entry off. */
    verified: boolean;
    /** Anything a reviewer should know, especially a rejected source value. */
    note?: string;
};

export const NUTRITION_TABLE: NutritionEntry[] = [
    // ───────────────────────── tiffin / breakfast ─────────────────────────
    {
        id: "idli",
        label: "Idli",
        aliases: ["idly", "iddli", "idlis", "steamed rice cake", "rice cake"],
        unit: "1 idli (~25 g)",
        carbsPerUnit: 7.1,
        caloriesPerUnit: 34,
        source: "INDB",
        verified: false,
        note: "INDB assumes a 25 g idli. Dr. Mohan's cites ~11 g carb for a larger one, so confirm the size served locally.",
    },
    {
        id: "dosa",
        label: "Plain dosa",
        aliases: ["dosai", "dose", "sada dosa", "plain dosai"],
        unit: "1 dosa (~36 g)",
        carbsPerUnit: 23.1,
        caloriesPerUnit: 138,
        source: "INDB",
        verified: false,
    },
    {
        id: "masala-dosa",
        label: "Masala dosa",
        aliases: ["masala dosai", "masaladosa", "potato dosa"],
        unit: "1 dosa with filling (~210 g)",
        carbsPerUnit: 41.0,
        caloriesPerUnit: 345,
        source: "INDB",
        verified: false,
    },
    {
        id: "rava-dosa",
        label: "Rava dosa",
        aliases: ["semolina dosa", "suji dosa", "rava dosai"],
        unit: "1 dosa",
        carbsPerUnit: 24.1,
        caloriesPerUnit: 167,
        source: "INDB",
        verified: false,
    },
    {
        id: "uttapam",
        label: "Uttapam",
        aliases: ["uthappam", "uttappam", "oothappam"],
        unit: "1 uttapam (~68 g)",
        carbsPerUnit: 24.7,
        caloriesPerUnit: 174,
        source: "INDB",
        verified: false,
    },
    {
        id: "medu-vada",
        label: "Medu vada",
        aliases: ["vada", "vadai", "urad dal vada", "uzhunnu vada", "ulundu vadai", "medhu vada"],
        unit: "1 vada (~45 g)",
        carbsPerUnit: 12,
        caloriesPerUnit: 165,
        source: "Dr. Mohan's",
        verified: false,
        note: "INDB value rejected: 745 kcal/100 g and 7.7 g carb, inconsistent with a fried urad batter. Figure here is Dr. Mohan's published per-piece range (150-180 kcal, 12 g carb), midpoint taken.",
    },
    {
        id: "idiyappam",
        label: "Idiyappam",
        aliases: ["string hopper", "sevai", "nool puttu", "santhagai"],
        unit: "1 idiyappam (~40 g)",
        carbsPerUnit: 12,
        caloriesPerUnit: 55,
        source: "approximate",
        verified: false,
        note: "Not present in INDB. Estimated from rice-flour composition; needs a real figure.",
    },
    {
        id: "pongal",
        label: "Ven pongal",
        aliases: ["pongal", "khara pongal", "ven pongal", "rice and moong dal"],
        unit: "1 bowl (~200 g)",
        carbsPerUnit: 45,
        caloriesPerUnit: 290,
        source: "approximate",
        verified: false,
        note: "Not present in INDB. Ghee quantity varies widely between homes and hotels; carbs are the more stable figure.",
    },
    {
        id: "upma",
        label: "Rava upma",
        aliases: ["upma", "uppuma", "semolina upma", "suji upma"],
        unit: "1 bowl",
        carbsPerUnit: 17.3,
        caloriesPerUnit: 157,
        source: "INDB",
        verified: false,
    },
    {
        id: "poori",
        label: "Poori",
        aliases: ["puri", "poori masala", "pooris"],
        unit: "1 poori (~40 g)",
        carbsPerUnit: 15,
        caloriesPerUnit: 140,
        source: "approximate",
        verified: false,
        note: "INDB value rejected: 738 kcal/100 g and 8.2 g carb for a wheat poori. Figure here is a commonly cited per-piece estimate.",
    },
    {
        id: "appam",
        label: "Appam",
        aliases: ["aappam", "palappam", "hopper"],
        unit: "1 appam (~60 g)",
        carbsPerUnit: 20,
        caloriesPerUnit: 110,
        source: "approximate",
        verified: false,
        note: "INDB reports 409 kcal for a single appam, which is implausible. Estimated from rice-and-coconut batter.",
    },

    // ───────────────────────────── breads ─────────────────────────────────
    {
        id: "chapati",
        label: "Chapati",
        aliases: ["roti", "chapathi", "phulka"],
        unit: "1 chapati (~36 g)",
        carbsPerUnit: 12.8,
        caloriesPerUnit: 73,
        source: "INDB",
        verified: false,
    },
    {
        id: "parotta",
        label: "Parotta",
        aliases: ["porotta", "malabar parotta", "kerala parotta", "barotta"],
        unit: "1 parotta (~90 g)",
        carbsPerUnit: 40,
        caloriesPerUnit: 290,
        source: "approximate",
        verified: false,
        note: "Not present in INDB; INDB's north-Indian 'parantha' is a different preparation. Layered maida parotta estimated separately.",
    },

    // ────────────────────────────── rice ──────────────────────────────────
    {
        id: "rice",
        label: "Steamed rice",
        aliases: ["boiled rice", "white rice", "plain rice", "sadam", "cooked rice", "steamed white rice"],
        unit: "1 plate (~300 g)",
        carbsPerUnit: 77.2,
        caloriesPerUnit: 352,
        source: "INDB",
        verified: false,
        note: "A 300 g plate is a large serving. Confirm the portion actually eaten before dosing.",
    },
    {
        id: "curd-rice",
        label: "Curd rice",
        aliases: ["thayir sadam", "dahi bhaat", "perugu annam", "yogurt rice"],
        unit: "1 plate (~216 g)",
        carbsPerUnit: 71.2,
        caloriesPerUnit: 423,
        source: "INDB",
        verified: false,
    },
    {
        id: "lemon-rice",
        label: "Lemon rice",
        aliases: ["elumichai sadam", "chitranna", "pulihora", "citron rice"],
        unit: "1 plate",
        carbsPerUnit: 69.0,
        caloriesPerUnit: 563,
        source: "INDB",
        verified: false,
    },
    {
        id: "tamarind-rice",
        label: "Tamarind rice",
        aliases: ["puliyodharai", "puliyogare", "puli sadam"],
        unit: "1 plate",
        carbsPerUnit: 83.2,
        caloriesPerUnit: 477,
        source: "INDB",
        verified: false,
    },
    {
        id: "veg-biryani",
        label: "Vegetable biryani",
        aliases: ["veg biryani", "vegetable biriyani", "biryani", "biriyani"],
        unit: "1 plate",
        carbsPerUnit: 56.0,
        caloriesPerUnit: 527,
        source: "INDB",
        verified: false,
    },
    {
        id: "mutton-biryani",
        label: "Mutton biryani",
        aliases: ["mutton biriyani", "chicken biryani", "chicken biriyani", "meat biryani"],
        unit: "1 plate",
        carbsPerUnit: 46.7,
        caloriesPerUnit: 396,
        source: "INDB",
        verified: false,
        note: "INDB figure is for mutton. Chicken biryani is mapped here as the closest available entry.",
    },

    // ────────────────────────── sides / gravies ───────────────────────────
    {
        id: "sambar",
        label: "Sambar",
        aliases: ["sambhar", "sambar dal", "lentil stew"],
        unit: "1 bowl (~257 g)",
        carbsPerUnit: 27.2,
        caloriesPerUnit: 249,
        source: "INDB",
        verified: false,
        note: "257 g is a generous bowl. A small tiffin serving is nearer half this.",
    },
    {
        id: "rasam",
        label: "Rasam",
        aliases: ["puli rasam", "tomato rasam", "chaaru", "saaru"],
        unit: "1 bowl",
        carbsPerUnit: 13.1,
        caloriesPerUnit: 104,
        source: "INDB",
        verified: false,
    },
    {
        id: "coconut-chutney",
        label: "Coconut chutney",
        aliases: ["chutney", "thengai chutney", "nariyal chutney", "white chutney"],
        unit: "1 tablespoon",
        carbsPerUnit: 2.1,
        caloriesPerUnit: 67,
        source: "INDB",
        verified: false,
    },
];

/** Normalise a name for matching: lowercase, strip accents and punctuation. */
function normalise(value: string): string {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9 ]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Find the table entry for a food name the model returned.
 *
 * Exact label and alias matches are tried first, then containment, so
 * "masala dosa with sambar" resolves to masala dosa rather than plain dosa.
 * Returns null when nothing matches, which the caller must surface rather
 * than treat as zero carbs.
 */
export function lookupFood(name: string): NutritionEntry | null {
    const query = normalise(name);
    if (!query) return null;

    for (const entry of NUTRITION_TABLE) {
        const names = [entry.label, ...entry.aliases].map(normalise);
        if (names.includes(query)) return entry;
    }

    // Longest match wins, so a more specific dish beats a generic one.
    let best: NutritionEntry | null = null;
    let bestLength = 0;
    for (const entry of NUTRITION_TABLE) {
        for (const candidate of [entry.label, ...entry.aliases]) {
            const token = normalise(candidate);
            if (token.length > bestLength && (query.includes(token) || token.includes(query))) {
                best = entry;
                bestLength = token.length;
            }
        }
    }
    return best;
}

/** True while any entry in use still lacks clinical sign-off. */
export function hasUnverified(entries: (NutritionEntry | null)[]): boolean {
    return entries.some((e) => e !== null && !e.verified);
}
