"use client";

import { useState } from "react";
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
import { WifiOff, Droplets, Heart, Flame, Moon } from "lucide-react";

type Metric = "glucose" | "heartRate" | "activeBurn" | "sleep";
type Point = { time: string; value: number };

interface GlucoseChartProps {
    data?: Point[];
    seriesByMetric?: Record<Metric, Point[]>;
    connectedDevices?: { cgm: boolean; watch: boolean; fitbit: boolean };
    isConnected?: boolean;
}

const defaultData: Point[] = [
    { time: "08:00", value: 110 },
    { time: "09:00", value: 145 },
    { time: "10:00", value: 160 },
    { time: "11:00", value: 130 },
    { time: "12:00", value: 95 },
    { time: "13:00", value: 120 },
    { time: "14:00", value: 140 },
    { time: "15:00", value: 155 },
];

const METRIC_CONFIG: Record<Metric, {
    device: "cgm" | "watch" | "fitbit";
    titleKey: string;
    syncKey: string;
    labelKey: string;
    icon: typeof Droplets;
    domain: [number, number];
    range?: [number, number];
    unit: string;
    color: string;
}> = {
    glucose: { device: "cgm", titleKey: "charts.glucoseTitle", syncKey: "charts.glucoseSync", labelKey: "dashboard.lastGlucose", icon: Droplets, domain: [40, 300], range: [70, 180], unit: "mg/dL", color: "#3B82F6" },
    heartRate: { device: "watch", titleKey: "charts.heartRateTitle", syncKey: "charts.heartRateSync", labelKey: "dashboard.heartRate", icon: Heart, domain: [40, 160], range: [60, 100], unit: "bpm", color: "#EF4444" },
    activeBurn: { device: "fitbit", titleKey: "charts.activeBurnTitle", syncKey: "charts.activeBurnSync", labelKey: "dashboard.activeBurn", icon: Flame, domain: [0, 800], unit: "kcal", color: "#F59E0B" },
    sleep: { device: "fitbit", titleKey: "charts.sleepTitle", syncKey: "charts.sleepSync", labelKey: "dashboard.deepSleep", icon: Moon, domain: [0, 10], unit: "hrs", color: "#8B5CF6" },
};

export default function GlucoseChart({ data, seriesByMetric, connectedDevices, isConnected }: GlucoseChartProps) {
    const { t } = useLanguage();
    const [metric, setMetric] = useState<Metric>("glucose");

    const devices = connectedDevices ?? { cgm: isConnected ?? true, watch: false, fitbit: false };
    const series = seriesByMetric ?? { glucose: data ?? defaultData, heartRate: [], activeBurn: [], sleep: [] };

    const config = METRIC_CONFIG[metric];
    const chartData = series[metric] && series[metric].length > 0 ? series[metric] : defaultData;
    const connected = devices[config.device];

    return (
        <div className="premium-card p-6 h-[440px] relative overflow-hidden bg-white flex flex-col">
            {/* Metric Tabs */}
            <div className="flex gap-2 mb-4">
                {(Object.keys(METRIC_CONFIG) as Metric[]).map((m) => {
                    const cfg = METRIC_CONFIG[m];
                    const Icon = cfg.icon;
                    const active = metric === m;
                    return (
                        <button
                            key={m}
                            type="button"
                            onClick={() => setMetric(m)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                active
                                    ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            <Icon size={13} />
                            {t(cfg.labelKey)}
                        </button>
                    );
                })}
            </div>

            {/* Header */}
            <div className={`flex items-center justify-between mb-6 transition-all duration-300 ${!connected ? "blur-[2px]" : ""}`}>
                <div>
                    <h3 className="text-lg font-bold">{t(config.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground font-medium">
                        {connected ? t(config.syncKey) : t("dashboard.connectToView")}
                    </p>
                </div>
                {connected && metric === "glucose" && (
                    <div className="flex gap-2">
                        <span className="inline-flex items-center rounded-full bg-glucose-normal/10 px-2.5 py-0.5 text-xs font-medium text-glucose-normal">
                            {t("cgm.inRange")}
                        </span>
                    </div>
                )}
            </div>

            {/* Chart Area */}
            <div className={`flex-1 w-full transition-all duration-500 ${!connected ? "blur-md pointer-events-none select-none opacity-40" : ""}`}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
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
                            domain={config.domain}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#fff",
                                borderRadius: "12px",
                                border: "1px solid #E2E8F0",
                                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                            }}
                            formatter={(value?: number) => [`${value ?? 0} ${config.unit}`, t(config.labelKey)]}
                        />
                        {config.range && (
                            <ReferenceArea y1={config.range[0]} y2={config.range[1]} fill="#10B981" fillOpacity={0.05} />
                        )}
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={config.color}
                            strokeWidth={3}
                            dot={{ r: 4, fill: config.color, strokeWidth: 2, stroke: "#fff" }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Offline Overlay */}
            {!connected && (
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
