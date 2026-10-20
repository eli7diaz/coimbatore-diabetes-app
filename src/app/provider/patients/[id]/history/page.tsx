import ClinicalHistory from "@/components/provider/portal/ClinicalHistory";
import { portalPatients } from "@/lib/clinicalPortal";

export function generateStaticParams() {
    return portalPatients.map((patient) => ({ id: patient.id }));
}

export default function ClinicalHistoryPage() {
    return <ClinicalHistory />;
}
