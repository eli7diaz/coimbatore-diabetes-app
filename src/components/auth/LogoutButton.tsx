"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

export default function LogoutButton() {
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        // Check auth status on mount and when storage changes
        const checkAuth = () => {
            setIsAuth(!!localStorage.getItem("auth"));
        };

        checkAuth();
        window.addEventListener("storage", checkAuth);
        // Custom event for same-window updates
        window.addEventListener("auth-change", checkAuth);

        return () => {
            window.removeEventListener("storage", checkAuth);
            window.removeEventListener("auth-change", checkAuth);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("auth");
        localStorage.removeItem("role");
        // Dispatch event for local listener
        window.dispatchEvent(new Event("auth-change"));
        router.push("/landing");
    };

    if (!isAuth) return null;

    return (
        <div className="flex items-center gap-3 pl-4 border-l border-gray-100 ml-4 group">
            <div className="flex flex-col items-end hidden lg:flex">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary leading-none">Session</span>
                <span className="text-xs font-bold text-gray-500">Active</span>
            </div>
            <button
                onClick={handleLogout}
                className="h-10 w-10 rounded-xl bg-gray-50 text-gray-400 hover:text-glucose-low hover:bg-glucose-low/10 transition-all flex items-center justify-center group-hover:scale-105 active:scale-95"
                title="Logout"
            >
                <LogOut size={18} />
            </button>
        </div>
    );
}
