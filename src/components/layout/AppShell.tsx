"use client";

import { usePathname } from "next/navigation";
import AIAssistant from "@/components/ai/AIAssistant";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { isFullBleedAuthRoute } from "@/lib/authRoutes";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (isFullBleedAuthRoute(pathname) || pathname === "/landing") {
        return <div className="flex-1">{children}</div>;
    }

    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-12 flex-1">{children}</main>
            <Footer />
            <AIAssistant />
        </>
    );
}
