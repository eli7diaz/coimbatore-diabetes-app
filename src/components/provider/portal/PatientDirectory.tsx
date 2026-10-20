"use client";

import Link from "next/link";
import { portalPatients } from "@/lib/clinicalPortal";
import { usePortalSearch } from "@/components/provider/portal/ProviderShell";
import { useLanguage } from "@/components/i18n/LanguageContext";
import { matchesQuery, portalCopy, tx } from "@/lib/i18n/portalCopy";

export default function PatientDirectory() {
    const { query } = usePortalSearch();
    const { locale } = useLanguage();
    const copy = portalCopy[locale];
    const text = copy.directory;
    const patients = portalPatients.filter((patient) =>
        matchesQuery(copy, query, [patient.name, patient.mrn, patient.email, patient.status, ...patient.conditions.flatMap((item) => [item.name, item.detail])])
    );

    return (
        <div className="mx-auto max-w-6xl">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-primary">{text.eyebrow}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">{text.title}</h1>
            <p className="mt-1 text-sm text-slate-500">{text.body}</p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-[11px] tracking-wide text-slate-400">
                        <tr>
                            <th className="px-4 py-3 font-medium">{text.patient}</th>
                            <th className="px-4 py-3 font-medium">{text.mrn}</th>
                            <th className="px-4 py-3 font-medium">{text.status}</th>
                            <th className="px-4 py-3 font-medium">{text.latest}</th>
                            <th className="px-4 py-3 font-medium">{text.chart}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient) => (
                            <tr key={patient.id} className="border-t border-slate-100">
                                <td className="px-4 py-3">
                                    <p className="font-semibold">{patient.name}</p>
                                    <p className="text-xs text-slate-400">{tx(copy, patient.age)}</p>
                                </td>
                                <td className="px-4 py-3 text-slate-500">{patient.mrn}</td>
                                <td className="px-4 py-3 text-xs font-semibold text-slate-600">{tx(copy, patient.status)}</td>
                                <td className="px-4 py-3">{patient.lastGlucose}</td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-3 text-sm font-medium text-primary">
                                        <Link href={`/provider/patients/${patient.id}`}>{text.profile}</Link>
                                        <Link href={`/provider/patients/${patient.id}/history`}>{text.history}</Link>
                                        <Link href={`/provider/patients/${patient.id}/observations`}>{text.log}</Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {patients.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">{text.empty}</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
