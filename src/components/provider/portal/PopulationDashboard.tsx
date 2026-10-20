"use client";

import { useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { usePortalSearch } from "@/components/provider/portal/ProviderShell";

const bars = [
    { label: "< 7.0", height: 130, color: "bg-emerald-300" },
    { label: "7.0 - 8.0", height: 78, color: "bg-amber-300" },
    { label: "8.0 - 9.0", height: 58, color: "bg-orange-300" },
    { label: "> 9.0", height: 44, color: "bg-red-400" },
];

const actions = [
    { tag: "FOLLOW-UP", when: "Today", title: "Review Care Plan: Sarah Jenkins", detail: "Consistently high fasting glucose readings last 4 days.", tone: "border-blue-500" },
    { tag: "PRESCRIPTION", when: "Due 2h", title: "Authorize Insulin Refill: Karthik S.", detail: "30-day supply expired. Patient request pending.", tone: "border-violet-500" },
    { tag: "SCREENING", when: "Tomorrow", title: "Annual Foot Exam: 8 Patients", detail: "Overdue screenings per ICMR compliance.", tone: "border-orange-400" },
    { tag: "FOLLOW-UP", when: "Today", title: "CGM review: Meera Iyer", detail: "Confirm overnight lows before the 11:15 visit.", tone: "border-blue-500" },
    { tag: "LAB", when: "This week", title: "Repeat HbA1c: Kevin Chen", detail: "Last critical low needs a same-week lab check.", tone: "border-red-400" },
];

const queue = [
    { id: "arjun-sharma", time: "10:30", name: "Arjun Sharma", visit: "Regular Checkup", status: "WAITING", glucose: "142 mg/dL", note: "latest CGM", tone: "bg-slate-100 text-slate-500" },
    { id: "meera-iyer", time: "11:15", name: "Meera Iyer", visit: "CGM Review", status: "IN PROGRESS", glucose: "98 mg/dL", note: "latest CGM", tone: "bg-blue-50 text-blue-600" },
    { id: "vijay-natarajan", time: "12:00", name: "Vijay Natarajan", visit: "Insulin Adjustment", status: "UPCOMING", glucose: "185 mg/dL", note: "latest CGM", tone: "bg-slate-100 text-slate-500" },
    { id: "divya-prakash", time: "14:15", name: "Divya Prakash", visit: "HbA1c Lab Follow-up", status: "UPCOMING", glucose: "121 mg/dL", note: "latest CGM", tone: "bg-slate-100 text-slate-500" },
];

export default function PopulationDashboard() {
    const { query } = usePortalSearch();
    const [range, setRange] = useState("Last 30 Days");
    const [showTasks, setShowTasks] = useState(false);
    const [showSchedule, setShowSchedule] = useState(false);

    const needle = query.trim().toLowerCase();
    const visibleQueue = queue.filter((visit) => !needle || `${visit.name} ${visit.visit}`.toLowerCase().includes(needle));
    const visibleActions = showTasks ? actions : actions.slice(0, 3);

    return (
        <div className="mx-auto max-w-6xl space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-primary">DOCTOR PORTAL</p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight">Doctor Population Dashboard</h1>
                    <p className="text-sm text-slate-500">Real-time clinical insights across 1,248 assigned patients.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => window.print()} className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium">
                        <Download size={15} /> Export PDF
                    </button>
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
                <Stat label="TOTAL PATIENTS" value="1,248" extra="+2.4%" extraClass="text-emerald-600" />
                <Stat label="HIGH RISK (HBA1C > 9)" value="142" extra="-12%" extraClass="text-red-500" />
                <Stat label="ACTIVE CGM SYNCS" value="154" extra="patients" extraClass="text-slate-400" />
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h2 className="font-semibold">HbA1c Distribution</h2>
                            <p className="text-sm text-slate-500">Percentage of population within specific glycemic ranges.</p>
                        </div>
                        <select value={range} onChange={(event) => setRange(event.target.value)} className="rounded-lg bg-slate-100 px-2 py-1 text-xs">
                            <option>Last 30 Days</option>
                            <option>Last 90 Days</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="mt-8 flex h-44 items-end gap-6 px-4">
                        {bars.map((bar) => (
                            <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                                <div className={`w-full max-w-[72px] rounded-t-lg ${bar.color}`} style={{ height: range === "Last Year" ? bar.height * 0.8 : bar.height }} />
                                <span className="text-xs text-slate-500">{bar.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-emerald-400" /> In Range</span>
                        <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-amber-400" /> Moderate Risk</span>
                        <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-red-500" /> High Risk</span>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h2 className="font-semibold">Priority Actions</h2>
                    <p className="text-sm text-slate-500">Immediate tasks requiring clinical attention.</p>
                    <div className="mt-4 space-y-3">
                        {visibleActions.map((action) => (
                            <article key={action.title} className={`rounded-xl border border-slate-200 border-l-4 ${action.tone} p-3`}>
                                <div className="flex justify-between text-[10px] font-semibold tracking-wide text-slate-400">
                                    <span>{action.tag}</span><span>{action.when}</span>
                                </div>
                                <p className="mt-1 text-sm font-semibold">{action.title}</p>
                                <p className="text-xs text-slate-500">{action.detail}</p>
                            </article>
                        ))}
                    </div>
                    <button onClick={() => setShowTasks((value) => !value)} className="mt-4 h-10 w-full rounded-lg border border-slate-200 text-sm font-medium">
                        {showTasks ? "Show fewer tasks" : "View All Tasks (14)"}
                    </button>
                </section>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="font-semibold">Today&apos;s Patient Queue</h2>
                            <p className="text-sm text-slate-500">Live monitoring check-ins · 12 visits today</p>
                        </div>
                        <button onClick={() => setShowSchedule(true)} className="text-sm font-medium text-primary">View Calendar</button>
                    </div>
                    <div className="mt-3 divide-y divide-slate-100">
                        {(showSchedule ? visibleQueue : visibleQueue.slice(0, 4)).map((visit) => (
                            <Link key={visit.id} href={`/provider/patients/${visit.id}`} className="flex items-center gap-3 py-3 text-sm">
                                <span className="w-12 text-slate-500">{visit.time}</span>
                                <span className="min-w-0 flex-1"><span className="block font-semibold">{visit.name}</span><span className="text-xs text-slate-400">{visit.visit}</span></span>
                                <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${visit.tone}`}>{visit.status}</span>
                                <span className="text-right text-xs"><span className="block font-semibold">{visit.glucose}</span><span className="text-slate-400">{visit.note}</span></span>
                            </Link>
                        ))}
                    </div>
                    <button onClick={() => setShowSchedule((value) => !value)} className="mt-2 text-sm font-medium text-primary">
                        {showSchedule ? "Show current queue" : "Full schedule →"}
                    </button>
                </section>
        </div>
    );
}

function Stat({ label, value, extra, extraClass = "", valueClass = "" }: { label: string; value: string; extra?: string; extraClass?: string; valueClass?: string }) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-[11px] font-semibold tracking-wide text-slate-400">{label}</p>
            <p className="mt-2 flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${valueClass}`}>{value}</span>
                {extra && <span className={`text-xs font-semibold ${extraClass}`}>{extra}</span>}
            </p>
        </article>
    );
}
