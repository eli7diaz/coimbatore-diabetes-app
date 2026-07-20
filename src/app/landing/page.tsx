"use client";

import Link from "next/link";
import { ArrowRight, Shield, Activity, Sparkles, Brain, Lock, BookOpen, PlayCircle, BarChart2 } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageContext";

export default function LandingPage() {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 overflow-hidden">
                <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-10 blur-3xl bg-primary/30 rounded-full" />
                <div className="container px-4 mx-auto text-center lg:text-left lg:flex lg:items-center lg:gap-12">
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/20">
                            <Sparkles size={14} />
                            {t("landing.heroTag")}
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
                            {t("landing.heroTitle")}
                        </h1>
                        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                            {t("landing.heroSubtitle")}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                href="/auth/register"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.05] transition-transform"
                            >
                                {t("common.joinNetwork")}
                                <ArrowRight size={18} />
                            </Link>
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white border border-gray-200 text-gray-900 font-bold rounded-2xl hover:bg-gray-50 transition-colors"
                            >
                                {t("common.signIn")}
                            </Link>
                        </div>
                    </div>

                    <div className="hidden lg:block lg:w-1/2 relative">
                        <div className="premium-card bg-black/5 border-none scale-100 relative overflow-hidden rounded-3xl shadow-2xl">
                            <div className="absolute top-0 w-full p-4 bg-gray-900/5 backdrop-blur-sm z-10 flex gap-2">
                                <div className="h-3 w-3 rounded-full bg-red-400" />
                                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                                <div className="h-3 w-3 rounded-full bg-green-400" />
                            </div>
                            <img 
                                src="/homepage_demo.webp" 
                                alt="Platform Demo" 
                                className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Education Section: Diabetes in India */}
            <section className="py-24 bg-white">
                <div className="container px-4 mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100">
                                <BookOpen size={14} />
                                {t("education.subtitle")}
                            </div>
                            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">{t("education.title")}</h2>
                            <p className="text-lg text-muted-foreground mb-8 font-medium leading-relaxed">
                                {t("education.guidelinesDesc")}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                                    <h4 className="text-2xl font-black text-primary mb-2">{t("education.stat1Title")}</h4>
                                    <p className="text-sm text-muted-foreground font-bold">{t("education.stat1Desc")}</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                                    <h4 className="text-2xl font-black text-primary mb-2">{t("education.stat2Title")}</h4>
                                    <p className="text-sm text-muted-foreground font-bold">{t("education.stat2Desc")}</p>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                            <div className="space-y-4 pt-12">
                                <div className="h-48 rounded-3xl bg-primary/10 flex flex-col justify-end p-6 overflow-hidden relative">
                                    <div className="absolute top-4 left-4 h-12 w-12 rounded-full bg-white/50 backdrop-blur flex items-center justify-center">
                                        <Shield className="text-primary" size={24} />
                                    </div>
                                    <p className="text-sm font-bold text-primary relative z-10 mb-2">{t("education.guidelinesTitle")}</p>
                                    <p className="text-[10px] text-primary/70 leading-tight relative z-10">{t("education.guidelinesDesc")}</p>
                                </div>
                                <div className="h-64 rounded-3xl bg-gray-900 flex flex-col justify-end p-6">
                                    <div className="h-1 w-12 bg-primary rounded-full mb-4" />
                                    <p className="text-sm font-bold text-white mb-2">{t("education.stat3Title")}</p>
                                    <p className="text-[10px] text-white/60">{t("education.stat3Desc")}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-64 rounded-3xl bg-secondary flex flex-col justify-end p-6">
                                    <Sparkles className="text-primary mb-4" size={24} />
                                    <p className="text-sm font-bold text-gray-900 mb-2">{t("education.personalizedTitle")}</p>
                                    <p className="text-[10px] text-gray-500 leading-tight">{t("education.personalizedDesc")}</p>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <BarChart2 className="text-primary mb-2" size={32} />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-1">{t("education.analyticsTitle")}</p>
                                    <p className="text-[9px] text-gray-500 leading-tight px-4">{t("education.analyticsDesc")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tutorial Section */}
            <section className="py-24 bg-gray-50/50">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                            <PlayCircle size={14} />
                            Tutorial
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{t("tutorial.title")}</h2>
                        <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">{t("tutorial.subtitle")}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="premium-card p-10 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                                <div className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center text-xl font-black mb-8 relative z-10 shadow-lg shadow-primary/20">
                                    {step}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 relative z-10">{t(`tutorial.step${step}Title`)}</h3>
                                <p className="text-muted-foreground font-medium leading-relaxed relative z-10">
                                    {t(`tutorial.step${step}Desc`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-primary mb-4">{t("landing.featuresSubtitle")}</h2>
                        <p className="text-3xl font-extrabold text-gray-900">{t("landing.featuresTitle")}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="premium-card p-8">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                                <Brain size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{t("features.gptTitle")}</h3>
                            <p className="text-muted-foreground leading-relaxed font-medium">{t("features.gptDesc")}</p>
                        </div>
                        <div className="premium-card p-8">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                                <Activity size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{t("features.cgmTitle")}</h3>
                            <p className="text-muted-foreground leading-relaxed font-medium">{t("features.cgmDesc")}</p>
                        </div>
                        <div className="premium-card p-8">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                                <Lock size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{t("features.lockTitle")}</h3>
                            <p className="text-muted-foreground leading-relaxed font-medium">{t("features.lockDesc")}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
