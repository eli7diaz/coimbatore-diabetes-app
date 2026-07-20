"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageSelector() {
    const { locale, setLocale } = useLanguage();

    const languages = [
        { code: "en", label: "English" },
        { code: "ta", label: "தமிழ்" },
        { code: "te", label: "తెలుగు" },
        { code: "es", label: "Español" },
    ];

    return (
        <div className="flex items-center gap-2">
            <Globe size={16} className="text-muted-foreground" />
            <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as any)}
                className="text-xs font-bold border-none bg-gray-100/50 hover:bg-gray-100 rounded-lg p-2 outline-none transition-colors cursor-pointer"
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
