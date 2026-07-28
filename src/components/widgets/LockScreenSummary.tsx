"use client";

import { Droplets, Activity, Clock } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageContext";

export default function LockScreenSummary() {
    const { t } = useLanguage();
    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="bg-black/80 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/10 shadow-2xl text-white">
                <div className="flex justify-between items-start mb-8">
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white/60">{t("widget.nextCheck")}</span>
                        <span className="text-xl font-bold">1:30 PM</span>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                        <Droplets className="text-primary" size={24} />
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-bold tracking-tighter">120</span>
                        <span className="text-lg font-medium text-white/60">mg/dL</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-glucose-normal w-[65%]" />
                        </div>
                        <span className="text-[10px] font-bold text-glucose-normal shrink-0">{t("widget.stable")}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <div className="flex items-center gap-2 mb-1 opacity-60">
                            <Activity size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{t("widget.active")}</span>
                        </div>
                        <span className="text-lg font-bold">8,432</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <div className="flex items-center gap-2 mb-1 opacity-60">
                            <Clock size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{t("widget.insulin")}</span>
                        </div>
                        <span className="text-lg font-bold">3.2 u</span>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <div className="w-12 h-1 bg-white/20 rounded-full" />
                </div>
            </div>
            <p className="text-center mt-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                {t("widget.preview")}
            </p>
        </div>
    );
}
