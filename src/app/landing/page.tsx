"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
    Activity,
    Bell,
    BookOpen,
    ChevronDown,
    Download,
    Lock,
    Menu,
    Plus,
    Shield,
    ShieldCheck,
    Sparkles,
    Stethoscope,
    Triangle,
    Users,
    Utensils,
    Watch,
    Wifi,
    X,
} from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageContext";
import type { Locale } from "@/lib/i18n/dictionaries";

const nav = [
    { href: "/landing", label: "Home" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#for-doctors", label: "For Doctors" },
];

export default function LandingPage() {
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#f4f6fb] text-slate-900">
            <SiteHeader open={open} setOpen={setOpen} />

            <main>
                <Hero />
                <ScaleSection />
                <HowItWorks />
                <Capabilities />
                <Clinics />
                <TrustRow />
            </main>

            <SiteFooter />
        </div>
    );
}

function SiteHeader({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
    const { locale, setLocale } = useLanguage();

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
            <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between gap-4 px-5">
                <Link href="/landing" className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1d4ed8] text-white">
                        <Plus size={18} strokeWidth={2.75} />
                    </span>
                    <span className="leading-tight">
                        <span className="block text-[15px] font-bold tracking-tight text-slate-900">India Care</span>
                        <span className="block text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                            Clinical Health Network
                        </span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-1 md:flex">
                    <Link href="/landing" className="rounded-lg bg-slate-100 px-3.5 py-2 text-sm font-medium text-slate-800">
                        Home
                    </Link>
                    <a href="#how-it-works" className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                        How it works
                    </a>
                    <a href="#for-doctors" className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                        For Doctors
                    </a>
                </nav>

                <div className="hidden items-center gap-3 md:flex">
                    <label className="relative">
                        <select
                            aria-label="Language"
                            value={locale}
                            onChange={(e) => setLocale(e.target.value as Locale)}
                            className="appearance-none rounded-lg bg-transparent py-2 pr-6 pl-2 text-sm font-medium text-slate-700 outline-none"
                        >
                            <option value="en">English</option>
                            <option value="ta">தமிழ்</option>
                            <option value="te">తెలుగు</option>
                            <option value="es">Español</option>
                        </select>
                        <ChevronDown size={14} className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-slate-500" />
                    </label>
                    <Link href="/auth/role" className="px-2 text-sm font-medium text-slate-700 hover:text-slate-900">
                        Sign In
                    </Link>
                    <Link
                        href="/auth/patient/register"
                        className="rounded-lg bg-[#1d4ed8] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1e40af]"
                    >
                        Get Started
                    </Link>
                </div>

                <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 md:hidden"
                    aria-label={open ? "Close menu" : "Open menu"}
                    onClick={() => setOpen(!open)}
                >
                    {open ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {open && (
                <div className="border-t border-slate-100 bg-white px-5 py-4 md:hidden">
                    <div className="flex flex-col gap-1">
                        {nav.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700"
                            >
                                {item.label}
                            </a>
                        ))}
                        <Link href="/auth/role" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700">
                            Sign In
                        </Link>
                        <Link
                            href="/auth/patient/register"
                            onClick={() => setOpen(false)}
                            className="mt-2 rounded-lg bg-[#1d4ed8] px-3 py-2.5 text-center text-sm font-semibold text-white"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}

function Hero() {
    return (
        <section className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 pt-14 pb-16 lg:grid-cols-[1fr_1.05fr] lg:pt-16 lg:pb-20">
            <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold tracking-wide text-[#1d4ed8] shadow-sm ring-1 ring-slate-200/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1d4ed8]" />
                    AI-POWERED CARE IN INDIA
                </div>
                <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                    Diabetes Care, Evolved.
                </h1>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-slate-500">
                    Precision glucose tracking and continuous AI clinical support tailored for Indian patients, local cuisines, and personalized treatment regimens.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                        href="/auth/patient/register"
                        className="rounded-lg bg-[#1d4ed8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1e40af]"
                    >
                        Join as a Patient
                    </Link>
                    <Link
                        href="/auth/provider/register"
                        className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                    >
                        I&apos;m a Doctor
                    </Link>
                </div>
                <div className="mt-8 flex items-center gap-3">
                    <div className="flex -space-x-2">
                        <Avatar initials="RS" className="bg-[#1d4ed8]" />
                        <Avatar initials="AP" className="bg-slate-400" />
                        <Avatar initials="MN" className="bg-slate-300 text-slate-700" />
                    </div>
                    <p className="text-sm leading-snug text-slate-600">
                        <span className="font-semibold text-slate-800">Built with diabetologists in Coimbatore</span>
                        <span className="block text-xs text-slate-400">Your doctor reviews your trends</span>
                    </p>
                </div>
            </div>

            <GlucoseCard />
        </section>
    );
}

function Avatar({ initials, className }: { initials: string; className: string }) {
    return (
        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-white ${className}`}>
            {initials}
        </span>
    );
}

function GlucoseCard() {
    return (
        <div className="rounded-3xl bg-white p-5 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] ring-1 ring-slate-200/70 sm:p-6">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1d4ed8] text-sm font-bold text-white">
                        RS
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-slate-900">Arjun Sharma, 52 yrs</p>
                        <p className="text-xs text-slate-400">Target Range: 70–180 mg/dL · Type 2</p>
                    </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs font-medium text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Live Sync
                </span>
            </div>

            <div className="mt-5 flex items-end justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-slate-400">REAL-TIME GLUCOSE</p>
                    <p className="mt-1 text-5xl font-semibold tracking-tight text-slate-950">
                        118 <span className="text-base font-medium text-slate-400">mg/dL</span>
                    </p>
                </div>
                <div className="mb-1 flex flex-col items-end gap-1">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 ring-1 ring-emerald-100">
                        Optimal Range
                    </span>
                    <span className="text-[11px] text-slate-400">Updated 2m ago</span>
                </div>
            </div>

            <GlucoseChart />

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#f6f8fc] px-4 py-3">
                    <p className="text-[11px] font-semibold tracking-[0.12em] text-slate-400">TIME IN RANGE</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-950">
                        86% <span className="text-xs font-semibold text-emerald-600">↑ +4% target</span>
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full w-[86%] rounded-full bg-[#1d4ed8]" />
                    </div>
                </div>
                <div className="rounded-2xl bg-[#f6f8fc] px-4 py-3">
                    <p className="text-[11px] font-semibold tracking-[0.12em] text-slate-400">ESTIMATED HBA1C</p>
                    <p className="mt-1 text-2xl font-semibold text-emerald-600">
                        6.4% <span className="text-xs font-semibold">↓ −0.3% (90d)</span>
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full w-[64%] rounded-full bg-emerald-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function GlucoseChart() {
    const line =
        "M 8 110 C 20 108, 56 105, 80 98 C 104 91, 128 67, 150 68 C 172 69, 192 95, 210 104 C 228 113, 240 134, 260 122 C 280 110, 308 41, 330 30 C 352 19, 370 33, 390 55 C 410 77, 430 153, 450 162 C 470 171, 490 119, 510 108 C 530 97, 551 101, 570 98 C 589 95, 615 93, 624 92";

    return (
        <div className="mt-4">
            <div className="flex items-start justify-between gap-2 px-1 text-[10px] leading-tight text-slate-400">
                <span>06:00 AM</span>
                <span className="hidden text-center sm:inline">Meal: Idli Sambhar (08:30)</span>
                <span className="hidden text-center md:inline">Meal: Roti Dal (13:15)</span>
                <span className="text-right">Current (16:45)</span>
            </div>
            <svg viewBox="0 0 640 188" className="mt-1 h-auto w-full" role="img" aria-label="Today's glucose trend">
                <line x1="8" y1="28" x2="632" y2="28" stroke="#e2e8f0" strokeDasharray="3 4" />
                <line x1="8" y1="132" x2="632" y2="132" stroke="#e2e8f0" strokeDasharray="3 4" />
                <text x="12" y="24" fill="#94a3b8" fontSize="10">
                    180 mg/dL (upper limit)
                </text>
                <text x="12" y="148" fill="#94a3b8" fontSize="10">
                    70 mg/dL (lower limit)
                </text>
                <path d={`${line} L624,176 L8,176 Z`} fill="url(#glucoseFill)" />
                <path d={line} fill="none" stroke="#1d4ed8" strokeWidth="2.6" strokeLinecap="round" />
                <circle cx="624" cy="92" r="6" fill="#fff" stroke="#1d4ed8" strokeWidth="2.5" />
                <circle cx="624" cy="92" r="2.4" fill="#1d4ed8" />
                <defs>
                    <linearGradient id="glucoseFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.01" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1d4ed8]" />
                    Idli Sambhar (+28 mg/dL)
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#60a5fa]" />
                    Multigrain Roti (+19 mg/dL)
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full ring-2 ring-[#1d4ed8]" />
                    CGM: Dexcom G6 Active
                </span>
            </div>
        </div>
    );
}

function ScaleSection() {
    return (
        <section className="bg-[#eef1f8] py-16">
            <div className="mx-auto max-w-[1180px] px-5">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-semibold tracking-[0.16em] text-[#1d4ed8]">NATIONAL HEALTH CONTEXT</p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            The Scale of Diabetes in India
                        </h2>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                        <BookOpen size={14} className="text-[#1d4ed8]" />
                        Source: ICMR-INDIAB study, 2023
                    </span>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                    <StatCard
                        kicker="CONFIRMED DIABETIC BURDEN"
                        value="101 Million"
                        body="People actively living with diabetes across urban metropolises and rural tier-2/3 belts across India today."
                        left="Tuned for regional Indian dishes"
                        right="11.4% National Prevalence"
                        icon={<Activity size={16} className="text-rose-500" />}
                    />
                    <StatCard
                        kicker="IMPAIRED GLUCOSE TOLERANCE"
                        value="136 Million"
                        body="People diagnosed with prediabetes—a decisive window where lifestyle changes can delay or prevent progression."
                        left="High reversal potential"
                        right="15.3% National Prevalence"
                        icon={<Triangle size={14} className="text-[#1d4ed8]" />}
                    />
                </div>

                <div className="mt-4 flex gap-4 rounded-2xl bg-white px-5 py-4 ring-1 ring-slate-200/80">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef3ff] text-[#1d4ed8]">
                        <BookOpen size={18} />
                    </span>
                    <p className="text-sm leading-relaxed text-slate-600">
                        <span className="font-semibold text-[#1d4ed8]">ICMR guidance emphasizes</span> proactive continuous glucose monitoring and targeted nutrition planning calibrated to regional Indian diets and carbohydrate profiles. India Care translates these institutional clinical mandates into everyday digital guidance.
                    </p>
                </div>
            </div>
        </section>
    );
}

function StatCard({
    kicker,
    value,
    body,
    left,
    right,
    icon,
}: {
    kicker: string;
    value: string;
    body: string;
    left: string;
    right: string;
    icon: ReactNode;
}) {
    return (
        <article className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/80">
            <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-slate-400">{kicker}</p>
                {icon}
            </div>
            <p className="mt-3 text-4xl font-bold tracking-tight text-slate-950">{value}</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">{body}</p>
            <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs">
                <span className="text-slate-400">{left}</span>
                <span className="font-semibold text-[#1d4ed8]">{right}</span>
            </div>
        </article>
    );
}

function HowItWorks() {
    const steps = [
        {
            n: "01",
            title: "Connect devices",
            body: "Sync continuous glucose monitors (CGM) or popular smartwatches for real-time biometric tracking without manual friction.",
            foot: "NFC & Bluetooth Auto-sync",
            footClass: "text-emerald-600",
            footIcon: <Wifi size={12} />,
            icon: <Activity size={16} />,
        },
        {
            n: "02",
            title: "Log meals",
            body: "AI photo analysis specifically tuned for Indian meals, recognizing regional food like roti, dosa, dal, biryani, and regional glycemic loads instantly.",
            foot: "Regional Carb Decomposition",
            footClass: "text-[#1d4ed8]",
            footIcon: <Sparkles size={12} />,
            icon: <Utensils size={16} />,
        },
        {
            n: "03",
            title: "Get insights",
            body: "Actionable clinical feedback and trend alerts continuously reviewed and aligned directly with your personal consulting doctor.",
            foot: "Doctor alerts on out-of-range trends",
            footClass: "text-[#1d4ed8]",
            footIcon: <Bell size={12} />,
            icon: <Shield size={16} />,
        },
    ];

    return (
        <section id="how-it-works" className="scroll-mt-24 bg-[#f7f8fc] py-16">
            <div className="mx-auto max-w-[1180px] px-5 text-center">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-[#1d4ed8]">SIMPLE, CONTINUOUS CARE</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">How India Care Works</h2>
                <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
                    Your readings, meals and doctor stay in sync, without manual logging fatigue.
                </p>
                <div className="mt-10 grid gap-4 text-left md:grid-cols-3">
                    {steps.map((step) => (
                        <article key={step.n} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/80">
                            <div className="flex items-start justify-between">
                                <span className="text-sm font-bold text-[#1d4ed8]">{step.n}</span>
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                    {step.icon}
                                </span>
                            </div>
                            <h3 className="mt-6 text-lg font-semibold text-slate-900">{step.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.body}</p>
                            <p className={`mt-6 inline-flex items-center gap-1.5 text-xs font-medium ${step.footClass}`}>
                                {step.footIcon}
                                {step.foot}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Capabilities() {
    const items = [
        {
            title: "AI Meal Analysis",
            body: "Image recognition calibrated for South Asian and regional Indian staples, calculating carb load and glycemic impact in seconds. Recognizes varying wheat flour, rice polished levels, and gravies.",
            foot: "Tuned for regional Indian dishes",
            icon: <Utensils size={18} />,
        },
        {
            title: "CGM & Wearable Sync",
            body: "Universal integration with Abbott FreeStyle Libre, Dexcom, and fitness trackers for round-the-clock glycemic clarity. Automatic background synchronization without requiring constant manual app scans.",
            foot: "FreeStyle Libre · Dexcom · Apple Health",
            icon: <Watch size={18} />,
        },
        {
            title: "Connected to Your Doctor",
            body: "Real-time clinic synchronization so your physician receives proactive alerts before acute glycemic swings occur. Automated weekly ambulatory glucose profile (AGP) summaries delivered directly into clinic EHRs.",
            foot: "Weekly trend reports for your doctor",
            icon: <Stethoscope size={18} />,
        },
        {
            title: "ICMR-Guided Insights",
            body: "Insights aligned with ICMR guidance on glucose monitoring and nutrition for Indian diets.",
            foot: "Aligned with ICMR guidelines",
            icon: <BookOpen size={18} />,
        },
    ];

    return (
        <section id="capabilities" className="scroll-mt-24 bg-[#f4f6fb] py-16">
            <div className="mx-auto max-w-[1180px] px-5">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-semibold tracking-[0.16em] text-[#1d4ed8]">PLATFORM CAPABILITIES</p>
                        <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            Engineered for Indian Metabolic Health
                        </h2>
                    </div>
                    <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                        Combining computer vision, hardware telemetry, and Indian endocrinology frameworks in one clinical-grade system.
                    </p>
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {items.map((item) => (
                        <article key={item.title} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/80">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef3ff] text-[#1d4ed8]">
                                {item.icon}
                            </span>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.body}</p>
                            <p className="mt-5 text-xs font-medium text-[#1d4ed8]">{item.foot}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Clinics() {
    const actions = [
        { label: "Live Patient Queue Triage", icon: <Users size={15} /> },
        { label: "Automated Hypo/Hyper Alerts", icon: <Bell size={15} /> },
        { label: "Population Glycemic Distribution", icon: <Activity size={15} /> },
        { label: "One-Click EHR & PDF Export", icon: <Download size={15} /> },
    ];

    const queue = [
        {
            initials: "KV",
            name: "Kavita Verma (44)",
            detail: "Nighttime Hypoglycemia (58 mg/dL)",
            tone: "text-rose-600",
            avatar: "bg-rose-100 text-rose-600",
        },
        {
            initials: "RS",
            name: "Ramesh Sharma (52)",
            detail: "Time in Range: 86% (Target met)",
            tone: "text-emerald-600",
            avatar: "bg-slate-100 text-slate-600",
        },
        {
            initials: "AK",
            name: "Anil Kulkarni (61)",
            detail: "Post-prandial Spike: 215 mg/dL",
            tone: "text-slate-500",
            avatar: "bg-slate-100 text-slate-600",
        },
    ];

    return (
        <section id="for-doctors" className="scroll-mt-24 bg-[#1d4ed8] py-14 text-white">
            <div className="mx-auto grid max-w-[1180px] items-center gap-8 px-5 lg:grid-cols-[1.05fr_0.95fr]">
                <div>
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-blue-100/80">CLINICAL ENTERPRISE</p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">For doctors and clinics</h2>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-blue-100">
                        Empower your practice with real-time patient population intelligence. Eliminate guesswork between consultations with continuous remote monitoring.
                    </p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {actions.map((action) => (
                            <div
                                key={action.label}
                                className="inline-flex items-center gap-2 rounded-lg bg-[#3b6ef6] px-3 py-2.5 text-sm font-medium text-white"
                            >
                                {action.icon}
                                {action.label}
                            </div>
                        ))}
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-4">
                        <Link
                            href="/auth/provider/register"
                            className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-blue-50"
                        >
                            Register your clinic
                        </Link>
                        <p className="text-xs text-blue-100">No hardware upfront cost · 14-day free trial</p>
                    </div>
                </div>

                <div className="rounded-2xl bg-[#2457e6] p-4 shadow-lg ring-1 ring-white/10">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                                <Activity size={16} />
                            </span>
                            <p className="text-sm font-semibold leading-tight">
                                Kovai Diabetes Centre – Live
                                <span className="block">Queue</span>
                            </p>
                        </div>
                        <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white">
                            Active
                            <span className="block text-center">Monitor</span>
                        </span>
                    </div>
                    <div className="mt-4 space-y-2">
                        {queue.map((row) => (
                            <div key={row.name} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-slate-900">
                                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${row.avatar}`}>
                                    {row.initials}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold">{row.name}</p>
                                    <p className={`truncate text-xs ${row.tone}`}>{row.detail}</p>
                                </div>
                                <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">Review</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 flex justify-between px-1 text-[11px] text-blue-100">
                        <span>Active Patients: 428</span>
                        <span>Avg TIR: 78.4%</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

function TrustRow() {
    const items = [
        { title: "HIPAA Secure", body: "Healthcare Grade", icon: <Shield size={16} /> },
        { title: "DPDPA Compliant", body: "Indian Privacy Act 2023", icon: <ShieldCheck size={16} /> },
        { title: "256-bit AES", body: "Encrypted In-Transit", icon: <Lock size={16} /> },
        { title: "Doctor-Reviewed", body: "Clinician oversight on alerts", icon: <Stethoscope size={16} /> },
    ];

    return (
        <section className="bg-[#f4f6fb] py-8">
            <div className="mx-auto grid max-w-[1180px] gap-3 px-5 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((item) => (
                    <div key={item.title} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4 ring-1 ring-slate-200/80">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef3ff] text-[#1d4ed8]">
                            {item.icon}
                        </span>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                            <p className="text-xs text-slate-400">{item.body}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function SiteFooter() {
    const columns = [
        {
            title: "PLATFORM",
            links: [
                { label: "How it works", href: "#how-it-works" },
                { label: "Patient Dashboard", href: "/" },
                { label: "Clinical Portal", href: "/provider/dashboard" },
                { label: "Nutrition Database", href: "#capabilities" },
            ],
        },
        {
            title: "ACCESS",
            links: [
                { label: "Sign In", href: "/auth/role" },
                { label: "Patient Register", href: "/auth/patient/register" },
                { label: "Doctor Register", href: "/auth/provider/register" },
                { label: "Clinic Onboarding", href: "/auth/provider/register" },
            ],
        },
        {
            title: "LEGAL",
            links: [
                { label: "Privacy Policy", href: "/legal/privacy" },
                { label: "Terms of Service", href: "/legal/terms" },
                { label: "DPDPA Compliance", href: "/legal/dpdpa" },
                { label: "Security Overview", href: "/legal/privacy" },
            ],
        },
    ];

    return (
        <footer className="bg-[#f4f6fb] pb-8">
            <div className="mx-auto max-w-[1180px] px-5 pt-6">
                <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
                    <div>
                        <Link href="/landing" className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1d4ed8] text-white">
                                <Plus size={18} strokeWidth={2.75} />
                            </span>
                            <span className="text-[15px] font-bold">India Care</span>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
                            AI-driven metabolic telemetry and continuous glycemic governance designed specifically for Indian lifestyle patterns and clinical requirements.
                        </p>
                    </div>
                    {columns.map((col) => (
                        <div key={col.title}>
                            <p className="text-[11px] font-semibold tracking-[0.16em] text-slate-400">{col.title}</p>
                            <ul className="mt-4 space-y-2.5">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-sm text-slate-600 hover:text-[#1d4ed8]">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <p className="mt-10 text-xs text-slate-400">© 2026 India Care. All rights reserved.</p>
            </div>
        </footer>
    );
}
