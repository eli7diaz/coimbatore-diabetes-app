"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Droplets, HeartPulse, Pencil, Search, TestTube } from "lucide-react";
import { getPortalPatient } from "@/lib/clinicalPortal";

type Kind = "Blood Glucose" | "Blood Pressure" | "HbA1c" | "Body Weight";
type Entry = { id: string; kind: Kind; time: string; value: string; status: string; source: string; tone: string };

const lakshmiLog: Entry[] = [
    { id: "1", kind: "Blood Glucose", time: "Today, 08:15 AM", value: "112 mg/dL", status: "In Range", source: "Patient App", tone: "bg-emerald-50 text-emerald-700" },
    { id: "2", kind: "Blood Pressure", time: "Yesterday, 06:20 PM", value: "138/84 mmHg", status: "At Risk", source: "Device (Omron)", tone: "bg-amber-50 text-amber-700" },
    { id: "3", kind: "HbA1c", time: "Oct 24, 2023", value: "7.2 %", status: "Critical Alert", source: "City Central Lab", tone: "bg-rose-50 text-rose-700" },
];

const older: Entry[] = Array.from({ length: 15 }, (_, index) => ({
    id: `old-${index}`,
    kind: "Blood Glucose" as Kind,
    time: `Oct ${Math.max(1, 20 - index)}, 2023`,
    value: `${100 + index} mg/dL`,
    status: "In Range",
    source: "Patient App",
    tone: "bg-emerald-50 text-emerald-700",
}));

