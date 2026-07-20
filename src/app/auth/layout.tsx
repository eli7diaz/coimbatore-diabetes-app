"use client";

import { Shield, Lock } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="absolute top-8 left-8 flex items-center gap-2">
                <Link href="/landing" className="flex items-center gap-2 group">
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">C</div>
                    <span className="text-lg font-bold tracking-tight text-gray-900">India Care</span>
                </Link>
            </div>

            <div className="w-full max-w-[440px]">
                <div className="premium-card p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
                    {children}
                </div>

                <div className="mt-8 flex items-center justify-center gap-6 opacity-40">
                    <div className="flex items-center gap-2 text-xs font-bold">
                        <Shield size={14} />
                        HIPAA SECURE
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold">
                        <Lock size={14} />
                        DPDPA COMPLIANT
                    </div>
                </div>
            </div>
        </div>
    );
}
