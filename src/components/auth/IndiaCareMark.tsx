import { BriefcaseMedical } from "lucide-react";

export default function IndiaCareMark({ tone = "brand" }: { tone?: "brand" | "light" }) {
    const onPhoto = tone === "light";

    return (
        <div className={`flex items-center gap-3 ${onPhoto ? "text-white" : "text-primary"}`}>
            <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    onPhoto ? "bg-white/15 ring-1 ring-white/40" : "bg-primary text-white shadow-sm"
                }`}
            >
                <BriefcaseMedical size={22} strokeWidth={2.25} />
            </div>
            <span className="text-xl font-bold tracking-tight">India Care</span>
        </div>
    );
}