export default function ObservationEntry() {
    const params = useParams<{ id: string }>();
    const patient = getPortalPatient(params.id);
    const [kind, setKind] = useState<Kind>("Blood Glucose");
    const [observedAt, setObservedAt] = useState("11/24/2023, 10:30 AM");
    const [source, setSource] = useState("Patient");
    const [result, setResult] = useState("0.0");
    const [systolic, setSystolic] = useState("120");
    const [diastolic, setDiastolic] = useState("80");
    const [log, setLog] = useState<Entry[]>(patient?.id === "lakshmi-raman" ? lakshmiLog : []);
    const [showOlder, setShowOlder] = useState(false);
    const [filter, setFilter] = useState("");
    const [audit, setAudit] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        setLog(patient?.id === "lakshmi-raman" ? lakshmiLog : []);
        setShowOlder(false);
        setEditingId(null);
    }, [patient?.id]);

    const rows = useMemo(() => {
        const all = showOlder ? [...log, ...older] : log;
        const needle = filter.trim().toLowerCase();
        return all.filter((entry) => !needle || `${entry.kind} ${entry.value} ${entry.source} ${entry.status}`.toLowerCase().includes(needle));
    }, [log, showOlder, filter]);

    if (!patient) return <p className="text-slate-500">That patient chart is not on this panel.</p>;

    const reset = () => {
        setKind("Blood Glucose");
        setObservedAt("11/24/2023, 10:30 AM");
        setSource("Patient");
        setResult("0.0");
        setSystolic("120");
        setDiastolic("80");
        setEditingId(null);
    };

    const record = () => {
        const value = kind === "Blood Pressure" ? `${systolic}/${diastolic} mmHg` : kind === "Body Weight" ? `${result} kg` : kind === "HbA1c" ? `${result} %` : `${result} mg/dL`;
        const numeric = Number(kind === "Blood Pressure" ? systolic : result);
        const status = kind === "Blood Glucose" && numeric < 70 ? "Critical Alert" : kind === "Blood Glucose" && numeric > 180 ? "At Risk" : kind === "Blood Pressure" && numeric >= 140 ? "At Risk" : kind === "HbA1c" && numeric >= 7 ? "Critical Alert" : "In Range";
        const tone = status === "In Range" ? "bg-emerald-50 text-emerald-700" : status === "At Risk" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700";
        const entry = { id: editingId ?? `new-${Date.now()}`, kind, time: observedAt, value, status, source, tone };
        setLog((items) => editingId ? items.map((item) => item.id === editingId ? entry : item) : [entry, ...items]);
        setEditingId(null);
    };

    return (
        <div className="mx-auto max-w-6xl space-y-4">
            <p className="text-xs text-slate-400">
                <Link href="/provider/patients">Patient Records</Link> &gt; {patient.name} (ID: {patient.mrn})
            </p>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Observation Entry</h1>
                <button onClick={() => setAudit((value) => !value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">View Audit Log</button>
            </div>
            {audit && <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">Audit: last sync 2 minutes ago. Manual entries stay attached to {patient.name}&apos;s chart.</p>}

            <div className="grid gap-4 lg:grid-cols-[1.4fr_0.7fr]">
                <form
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                    onSubmit={(event) => {
                        event.preventDefault();
                        record();
                    }}
                >
                    <h2 className="font-semibold">New Measurement Entry</h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <label className="text-sm text-slate-500">Measurement Kind
                            <select value={kind} onChange={(event) => setKind(event.target.value as Kind)} className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-slate-900">
                                <option>Blood Glucose</option>
                                <option>Blood Pressure</option>
                                <option>HbA1c</option>
                                <option>Body Weight</option>
                            </select>
                        </label>
                        <label className="text-sm text-slate-500">Observed At (Date/Time)
                            <input value={observedAt} onChange={(event) => setObservedAt(event.target.value)} className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-slate-900" />
                        </label>
                        <div>
                            <p className="text-sm text-slate-500">Source</p>
                            <div className="mt-1 flex gap-2">
                                {["Patient", "Lab", "Device"].map((option) => (
                                    <button type="button" key={option} onClick={() => setSource(option)} className={`h-10 rounded-lg border px-3 text-sm ${source === option ? "border-primary bg-blue-50 text-primary" : "border-slate-200"}`}>{option}</button>
                                ))}
                            </div>
                        </div>
                        <label className="text-sm text-slate-500">Result Value
                            <input value={result} onChange={(event) => setResult(event.target.value)} className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-slate-900" />
                        </label>
                    </div>
                    <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-4">
                        <p className="text-sm font-medium">Blood Pressure Dual Entry</p>
                        <div className="mt-2 flex items-center gap-2">
                            <input value={systolic} onChange={(event) => setSystolic(event.target.value)} aria-label="Systolic" className="h-10 w-24 rounded-lg border border-slate-200 px-3" />
                            <span>/</span>
                            <input value={diastolic} onChange={(event) => setDiastolic(event.target.value)} aria-label="Diastolic" className="h-10 w-24 rounded-lg border border-slate-200 px-3" />
                            <span className="text-sm text-slate-400">mmHg</span>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-3">
                        <button type="button" onClick={reset} className="text-sm text-slate-500">Discard</button>
                        <button type="button" onClick={record} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">{editingId ? "Update Observation" : "Record Observation"}</button>
                    </div>
                </form>
                <div className="space-y-4">
                    <section className="rounded-2xl bg-primary p-5 text-white">
                        <p className="text-sm text-blue-100">Patient Status</p>
                        <p className="text-xs text-blue-100">Last synced 2 minutes ago</p>
                        <p className="mt-3 text-4xl font-bold">{patient.lastGlucose}</p>
                        <p className="mt-2 text-sm text-blue-100">Stable Glycemic Control</p>
                    </section>
                    <section className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">
                        <p className="font-semibold text-slate-800">Clinical Context</p>
                        <p className="mt-2">{patient.name.split(" ")[0]}&apos;s HbA1c target is 7.0%. Please ensure manual entries match CGM data for reporting accuracy.</p>
                    </section>
                </div>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-semibold">Recent History Log</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Search entries..." className="h-10 rounded-lg border border-slate-200 pl-8 pr-3 text-sm outline-none" />
                    </div>
                </div>
                <div className="mt-3 overflow-x-auto">
                    <table className="w-full min-w-[680px] text-left text-sm">
                        <thead className="text-[11px] text-slate-400"><tr><th className="py-2 font-medium">KIND</th><th>OBSERVED TIME</th><th>VALUE</th><th>STATUS</th><th>SOURCE</th><th>ACTIONS</th></tr></thead>
                        <tbody>
                            {rows.map((entry) => (
                                <tr key={entry.id} className="border-t border-slate-100">
                                    <td className="py-3 font-medium">
                                        <span className="inline-flex items-center gap-2">
                                            {entry.kind === "Blood Pressure" ? <HeartPulse size={16} /> : entry.kind === "HbA1c" ? <TestTube size={16} /> : <Droplets size={16} />}
                                            {entry.kind}
                                        </span>
                                    </td>
                                    <td>{entry.time}</td>
                                    <td className="font-semibold">{entry.value}</td>
                                    <td><span className={`rounded-full px-2 py-1 text-xs font-semibold ${entry.tone}`}>{entry.status}</span></td>
                                    <td className="text-slate-500">{entry.source}</td>
                                    <td>
                                        <button
                                            aria-label={`Edit ${entry.kind}`}
                                            onClick={() => {
                                                setEditingId(entry.id);
                                                setKind(entry.kind);
                                                setObservedAt(entry.time);
                                                setSource(entry.source.includes("Lab") ? "Lab" : entry.source.includes("Device") ? "Device" : "Patient");
                                                setResult(entry.value.split(" ")[0]);
                                            }}
                                        >
                                            <Pencil size={15} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {rows.length === 0 && <tr><td colSpan={6} className="py-6 text-center text-slate-400">No observations yet. Record the first measurement above.</td></tr>}
                        </tbody>
                    </table>
                </div>
                <button onClick={() => setShowOlder(true)} className="mt-3 w-full text-sm font-medium text-primary">Load 15 older entries ↓</button>
            </section>
        </div>
    );
}
