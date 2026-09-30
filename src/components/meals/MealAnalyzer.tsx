"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, CheckCircle2, AlertCircle, Sparkles, X, FlipHorizontal as Flip } from "lucide-react";
import InsulinCalculator from "./InsulinCalculator";
import { useLanguage } from "@/components/i18n/LanguageContext";
import { AppDatabase } from "@/lib/db";
import { lookupFood, type NutritionEntry } from "@/lib/nutrition";

const ANALYZE_ENDPOINT = "/.netlify/functions/analyze-meal";

// Keeps the upload small enough for Firestore's 1MiB document cap and cheap
// enough to send to a vision model, without losing detail that matters.
const MAX_EDGE_PX = 1024;
const JPEG_QUALITY = 0.8;

/** One food the model spotted, matched against the nutrition table. */
type MealItem = {
    /** Stable key for React and for updates. */
    key: string;
    /** The name the model used, kept so the user can see what was recognised. */
    name: string;
    /** How many units. Editable, and the only thing the user needs to judge. */
    count: number;
    /** Table match, or null when this food is not in the nutrition table. */
    entry: NutritionEntry | null;
    /**
     * Per-unit figures used only when `entry` is null. Seeded with the model's
     * own estimate so an unknown food still produces a usable number, then
     * editable. Far less trustworthy than the table.
     */
    fallbackCarbs: number;
    fallbackCalories: number;
    /** True once the user has typed over the model's estimate. */
    userEdited: boolean;
};

type MealResult = {
    items: MealItem[];
    confidence: "high" | "medium" | "low";
    notes: string;
};

function itemCarbs(item: MealItem): number {
    const perUnit = item.entry ? item.entry.carbsPerUnit : item.fallbackCarbs;
    return perUnit * item.count;
}

function itemCalories(item: MealItem): number {
    const perUnit = item.entry ? item.entry.caloriesPerUnit : item.fallbackCalories;
    return perUnit * item.count;
}

/** True when this line's figures are a guess rather than a table lookup. */
function isEstimated(item: MealItem): boolean {
    return item.entry === null;
}

/** Re-encode a data URL down to MAX_EDGE_PX on its long side. */
function downscale(dataUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const scale = Math.min(1, MAX_EDGE_PX / Math.max(img.width, img.height));
            const width = Math.max(1, Math.round(img.width * scale));
            const height = Math.max(1, Math.round(img.height * scale));

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Could not process the image on this device."));
                return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
        };
        img.onerror = () => reject(new Error("That file could not be read as an image."));
        img.src = dataUrl;
    });
}

function describeError(status: number, data: { error?: string; message?: string } | null): string {
    // A 404 here means the serverless function isn't being served at all —
    // almost always "next dev" was started directly instead of "npm run dev".
    if (status === 404) {
        return "The analysis service isn't running. Stop the server and start it with `npm run dev`.";
    }

    switch (data?.error) {
        case "model_loading":
            return "The model is starting up. Give it a few seconds and try again.";
        case "upstream_timeout":
            return "The model took too long to respond. Try again.";
        case "not_food":
            return "That doesn't look like a meal. Try another photo.";
        case "unsupported_media_type":
            return "Use a JPEG, PNG, or WebP image.";
        case "image_too_large":
            return "That image is too large. Try a smaller photo.";
        case "server_not_configured":
            return "The server is missing its Hugging Face API key.";
        case "unparseable_response":
            return "The model returned an unexpected answer. Try again.";
        default:
            return data?.message || `Analysis failed (${status}).`;
    }
}

