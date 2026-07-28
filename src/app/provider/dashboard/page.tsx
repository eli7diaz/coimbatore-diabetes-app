"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, Users, BarChart3, Newspaper, Bell, UserCheck, Clock, MapPin, TrendingUp } from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import AIAssistant from "@/components/ai/AIAssistant";
import { useLanguage } from "@/components/i18n/LanguageContext";
import VisitModal from "@/components/provider/VisitModal";
import StaffModal from "@/components/provider/StaffModal";
import AnalyticsModal from "@/components/provider/AnalyticsModal";
import CalendarModal from "@/components/provider/CalendarModal";
import ArticleModal from "@/components/provider/ArticleModal";

export default function ProviderDashboard() {
    const router = useRouter();
    const { t } = useLanguage();

    const [selectedVisit, setSelectedVisit] = useState<any>(null);
    const [showStaff, setShowStaff] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<{ title: string; date: string; category: string } | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Simulated simple auth check
        const isAuth = localStorage.getItem("auth");
        if (!isAuth) {
            router.push("/landing");
        }
    }, [router]);

    const todayVisits = [
        { name: "Arjun Sharma", time: "10:30 AM", type: "Regular Checkup", status: "Waiting", glucose: "142 mg/dL" },
        { name: "Meera Iyer", time: "11:15 AM", type: "CGM Review", status: "In Progress", glucose: "98 mg/dL" },
        { name: "Vijay Natarajan", time: "12:00 PM", type: "Insulin Adjustment", status: "Upcoming", glucose: "185 mg/dL" },
    ];

    const articles = [
        { title: "Managing Type 2 in Urban India", date: "Feb 14", category: "Local Insight" },
        { title: "New CGM Guidelines by ICMR 2026", date: "Feb 12", category: "Clinical" },
        { title: "Fiber-rich Diet for South Indian Meals", date: "Feb 10", category: "Nutrition" },
    ];

    const query = searchQuery.trim().toLowerCase();
    const filteredVisits = query
        ? todayVisits.filter(v => v.name.toLowerCase().includes(query) || v.type.toLowerCase().includes(query))
        : todayVisits;
    const filteredArticles = query
        ? articles.filter(a => a.title.toLowerCase().includes(query) || a.category.toLowerCase().includes(query))
        : articles;

    return (
        <div className="flex flex-col gap-8 pb-20">
            {/* Modals */}
            {selectedVisit && (
                <VisitModal visit={selectedVisit} onClose={() => setSelectedVisit(null)} />
            )}
            {showStaff && (
                <StaffModal onClose={() => setShowStaff(false)} />
            )}
            {showAnalytics && (
                <AnalyticsModal onClose={() => setShowAnalytics(false)} />
            )}
            {showCalendar && (
                <CalendarModal onClose={() => setShowCalendar(false)} />
            )}
            {selectedArticle && (
                <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{t("provider.portalTitle")}</h1>
                    <p className="text-lg text-muted-foreground font-medium">Dr. Rajesh Kumar | Apollo Hospitals India</p>
                </div>
                <div className="relative w-full md:w-[400px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`${t("common.search")} patients, visit types, articles...`}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-sm"
                    />
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title={t("provider.metricVisits")} value="12" unit={t("common.patients")} icon={Calendar} status="normal" />
                <MetricCard title={t("provider.metricAlerts")} value="03" unit={t("common.active")} icon={Bell} status="danger" />
                <MetricCard title={t("provider.metricSyncs")} value="142" unit="users" icon={UserCheck} status="normal" />
                <MetricCard title={t("provider.metricHba1c")} value="7.2" unit="%" icon={BarChart3} status="warning" />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Today's Schedule */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="premium-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-left">
                                <Clock className="text-primary" size={20} />
                                {t("provider.queueTitle")}
                            </h2>
                            <button
                                onClick={() => setShowCalendar(true)}
                                className="text-sm font-bold text-primary hover:underline"
                            >
                                View Calendar
                            </button>
                        </div>
                        <div className="space-y-4">
                            {filteredVisits.length === 0 && (
                                <p className="text-sm text-center text-muted-foreground font-medium py-6">No visits match "{searchQuery}".</p>
                            )}
                            {filteredVisits.map((visit, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedVisit(visit)}
                                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                            {visit.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold group-hover:text-primary transition-colors text-left">{visit.name}</h4>
                                            <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1"><Clock size={12} /> {visit.time}</span>
                                                <span className="flex items-center gap-1"><MapPin size={12} /> {visit.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-[10px] font-extrabold px-3 py-1 rounded-full mb-1 inline-block ${visit.status === "Waiting" ? "bg-yellow-100 text-yellow-700" :
                                            visit.status === "In Progress" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                            }`}>
                                            {visit.status.toUpperCase()}
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 block">{visit.glucose}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Analytics Preview */}
                    <div className="premium-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <TrendingUp className="text-primary" size={20} />
                                {t("provider.statsTitle")}
                            </h2>
                            <button
                                onClick={() => setShowAnalytics(true)}
                                className="text-xs font-bold text-primary hover:underline"
                            >
                                Full Analysis
                            </button>
                        </div>
                        <div className="h-[200px] w-full bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
                            <div className="text-center">
                                <BarChart3 className="text-primary/20 mx-auto mb-2" size={48} />
                                <span className="text-muted-foreground font-bold text-sm block">Aggregated Population Trends Visualization</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="premium-card p-6 bg-primary text-white border-none shadow-xl shadow-primary/30">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Newspaper size={20} className="text-white/80" />
                            {t("provider.knowledgeTitle")}
                        </h3>
                        <div className="space-y-4 text-left">
                            {filteredArticles.length === 0 && (
                                <p className="text-xs text-white/60 font-medium">No articles match "{searchQuery}".</p>
                            )}
                            {filteredArticles.map((article, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedArticle(article)}
                                    className="w-full text-left pb-4 border-b border-white/10 last:border-none last:pb-0 hover:translate-x-1 transition-transform cursor-pointer"
                                >
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/60 mb-1 block">{article.category}</span>
                                    <h4 className="text-sm font-bold leading-tight">{article.title}</h4>
                                    <span className="text-[10px] text-white/50 mt-2 block">{article.date}</span>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setSelectedArticle(articles[0])}
                            className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors"
                        >
                            Explore Academy
                        </button>
                    </div>

                    <div className="premium-card p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-left">
                            <Users className="text-primary" size={18} />
                            Assigned Team
                        </h3>
                        <div className="flex -space-x-3 overflow-hidden mb-4">
                            {["AI", "SM", "PD", "RN"].map((initials, i) => (
                                <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-500">
                                    {initials}
                                </div>
                            ))}
                            <div className="h-10 w-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-white text-[10px] font-bold">
                                +5
                            </div>
                        </div>
                        <p className="text-xs font-medium text-muted-foreground mb-4 text-left">You have 9 nurses and assistants synchronized across shifts.</p>
                        <button
                            onClick={() => setShowStaff(true)}
                            className="w-full py-2 text-sm font-bold border rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Manage Staff
                        </button>
                    </div>
                </div>
            </div>
            <AIAssistant />
        </div>
    );
}

