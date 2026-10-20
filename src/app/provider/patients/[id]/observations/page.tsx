import ObservationEntry from "@/components/provider/portal/ObservationEntry";
import { portalPatients } from "@/lib/clinicalPortal";

export function generateStaticParams() {
    return portalPatients.map((patient) => ({ id: patient.id }));
}

export default function ObservationPage() {
    return <ObservationEntry />;
}
