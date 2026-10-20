"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Download, Plus } from "lucide-react";
import { getPortalPatient } from "@/lib/clinicalPortal";
import { useLanguage } from "@/components/i18n/LanguageContext";
import { portalCopy, tx } from "@/lib/i18n/portalCopy";

const meeraHistory = [
    { kind: "CHRONIC", year: "Est. 2018", title: "Type 2 Diabetes Mellitus", detail: "HbA1c Target < 7.0%. Currently managed with Metformin.", tags: ["Endocrine", "Metabolic"] },
    { kind: "CHRONIC", year: "Est. 2015", title: "Essential Hypertension", detail: "Stage 1. Controlled with Lisinopril 10mg daily.", tags: ["Cardio"] },
    { kind: "RESOLVED", year: "2021", title: "Acute Bronchitis", detail: "Self-limiting. No long-term pulmonary impact.", tags: [] },
];

const allergies = [
    { name: "PENICILLIN G", detail: "Severe Reaction: Anaphylaxis", tone: "bg-rose-50 text-rose-700" },
    { name: "SULFA DRUGS", detail: "Mild Reaction: Hives / Rash", tone: "bg-amber-50 text-amber-700" },
    { name: "LATEX", detail: "Contact Dermatitis", tone: "bg-slate-50 text-slate-700" },
];

const surgeries = [
    { date: "July 2019", title: "Appendectomy", detail: "Laparoscopic, no complications." },
    { date: "March 2012", title: "Knee Arthroscopy", detail: "Left meniscus repair." },
];

const labs = [
    { name: "HbA1c", result: "6.8%", range: "< 5.7%", date: "Oct 24, 2023", trend: "up" },
    { name: "Fasting Glucose", result: "112 mg/dL", range: "70-99 mg/dL", date: "Oct 24, 2023", trend: "flat" },
    { name: "LDL Cholesterol", result: "94 mg/dL", range: "< 100 mg/dL", date: "Sep 12, 2023", trend: "down" },
];

