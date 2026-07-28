"use client";

import { useState, useEffect } from "react";
import { Calculator, Zap, Thermometer, Info, CheckCircle2 } from "lucide-react";
import { AppDatabase } from "@/lib/db";
import { useLanguage } from "@/components/i18n/LanguageContext";

interface InsulinCalculatorProps {
    carbs: number;
    onClose: () => void;
}

export default function InsulinCalculator({ carbs, onClose }: InsulinCalculatorProps) {
    const { t } = useLanguage();
    const [glucose, setGlucose] = useState(120);
    const [target, setTarget] = useState(100);
    const [carbRatio, setCarbRatio] = useState(10); // 1 unit per 10g carbs
    const [sensitivity, setSensitivity] = useState(50); // 1 unit drops 50 mg/dL
    const [bolus, setBolus] = useState(0);
    const [recorded, setRecorded] = useState(false);

    useEffect(() => {
        const carbDose = carbs / carbRatio;
        const correctionDose = Math.max(0, (glucose - target) / sensitivity);
        const total = (carbDose + correctionDose).toFixed(1);
        setBolus(parseFloat(total));
    }, [carbs, glucose, target, carbRatio, sensitivity]);

    const handleRecord = async () => {
        await AppDatabase.saveInsulinLog({
            carbs,
            dose: bolus,
        });
        setRecorded(true);
        setTimeout(() => {
            onClose();
        }, 2000);
    };

    return (
        <div className="animate-in fade-in zoom-in-95 duration-300 p-6 rounded-3xl bg-white border shadow-2xl">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                    <Calculator size={20} />
                    {t("insulin.title")}
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-lg">×</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">{t("insulin.currentGlucose")}</label>
                        <input
                            type="number"
                            value={glucose}
                            onChange={(e) => setGlucose(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">{t("insulin.mealCarbs")}</label>
                        <div className="w-full px-4 py-3 rounded-xl bg-primary/5 border border-primary/20 font-extrabold text-primary">
                            {carbs}g
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="flex items-center justify-between mb-3 text-xs font-bold text-muted-foreground">
                            <span>{t("insulin.personalRatios")}</span>
                            <Info size={14} className="opacity-50" />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <span className="text-[10px] text-muted-foreground block mb-1">{t("insulin.ratio")}</span>
                                <input
                                    type="number"
                                    value={carbRatio}
                                    onChange={(e) => setCarbRatio(parseInt(e.target.value) || 1)}
                                    className="w-full bg-transparent font-bold outline-none"
                                />
                            </div>
                            <div className="flex-1">
                                <span className="text-[10px] text-muted-foreground block mb-1">{t("insulin.isf")}</span>
                                <input
                                    type="number"
                                    value={sensitivity}
                                    onChange={(e) => setSensitivity(parseInt(e.target.value) || 1)}
                                    className="w-full bg-transparent font-bold outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 rounded-3xl bg-primary text-white text-center relative overflow-hidden shadow-lg shadow-primary/30">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap size={120} strokeWidth={1} />
                </div>
                <div className="relative z-10">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">{t("insulin.recommendedDose")}</span>
                    <div className="text-6xl font-black my-2">{bolus}<span className="text-2xl ml-1">U</span></div>
                    <p className="text-xs font-medium text-white/70 italic px-8">
                        {glucose > 180 ? t("insulin.aiAdjustedHyper") : t("insulin.aiAdjustedCurrent")}
                    </p>
                </div>
            </div>

            <button
                onClick={handleRecord}
                disabled={recorded}
                className={`w-full mt-6 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${recorded ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:scale-[1.02] active:scale-[0.98]'
                    }`}
            >
                {recorded ? (
                    <>
                        <CheckCircle2 size={24} />
                        {t("insulin.recorded")}
                    </>
                ) : (
                    t("insulin.recordSync")
                )}
            </button>
        </div>
    );
}
