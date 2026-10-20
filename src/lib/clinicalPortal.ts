export type PatientStatus = "Active" | "In Range" | "At Risk" | "Critical";

export type PortalPatient = {
    id: string;
    name: string;
    mrn: string;
    dob: string;
    age: string;
    phone: string;
    email: string;
    status: PatientStatus;
    lastGlucose: string;
    conditions: { name: string; detail: string; tone: "rose" | "slate" }[];
    medications: { name: string; dose: string }[];
};

export const portalPatients: PortalPatient[] = [
    {
        id: "meera-iyer",
        name: "Meera Iyer",
        mrn: "DC-884920",
        dob: "05/14/1972",
        age: "51 yrs",
        phone: "+91 98430 12284",
        email: "meera.iyer@example.com",
        status: "Active",
        lastGlucose: "98 mg/dL",
        conditions: [
            { name: "Type 2 Diabetes", detail: "Dx: Oct 2021 · Primary Care", tone: "rose" },
            { name: "Hypertension", detail: "Dx: Jan 2023 · Managed", tone: "slate" },
        ],
        medications: [
            { name: "Metformin", dose: "500mg · Twice daily" },
            { name: "Lisinopril", dose: "10mg · Once daily" },
            { name: "Atorvastatin", dose: "20mg · At bedtime" },
        ],
    },
    {
        id: "lakshmi-raman",
        name: "Lakshmi Raman",
        mrn: "99283",
        dob: "03/02/1968",
        age: "58 yrs",
        phone: "+91 98410 22910",
        email: "lakshmi.raman@example.com",
        status: "In Range",
        lastGlucose: "104 mg/dL",
        conditions: [
            { name: "Type 2 Diabetes", detail: "Dx: Aug 2019 · Primary Care", tone: "rose" },
            { name: "Dyslipidemia", detail: "Dx: Feb 2021 · Managed", tone: "slate" },
        ],
        medications: [
            { name: "Metformin", dose: "1000mg · Twice daily" },
            { name: "Glimepiride", dose: "1mg · Once daily" },
        ],
    },
    {
        id: "arjun-sharma",
        name: "Arjun Sharma",
        mrn: "DC-441208",
        dob: "11/09/1984",
        age: "41 yrs",
        phone: "+91 98220 11843",
        email: "arjun.sharma@example.com",
        status: "In Range",
        lastGlucose: "142 mg/dL",
        conditions: [{ name: "Type 2 Diabetes", detail: "Dx: Mar 2022 · Primary Care", tone: "rose" }],
        medications: [{ name: "Metformin", dose: "500mg · Twice daily" }],
    },
    {
        id: "vijay-natarajan",
        name: "Vijay Natarajan",
        mrn: "DC-773015",
        dob: "07/21/1970",
        age: "56 yrs",
        phone: "+91 98400 55219",
        email: "vijay.natarajan@example.com",
        status: "At Risk",
        lastGlucose: "185 mg/dL",
        conditions: [
            { name: "Type 2 Diabetes", detail: "Dx: Jan 2018 · Insulin", tone: "rose" },
            { name: "Hypertension", detail: "Dx: May 2020 · Managed", tone: "slate" },
        ],
        medications: [{ name: "Insulin glargine", dose: "18 units · At bedtime" }],
    },
    {
        id: "divya-prakash",
        name: "Divya Prakash",
        mrn: "DC-220184",
        dob: "01/30/1991",
        age: "35 yrs",
        phone: "+91 97900 44128",
        email: "divya.prakash@example.com",
        status: "In Range",
        lastGlucose: "121 mg/dL",
        conditions: [{ name: "Type 2 Diabetes", detail: "Dx: Sep 2024 · Primary Care", tone: "rose" }],
        medications: [{ name: "Metformin", dose: "500mg · Once daily" }],
    },
    {
        id: "robert-johnson",
        name: "Robert Johnson",
        mrn: "A-88219",
        dob: "04/18/1965",
        age: "61 yrs",
        phone: "+91 98411 00921",
        email: "robert.johnson@example.com",
        status: "Critical",
        lastGlucose: "242 mg/dL",
        conditions: [{ name: "Type 2 Diabetes", detail: "Fasting glucose critically high", tone: "rose" }],
        medications: [{ name: "Metformin", dose: "1000mg · Twice daily" }],
    },
    {
        id: "elena-martinez",
        name: "Elena Martinez",
        mrn: "51042",
        dob: "09/12/1976",
        age: "50 yrs",
        phone: "+91 98840 22109",
        email: "elena.martinez@example.com",
        status: "At Risk",
        lastGlucose: "165/102 mmHg",
        conditions: [{ name: "Hypertension", detail: "Dx: Jun 2021 · Uncontrolled", tone: "rose" }],
        medications: [{ name: "Amlodipine", dose: "5mg · Once daily" }],
    },
    {
        id: "kevin-chen",
        name: "Kevin Chen",
        mrn: "77321",
        dob: "02/08/1995",
        age: "31 yrs",
        phone: "+91 99000 11876",
        email: "kevin.chen@example.com",
        status: "Critical",
        lastGlucose: "62 mg/dL",
        conditions: [{ name: "Type 1 Diabetes", detail: "Random glucose below threshold", tone: "rose" }],
        medications: [{ name: "Insulin aspart", dose: "Mealtime · As directed" }],
    },
];

export function getPortalPatient(id: string) {
    return portalPatients.find((patient) => patient.id === id);
}
