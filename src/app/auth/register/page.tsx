"use client";

import Link from "next/link";
import { User, Stethoscope, ArrowRight, Activity, Sparkles } from "lucide-react";

export default function UnifiedRegisterPage() {
    return (
        <div>
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Join the Network</h1>
                <p className="text-muted-foreground font-medium">Select your role to begin your metabolic journey.</p>
            </div>

            <div className="grid gap-6">
                <Link
                    href="/auth/patient/register"
                    className="group relative overflow-hidden premium-card p-6 border-2 hover:border-primary/50 transition-all active:scale-[0.98]"
                >
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                            <User size={28} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">I am a Patient</h3>
                            <p className="text-sm text-muted-foreground font-medium mt-1">Track trends, log meals, and sync devices.</p>
                        </div>
                        <ArrowRight className="text-gray-300 group-hover:text-primary transition-transform group-hover:translate-x-1" size={20} />
                    </div>
                </Link>

                <Link
                    href="/auth/provider/register"
                    className="group relative overflow-hidden premium-card p-6 border-2 hover:border-primary/50 transition-all active:scale-[0.98]"
                >
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-glucose-high/10 text-glucose-high flex items-center justify-center group-hover:bg-glucose-high group-hover:text-white transition-colors">
                            <Stethoscope size={28} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-glucose-high transition-colors">I am a Provider</h3>
                            <p className="text-sm text-muted-foreground font-medium mt-1">Manage patients, review trends, and clinic tools.</p>
                        </div>
                        <ArrowRight className="text-gray-300 group-hover:text-glucose-high transition-transform group-hover:translate-x-1" size={20} />
                    </div>
                </Link>
            </div>

            <div className="mt-10 pt-8 border-t">
                <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 italic text-xs font-bold text-muted-foreground">
                    <Sparkles size={14} className="text-primary" />
                    Powered by India-GPT for precision clinical care
                </div>
                <p className="text-center text-sm font-medium text-muted-foreground mt-8">
                    Already have an account? <Link href="/auth/login" className="text-primary font-bold hover:underline transition-all">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
