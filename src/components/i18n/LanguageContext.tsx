"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { dictionaries, Locale, Dictionary } from "@/lib/i18n/dictionaries";

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState<Locale>("en");

    useEffect(() => {
        const savedLocale = localStorage.getItem("locale") as Locale;
        if (savedLocale && (savedLocale === "en" || savedLocale === "ta" || savedLocale === "te" || savedLocale === "es")) {
            setLocale(savedLocale);
        }
    }, []);

    const handleSetLocale = (newLocale: Locale) => {
        setLocale(newLocale);
        localStorage.setItem("locale", newLocale);
    };

    const t = (path: string): string => {
        const keys = path.split(".");
        let current: any = dictionaries[locale];

        for (const key of keys) {
            if (current[key] === undefined) {
                console.warn(`Translation path not found: ${path} for locale: ${locale}`);
                // Fallback to English
                let fallback: any = dictionaries["en"];
                for (const fKey of keys) {
                    if (fallback[fKey] === undefined) return path;
                    fallback = fallback[fKey];
                }
                return fallback;
            }
            current = current[key];
        }

        return current;
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
