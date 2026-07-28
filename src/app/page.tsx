"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Heart, Droplets, Shield, Smartphone, PlayCircle } from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import GlucoseChart from "@/components/dashboard/GlucoseChart";
import MealAnalyzer from "@/components/meals/MealAnalyzer";
import DeviceSync from "@/components/sync/DeviceSync";
import TeleHealthPortal from "@/components/telehealth/TeleHealthPortal";
import ReminderSettings from "@/components/settings/ReminderSettings";
import LockScreenSummary from "@/components/widgets/LockScreenSummary";
import LogReadingForm from "@/components/dashboard/LogReadingForm";
import { useLanguage } from "@/components/i18n/LanguageContext";
import UserGuide from "@/components/dashboard/UserGuide";
import { AppDatabase } from "@/lib/db";

export default function Dashboard() {
    const router = useRouter();
    const { t, locale } = useLanguage();

    const [connectedDevices, setConnectedDevices] = useState({
        cgm: true,
        watch: false,
        fitbit: false,
    });

    type Metric = "glucose" | "heartRate" | "activeBurn" | "sleep";
    type Point = { time: string; value: number };

    const [seriesByMetric, setSeriesByMetric] = useState<Record<Metric, Point[]>>({
        glucose: [
            { time: "08:00", value: 110 },
            { time: "09:00", value: 145 },
            { time: "10:00", value: 160 },
            { time: "11:00", value: 130 },
            { time: "12:00", value: 95 },
            { time: "13:00", value: 120 },
            { time: "14:00", value: 140 },
            { time: "15:00", value: 155 },
        ],
        heartRate: [
            { time: "08:00", value: 68 },
            { time: "10:00", value: 74 },
            { time: "12:00", value: 82 },
            { time: "14:00", value: 76 },
            { time: "15:00", value: 72 },
        ],
        activeBurn: [
            { time: "08:00", value: 60 },
            { time: "10:00", value: 180 },
            { time: "12:00", value: 260 },
            { time: "14:00", value: 360 },
            { time: "15:00", value: 432 },
        ],
        sleep: [
            { time: "Mon", value: 6.1 },
            { time: "Tue", value: 5.8 },
            { time: "Wed", value: 7.0 },
            { time: "Thu", value: 6.4 },
            { time: "Fri", value: 6.5 },
        ],
    });

    const [vitals, setVitals] = useState({
        glucose: 120,
        heartRate: 72,
        activeBurn: 432,
        sleep: 6.5,
    });

    const [connectingLiveFeed, setConnectingLiveFeed] = useState(false);

    // Tracks whether we have any real reading for a metric, independent of
    // whether its source device is connected (manual entries count too).
    const [hasReading, setHasReading] = useState<Record<Metric, boolean>>({
        glucose: true,
        heartRate: false,
        activeBurn: false,
        sleep: false,
    });

    useEffect(() => {
        // Simulated simple auth check
        const isAuth = localStorage.getItem("auth");
        if (!isAuth) {
            router.push("/landing");
        }
    }, [router]);

    useEffect(() => {
        const loadDatabase = async () => {
            const devices = await AppDatabase.getDeviceStatuses();
            setConnectedDevices({
                cgm: devices.cgm?.connected ?? true,
                watch: devices.watch?.connected ?? false,
                fitbit: devices.fitbit?.connected ?? false,
            });

            const vitalsLog = await AppDatabase.getVitals();
            const latestVitals = {
                glucose: 120,
                heartRate: 72,
                activeBurn: 432,
                sleep: 6.5,
            };
            
            [...vitalsLog].reverse().forEach((reading) => {
                if (reading.metricType in latestVitals) {
                    latestVitals[reading.metricType as keyof typeof latestVitals] = reading.value;
                }
            });
            setVitals(latestVitals);

            const metrics: Metric[] = ["glucose", "heartRate", "activeBurn", "sleep"];
            setSeriesByMetric((prev) => {
                const next = { ...prev };
                metrics.forEach((m) => {
                    const logs = vitalsLog
                        .filter(v => v.metricType === m)
                        .map(v => {
                            const timeStr = new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                            return { time: timeStr, value: v.value };
                        });
                    if (logs.length > 0) {
                        next[m] = logs.reverse();
                    }
                });
                return next;
            });

            setHasReading((prev) => {
                const next = { ...prev };
                metrics.forEach((m) => {
                    if (vitalsLog.some(v => v.metricType === m)) {
                        next[m] = true;
                    }
                });
                return next;
            });
        };

        loadDatabase();
    }, []);

    const handleLogReading = async (metric: "glucose" | "heartRate" | "activeBurn" | "sleep", value: number, source: string) => {
        let deviceName = "Manual Input";
        if (source === "cgm") deviceName = "Dexter G6 CGM";
        else if (source === "watch") deviceName = "Apple Watch S9";
        else if (source === "fitbit") deviceName = "Fitbit Charge 6";

        await AppDatabase.saveVital({
            metricType: metric,
            value,
            sourceDevice: deviceName,
        });

        setVitals((prev) => ({
            ...prev,
            [metric]: value,
        }));
        setHasReading((prev) => ({ ...prev, [metric]: true }));

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        setSeriesByMetric((prev) => ({
            ...prev,
            [metric]: [...prev[metric], { time: timeStr, value }],
        }));
    };

    const handleConnectLiveFeed = () => {
        if (connectingLiveFeed) return;
        setConnectingLiveFeed(true);
        setTimeout(async () => {
            if (!connectedDevices.cgm) {
                await handleToggleConnect("cgm");
            }
            setConnectingLiveFeed(false);
            document.getElementById("ecosystem-sync")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 900);
    };

    const handleToggleConnect = async (id: "cgm" | "watch" | "fitbit") => {
        const nextState = !connectedDevices[id];
        await AppDatabase.saveDeviceStatus(id, nextState);
        setConnectedDevices((prev) => ({
            ...prev,
            [id]: nextState,
        }));
    };

    return (
        <div className="flex flex-col gap-12 pb-20">
            {/* Hero Welcome */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{t("dashboard.title")}</h1>
                    <p className="text-lg text-muted-foreground font-medium">{t("dashboard.subtitle")}</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-500 border border-gray-200">
                                {i === 1 ? "SD" : i === 2 ? "RV" : "+2"}
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleConnectLiveFeed}
                        disabled={connectingLiveFeed}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-70"
                    >
                        {connectingLiveFeed ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            <Smartphone size={18} />
                        )}
                        {t("dashboard.connectLiveFeed")}
                    </button>
                </div>
            </div>

            {/* Primary Metrics Layer */}
            <section>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">{t("dashboard.vitalsTitle")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        title={t("dashboard.lastGlucose")}
                        value={connectedDevices.cgm || hasReading.glucose ? String(vitals.glucose) : "--"}
                        unit="mg/dL"
                        icon={Droplets}
                        status={connectedDevices.cgm || hasReading.glucose ? (vitals.glucose > 180 ? "warning" : vitals.glucose < 70 ? "danger" : "normal") : "normal"}
                        trend={connectedDevices.cgm ? { value: "12", isUp: false } : undefined}
                    />
                    <MetricCard
                        title={t("dashboard.heartRate")}
                        value={connectedDevices.watch || hasReading.heartRate ? String(vitals.heartRate) : "--"}
                        unit="bpm"
                        icon={Heart}
                        status={connectedDevices.watch || hasReading.heartRate ? (vitals.heartRate > 100 || vitals.heartRate < 60 ? "warning" : "normal") : "normal"}
                    />
                    <MetricCard
                        title={t("dashboard.activeBurn")}
                        value={connectedDevices.fitbit || hasReading.activeBurn ? String(vitals.activeBurn) : "--"}
                        unit="kcal"
                        icon={Activity}
                        trend={connectedDevices.fitbit ? { value: "15%", isUp: true } : undefined}
                    />
                    <MetricCard
                        title={t("dashboard.deepSleep")}
                        value={connectedDevices.fitbit || hasReading.sleep ? String(vitals.sleep) : "--"}
                        unit="hrs"
                        icon={Shield}
                    />
                </div>
            </section>

            {/* Main Analysis Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <GlucoseChart seriesByMetric={seriesByMetric} connectedDevices={connectedDevices} />
                    <MealAnalyzer />
                </div>

                <aside className="flex flex-col gap-8">
                    <LogReadingForm connectedDevices={connectedDevices} onLogReading={handleLogReading} />
                    <TeleHealthPortal />
                    <ReminderSettings />
                    <div className="premium-card p-6 bg-gray-900 border-none">
                        <LockScreenSummary />
                    </div>
                </aside>
            </section>

            {/* Device Management Section */}
            <section id="ecosystem-sync">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">{t("dashboard.syncTitle")}</h2>
                <DeviceSync connectedDevices={connectedDevices} onToggleConnect={handleToggleConnect} vitals={vitals} />
            </section>

            {/* Guides & Support Section */}
            <section className="border-t border-gray-250/20 pt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Onboarding Tutorial */}
                <div className="space-y-6">
                    <div className="flex flex-col">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-3 self-start border border-primary/20">
                            <PlayCircle size={14} />
                            {t("dashboard.onboardingTutorial")}
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{t("tutorial.title")}</h2>
                        <p className="text-sm text-muted-foreground font-semibold max-w-2xl">{t("tutorial.subtitle")}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="premium-card p-6 bg-white relative group overflow-hidden flex items-start gap-4">
                                <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center text-md font-black shrink-0 relative z-10 shadow-lg shadow-primary/25">
                                    {step}
                                </div>
                                <div className="space-y-1 relative z-10">
                                    <h3 className="text-base font-extrabold">{t(`tutorial.step${step}Title`)}</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                                        {t(`tutorial.step${step}Desc`)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detailed User Guide */}
                <div>
                    <UserGuide />
                </div>
            </section>
        </div>
    );
}
