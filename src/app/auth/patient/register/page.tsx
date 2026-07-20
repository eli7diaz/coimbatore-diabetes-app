"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Activity, ShieldPlus, ArrowRight, ArrowLeft, Info } from "lucide-react";
import DiabetesAssessment from "@/components/auth/DiabetesAssessment";

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [diabetesType, setDiabetesType] = useState("Type 2 Diabetes");
    const [showAssessment, setShowAssessment] = useState(false);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 2) {
            setStep(step + 1);
            return;
        }
        setLoading(true);
        localStorage.setItem("auth", "true");
        window.dispatchEvent(new Event("auth-change"));
        setTimeout(() => router.push("/"), 2000);
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "I don't know") {
            setShowAssessment(true);
        } else {
            setDiabetesType(value);
        }
    };

    const handleAssessmentComplete = (result: string) => {
        setDiabetesType(result);
        setShowAssessment(false);
    };

    if (showAssessment) {
        return (
            <div className="max-w-md mx-auto">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-black text-gray-900">Health Assessment</h1>
                    <p className="text-muted-foreground font-medium text-sm">Let's find out your metabolic profile</p>
                </div>
                <DiabetesAssessment
                    onComplete={handleAssessmentComplete}
                    onCancel={() => setShowAssessment(false)}
                />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Register</h1>
                    <span className="text-xs font-bold text-primary px-2 py-1 rounded-md bg-primary/10">STEP {step} OF 2</span>
                </div>
                <p className="text-muted-foreground font-medium">Join 50k+ patients in India</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
                {step === 1 ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Full Legal Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    placeholder="Arjun Sharma"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Email Address</label>
                            <input
                                type="email"
                                required
                                placeholder="name@example.com"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center justify-between">
                                Diabetes Type
                                <button
                                    type="button"
                                    onClick={() => setShowAssessment(true)}
                                    className="text-[10px] text-primary hover:underline flex items-center gap-1"
                                >
                                    <Info size={10} />
                                    Not sure? Assessment
                                </button>
                            </label>
                            <select
                                value={diabetesType}
                                onChange={handleTypeChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium decoration-none"
                            >
                                <option>Type 1 Diabetes</option>
                                <option>Type 2 Diabetes</option>
                                <option>Gestational</option>
                                <option>Prediabetic</option>
                                <option>I don't know</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Primary Healthcare Facility</label>
                            <div className="relative">
                                <ShieldPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    placeholder="India Medical Center"
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
                                {step === 1 ? "Next Step" : "Complete Registration"}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </div>
            </form>

            <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
                Already have an account? <Link href="/auth/login" className="text-primary font-bold hover:underline">Sign In</Link>
            </p>
        </div>
    );
}

