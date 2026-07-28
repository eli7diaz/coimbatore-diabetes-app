"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Fingerprint, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isBiometricLoading, setIsBiometricLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate auth verification, then grant access only once it "completes"
        setTimeout(() => {
            localStorage.setItem("auth", "true");
            window.dispatchEvent(new Event("auth-change"));
            router.push("/");
        }, 1500);
    };

    const handleBiometricLogin = () => {
        setIsBiometricLoading(true);
        // Simulate biometric scan delay
        setTimeout(() => {
            localStorage.setItem("auth", "true");
            window.dispatchEvent(new Event("auth-change"));
            router.push("/");
        }, 2000);
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sign In</h1>
                <p className="text-muted-foreground font-medium mt-1">Access your metabolic trends</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <label className="text-sm font-bold text-gray-700">Password</label>
                        <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || isBiometricLoading}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white font-extrabold py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                >
                    {loading ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-3 border-white border-t-transparent" />
                    ) : (
                        <>
                            Sign In
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-8 border-t">
                <div className="flex flex-col gap-4">
                    <button
                        onClick={handleBiometricLogin}
                        disabled={loading || isBiometricLoading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {isBiometricLoading ? (
                            <div className="flex items-center gap-2 text-primary animate-pulse">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                <span>Scanning...</span>
                            </div>
                        ) : (
                            <>
                                <Fingerprint className="text-primary" size={20} />
                                Biometric Sign In
                            </>
                        )}
                    </button>

                    <p className="text-center text-sm font-medium text-muted-foreground">
                        New to the network? <Link href="/auth/register" className="text-primary font-bold hover:underline">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

