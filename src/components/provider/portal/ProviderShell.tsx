"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Bell,
    Bot,
    HelpCircle,
    LayoutDashboard,
    Menu,
    Plus,
    Search,
    Settings,
    UserRound,
    Users,
    X,
} from "lucide-react";
import IndiaCareMark from "@/components/auth/IndiaCareMark";
import { useLanguage } from "@/components/i18n/LanguageContext";

const PortalSearchContext = createContext({ query: "", setQuery: (_value: string) => {} });

export function usePortalSearch() {
    return useContext(PortalSearchContext);
}

const nav = [
    { href: "/provider/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/provider/patients", label: "Patient Population", icon: Users },
    { href: "/provider/dashboard", label: "AI Assistant", icon: Bot },
];

export default function ProviderShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { locale, setLocale } = useLanguage();
    const [ready, setReady] = useState(false);
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [emergency, setEmergency] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem("auth")) {
            router.replace("/auth/provider/login");
            return;
        }
        setReady(true);
    }, [router]);

    const patientMatch = pathname.match(/^\/provider\/patients\/([^/]+)/);
    const patientId = patientMatch?.[1];
    const carePlansHref = patientId
        ? `/provider/patients/${patientId}/history`
        : "/provider/patients/meera-iyer/history";

    const itemActive = (href: string, label: string) => {
        if (label === "Dashboard") return pathname === "/provider/dashboard";
        if (label === "Patient Population") return pathname.startsWith("/provider/patients");
        return false;
    };

    if (!ready) {
        return <div className="min-h-screen bg-[#f4f6fb]" />;
    }

    return (
        <PortalSearchContext.Provider value={{ query, setQuery }}>
            <div className="flex h-screen overflow-hidden bg-[#f5f7fb] text-slate-900">
                {open && <button className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu" />}
                <aside className={`fixed inset-y-0 left-0 z-40 flex w-[240px] flex-col border-r border-slate-200 bg-[#f8f9fc] px-4 py-5 transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
                    <div className="flex items-start justify-between">
                        <Link href="/provider/dashboard" onClick={() => setOpen(false)}>
                            <IndiaCareMark />
                            <p className="mt-1 pl-14 text-xs text-slate-400">Clinical Portal</p>
                        </Link>
                        <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close sidebar"><X size={18} /></button>
                    </div>
                    <nav className="mt-8 space-y-1">
                        {nav.map((item) => {
                            const Icon = item.icon;
                            const active = itemActive(item.href, item.label);
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${active ? "bg-blue-50 text-primary" : "text-slate-600 hover:bg-white"}`}
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="mt-auto space-y-3">
                        <div className="flex items-center gap-2 px-3 text-sm text-slate-500">
                            <Settings size={16} /> Settings
                        </div>
                        <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                            <span className="text-slate-500">Language</span>
                            <select
                                value={locale}
                                onChange={(event) => setLocale(event.target.value as "en" | "ta" | "te" | "es")}
                                className="bg-transparent text-sm font-medium outline-none"
                            >
                                <option value="en">English</option>
                                <option value="ta">தமிழ்</option>
                                <option value="te">తెలుగు</option>
                                <option value="es">Español</option>
                            </select>
                        </label>
                        <Link
                            href="/provider/patients/lakshmi-raman/observations"
                            onClick={() => setOpen(false)}
                            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-white"
                        >
                            <Plus size={16} /> New Patient Intake
                        </Link>
                    </div>
                </aside>

                <div className="flex min-w-0 flex-1 flex-col">
                    <header className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:px-6">
                        <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
                        <div className="relative min-w-[180px] flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search patients, conditions, or files..."
                                className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-primary"
                            />
                        </div>
                        <nav className="hidden items-center gap-5 text-sm text-slate-600 md:flex">
                            <Link href="/provider/patients" className={pathname.startsWith("/provider/patients") && !pathname.endsWith("/history") ? "font-semibold text-primary underline decoration-2 underline-offset-8" : ""}>Recent Patients</Link>
                            <Link href={carePlansHref} className={pathname.endsWith("/history") ? "font-semibold text-primary underline decoration-2 underline-offset-8" : ""}>Care Plans</Link>
                            <Link href="/provider/patients">Resources</Link>
                        </nav>
                        <button
                            onClick={() => setEmergency((value) => !value)}
                            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white"
                        >
                            Emergency Alert
                        </button>
                        <button className="hidden text-slate-500 sm:block" aria-label="Messages"><Bell size={18} /></button>
                        <Link href="/provider/dashboard" className="hidden text-slate-500 sm:block" aria-label="Help"><HelpCircle size={18} /></Link>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-600"><UserRound size={18} /></span>
                    </header>
                    {emergency && (
                        <p className="bg-red-50 px-6 py-2 text-sm font-medium text-red-700">
                            Emergency alert is active for the on-call clinical team. Select the button again to clear it.
                        </p>
                    )}
                    <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-6">{children}</main>
                </div>
            </div>
        </PortalSearchContext.Provider>
    );
}
