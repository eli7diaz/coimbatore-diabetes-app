import PatientProfile from "@/components/provider/portal/PatientProfile";
import { portalPatients } from "@/lib/clinicalPortal";

export function generateStaticParams() {
    return portalPatients.map((patient) => ({ id: patient.id }));
}

export default function PatientProfilePage() {
    return <PatientProfile />;
}
