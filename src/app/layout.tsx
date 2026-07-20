import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AIAssistant from "@/components/ai/AIAssistant";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { LanguageProvider } from "@/components/i18n/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "India GPT-Diabetes | Premium Care",
    description: "AI-enhanced diabetes management and clinical support",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} min-h-screen bg-background flex flex-col`}>
                <LanguageProvider>
                    <Header />
                    <main className="container mx-auto px-4 py-12 flex-1">
                        {children}
                    </main>
                    <Footer />
                    <AIAssistant />
                </LanguageProvider>
            </body>
        </html>
    );
}
