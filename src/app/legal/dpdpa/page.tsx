"use client";

import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageContext";

export default function DpdpaCompliancePage() {
    const { locale } = useLanguage();

    const content = {
        es: {
            title: "Cumplimiento DPDPA",
            lastUpdated: "Última actualización: Julio 2026",
            intro: "India Care cumple plenamente con la Ley de Protección de Datos Personales Digitales de la India (DPDPA 2023).",
            sec1Title: "1. Consentimiento Explícito",
            sec1Text: "Solo procesamos sus datos de salud con su consentimiento claro, afirmativo y explícito, el cual puede retirar en cualquier momento desde su perfil.",
            sec2Title: "2. Derechos del Fideicomisario de Datos",
            sec2Text: "Usted tiene derecho a acceder, rectificar, completar o solicitar la eliminación total de sus datos personales y registros metabólicos almacenados en nuestra red.",
            sec3Title: "3. Oficial de Protección de Datos (DPO)",
            sec3Text: "Hemos designado un Oficial de Protección de Datos dedicado para supervisar el procesamiento seguro de sus datos y responder a cualquier consulta sobre sus derechos de protección.",
            back: "Volver al Inicio"
        },
        en: {
            title: "DPDPA Compliance",
            lastUpdated: "Last updated: July 2026",
            intro: "India Care is fully committed to compliance with the Digital Personal Data Protection Act of India (DPDPA 2023).",
            sec1Title: "1. Explicit Consent",
            sec1Text: "We only process your medical and wearable sync data with your clear, affirmative, and explicit consent, which you can withdraw at any time in your profile settings.",
            sec2Title: "2. Rights of the Data Principal",
            sec2Text: "Under the DPDPA, you have the right to access, rectify, complete, or request erasure of your personal metabolic records and health details stored in our network.",
            sec3Title: "3. Data Protection Officer (DPO)",
            sec3Text: "We have appointed a dedicated Data Protection Officer to supervise secure processing and address any inquiries regarding your digital privacy rights.",
            back: "Back to Home"
        },
        ta: {
            title: "DPDPA இணக்கம்",
            lastUpdated: "கடைசியாக புதுப்பிக்கப்பட்டது: ஜூலை 2026",
            intro: "இண்டியா கேர் இந்தியாவின் டிஜிட்டல் தனிநபர் தரவு பாதுகாப்பு சட்டத்திற்கு (DPDPA 2023) முழுமையாக இணங்க கடமைப்பட்டுள்ளது.",
            sec1Title: "1. வெளிப்படையான ஒப்புதல்",
            sec1Text: "உங்கள் தெளிவான, உறுதியான மற்றும் வெளிப்படையான ஒப்புதலுடன் மட்டுமே உங்கள் மருத்துவத் தரவை நாங்கள் செயலாக்குகிறோம், இதை நீங்கள் எப்போது வேண்டுமானாலும் திரும்பப் பெறலாம்.",
            sec2Title: "2. தரவு உரிமையாளரின் உரிமைகள்",
            sec2Text: "உங்களுக்கு அணுகல், திருத்தம், நிறைவு அல்லது எங்கள் நெட்வொர்க்கில் சேமிக்கப்பட்டுள்ள உங்கள் தனிப்பட்ட வளர்சிதை மாற்றப் பதிவுகளை முழுமையாக நீக்கக் கோருவதற்கு உரிமை உள்ளது.",
            sec3Title: "3. தரவு பாதுகாப்பு அதிகாரி (DPO)",
            sec3Text: "பாதுகாப்பான செயலாக்கத்தை மேற்பார்வையிடவும் மற்றும் உங்கள் டிஜிட்டல் தனியுரிமை உரிமைகள் தொடர்பான விசாரணைகளை நிவர்த்தி செய்யவும் நாங்கள் ஒரு தரவு பாதுகாப்பு அதிகாரியை நியமித்துள்ளோம்.",
            back: "முகப்பு பக்கத்திற்கு திரும்புக"
        },
        te: {
            title: "DPDPA సమ్మతి",
            lastUpdated: "చివరిగా నవీకరించబడింది: జూలై 2026",
            intro: "ఇండియా కేర్ భారతదేశ డిజిటల్ వ్యక్తిగత డేటా రక్షణ చట్టానికి (DPDPA 2023) పూర్తిగా కట్టుబడి ఉంది.",
            sec1Title: "1. స్పష్టమైన సమ్మతి",
            sec1Text: "మేము మీ స్పష్టమైన మరియు నిర్దిష్టమైన సమ్మతితో మాత్రమే మీ ఆరోగ్య డేటాను ప్రాసెస్ చేస్తాము, దీనిని మీరు ఎప్పుడైనా మీ ప్రొఫైల్ నుండి ఉపసంహరించుకోవచ్చు.",
            sec2Title: "2. డేటా ప్రిన్సిపాల్ హక్కులు",
            sec2Text: "మా నెట్‌వర్క్‌లో నిల్వ చేయబడిన మీ వ్యక్తిగत మెటబాలిక్ రికార్డులను యాక్సెస్ చేయడానికి, సరిదిద్దడానికి లేదా తొలగించడానికి మీకు హక్కు ఉంది.",
            sec3Title: "3. డేటా ప్రొటెక్షన్ ఆఫీసర్ (DPO)",
            sec3Text: "సురక్షితమైన డేటా ప్రాసెసింగ్‌ను పర్యవేక్షించడానికి మరియు మీ గోప్యతా హక్కులకు సంబంధించిన విచారణలను పరిష్కరించడానికి మేము ఒక ప్రత్యేక డేటా ప్రొటెక్షన్ ఆఫీసర్‌ను నియమించాము.",
            back: "హోమ్ పేజీకి తిరిగి వెళ్ళండి"
        }
    };

    const t = content[locale as keyof typeof content] || content.en;

    return (
        <div className="min-h-screen py-16 bg-gray-50/50 flex flex-col items-center">
            <div className="container max-w-3xl px-6 mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary mb-10 transition-colors">
                    <ArrowLeft size={16} />
                    {t.back}
                </Link>

                <div className="premium-card p-10 bg-white shadow-xl shadow-gray-100/50">
                    <div className="flex items-center gap-3.5 mb-6 text-primary">
                        <Lock size={32} />
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 leading-none">{t.title}</h1>
                            <p className="text-xs text-muted-foreground mt-1.5 font-semibold">{t.lastUpdated}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-8 pt-8 space-y-6">
                        <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                            {t.intro}
                        </p>

                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-gray-950">{t.sec1Title}</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                                {t.sec1Text}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-gray-950">{t.sec2Title}</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                                {t.sec2Text}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-gray-950">{t.sec3Title}</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                                {t.sec3Text}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
