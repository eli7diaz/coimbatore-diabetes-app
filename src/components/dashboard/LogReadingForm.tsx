"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/i18n/LanguageContext";
import { Activity, Droplets, Heart, Shield, AlertCircle, CheckCircle, Database } from "lucide-react";

interface LogReadingFormProps {
    connectedDevices: {
        cgm: boolean;
        watch: boolean;
        fitbit: boolean;
    };
    onLogReading: (metric: "glucose" | "heartRate" | "activeBurn" | "sleep", value: number, source: string) => void;
}

export default function LogReadingForm({ connectedDevices, onLogReading }: LogReadingFormProps) {
    const { t } = useLanguage();
    const [source, setSource] = useState<string>("manual");
    const [metric, setMetric] = useState<"glucose" | "heartRate" | "activeBurn" | "sleep">("glucose");
    const [value, setValue] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Automatically adjust metric when source changes
    useEffect(() => {
        if (source === "cgm") {
            setMetric("glucose");
        } else if (source === "watch") {
            setMetric("heartRate");
        } else if (source === "fitbit") {
            setMetric("activeBurn");
        }
    }, [source]);

    // Handle submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const numVal = parseFloat(value);
        if (isNaN(numVal) || numVal <= 0) {
            setError(t("dashboard.errorPositive"));
            return;
        }

        setLoading(true);

        // Simulate Bluetooth / Cloud sync delay
        setTimeout(() => {
            onLogReading(metric, numVal, source);
            setLoading(false);
            setSuccess(true);
            setValue("");
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        }, 1200);
    };

    // Helper for metric unit
    const getUnit = (m: string) => {
        switch (m) {
            case "glucose": return "mg/dL";
            case "heartRate": return "bpm";
            case "activeBurn": return "kcal";
            case "sleep": return "hrs";
            default: return "";
        }
    };

    return (
        <div className="premium-card p-6 bg-white">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <Database size={20} />
                </div>
                <div>
                    <h3 className="text-xl font-bold">{t("dashboard.logTitle")}</h3>
                    <p className="text-sm text-muted-foreground">{t("dashboard.logSubtitle")}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Source Selection */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t("dashboard.selectDevice")}
                    </label>
                    <select
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                    >
                        <option value="manual">📋 {t("dashboard.selectDevice") === "Select Device" ? "Manual Entry" : "Entrada Manual"}</option>
                        {connectedDevices.cgm && <option value="cgm">📱 Dexter G6 CGM</option>}
                        {connectedDevices.watch && <option value="watch">⌚ Apple Watch S9</option>}
                        {connectedDevices.fitbit && <option value="fitbit">🏃 Fitbit Charge 6</option>}
                    </select>
                </div>

                {/* Metric Selection (only editable for Manual or Fitbit) */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t("dashboard.selectMetric")}
                    </label>
                    {source === "manual" ? (
                        <div className="grid grid-cols-2 gap-2">
                            {(["glucose", "heartRate", "activeBurn", "sleep"] as const).map((m) => {
                                const active = metric === m;
                                return (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setMetric(m)}
                                        className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                                            active
                                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/15 hover:scale-[1.02]"
                                                : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:scale-[1.01]"
                                        }`}
                                    >
                                        {m === "glucose" && <span className="text-sm">💧</span>}
                                        {m === "heartRate" && <span className="text-sm">❤️</span>}
                                        {m === "activeBurn" && <span className="text-sm">🔥</span>}
                                        {m === "sleep" && <span className="text-sm">💤</span>}
                                        <span>{t(`dashboard.${m === "glucose" ? "lastGlucose" : m === "heartRate" ? "heartRate" : m === "activeBurn" ? "activeBurn" : "deepSleep"}`)}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : source === "fitbit" ? (
                        <div className="grid grid-cols-2 gap-2">
                            {(["activeBurn", "sleep"] as const).map((m) => {
                                const active = metric === m;
                                return (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setMetric(m)}
                                        className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                                            active
                                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/15 hover:scale-[1.02]"
                                                : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:scale-[1.01]"
                                        }`}
                                    >
                                        {m === "activeBurn" && <span className="text-sm">🔥</span>}
                                        {m === "sleep" && <span className="text-sm">💤</span>}
                                        <span>{t(`dashboard.${m === "activeBurn" ? "activeBurn" : "deepSleep"}`)}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-150 flex items-center gap-3 text-sm text-gray-700 font-bold">
                            {metric === "glucose" ? <span className="text-primary text-sm">💧</span> : <span className="text-primary text-sm">❤️</span>}
                            <span>{t(`dashboard.${metric === "glucose" ? "lastGlucose" : "heartRate"}`)}</span>
                        </div>
                    )}
                </div>

                {/* Input Value */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t("dashboard.enterValue")}
                    </label>
                    <div className="relative flex items-center">
                        <input
                            type="number"
                            step="any"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="e.g. 120"
                            className="w-full pl-4 pr-20 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                        />
                        <span className="absolute right-4 text-xs font-black text-muted-foreground">
                            {getUnit(metric)}
                        </span>
                    </div>
                </div>

                {/* Feedback Messages */}
                {error && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 flex gap-2.5 text-xs font-medium text-red-800 animate-in fade-in duration-200">
                        <AlertCircle size={16} className="shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {success && (
                    <div className="p-3.5 rounded-xl bg-green-50 border border-green-100 flex gap-2.5 text-xs font-medium text-green-800 animate-in fade-in duration-200">
                        <CheckCircle size={16} className="shrink-0" />
                        <p>{t("dashboard.success")}</p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !value}
                    className={`w-full py-3.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                        loading
                            ? "bg-primary/75 cursor-not-allowed shadow-none"
                            : value
                            ? "bg-primary hover:scale-[1.01] hover:shadow-primary/25 active:scale-[0.99]"
                            : "bg-gray-300 shadow-none cursor-not-allowed"
                    }`}
                >
                    {loading ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span>{t("dashboard.syncing")}</span>
                        </>
                    ) : (
                        <span>{t("dashboard.submit")}</span>
                    )}
                </button>
            </form>
        </div>
    );
}