export default function ClinicalHistory() {
    const params = useParams<{ id: string }>();
    const patient = getPortalPatient(params.id);
    const { locale } = useLanguage();
    const copy = portalCopy[locale];
    const text = copy.history;
    const [added, setAdded] = useState<{ title: string; detail: string }[]>([]);
    const [draft, setDraft] = useState("");
    const [open, setOpen] = useState(false);
    const [notice, setNotice] = useState("");

    if (!patient) return <p className="text-slate-500">{portalCopy[locale].profile.missing}</p>;

    const history = patient.id === "meera-iyer"
        ? meeraHistory
        : patient.conditions.map((condition) => ({ kind: "CHRONIC", year: "On file", title: condition.name, detail: condition.detail, tags: [] as string[] }));

    return (
        <div className="mx-auto max-w-6xl space-y-4">
            <p className="text-xs text-slate-400">
                <Link href="/provider/patients">{text.population}</Link> &gt; <Link href={`/provider/patients/${patient.id}`}>{patient.name}</Link> &gt; {text.crumb}
            </p>
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-primary">{text.eyebrow}</p>
                    <h1 className="text-3xl font-bold">{patient.name}</h1>
                    <p className="text-sm text-slate-500">{text.dob} {patient.dob} ({tx(copy, patient.age)}) · {text.mrn} #{patient.mrn} · <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{patient.status === "Critical" ? tx(copy, "Needs review") : tx(copy, "In Range")}</span></p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => window.print()} className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium"><Download size={15} /> {text.exportPdf}</button>
                    <button onClick={() => setNotice("EHR import queued. New conditions will appear after the next sync.")} className="h-10 rounded-lg bg-primary px-3 text-sm font-semibold text-white">{text.importEhr}</button>
                </div>
            </div>
            {notice && <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-primary">{tx(copy, notice)}</p>}

            <div className="grid gap-4 lg:grid-cols-[1.5fr_0.7fr]">
                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex justify-between"><h2 className="font-semibold">{text.past}</h2><button onClick={() => setOpen(true)} className="text-sm font-medium text-primary">{text.addCondition}</button></div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {history.map((item) => (
                            <article key={item.title} className="rounded-xl border border-slate-200 p-3">
                                <p className="flex justify-between text-[10px] font-semibold tracking-wide text-slate-400"><span>{tx(copy, item.kind)}</span><span>{tx(copy, item.year)}</span></p>
                                <p className="mt-1 font-semibold">{tx(copy, item.title)}</p>
                                <p className="text-sm text-slate-500">{tx(copy, item.detail)}</p>
                                <div className="mt-2 flex gap-2">{item.tags.map((tag) => <span key={tag} className="rounded bg-slate-100 px-2 py-0.5 text-[10px]">{tx(copy, tag)}</span>)}</div>
                            </article>
                        ))}
                        {added.map((item) => (
                            <article key={item.title} className="rounded-xl border border-dashed border-primary p-3">
                                <p className="text-[10px] font-semibold text-primary">{tx(copy, "ADDED TODAY")}</p>
                                <p className="font-semibold">{item.title}</p>
                                <p className="text-sm text-slate-500">{tx(copy, item.detail)}</p>
                            </article>
                        ))}
                        <button onClick={() => setOpen(true)} className="flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 text-sm text-slate-400">
                            <Plus size={18} /> {text.addDiagnosis}
                        </button>
                    </div>
                    {open && (
                        <form
                            className="mt-4 flex gap-2"
                            onSubmit={(event) => {
                                event.preventDefault();
                                if (!draft.trim()) return;
                                setAdded((items) => [...items, { title: draft.trim(), detail: "Added from this visit." }]);
                                setDraft("");
                                setOpen(false);
                            }}
                        >
                            <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={text.conditionName} className="h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none" />
                            <button className="rounded-lg bg-primary px-3 text-sm font-semibold text-white">{text.save}</button>
                        </form>
                    )}
                </section>
                <section className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5">
                    <h2 className="font-semibold text-rose-700">{text.allergies}</h2>
                    <ul className="mt-3 space-y-2">
                        {(patient.id === "meera-iyer" ? allergies : [{ name: "No severe allergies on file", detail: "Confirm at the next visit.", tone: "bg-white text-slate-600" }]).map((item) => (
                            <li key={item.name} className={`rounded-xl px-3 py-2 text-sm ${item.tone}`}>
                                <p className="font-semibold">{tx(copy, item.name)}</p>
                                <p>{tx(copy, item.detail)}</p>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h2 className="font-semibold">{text.surgical}</h2>
                    <ul className="mt-4 space-y-4">
                        {(patient.id === "meera-iyer" ? surgeries : [{ date: "None recorded", title: "No procedures on file", detail: "Ask during intake if this is incomplete." }]).map((item) => (
                            <li key={item.title} className="border-l-2 border-slate-200 pl-3">
                                <p className="text-xs text-slate-400">{tx(copy, item.date)}</p>
                                <p className="font-semibold">{tx(copy, item.title)}</p>
                                <p className="text-sm text-slate-500">{tx(copy, item.detail)}</p>
                            </li>
                        ))}
                    </ul>
                </section>
                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex justify-between"><h2 className="font-semibold">{text.labs}</h2><Link href={`/provider/patients/${patient.id}/observations`} className="text-sm text-primary">{text.viewAllLabs}</Link></div>
                    <table className="mt-3 w-full text-left text-sm">
                        <thead className="text-[11px] text-slate-400"><tr><th className="py-2 font-medium">{text.testName}</th><th>{text.result}</th><th>{text.reference}</th><th>{text.date}</th><th>{text.trend}</th></tr></thead>
                        <tbody>
                            {labs.map((lab) => (
                                <tr key={lab.name} className="border-t border-slate-100">
                                    <td className="py-2">{tx(copy, lab.name)}</td>
                                    <td className="font-semibold text-primary">{lab.result}</td>
                                    <td className="text-slate-500">{lab.range}</td>
                                    <td className="text-slate-500">{tx(copy, lab.date)}</td>
                                    <td>{lab.trend === "up" ? "↑" : lab.trend === "down" ? "↓" : "→"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="font-semibold">{text.ehr}</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <article className="rounded-xl bg-slate-50 p-4 text-sm"><p className="font-semibold">{tx(copy, "Epic Systems Sync")}</p><p className="text-slate-500">{tx(copy, "Last successful sync: Today, 08:45 AM")}</p><p className="text-emerald-600">{tx(copy, "Healthy Connection")}</p></article>
                    <article className="rounded-xl bg-slate-50 p-4 text-sm"><p className="font-semibold">{tx(copy, "Manual Lab Upload")}</p><p className="text-slate-500">{tx(copy, "Uploaded by Dr. Aris (Oct 15, 2023)")}</p><button onClick={() => setNotice("Source file: Quest lab PDF, Oct 15, 2023.")} className="text-primary">{text.viewSource}</button></article>
                    <article className="rounded-xl bg-slate-50 p-4 text-sm"><p className="font-semibold">{tx(copy, "Audit History")}</p><p className="text-slate-500">{tx(copy, "14 updates in the last 30 days")}</p><button onClick={() => setNotice("Latest audit: care plan viewed today, lab imported Oct 15.")} className="text-primary">{text.logs}</button></article>
                </div>
            </section>
        </div>
    );
}
