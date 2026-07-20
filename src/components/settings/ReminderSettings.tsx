"use client";

import { useState } from "react";
import { Bell, Clock, Settings, Volume2, Save, CheckCircle2 } from "lucide-react";

export default function ReminderSettings() {
    const [reminders, setReminders] = useState([
        { id: 1, label: "Fasting Glucose", time: "07:30", active: true, freq: "Daily" },
        { id: 2, label: "Post-Breakfast Check", time: "10:00", active: true, freq: "Daily" },
        { id: 3, label: "Weekly HbA1c Log", time: "09:00", active: false, freq: "Weekly" },
    ]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const toggleReminder = (id: number) => {
        setReminders(prev => prev.map(rem =>
            rem.id === id ? { ...rem, active: !rem.active } : rem
        ));
    };

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }, 1000);
    };

    return (
        <div className="premium-card p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold">Alarm & Reminders</h3>
                    <p className="text-sm text-muted-foreground">Adjust frequency and alert types</p>
                </div>
                <Settings size={20} className="text-muted-foreground" />
            </div>

            <div className="space-y-4 mb-6">
                {reminders.map((rem) => (
                    <div key={rem.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${rem.active ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400"}`}>
                                <Bell size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-bold">{rem.label}</p>
                                <p className="text-xs text-muted-foreground">{rem.time} • {rem.freq}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div
                                className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${rem.active ? "bg-primary" : "bg-gray-200"}`}
                                onClick={() => toggleReminder(rem.id)}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${rem.active ? "translate-x-4" : ""}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <label className="text-sm font-bold block">Smart Notification Frequency</label>
                <select className="w-full bg-white border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                    <option>Critical Only (Low/High)</option>
                    <option>Balanced (Hourly Trends)</option>
                    <option>Continuous (Full CGM Feed)</option>
                </select>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${saved ? "bg-green-500 text-white" : "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02]"
                        }`}
                >
                    {saving ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : saved ? (
                        <>
                            <CheckCircle2 size={18} />
                            Preferences Saved
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            Save Preferences
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
