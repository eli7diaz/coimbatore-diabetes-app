"use client";

import Link from "next/link";
import { portalPatients } from "@/lib/clinicalPortal";
import { usePortalSearch } from "@/components/provider/portal/ProviderShell";

export default function PatientDirectory() {
    const { query } = usePortalSearch();
    const needle = query.trim().toLowerCase();
    const patients = portalPatients.filter((patient) =>
        !needle || `${patient.name} ${patient.mrn} ${patient.email} ${patient.conditions.map((item) => item.name).join(" ")}`.toLowerCase().includes(needle)
    );

    return (
        <div className="mx-auto max-w-6xl">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-primary">PATIENT POPULATION</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Assigned patients</h1>
            <p className="mt-1 text-sm text-slate-500">Open a chart for the profile, clinical history, or observation log.</p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-[11px] tracking-wide text-slate-400">
                        <tr>
                            <th className="px-4 py-3 font-medium">PATIENT</th>
                            <th className="px-4 py-3 font-medium">MRN</th>
                            <th className="px-4 py-3 font-medium">STATUS</th>
                            <th className="px-4 py-3 font-medium">LATEST</th>
                            <th className="px-4 py-3 font-medium">CHART</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient) => (
                            <tr key={patient.id} className="border-t border-slate-100">
                                <td className="px-4 py-3">
                                    <p className="font-semibold">{patient.name}</p>
                                    <p className="text-xs text-slate-400">{patient.age}</p>
                                </td>
                                <td className="px-4 py-3 text-slate-500">{patient.mrn}</td>
                                <td className="px-4 py-3 text-xs font-semibold text-slate-600">{patient.status}</td>
                                <td className="px-4 py-3">{patient.lastGlucose}</td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-3 text-sm font-medium text-primary">
                                        <Link href={`/provider/patients/${patient.id}`}>Profile</Link>
                                        <Link href={`/provider/patients/${patient.id}/history`}>History</Link>
                                        <Link href={`/provider/patients/${patient.id}/observations`}>Log</Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {patients.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No patients match that search.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
