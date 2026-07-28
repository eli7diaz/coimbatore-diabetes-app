"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";
import { useLanguage } from "@/components/i18n/LanguageContext";
import LanguageSelector from "@/components/i18n/LanguageSelector";

export default function Header() {
    const { t } = useLanguage();
    const [auth, setAuth] = useState({ isAuth: false, role: "" });

    useEffect(() => {
        const checkAuth = () => {
            setAuth({
                isAuth: !!localStorage.getItem("auth"),
                role: localStorage.getItem("role") || "",
            });
        };

        checkAuth();
        window.addEventListener("storage", checkAuth);
        window.addEventListener("auth-change", checkAuth);

        return () => {
            window.removeEventListener("storage", checkAuth);
            window.removeEventListener("auth-change", checkAuth);
        };
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 mx-auto">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">C</div>
                    <span className="text-lg font-bold tracking-tight text-gray-900 leading-none">
                        India<br />
                        <span className="text-[10px] text-primary uppercase font-black tracking-widest">Care</span>
                    </span>
                </Link>

                <nav className="hidden md:flex gap-6 text-sm font-medium items-center">
                    {auth.isAuth ? (
                        <>
                            {auth.role === "provider" ? (
                                <Link href="/provider/dashboard" className="hover:text-primary transition-colors text-gray-600 font-bold border-b-2 border-primary">{t("common.clinicalPortal")}</Link>
                            ) : (
                                <Link href="/" className="hover:text-primary transition-colors text-gray-600 font-bold border-b-2 border-primary">{t("common.dashboard")}</Link>
                            )}
                        </>
                    ) : (
                        <>
                            <Link href="/landing" className="hover:text-primary transition-colors text-gray-600">{t("common.home")}</Link>
                            <Link href="/auth/register" className="hover:text-primary transition-colors text-gray-600">{t("common.joinNetwork")}</Link>
                        </>
                    )}
                </nav>

                <div className="flex items-center gap-4">
                    <LanguageSelector />
                    {!auth.isAuth ? (
                        <div className="flex items-center gap-4">
                            <Link href="/auth/login" className="text-xs font-bold text-gray-600 hover:text-primary transition-colors">{t("common.signIn")}</Link>
                            <Link href="/auth/register" className="text-xs font-black text-primary hover:scale-105 transition-transform bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">{t("common.getStarted")}</Link>
                        </div>
                    ) : (
                        <>
                            <LogoutButton />
                            <Link href={auth.role === "provider" ? "/provider/dashboard" : "/"}>
                                <button className="rounded-full bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors">
                                    {t("common.memberPortal")}
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