export default function MealAnalyzer() {
    const { locale, t } = useLanguage();
    const [image, setImage] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<MealResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showCalculator, setShowCalculator] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Totals are derived, never stored, so editing a count cannot leave the
    // displayed carbs and the dose disagreeing.
    const totalCarbs = result ? result.items.reduce((sum, i) => sum + itemCarbs(i), 0) : 0;
    const totalCalories = result ? result.items.reduce((sum, i) => sum + itemCalories(i), 0) : 0;
    const estimatedCount = result ? result.items.filter(isEstimated).length : 0;
    const usesUnverified = result
        ? result.items.some((i) => i.entry !== null && !i.entry.verified)
        : false;

    const patchItem = (key: string, patch: Partial<MealItem>) => {
        setResult((prev) =>
            prev
                ? { ...prev, items: prev.items.map((i) => (i.key === key ? { ...i, ...patch } : i)) }
                : prev,
        );
    };

    const removeItem = (key: string) => {
        setResult((prev) => (prev ? { ...prev, items: prev.items.filter((i) => i.key !== key) } : prev));
    };

    const describeMeal = (items: MealItem[]): string =>
        items.map((i) => `${i.count} × ${i.entry ? i.entry.label : i.name}`).join(", ");

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
                audio: false
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreaming(true);
                // Clear any previous results
                setImage(null);
                setResult(null);
                setError(null);
            } else {
                // Nothing to attach the stream to — release the camera so its
                // indicator light doesn't stay on with no way to stop it.
                stream.getTracks().forEach((track) => track.stop());
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please ensure permissions are granted.");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setIsStreaming(false);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext("2d");
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL("image/jpeg");
                stopCamera();
                void runAnalysis(dataUrl);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const input = e.target;
        const reader = new FileReader();
        reader.onloadend = () => {
            void runAnalysis(reader.result as string);
            // Clear the input value so the same file can be selected again
            input.value = "";
        };
        reader.onerror = () => {
            setError("That file could not be read.");
            input.value = "";
        };
        reader.readAsDataURL(file);
    };

    /**
     * Send the photo to the vision model and show what it reports.
     * `rawDataUrl` is passed in rather than read from state so the value is
     * always the image we just captured, never the previous render's.
     */
    const runAnalysis = async (rawDataUrl: string) => {
        setAnalyzing(true);
        setResult(null);
        setError(null);
        setImage(rawDataUrl);

        try {
            const compact = await downscale(rawDataUrl);

            const response = await fetch(ANALYZE_ENDPOINT, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ image: compact }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                setError(describeError(response.status, data));
                return;
            }

            // The model reports what it saw; carbs come from the nutrition table.
            const items: MealItem[] = (data.items ?? []).map(
                (
                    raw: {
                        name: string;
                        count: number;
                        est_carbs_per_unit?: number;
                        est_calories_per_unit?: number;
                    },
                    index: number,
                ) => ({
                    key: `${index}-${raw.name}`,
                    name: raw.name,
                    count: raw.count,
                    entry: lookupFood(raw.name),
                    fallbackCarbs: raw.est_carbs_per_unit ?? 0,
                    fallbackCalories: raw.est_calories_per_unit ?? 0,
                    userEdited: false,
                }),
            );

            const meal: MealResult = {
                items,
                confidence: data.confidence,
                notes: data.notes,
            };
            setResult(meal);
            setAnalyzing(false);

            // Persisting is best-effort and deliberately not awaited: the result
            // is already on screen, and a slow or failing write must not keep the
            // spinner running over it.
            void AppDatabase.saveMealLog({
                food: describeMeal(items),
                carbs: Math.round(items.reduce((sum, i) => sum + itemCarbs(i), 0)),
                calories: Math.round(items.reduce((sum, i) => sum + itemCalories(i), 0)),
                image: compact,
            }).catch((saveErr) => {
                console.error("Could not save meal log:", saveErr);
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setAnalyzing(false);
        }
    };

    const reset = () => {
        stopCamera();
        setImage(null);
        setResult(null);
        setError(null);
        setAnalyzing(false);
        setShowCalculator(false);

        // Clear the file input element's value so it can be re-triggered
        const fileInput = document.getElementById("meal-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    };

    useEffect(() => {
        return () => stopCamera();
    }, []);

    return (
        <div className="premium-card p-6 relative">
            <canvas ref={canvasRef} className="hidden" />

            {showCalculator && result && (
                <div className="absolute inset-x-0 top-0 z-50 p-2">
                    <InsulinCalculator
                        carbs={Math.round(totalCarbs)}
                        onClose={() => setShowCalculator(false)}
                    />
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="text-primary" size={20} />
                        {t("meal.title")}
                    </h3>
                    <p className="text-sm text-muted-foreground">{t("meal.subtitle")}</p>
                </div>
                {(image || isStreaming) && !analyzing && (
                    <button
                        onClick={reset}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                        <X size={14} />
                        {t("meal.reset")}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                    onClick={() => {
                        if (!isStreaming && !analyzing) {
                            document.getElementById('meal-upload')?.click();
                        }
                    }}
                    className={`border-2 border-dashed border-gray-200 rounded-xl aspect-square flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 transition-colors bg-gray-50/50 relative overflow-hidden ${isStreaming ? "border-primary/50" : ""}`}
                >
                    <input
                        type="file"
                        id="meal-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    {isStreaming ? (
                        <div className="absolute inset-0 w-full h-full bg-black flex flex-col">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 inset-x-0 flex justify-center items-center gap-4 px-4">
                                <button
                                    onClick={(e) => { e.stopPropagation(); capturePhoto(); }}
                                    className="h-14 w-14 rounded-full bg-white border-4 border-primary shadow-xl flex items-center justify-center animate-pulse"
                                >
                                    <div className="h-10 w-10 rounded-full bg-primary" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); stopCamera(); }}
                                    className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    ) : image ? (
                        <>
                            <img src={image} alt="Meal" className={`absolute inset-0 w-full h-full object-cover ${analyzing || error ? "opacity-40" : ""}`} />
                            {analyzing ? (
                                <div className="relative z-10 flex flex-col items-center gap-2">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                                    <span className="text-sm font-bold bg-white/80 px-3 py-1 rounded-full text-primary">{t("meal.analyzing")}</span>
                                </div>
                            ) : error ? (
                                <div className="relative z-10 flex flex-col items-center gap-2 text-red-600">
                                    <AlertCircle size={48} className="drop-shadow-lg" />
                                    <span className="text-sm font-bold bg-white/90 px-3 py-1 rounded-full">Analysis failed</span>
                                </div>
                            ) : (
                                <div className="relative z-10 flex flex-col items-center gap-2 text-primary">
                                    <CheckCircle2 size={48} className="drop-shadow-lg" />
                                    <span className="text-sm font-bold bg-white/80 px-3 py-1 rounded-full">{t("meal.complete")}</span>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-6 p-6 w-full h-full justify-center">
                            <div className="flex gap-4">
                                <button
                                    onClick={(e) => { e.stopPropagation(); startCamera(); }}
                                    className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all hover:scale-105"
                                >
                                    <Camera size={32} />
                                    <span className="text-sm font-bold">{t("meal.useCamera")}</span>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); document.getElementById('meal-upload')?.click(); }}
                                    className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 transition-all hover:scale-105"
                                >
                                    <Flip size={32} />
                                    <span className="text-sm font-bold">{t("meal.uploadFile")}</span>
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground text-center">{t("meal.captureHint")}</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-center gap-4">
                    {error ? (
                        <div className="p-6 rounded-2xl border border-red-200 bg-red-50/60 space-y-3 animate-in fade-in duration-300">
                            <div className="flex items-center gap-2 text-red-600 font-bold text-sm uppercase tracking-wider">
                                <AlertCircle size={16} />
                                <span>Analysis Failed</span>
                            </div>
                            <p className="text-sm text-gray-700 font-semibold leading-relaxed">{error}</p>
                            <button
                                onClick={reset}
                                className="w-full mt-2 bg-gray-900 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-gray-800 transition-colors cursor-pointer"
                            >
                                Try another photo
                            </button>
                        </div>
                    ) : result ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mb-4">
                                <div className="flex items-start justify-between gap-3">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
                                        {locale === "es" ? "Comida Detectada" : locale === "ta" ? "கண்டறியப்பட்ட உணவு" : locale === "te" ? "గుర్తించిన ఆహారం" : "Detected Meal"}
                                    </h4>
                                    <span
                                        className={`shrink-0 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${result.confidence === "high"
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : result.confidence === "medium"
                                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                                : "bg-red-50 text-red-700 border-red-200"
                                            }`}
                                    >
                                        {result.confidence} confidence
                                    </span>
                                </div>
                                {result.notes && (
                                    <p className="text-[11px] text-muted-foreground font-semibold mt-2 leading-relaxed">
                                        {result.notes}
                                    </p>
                                )}
                            </div>

                            {/* One row per food. The count is the only thing the user has to judge,
                                and carbs recompute from the nutrition table as it changes. */}
                            <div className="rounded-xl border overflow-hidden mb-4 bg-white">
                                {result.items.map((item) => (
                                    <div
                                        key={item.key}
                                        className="flex items-center gap-2 px-3 py-2.5 border-b last:border-b-0"
                                    >
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.5"
                                            value={item.count}
                                            onChange={(e) =>
                                                patchItem(item.key, {
                                                    count: Math.max(0, parseFloat(e.target.value) || 0),
                                                })
                                            }
                                            aria-label={`Number of ${item.entry ? item.entry.label : item.name}`}
                                            className="w-14 shrink-0 px-2 py-1 rounded-lg border bg-gray-50 text-sm font-bold text-center tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate">
                                                {item.entry ? item.entry.label : item.name}
                                            </p>
                                            {item.entry ? (
                                                <p className="text-[10px] text-muted-foreground font-semibold truncate">
                                                    {item.entry.unit}
                                                </p>
                                            ) : (
                                                <p className="text-[10px] text-amber-700 font-semibold">
                                                    {item.userEdited
                                                        ? "Your value · not in nutrition table"
                                                        : "AI estimate · not in nutrition table"}
                                                </p>
                                            )}
                                        </div>
                                        {item.entry ? (
                                            <span className="text-sm font-bold tabular-nums shrink-0">
                                                {itemCarbs(item).toFixed(1)}g
                                            </span>
                                        ) : (
                                            <div className="flex items-center gap-1 shrink-0">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.5"
                                                    value={item.fallbackCarbs}
                                                    onChange={(e) =>
                                                        patchItem(item.key, {
                                                            fallbackCarbs: Math.max(
                                                                0,
                                                                parseFloat(e.target.value) || 0,
                                                            ),
                                                            userEdited: true,
                                                        })
                                                    }
                                                    aria-label={`Carbs per unit for ${item.name}`}
                                                    className="w-16 px-2 py-1 rounded-lg border border-amber-300 bg-amber-50 text-sm font-bold text-right tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-200"
                                                />
                                                <span className="text-[10px] text-amber-700 font-bold">g/unit</span>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => removeItem(item.key)}
                                            aria-label={`Remove ${item.entry ? item.entry.label : item.name}`}
                                            className="shrink-0 text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                {result.items.length === 0 && (
                                    <p className="px-3 py-4 text-xs text-muted-foreground font-semibold text-center">
                                        No foods left. Reset and try another photo.
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-gray-50 border">
                                    <span className="text-xs text-muted-foreground block font-medium">
                                        {locale === "es" ? "Carbohidratos Est." : locale === "ta" ? "மதிப்பிடப்பட்ட கார்ப்ஸ்" : locale === "te" ? "అంచనా కార్బోహైడ్రేట్లు" : "Est. Carbs"}
                                    </span>
                                    <span className="text-2xl font-bold tabular-nums">{Math.round(totalCarbs)}g</span>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 border">
                                    <span className="text-xs text-muted-foreground block font-medium">
                                        {locale === "es" ? "Calorías" : locale === "ta" ? "கலோரிகள்" : locale === "te" ? "క్యాలరీలు" : "Calories"}
                                    </span>
                                    <span className="text-2xl font-bold tabular-nums">{Math.round(totalCalories)}</span>
                                </div>
                            </div>

                            {estimatedCount > 0 && (
                                <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                                    <AlertCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                                    <p className="text-[11px] text-amber-800 font-semibold leading-relaxed">
                                        {estimatedCount === 1 ? "One food is" : `${estimatedCount} foods are`} not
                                        in the nutrition table, so {estimatedCount === 1 ? "its" : "their"} carb
                                        figure is the AI&rsquo;s own estimate rather than a reference value. Check
                                        it against the packet or a known portion before dosing.
                                    </p>
                                </div>
                            )}

                            {usesUnverified && estimatedCount === 0 && (
                                <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-gray-50 border">
                                    <AlertCircle size={14} className="text-gray-400 mt-0.5 shrink-0" />
                                    <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
                                        Carb values come from a reference table that has not been checked by a
                                        dietitian yet. Confirm the counts above match what you actually ate.
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={() => setShowCalculator(true)}
                                disabled={result.items.length === 0}
                                className="w-full mt-6 bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform cursor-pointer disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
                            >
                                {locale === "es" ? "Aplicar al Cálculo de Insulina" : locale === "ta" ? "இன்சுலின் கால்குலேட்டருக்குப் பயன்படுத்துங்கள்" : locale === "te" ? "ఇన్సులిన్ కాలిక్యులేటర్‌కు వర్తింపజేయి" : "Apply to Insulin Calculator"}
                            </button>
                        </div>
                    ) : (
                        <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-4">
                            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-2">
                                <Sparkles size={16} className="animate-pulse" />
                                <span>
                                    {locale === "es" ? "Guía para Fotos de IA" : locale === "ta" ? "AI புகைப்பட வழிகாட்டி" : locale === "te" ? "AI ఫోటో మార్గదర్శకాలు" : "AI Photo Guidelines"}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground font-semibold leading-relaxed mb-4">
                                {locale === "es" ? "Siga estas pautas para obtener la estimación de carbohidratos más precisa de la IA:" : locale === "ta" ? "துல்லியமான கார்ப் மதிப்பீட்டைப் பெற இந்த வழிகாட்டுதல்களைப் பின்பற்றவும்:" : locale === "te" ? "ఖచ్చితమైన కార్బ్ అంచనాను పొందడానికి ఈ మార్గదర్శకాలను అనుసరించండి:" : "Follow these guidelines to get the most accurate carb estimation from the AI:"}
                            </p>
                            <div className="space-y-3.5 text-left">
                                <div className="flex gap-2.5">
                                    <span className="text-primary mt-0.5 font-bold">✓</span>
                                    <div>
                                        <h5 className="text-xs font-bold text-gray-800">
                                            {locale === "es" ? "Buena Iluminación" : locale === "ta" ? "நல்ல வெளிச்சம்" : locale === "te" ? "మంచి కాంతి" : "Good Lighting"}
                                        </h5>
                                        <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
                                            {locale === "es" ? "Evite sombras fuertes o ambientes oscuros." : locale === "ta" ? "இருண்ட சூழலைத் தவிர்க்கவும்." : locale === "te" ? "చీకటి ప్రాంతాలను నివారించండి." : "Avoid harsh shadows or dark environments."}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2.5">
                                    <span className="text-primary mt-0.5 font-bold">✓</span>
                                    <div>
                                        <h5 className="text-xs font-bold text-gray-800">
                                            {locale === "es" ? "Ángulo Cenital (Top-Down)" : locale === "ta" ? "மேலிருந்து கீழ் பார்வை" : locale === "te" ? "పై నుండి క్రిందికి వ్యూ" : "Top-Down View"}
                                        </h5>
                                        <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
                                            {locale === "es" ? "Tome la foto desde arriba para mostrar porciones claras." : locale === "ta" ? "பகுதி அளவுகள் தெளிவாகத் தெரியும்படி மேலிருந்து எடுக்கவும்." : locale === "te" ? "పరిమాణం స్పష్టంగా కనిపించేలా పై నుండి ఫోటో తీయండి." : "Capture directly from above to show portion sizes clearly."}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2.5">
                                    <span className="text-primary mt-0.5 font-bold">✓</span>
                                    <div>
                                        <h5 className="text-xs font-bold text-gray-800">
                                            {locale === "es" ? "Sin Envoltorios o Tapas" : locale === "ta" ? "மூடி அல்லது கவர் இல்லாமல்" : locale === "te" ? "ప్యాకేజింగ్ లేదా మూత లేకుండా" : "Remove Lids & Wrappers"}
                                        </h5>
                                        <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
                                            {locale === "es" ? "Retire las tapas de los envases antes de capturar." : locale === "ta" ? "புகைப்படம் எடுப்பதற்கு முன் மூடி போன்றவற்றை அகற்றவும்." : locale === "te" ? "ఫోటో తీసే ముందు ప్యాకేజింగ్ లేదా మూతలను తొలగించండి." : "Uncover the food so the AI can see the items."}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2.5">
                                    <span className="text-primary mt-0.5 font-bold">✓</span>
                                    <div>
                                        <h5 className="text-xs font-bold text-gray-800">
                                            {locale === "es" ? "Enfoque Nítido" : locale === "ta" ? "தெளிவான படம்" : locale === "te" ? "స్పష్టమైన ఫోకస్" : "Clear Focus"}
                                        </h5>
                                        <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
                                            {locale === "es" ? "Evite imágenes borrosas para no reducir la precisión." : locale === "ta" ? "மங்கலான படங்கள் துல்லியத்தைக் குறைக்கும்." : locale === "te" ? "మసక ఫోటోలు ఖచ్చితత్వాన్ని తగ్గిస్తాయి." : "Avoid blurry movement; hold your camera steady."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

