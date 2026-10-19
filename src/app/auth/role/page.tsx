"use client";

import { useState } from "react";
import Link from "next/link";
import { BriefcaseMedical, Check, Lock, User } from "lucide-react";
import IndiaCareMark from "@/components/auth/IndiaCareMark";

type Portal = "patient" | "doctor";

const portals: Record<
    Portal,
    { title: string; description: string; signIn: string; create: string; signInHref: string; createHref: string }
> = {
    patient: {
        title: "Patient Portal",
        description: "Manage your health and connect with your care team.",
        signIn: "Sign In to Patient Portal",
        create: "Create Patient Account",
        signInHref: "/auth/login",
        createHref: "/auth/patient/register",
    },
    doctor: {
        title: "Doctor Portal",
        description: "Monitor populations and deliver critical clinical interventions.",
        signIn: "Sign In to Doctor Portal",
        create: "Create Doctor Account",
        signInHref: "/auth/provider/login",
        createHref: "/auth/provider/register",
    },
};

export default function RoleSelectionPage() {
    const [portal, setPortal] = useState<Portal | null>(null);
    const selected = portal ? portals[portal] : null;

    return (
        <div className="min-h-screen bg-[#f4f3ef] px-4 py-4 sm:px-6 sm:py-5">
            <p className="mb-3 px-1 text-xs font-medium text-slate-400">Auth / Role Selection</p>

            <div className="grid min-h-[calc(100vh-4.25rem)] bg-[#e7eefb] lg:grid-cols-[1.15fr_0.85fr]">
                <section className="flex flex-col justify-between px-8 py-12 sm:px-12 lg:px-16 lg:py-14">
                    <div className="max-w-md lg:my-auto">
                        <IndiaCareMark />
                        <h1 className="mt-10 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                            Empowering clinical precision through shared insights.
                        </h1>
                        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                            Select your role to access personalized dashboards, clinical alerts, and integrated care plans
                            tailored for effective diabetes management.
                        </p>

                        <div className="mt-8 flex items-center gap-3">
                            <div className="flex items-center">
                                {["bg-sky-200", "bg-blue-200", "bg-indigo-200"].map((tone) => (
                                    <span
                                        key={tone}
                                        className={`-ml-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#e7eefb] first:ml-0 ${tone} text-primary`}
                                    >
                                        <User size={15} />
                                    </span>
                                ))}
                                <span className="-ml-2 flex h-9 items-center rounded-full border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600">
                                    +5k
                                </span>
                            </div>
                        </div>
                        <p className="mt-3 text-xs text-slate-500">Trusted by providers across 40+ medical centers.</p>
                    </div>

                    <p className="mt-12 text-[11px] font-semibold tracking-[0.18em] text-slate-400">v2.4.0 CLINICAL BUILD</p>
                </section>

                <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:pr-12">
                    <div className="w-full max-w-[440px] rounded-2xl bg-white px-6 py-8 shadow-[0_24px_70px_-36px_rgba(29,78,216,0.55)] sm:px-8 sm:py-10">
                        <p className="text-center text-[11px] font-semibold tracking-[0.22em] text-primary">GETTING STARTED</p>
                        <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-slate-900">
                            Choose your portal access
                        </h2>

                        <div className="mt-8 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Portal">
                            {(Object.keys(portals) as Portal[]).map((key) => {
                                const item = portals[key];
                                const active = portal === key;
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        role="radio"
                                        aria-checked={active}
                                        onClick={() => setPortal(key)}
                                        className={`relative flex min-h-[168px] flex-col items-center rounded-xl px-3 py-5 text-center transition-colors ${
                                            active
                                                ? "border-2 border-primary bg-white"
                                                : "border border-slate-200 bg-white hover:border-slate-300"
                                        }`}
                                    >
                                        <span
                                            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                                                key === "doctor" && active
                                                    ? "bg-primary text-white"
                                                    : "bg-blue-100 text-primary"
                                            }`}
                                        >
                                            {key === "doctor" ? <BriefcaseMedical size={22} /> : <User size={22} />}
                                        </span>
                                        <span className="mt-4 text-sm font-bold text-slate-900">{item.title}</span>
                                        <span className="mt-1 text-xs leading-snug text-slate-500">{item.description}</span>
                                        {active && (
                                            <span className="absolute bottom-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                                                <Check size={12} strokeWidth={3} />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {selected ? (
                            <>
                                <Link
                                    href={selected.signInHref}
                                    className="mt-6 flex h-12 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                                >
                                    {selected.signIn}
                                </Link>
                                <Link
                                    href={selected.createHref}
                                    className="mt-3 flex h-12 items-center justify-center rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
                                >
                                    {selected.create}
                                </Link>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    disabled
                                    className="mt-6 flex h-12 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white opacity-50"
                                >
                                    Sign In
                                </button>
                                <button
                                    type="button"
                                    disabled
                                    className="mt-3 flex h-12 w-full items-center justify-center rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 opacity-50"
                                >
                                    Create Account
                                </button>
                            </>
                        )}

                        <div className="my-8 flex items-center gap-3">
                            <div className="h-px flex-1 bg-slate-200" />
                            <span className="text-[10px] font-semibold tracking-[0.18em] text-slate-400">SECURITY PROTOCOL</span>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-500">
                            <Lock size={13} />
                            HIPAA Compliant and Encrypted End-to-End
                        </p>

                        <div className="mt-6 flex items-center justify-center gap-6 text-[10px] font-semibold tracking-[0.16em] text-slate-400">
                            <span className="inline-flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                SYSTEMS ACTIVE
                            </span>
                            <span>GLOBAL SUPPORT AVAILABLE</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
