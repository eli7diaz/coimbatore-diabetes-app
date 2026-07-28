"use client";

import Link from "next/link";
import { Shield, Lock, Twitter, Github, Linkedin, Mail } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageContext";

export default function Footer() {
    const { t } = useLanguage();
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold">C</div>
                            <span className="text-xl font-bold tracking-tight text-gray-900 leading-none">India<br /><span className="text-[12px] text-primary uppercase font-black tracking-widest">Care</span></span>
                        </Link>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6">
                            {t("footer.tagline")}
                        </p>
                        <div className="flex gap-4">
                            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all"><Twitter size={18} /></a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all"><Github size={18} /></a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all"><Linkedin size={18} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">{t("footer.platform")}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/landing" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">{t("footer.howItWorks")}</Link></li>
                            <li><Link href="/" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">{t("footer.dashboard")}</Link></li>
                            <li><Link href="/provider/dashboard" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">{t("footer.clinicalPortal")}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">{t("footer.access")}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/auth/login" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">{t("footer.signIn")}</Link></li>
                            <li><Link href="/auth/patient/register" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">{t("footer.patientRegister")}</Link></li>
                            <li><Link href="/auth/provider/register" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">{t("footer.providerRegister")}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">{t("footer.legal")}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/legal/privacy" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">{t("footer.privacyPolicy")}</Link></li>
                            <li><Link href="/legal/terms" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">{t("footer.termsOfService")}</Link></li>
                            <li><Link href="/legal/dpdpa" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">{t("footer.dpdpaCompliance")}</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs font-bold text-gray-400 italic flex items-center gap-2">
                        {t("footer.copyright")}
                    </p>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-400">
                            <Shield size={14} className="text-primary" />
                            {t("footer.hipaaSecure")}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-400">
                            <Lock size={14} className="text-primary" />
                            {t("footer.dpdpaEncrypted")}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
