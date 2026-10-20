"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Pencil, Printer, UserRound } from "lucide-react";
import { getPortalPatient } from "@/lib/clinicalPortal";

const series = {
    "1W": [118, 124, 110, 132, 121, 128, 118],
    "1M": [140, 132, 128, 136, 122, 118, 124],
    "3M": [156, 148, 142, 138, 130, 124, 118],
};

export default function PatientProfile() {
    const params = useParams<{ id: string }>();
    const patient = getPortalPatient(params.id);
    const [range, setRange] = useState<keyof typeof series>("1W");
    const [editing, setEditing] = useState(false);
    const points = series[range];
    const chart = useMemo(() => toPath(points), [points]);

    if (!patient) return <p className="text-slate-500">That patient chart is not on this panel.</p>;

    const average = Math.round(points.reduce((sum, value) => sum + value, 0) / points.length);

    return (
        <div className="mx-auto max-w-6xl space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex gap-4">
                        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-primary"><UserRound size={28} /></span>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold">{patient.name}</h1>
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">{patient.status}</span>
                            </div>
                            <dl className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-4">
                                <Field label="MRN" value={`${patient.mrn} (${patient.age})`} />
                                <Field label="DOB" value={patient.dob} />
                                <Field label="PHONE" value={patient.phone} />
                                <Field label="EMAIL" value={patient.email} />
                            </dl>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setEditing((value) => !value)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200" aria-label="Edit chart"><Pencil size={16} /></button>
                        <button onClick={() => window.print()} className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200" aria-label="Print chart"><Printer size={16} /></button>
                        <Link href={`/provider/patients/${patient.id}/observations`} className="flex h-10 items-center rounded-lg border border-primary px-3 text-sm font-semibold text-primary">Vitals Log</Link>
                        <Link href={`/provider/patients/${patient.id}/history`} className="flex h-10 items-center rounded-lg bg-slate-900 px-3 text-sm font-semibold text-white">Clinical History</Link>
                    </div>
                </div>
                {editing && <p className="mt-4 rounded-lg bg-blue-50 px-3 py-2 text-sm text-primary">Chart edits are recorded for the care team. Close the pencil to finish.</p>}
            </section>

            <div className="grid gap-4 lg:grid-cols-[280px_1fr_280px]">
                <div className="space-y-4">
                    <section className="rounded-2xl border border-slate-200 bg-white p-4">
                        <h2 className="font-semibold">Conditions</h2>
                        <div className="mt-3 space-y-2">
                            {patient.conditions.map((condition) => (
                                <article key={condition.name} className={`rounded-xl p-3 ${condition.tone === "rose" ? "bg-rose-50" : "bg-slate-50"}`}>
                                    <p className="font-semibold">{condition.name}</p>
                                    <p className="text-xs text-slate-500">{condition.detail}</p>
                                </article>
                            ))}
                        </div>
                    </section>
                    <section className="rounded-2xl border border-slate-200 bg-white p-4">
                        <h2 className="font-semibold">Medications <span className="text-primary">+ Add</span></h2>
                        <ul className="mt-3 space-y-3">
                            {patient.medications.map((medication) => (
                                <li key={medication.name} className="text-sm">
                                    <p className="font-semibold">{medication.name}</p>
                                    <p className="text-slate-500">{medication.dose}</p>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <div className="space-y-4">
                    <section className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="font-semibold">Blood Glucose Trend</h2>
                                <p className="text-sm text-slate-500">Continuous glucose monitoring ({range === "1W" ? "Past 7 Days" : range === "1M" ? "Past 30 Days" : "Past 90 Days"})</p>
                            </div>
                            <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
                                {(Object.keys(series) as Array<keyof typeof series>).map((key) => (
                                    <button key={key} onClick={() => setRange(key)} className={`rounded-md px-2 py-1 ${range === key ? "bg-white text-slate-900" : "text-slate-500"}`}>{key}</button>
                                ))}
                            </div>
                        </div>
                        <svg viewBox="0 0 320 140" className="mt-4 h-40 w-full rounded-xl bg-slate-50">
                            <path d={chart} fill="none" stroke="#2563eb" strokeWidth="3" />
                        </svg>
                        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                            <Mini label="AVERAGE" value={`${average} mg/dL`} />
                            <Mini label="TIME IN RANGE" value="82%" />
                            <Mini label="STANDARD DEV" value="28" />
                        </div>
                    </section>
                    <section className="rounded-2xl border border-slate-200 bg-white p-4">
                        <h2 className="font-semibold">HbA1c History</h2>
                        <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                            <div className="space-y-2">
                                <Row label="Latest (Aug 2023)" value="6.8%" />
                                <Row label="Previous (May 2023)" value="7.2%" />
                                <Row label="Baseline (Jan 2023)" value="8.1%" />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-primary">-1.3%</p>
                                <p className="text-[10px] font-semibold tracking-wide text-slate-400">YTD IMPROVEMENT</p>
                            </div>
                        </div>
                    </section>
                </div>

                <section className="rounded-2xl border border-slate-200 bg-white p-4">
                    <h2 className="font-semibold">Recent Observations</h2>
                    <ul className="mt-3 divide-y divide-slate-100 text-sm">
                        <li className="py-3"><p className="text-slate-500">Blood Glucose <span className="float-right">2 hrs ago</span></p><p className="font-semibold">{patient.lastGlucose} <span className="ml-2 rounded bg-emerald-50 px-1.5 text-[10px] text-emerald-600">IN RANGE</span></p><p className="text-xs text-slate-400">Sync via Dexcom G6</p></li>
                        <li className="py-3"><p className="text-slate-500">Blood Pressure <span className="float-right">Today, 08:30 AM</span></p><p className="font-semibold">128/84 <span className="ml-2 rounded bg-amber-50 px-1.5 text-[10px] text-amber-600">ELEVATED</span></p><p className="text-xs text-slate-400">Manual Entry (Clinic)</p></li>
                        <li className="py-3"><p className="text-slate-500">Body Weight <span className="float-right">Yesterday</span></p><p className="font-semibold">168.4 kg</p><p className="text-xs text-slate-400">Withings Smart Scale</p></li>
                    </ul>
                    <Link href={`/provider/patients/${patient.id}/observations`} className="mt-3 block text-sm font-medium text-primary">View All Observations</Link>
                </section>
            </div>
        </div>
    );
}

function toPath(values: number[]) {
    const min = Math.min(...values) - 10;
    const max = Math.max(...values) + 10;
    return values.map((value, index) => {
        const x = (index / (values.length - 1)) * 300 + 10;
        const y = 120 - ((value - min) / (max - min)) * 100;
        return `${index === 0 ? "M" : "L"}${x},${y}`;
    }).join(" ");
}

function Field({ label, value }: { label: string; value: string }) {
    return <div><dt className="text-[10px] font-semibold tracking-wide text-slate-400">{label}</dt><dd className="font-medium">{value}</dd></div>;
}
function Mini({ label, value }: { label: string; value: string }) {
    return <div className="rounded-xl bg-slate-50 py-3"><p className="text-[10px] font-semibold text-slate-400">{label}</p><p className="text-lg font-bold text-primary">{value}</p></div>;
}
function Row({ label, value }: { label: string; value: string }) {
    return <p className="flex justify-between gap-8"><span className="text-slate-500">{label}</span><span className="font-semibold text-primary">{value}</span></p>;
}
