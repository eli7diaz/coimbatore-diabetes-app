import { LucideIcon } from "lucide-react";

interface MetricCardProps {
    title: string;
    value: string;
    unit: string;
    icon: LucideIcon;
    trend?: {
        value: string;
        isUp: boolean;
    };
    status?: "normal" | "warning" | "danger";
}

export default function MetricCard({
    title,
    value,
    unit,
    icon: Icon,
    trend,
    status = "normal",
}: MetricCardProps) {
    const statusColors = {
        normal: "text-glucose-normal bg-glucose-normal/10",
        warning: "text-glucose-high bg-glucose-high/10",
        danger: "text-glucose-low bg-glucose-low/10",
    };

    return (
        <div className="premium-card p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
                <div className={`p-2 rounded-lg ${statusColors[status]}`}>
                    <Icon size={18} />
                </div>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{value}</span>
                <span className="text-sm text-muted-foreground">{unit}</span>
            </div>
            {trend && (
                <div className="flex items-center gap-1">
                    <span className={`text-xs font-medium ${trend.isUp ? "text-glucose-low" : "text-glucose-normal"}`}>
                        {trend.isUp ? "↑" : "↓"} {trend.value}
                    </span>
                    <span className="text-xs text-muted-foreground">vs last hour</span>
                </div>
            )}
        </div>
    );
}
