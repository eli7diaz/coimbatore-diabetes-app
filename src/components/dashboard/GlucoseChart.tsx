"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceArea,
} from "recharts";
import { useLanguage } from "@/components/i18n/LanguageContext";
import { WifiOff } from "lucide-react";

interface GlucoseChartProps {
    data?: Array<{ time: string; value: number }>;
    isConnected?: boolean;
}

const defaultData = [
    { time: "08:00", value: 110 },
    { time: "09:00", value: 145 },
    { time: "10:00", value: 160 },
    { time: "11:00", value: 130 },
    { time: "12:00", value: 95 },
    { time: "13:00", value: 120 },
    { time: "14:00", value: 140 },
    { time: "15:00", value: 155 },
];

export default function GlucoseChart({ data = defaultData, isConnected = true }: GlucoseChartProps) {
    const { t } = useLanguage();

    return (
        <div className="premium-card p-6 h-[400px] relative overflow-hidden bg-white">
            {/* Header */}
            <div className={`flex items-center justify-between mb-6 transition-all duration-300 ${!isConnected ? "blur-[2px]" : ""}`}>
                <div>
                    <h3 className="text-lg font-bold">Glucose Trends (CGM)</h3>
                    <p className="text-sm text-muted-foreground font-medium">
                        {isConnected ? "Real-time sync from Dexter-G6" : t("dashboard.connectToView")}
                    </p>
                </div>
                {isConnected && (
                    <div className="flex gap-2">
                        <span className="inline-flex items-center rounded-full bg-glucose-normal/10 px-2.5 py-0.5 text-xs font-medium text-glucose-normal">
                            85% in Range
                        </span>
                    </div>
                )}
            </div>

            {/* Chart Area */}
            <div className={`h-[300px] w-full transition-all duration-500 ${!isConnected ? "blur-md pointer-events-none select-none opacity-40" : ""}`}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#64748b" }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#64748b" }}
                            domain={[40, 300]}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#fff",
                                borderRadius: "12px",
                                border: "1px solid #E2E8F0",
                                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                            }}
                        />
                        <ReferenceArea y1={70} y2={180} fill="#10B981" fillOpacity={0.05} />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#3B82F6", strokeWidth: 2, stroke: "#fff" }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Offline Overlay */}
            {!isConnected && (
                <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300 z-10">
                    <div className="p-4 rounded-full bg-orange-50 border border-orange-100 text-orange-600 mb-4 shadow-sm">
                        <WifiOff size={32} className="animate-pulse" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {t("dashboard.cgmOffline")}
                    </h4>
                    <p className="text-sm text-muted-foreground max-w-xs font-semibold px-4">
                        {t("dashboard.cgmOfflineDesc")}
                    </p>
                </div>
            )}
        </div>
    );
}
