"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageContext";

export default function TermsOfServicePage() {
    const { locale } = useLanguage();

    const content = {
        es: {
            title: "Términos de Servicio",
            lastUpdated: "Última actualización: Julio 2026",
            intro: "Al utilizar India Care, usted acepta estos Términos de Servicio. Por favor, léalos atentamente antes de usar la plataforma.",
            sec1Title: "1. No es consejo médico",
            sec1Text: "La plataforma India Care e India-GPT brindan recomendaciones basadas en pautas del ICMR, pero NO sustituyen el diagnóstico, tratamiento o consejo de un profesional de la salud calificado.",
            sec2Title: "2. Cuentas de usuario",
            sec2Text: "Usted es responsable de mantener la confidencialidad de sus credenciales de inicio de sesión y de todas las actividades que ocurran bajo su cuenta.",
            sec3Title: "3. Uso aceptable",
            sec3Text: "Se compromete a utilizar la plataforma únicamente para fines de gestión personal de la salud y de acuerdo con todas las leyes aplicables.",
            back: "Volver al Inicio"
        },
        en: {
            title: "Terms of Service",
            lastUpdated: "Last updated: July 2026",
            intro: "By accessing or using India Care, you agree to comply with and be bound by these Terms of Service. Please read them carefully.",
            sec1Title: "1. Not Medical Advice",
            sec1Text: "The India Care platform and India-GPT provide recommendations based on ICMR guidelines, but they are NOT a substitute for qualified professional medical advice, diagnosis, or treatment.",
            sec2Title: "2. User Accounts",
            sec2Text: "You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.",
            sec3Title: "3. Acceptable Use",
            sec3Text: "You agree to use the platform solely for personal health tracking purposes and in compliance with all applicable local laws.",
            back: "Back to Home"
        },
        ta: {
            title: "சேவை விதிமுறைகள்",
            lastUpdated: "கடைசியாக புதுப்பிக்கப்பட்டது: ஜூலை 2026",
            intro: "இண்டியா கேரைப் பயன்படுத்துவதன் மூலம், இந்த சேவை விதிமுறைகளுக்கு இணங்க ஒப்புக்கொள்கிறீர்கள். தயவுசெய்து அவற்றை கவனமாகப் படிக்கவும்.",
            sec1Title: "1. மருத்துவ ஆலோசனை அல்ல",
            sec1Text: "இண்டியா கேர் தளம் மற்றும் இண்டியா-GPT ஆகியவை ICMR வழிகாட்டுதல்களின் அடிப்படையில் பரிந்துரைகளை வழங்குகின்றன, ஆனால் அவை தகுதிவாய்ந்த தொழில்முறை மருத்துவ ஆலோசனை, நோயறிதல் அல்லது சிகிச்சைக்கு மாற்றாகாது.",
            sec2Title: "2. பயனர் கணக்குகள்",
            sec2Text: "உங்கள் உள்நுழைவு சான்றுகளின் ரகசியத்தன்மையைப் பேணுவதற்கும் உங்கள் கணக்கின் கீழ் நடைபெறும் அனைத்து செயல்பாடுகளுக்கும் நீங்களே பொறுப்பாவீர்கள்.",
            sec3Title: "3. ஏற்றுக்கொள்ளக்கூடிய பயன்பாடு",
            sec3Text: "தனிப்பட்ட சுகாதார கண்காணிப்பு நோக்கங்களுக்காக மட்டுமே மற்றும் பொருந்தக்கூடிய அனைத்து உள்ளூர் சட்டங்களுக்கும் இணங்க இந்த தளத்தைப் பயன்படுத்த ஒப்புக்கொள்கிறீர்கள்.",
            back: "முகப்பு பக்கத்திற்கு திரும்புக"
        },
        te: {
            title: "సేవా నిబంధనలు",
            lastUpdated: "చివరిగా నవీకరించబడింది: జూలై 2026",
            intro: "ఇండియా కేర్‌ను ఉపయోగించడం ద్వారా, మీరు ఈ సేవా నిబంధనలకు లోబడి ఉండటానికి అంగీకరిస్తున్నారు. దయచేసి వాటిని జాగ్రత్తగా చదవండి.",
            sec1Title: "1. వైద్య సలహా కాదు",
            sec1Text: "ఇండియా కేర్ ప్లాట్‌ఫారమ్ మరియు ఇండియా-GPT ICMR మార్గదర్శకాల ఆధారంగా సిఫార్సులను అందిస్తాయి, కానీ అవి అర్హత కలిగిన వృత్తిపరమైన వైద్య సలహా, రోగ నిర్ధారణ లేదా చికిత్సకు ప్రత్యామ్నాయం కాదు.",
            sec2Title: "2. వినియోగదారు ఖాతాలు",
            sec2Text: "మీ లాగిన్ ఆధారాల గోప్యతను కాపాడటానికి మరియు మీ ఖాతా పరిధిలో జరిగే అన్ని కార్యకలాపాలకు మీరే బాధ్యత వహిస్తారు.",
            sec3Title: "3. ఆమోదయోగ్యమైన ఉపయోగం",
            sec3Text: "వ్యక్తిగత ఆరోగ్య ట్రాకింగ్ ప్రయోజనాల కోసం మాత్రమే మరియు వర్తించే అన్ని స్థానిక చట్టాలకు అనుగుణంగా ప్లాట్‌ఫారమ్‌ను ఉపయోగించడానికి మీరు అంగీకరిస్తున్నారు.",
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
                        <BookOpen size={32} />
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
