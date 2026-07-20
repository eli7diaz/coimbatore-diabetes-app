"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Stethoscope, Building2, BadgeCheck, ArrowRight, ArrowLeft } from "lucide-react";

export default function ProviderRegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 2) {
            setStep(step + 1);
            return;
        }
        setLoading(true);
        localStorage.setItem("auth", "true");
        localStorage.setItem("role", "provider");
        window.dispatchEvent(new Event("auth-change"));
        setTimeout(() => router.push("/provider/dashboard"), 2000);
    };

    return (
        <div>
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Provider Portal</h1>
                    <span className="text-xs font-bold text-primary px-2 py-1 rounded-md bg-primary/10">CLINICAL STEP {step} OF 2</span>
                </div>
                <p className="text-muted-foreground font-medium">Register as a Healthcare Professional</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
                {step === 1 ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Medical Registration Number (MCI/NMC)</label>
                            <div className="relative">
                                <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    placeholder="MCI-123456"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Primary Specialization</label>
                            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium decoration-none">
                                <option>Endocrinology</option>
                                <option>Diabetology</option>
                                <option>Internal Medicine</option>
                                <option>Primary Care Physician</option>
                                <option>Nutrient Specialist</option>
                            </select>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Full Clinical Name</label>
                            <div className="relative">
                                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    placeholder="Dr. Rajesh Kumar"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Hospital/Clinic Affiliation</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    placeholder="Apollo Hospitals, India"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex gap-4">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-4 border rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-extrabold py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-3 border-white border-t-transparent" />
                        ) : (
                            <>
                                {step === 1 ? "Verify Credentials" : "Initialize Provider Portal"}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </div>
            </form>

            <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
                Returning doctor? <Link href="/auth/login" className="text-primary font-bold hover:underline">Sign In</Link>
            </p>
        </div>
    );
}
