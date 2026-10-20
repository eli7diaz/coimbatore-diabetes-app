"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import IndiaCareMark from "@/components/auth/IndiaCareMark";

export default function DoctorLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resetNotice, setResetNotice] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            localStorage.setItem("auth", "true");
            localStorage.setItem("role", "provider");
            window.dispatchEvent(new Event("auth-change"));
            router.push("/provider/dashboard");
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-[#f4f3ef] px-4 py-4 sm:px-6 sm:py-5">
            <p className="mb-3 px-1 text-xs font-medium text-slate-400">Auth / Doctor Sign In</p>

            <div className="grid min-h-[calc(100vh-4.25rem)] overflow-hidden lg:grid-cols-2">
                <aside className="relative flex min-h-[320px] flex-col justify-between overflow-hidden bg-[#163a86] px-8 py-10 text-white sm:px-12 lg:min-h-full lg:px-14 lg:py-12">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_34%),linear-gradient(165deg,#2563eb_0%,#1e3a8a_46%,#0f2744_100%)]" />

                    <div className="relative">
                        <IndiaCareMark tone="light" />
                    </div>

                    <div className="relative max-w-md">
                        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                            Empowering clinical precision through shared insights
                        </h1>
                        <p className="mt-4 text-sm leading-relaxed text-blue-100 sm:text-base">
                            Access advanced patient population management and real-time clinical alerts designed for
                            specialized diabetic care workflows.
                        </p>
                    </div>
                </aside>

                <section className="flex flex-col bg-[#f7f8fb]">
                    <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
                        <div className="w-full max-w-[440px]">
                            <div className="text-center">
                                <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-primary">
                                    DOCTOR PORTAL
                                </span>
                                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Sign In</h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    Enter your credentials to access the clinical management platform.
                                </p>
                            </div>

                            <form
                                onSubmit={handleLogin}
                                className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                            >
                                <label htmlFor="medical-email" className="text-[11px] font-semibold tracking-wide text-slate-500">
                                    Medical Email Address
                                </label>
                                <div className="relative mt-2">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        id="medical-email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="dr.venkat@hospital.in"
                                        className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div className="mt-5 flex items-center justify-between">
                                    <label htmlFor="password" className="text-[11px] font-semibold tracking-wide text-slate-500">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setResetNotice(true)}
                                        className="text-xs font-semibold text-primary hover:underline"
                                    >
                                        Forget Password?
                                    </button>
                                </div>
                                <div className="relative mt-2">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((value) => !value)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>

                                {resetNotice && (
                                    <p className="mt-3 text-xs leading-relaxed text-slate-500" role="status">
                                        Password reset is handled by your clinic administrator in this build.
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-5 flex h-12 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
                                >
                                    {loading ? (
                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    ) : (
                                        "Sign In to Doctor Portal"
                                    )}
                                </button>
                            </form>

                            <p className="mt-8 text-center text-sm text-slate-500">
                                Are you a patient?{" "}
                                <Link href="/auth/login" className="font-semibold text-primary hover:underline">
                                    Go to Patient Portal
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-8 pb-8 text-sm text-slate-500">
                        <Link href="/legal/privacy" className="hover:text-primary">
                            Privacy Policy
                        </Link>
                        <Link href="/legal/terms" className="hover:text-primary">
                            Terms of Service
                        </Link>
                        <Link href="/landing" className="hover:text-primary">
                            Help Center
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
