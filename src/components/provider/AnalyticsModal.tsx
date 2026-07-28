"use client";

import { useState } from "react";
import { X, TrendingUp, BarChart, Users, ArrowUpRight, ArrowDownRight, Activity, Download } from "lucide-react";

interface AnalyticsModalProps {
    onClose: () => void;
}

type Range = "1W" | "1M" | "3M" | "YTD";

const RANGE_DATA: Record<Range, { bars: number[]; timeInRange: string; hypos: string; adherence: string }> = {
    "1W": { bars: [55, 60, 48, 65, 58, 70, 52], timeInRange: "81.2%", hypos: "2", adherence: "95%" },
    "1M": { bars: [40, 60, 45, 75, 55, 85, 30, 65, 50, 70, 40, 60], timeInRange: "78.4%", hypos: "12", adherence: "92%" },
    "3M": { bars: [50, 55, 60, 45, 70, 65, 58, 62, 48, 72, 66, 59, 61, 54], timeInRange: "76.9%", hypos: "34", adherence: "89%" },
    "YTD": { bars: [45, 50, 48, 55, 60, 58, 62, 65, 63, 68, 70, 72], timeInRange: "74.1%", hypos: "112", adherence: "87%" },
};

function downloadFile(filename: string, content: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export default function AnalyticsModal({ onClose }: AnalyticsModalProps) {
    const [range, setRange] = useState<Range>("1M");
    const current = RANGE_DATA[range];

    const handleDownloadReport = () => {
        const report = `India Care Clinical Report\nGenerated: ${new Date().toLocaleString()}\nRange: ${range}\n\nAvg Time in Range: ${current.timeInRange}\nCritical Hypos: ${current.hypos}\nCGM Adherence: ${current.adherence}\n\nPatient Demographics (India Wide)\nUrban: 68% | Rural: 32%\nType 1: 12% | Type 2: 88%\n`;
        downloadFile(`india-care-clinical-report-${range}.txt`, report, "text/plain");
    };

    const handleExportICMR = () => {
        const payload = {
            exportedAt: new Date().toISOString(),
            range,
            standard: "ICMR-INDIAB",
            metrics: {
                avgTimeInRange: current.timeInRange,
                criticalHypos: current.hypos,
                cgmAdherence: current.adherence,
            },
            demographics: { urban: "68%", rural: "32%", type1: "12%", type2: "88%" },
        };
        downloadFile(`icmr-export-${range}.json`, JSON.stringify(payload, null, 2), "application/json");
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <BarChart size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 text-left">Population Health Trends</h3>
                            <p className="text-sm text-muted-foreground font-medium text-left">Aggregated data across 1,240 patients</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-muted-foreground"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto space-y-8">
                    {/* High-level KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Avg Time in Range</span>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-black">{current.timeInRange}</span>
                                <span className="text-xs font-bold text-green-600 flex items-center mb-1"><ArrowUpRight size={14} /> 4.2%</span>
                            </div>
                        </div>
                        <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Critical Hypos</span>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-black">{current.hypos}</span>
                                <span className="text-xs font-bold text-red-600 flex items-center mb-1"><ArrowDownRight size={14} /> 2</span>
                            </div>
                        </div>
                        <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">CGM Adherence</span>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-black">{current.adherence}</span>
                                <span className="text-xs font-bold text-primary flex items-center mb-1">Stable</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Chart Visualization */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                <TrendingUp size={16} className="text-primary" />
                                Glycemic Stability Index (GSI)
                            </h4>
                            <div className="flex gap-2">
                                {(["1W", "1M", "3M", "YTD"] as Range[]).map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setRange(r)}
                                        className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-colors ${r === range ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-64 w-full bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative group overflow-hidden">
                            <div className="absolute inset-0 flex items-end justify-between px-12 pb-8">
                                {current.bars.map((h, i) => (
                                    <div key={i} className="w-4 bg-primary/20 rounded-t-full group-hover:bg-primary/40 transition-all cursor-pointer" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                            <Activity className="text-primary/20 mb-2 relative z-10" size={48} />
                            <p className="text-xs font-bold text-muted-foreground relative z-10">Advanced population-scale glycemic heatmap generation...</p>
                        </div>
                    </div>

                    {/* Regional Breakdown */}
                    <div className="p-6 rounded-3xl bg-gray-900 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Users size={120} />
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-lg font-bold mb-4">Patient Demographics (India Wide)</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-[10px] font-bold text-white/50 uppercase">Urban</p>
                                    <p className="text-xl font-bold">68%</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-white/50 uppercase">Rural</p>
                                    <p className="text-xl font-bold">32%</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-white/50 uppercase">Type 1</p>
                                    <p className="text-xl font-bold">12%</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-white/50 uppercase">Type 2</p>
                                    <p className="text-xl font-bold">88%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
                    <button
                        onClick={handleDownloadReport}
                        className="px-6 py-3 font-bold text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center gap-2"
                    >
                        <Download size={16} />
                        Download Clinical Report
                    </button>
                    <button
                        onClick={handleExportICMR}
                        className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
                    >
                        Generate ICMR Export
                    </button>
                </div>
            </div>
        </div>
    );
}
