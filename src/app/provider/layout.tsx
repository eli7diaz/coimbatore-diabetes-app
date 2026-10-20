"use client";

import ProviderShell from "@/components/provider/portal/ProviderShell";

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
    return <ProviderShell>{children}</ProviderShell>;
}
