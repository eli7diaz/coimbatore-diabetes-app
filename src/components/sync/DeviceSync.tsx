"use client";

import { useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageContext";
import { Smartphone, Watch, Activity, AlertCircle, Plus } from "lucide-react";

interface DeviceSyncProps {
    connectedDevices: {
        cgm: boolean;
        watch: boolean;
        fitbit: boolean;
    };
    onToggleConnect: (id: "cgm" | "watch" | "fitbit") => void;
    vitals: {
        glucose: number;
        heartRate: number;
        activeBurn: number;
        sleep: number;
    };
}

export default function DeviceSync({ connectedDevices, onToggleConnect, vitals }: DeviceSyncProps) {
    const { t } = useLanguage();
    const [syncing, setSyncing] = useState<string | null>(null);


    const getDeviceValueString = (id: string) => {
        switch (id) {
            case "cgm":
                return `${vitals.glucose} mg/dL`;
            case "watch":
                return `${vitals.heartRate} bpm`;
            case "fitbit":
                return `${vitals.activeBurn} kcal • ${vitals.sleep} hrs`;
            default:
                return "";
        }
    };

    const devices = [
        { id: "cgm", name: "Dexter G6 CGM", type: "Glucose", icon: Smartphone, key: "cgm" as const },
        { id: "watch", name: "Apple Watch S9", type: "Fitness/HR", icon: Watch, key: "watch" as const },
        { id: "fitbit", name: "Fitbit Charge 6", type: "Steps/Sleep", icon: Activity, key: "fitbit" as const },
    ];

    const handleToggle = (id: "cgm" | "watch" | "fitbit") => {
        setSyncing(id);
        setTimeout(() => {
            onToggleConnect(id);
            setSyncing(null);
        }, 1200);
    };

    return (
        <div className="premium-card p-6 bg-white">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold">{t("dashboard.syncTitle")}</h3>
                    <p className="text-sm text-muted-foreground">{t("dashboard.syncSubtitle")}</p>
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Plus size={20} />
                </button>
            </div>

            <div className="space-y-4">
                {devices.map((device) => {
                    const Icon = device.icon;
                    const isConnected = connectedDevices[device.key];
                    const isSyncing = syncing === device.id;

                    return (
                        <div key={device.id} className="flex items-center justify-between p-4 rounded-xl border bg-gray-50/50 hover:bg-white transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg transition-all duration-300 ${isConnected ? "bg-primary/10 text-primary" : "bg-gray-200 text-gray-500"}`}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold">{device.name}</h4>
                                    <p className="text-xs text-muted-foreground">
                                        {device.type} • {isConnected ? getDeviceValueString(device.id) : t("dashboard.connectToView")}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleToggle(device.key)}
                                disabled={isSyncing}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${isConnected
                                        ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                        : "bg-primary text-white shadow-md shadow-primary/10 hover:bg-primary/95"
                                    }`}
                            >
                                {isSyncing ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                ) : isConnected ? (
                                    t("dashboard.disconnect")
                                ) : (
                                    t("dashboard.connect")
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-orange-50 border border-orange-100 flex gap-3 text-orange-800 animate-in slide-in-from-bottom duration-300">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-xs leading-relaxed">
                    <strong>{t("dashboard.proTipLabel")}</strong> {t("dashboard.syncTip")}
                </p>
            </div>
        </div>
    );
}
