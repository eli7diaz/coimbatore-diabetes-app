"use client";

import { useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageContext";
import { HelpCircle, ChevronDown, ChevronUp, Cpu, Activity, Sparkles, Watch, Shield } from "lucide-react";

interface GuideSection {
    title: string;
    icon: any;
    steps: string[];
}

export default function UserGuide() {
    const { locale, t } = useLanguage();
    const [expandedSection, setExpandedSection] = useState<number | null>(null);

    const toggleSection = (index: number) => {
        setExpandedSection(expandedSection === index ? null : index);
    };

    const guides: Record<string, GuideSection[]> = {
        en: [
            {
                title: "1. Device Sync & Vitals",
                icon: Watch,
                steps: [
                    "Scroll down to 'Ecosystem Sync' at the bottom of the dashboard.",
                    "Click 'Connect' next to any health tracker (Dexter CGM, Apple Watch, or Fitbit).",
                    "Once connected, the live metrics at the top of your dashboard will unlock and begin real-time sync.",
                    "The CGM graph will automatically render your glucose trends once Dexter G6 is linked."
                ]
            },
            {
                title: "2. Log Manual Readings",
                icon: Activity,
                steps: [
                    "Locate the 'Log Device Reading' card in the right sidebar.",
                    "Select a device source (or choose 'Manual Entry').",
                    "Choose the vital metric (Glucose, Heart Rate, Active Burn, Deep Sleep) and enter the reading.",
                    "Click 'Log Reading' to submit. Your dashboard vitals and glucose chart will update instantly."
                ]
            },
            {
                title: "3. AI Meal Analysis",
                icon: Sparkles,
                steps: [
                    "Navigate to the 'AI Meal Analysis' card.",
                    "Upload a photo of your meal or use your camera to capture it.",
                    "The AI will automatically estimate the carb and calorie count of the Indian dish.",
                    "If the identification is inaccurate, click 'Correct AI' to manually adjust the food name and nutrients."
                ]
            },
            {
                title: "4. Insulin Dose Calculation",
                icon: Cpu,
                steps: [
                    "After analyzing a meal, click 'Apply to Insulin Calculator' on the results card.",
                    "The Insulin Bolus Calculator will appear in the sidebar with the estimated carbs pre-filled.",
                    "Review the suggested dosage and click 'Log Dose' to record it."
                ]
            },
            {
                title: "5. Telehealth & Reminders",
                icon: Shield,
                steps: [
                    "Click 'Connect to Provider' in the Telehealth sidebar card to start a live medical consult.",
                    "Use the 'Reminder Settings' card to turn on alarms for glucose checks and meal times.",
                    "Change the page language at the top menu to view all features translated in EN, ES, TA, or TE."
                ]
            }
        ],
        es: [
            {
                title: "1. Sincronización de Dispositivos",
                icon: Watch,
                steps: [
                    "Desplácese hasta 'Sincronización del Ecosistema' en la parte inferior del panel.",
                    "Haga clic en 'Conectar' junto a cualquier dispositivo (CGM Dexter, Apple Watch o Fitbit).",
                    "Una vez conectado, las métricas vitales en la parte superior se desbloquearán y comenzará la sincronización en tiempo real.",
                    "El gráfico de CGM mostrará automáticamente sus tendencias de glucosa una vez que se vincule el Dexter G6."
                ]
            },
            {
                title: "2. Registrar Lecturas Manuales",
                icon: Activity,
                steps: [
                    "Busque la tarjeta 'Registrar Lectura de Dispositivo' en la barra lateral derecha.",
                    "Seleccione una fuente de dispositivo (o elija 'Entrada Manual').",
                    "Elija la métrica vital (Glucosa, Ritmo Cardíaco, Calorías, Sueño) e ingrese la lectura.",
                    "Haga clic en 'Registrar Lectura' para guardar. Sus datos y el gráfico se actualizarán al instante."
                ]
            },
            {
                title: "3. Analizador de Comida con IA",
                icon: Sparkles,
                steps: [
                    "Vaya a la tarjeta 'AI Meal Analysis'.",
                    "Suba una foto de su comida o use su cámara para capturarla.",
                    "La IA estimará automáticamente el conteo de carbohidratos y calorías del plato indio.",
                    "Si el análisis es incorrecto, haga clic en 'Corregir IA' para ajustar el nombre y nutrientes manualmente."
                ]
            },
            {
                title: "4. Cálculo de Dosis de Insulina",
                icon: Cpu,
                steps: [
                    "Después del análisis, haga clic en 'Aplicar al Cálculo de Insulina' en la tarjeta de resultados.",
                    "El Cálculo de Insulina aparecerá en la barra lateral con los carbohidratos estimados precargados.",
                    "Revise la dosis sugerida y haga clic en 'Registrar Dosis' para guardarla."
                ]
            },
            {
                title: "5. Telemedicina y Recordatorios",
                icon: Shield,
                steps: [
                    "Haga clic en 'Conectar con el Proveedor' en la barra lateral de Telehealth para iniciar una videoconsulta.",
                    "Use la tarjeta de Recordatorios para activar alertas de control de glucosa y comidas.",
                    "Cambie el idioma del menú superior para ver toda la plataforma traducida al inglés, español, tamil o telugu."
                ]
            }
        ],
        ta: [
            {
                title: "1. முக்கிய அளவீடுகள் & சாதன ஒத்திசைவு",
                icon: Watch,
                steps: [
                    "தகவல் பலகையின் கீழே உள்ள 'சாதன ஒத்திசைவு' பகுதிக்குச் செல்லவும்.",
                    "ஏதேனும் ஒரு சாதனத்திற்கு (Dexter CGM, ஆப்பிள் வாட்ச் அல்லது ஃபிட்பிட்) பக்கத்திலுள்ள 'இணை' என்பதைக் கிளிக் செய்க.",
                    "இணைக்கப்பட்டதும், உங்கள் தகவல் பலகையின் மேலே உள்ள முக்கிய அளவீடுகள் திறக்கப்பட்டு நிகழ்நேரத்தில் ஒத்திசைக்கப்படும்.",
                    "Dexter G6 இணைக்கப்பட்டவுடன் குளுக்கோஸ் வரைபடம் தானாகவே உங்கள் குளுக்கோஸ் போக்குகளைக் காட்டும்."
                ]
            },
            {
                title: "2. அளவீடுகளை கைமுறையாக பதிவு செய்தல்",
                icon: Activity,
                steps: [
                    "வலது பக்கப் பட்டியில் உள்ள 'சாதனப் பதிவைப் பதிவுசெய்' கார்டைக் கண்டறியவும்.",
                    "ஒரு சாதனத் தேர்வைக் குறிப்பிடவும் (அல்லது 'கைமுறை பதிவு' என்பதைத் தேர்வு செய்யவும்).",
                    "முக்கிய அளவீட்டைத் (குளுக்கோஸ், இதயத் துடிப்பு, கலோரி, ஆழ்ந்த உறக்கம்) தேர்ந்தெடுத்து மதிப்பை உள்ளிடவும்.",
                    "பதிவு செய்ய 'அளவீட்டைப் பதிவுசெய்' என்பதைக் கிளிக் செய்க. தகவல் பலகையின் அளவீடுகள் மற்றும் வரைபடம் உடனடியாகப் புதுப்பிக்கப்படும்."
                ]
            },
            {
                title: "3. AI உணவு பகுப்பாய்வு",
                icon: Sparkles,
                steps: [
                    "AI உணவு பகுப்பாய்வு கார்டுக்குச் செல்லவும்.",
                    "உங்கள் உணவின் புகைப்படத்தைப் பிடிக்கவும் அல்லது கோப்பை பதிவேற்றவும்.",
                    "AI உணவைக் கண்டறிந்து கார்ப் மற்றும் கலோரி அளவை மதிப்பிடும்.",
                    "கண்டறிதல் தவறாக இருந்தால், உணவின் பெயர் மற்றும் ஊட்டச்சத்துக்களை மாற்ற 'AI ஐ திருத்து' என்பதைக் கிளிக் செய்க."
                ]
            },
            {
                title: "4. இன்சுலின் அளவைக் கணக்கிடுதல்",
                icon: Cpu,
                steps: [
                    "உணவை பகுப்பாய்வு செய்த பிறகு, 'இன்சுலின் கால்குலேட்டருக்குப் பயன்படுத்துங்கள்' என்பதைக் கிளிக் செய்க.",
                    "இன்சுலின் கால்குலேட்டர் மதிப்பிடப்பட்ட கார்ப்ஸுடன் பக்கப் பட்டியில் தோன்றும்.",
                    "பரிந்துரைக்கப்பட்ட அளவை சரிபார்த்து, அதை பதிவு செய்ய 'டோஸைப் பதிவுசெய்' என்பதைக் கிளிக் செய்க."
                ]
            },
            {
                title: "5. தொலைமருத்துவம் & நினைவூட்டல்கள்",
                icon: Shield,
                steps: [
                    "மருத்துவ ஆலோசனையைத் தொடங்க 'மருத்துவ தளம்' கார்டில் 'வழங்குநருடன் இணைக்கவும்' என்பதைக் கிளிக் செய்க.",
                    "குளுக்கோஸ் சோதனைகள் மற்றும் உணவு நேரங்களுக்கான விழிப்பூட்டல்களை இயக்க 'நினைவூட்டல் அமைப்புகள்' கார்டைப் பயன்படுத்தவும்.",
                    "அனைத்து அம்சங்களையும் தமிழ், ஆங்கிலம், ஸ்பானிஷ் அல்லது தெலுங்கில் காண மேல் மெனுவில் மொழியை மாற்றவும்."
                ]
            }
        ],
        te: [
            {
                title: "1. పరికరాల సమకాలీకరణ & వైటల్స్",
                icon: Watch,
                steps: [
                    "డ్యాష్‌బోర్డ్ దిగువన ఉన్న 'సాధనాల సమకాలీకరణ' విభాగానికి వెళ్ళండి.",
                    "ఏదైనా పరికరం (డెక్స్టర్ CGM, ఆపిల్ వాచ్, లేదా ఫిట్‌బిట్) పక్కన ఉన్న 'కనెక్ట్' క్లిక్ చేయండి.",
                    "కనెక్ట్ అయిన తర్వాత, డ్యాష్‌బోర్డ్ పైన ఉన్న వైటల్స్ నిజ-సమయ సమకాలీకరణను ప్రారంభిస్తాయి.",
                    "డెక్స్టర్ G6 లింక్ అయిన తర్వాత గ్లూకోజ్ గ్రాఫ్ స్వయంచాలకంగా మీ గ్లూకోజ్ ట్రెండ్‌లను చూపుతుంది."
                ]
            },
            {
                title: "2. మాన్యువల్ రీడింగ్‌లను నమోదు చేయండి",
                icon: Activity,
                steps: [
                    "కుడి సైడ్‌బార్‌లో 'పరికర రీడింగ్‌ను నమోదు చేయండి' కార్డ్‌ని కనుగొనండి.",
                    "పరికరం మూలాన్ని ఎంచుకోండి (లేదా 'మాన్యువల్ ఎంట్రీ' ఎంచుకోండి).",
                    "వైటల్ మెట్రిక్ (గ్లూకోజ్, గుండె వేగం, క్యాలరీలు, నిద్ర) ఎంచుకుని, రీడింగ్‌ను నమోదు చేయండి.",
                    "నమోదు చేయడానికి 'రీడింగ్‌ను నమోదు చేయి' క్లిక్ చేయండి. మీ డ్యాష్‌బోర్డ్ వైటల్స్ మరియు గ్లూకోజ్ చార్ట్ తక్షణమే అప్‌డేట్ అవుతాయి."
                ]
            },
            {
                title: "3. AI భోజన విశ్లేషణ",
                icon: Sparkles,
                steps: [
                    "AI భోజన విశ్లేషణ కార్డ్‌కు వెళ్ళండి.",
                    "మీ భోజనం ఫోటోను క్యాప్చర్ చేయండి లేదా ఫైల్‌ను అప్‌లోడ్ చేయండి.",
                    "భారతీయ భోజనంలో కార్బోహైడ్రేట్లు మరియు క్యాలరీల సంఖ్యను AI అంచనా వేస్తుంది.",
                    "గుర్తింపు సరిగ్గా లేకపోతే, ఆహార పేరు మరియు పోషకాలను సవరించడానికి 'AI ని సరిచేయి' క్లిక్ చేయండి."
                ]
            },
            {
                title: "4. ఇన్సులిన్ డోస్ లెక్కింపు",
                icon: Cpu,
                steps: [
                    "భోజనాన్ని విశ్లేషించిన తర్వాత, ఫలితాల కార్డ్‌పై 'ఇన్సులిన్ కాలిక్యులేటర్కు వర్తింపజేయి' క్లిక్ చేయండి.",
                    "ఇన్సులిన్ కాలిక్యులేటర్ అంచనా వేసిన కార్బ్స్‌తో సైడ్‌బార్‌లో కనిపిస్తుంది.",
                    "సూచించిన డోస్‌ను సమీక్షించి, నమోదు చేయడానికి 'డోస్‌ను లాగ్ చేయి' క్లిక్ చేయండి."
                ]
            },
            {
                title: "5. టెలిహెల్త్ & రిమైండర్‌లు",
                icon: Shield,
                steps: [
                    "లైవ్ వైద్య సంప్రదింపులను ప్రారంభించడానికి టెలిహెల్త్ కార్డ్‌లో 'ప్రదాతతో కనెక్ట్ అవ్వండి' క్లిక్ చేయండి.",
                    "గ్లూకోజ్ తనిఖీలు మరియు భోజన సమయాల కోసం హెచ్చరికలను ఆన్ చేయడానికి 'రిమైండర్ సెట్టింగ్‌లు' కార్డ్‌ని ఉపయోగించండి.",
                    "అన్ని ఫీచర్‌లను ఇంగ్లీష్, స్పానిష్, తమిళం లేదా తెలుగులో చూడటానికి పై మెనూలో భాషను మార్చండి."
                ]
            }
        ]
    };

    const currentGuide = guides[locale] || guides.en;

    return (
        <div className="premium-card p-6 bg-white">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <HelpCircle size={20} />
                </div>
                <div>
                    <h3 className="text-xl font-bold">{t("dashboard.userGuideTitle")}</h3>
                    <p className="text-sm text-muted-foreground font-semibold">{t("dashboard.userGuideSubtitle")}</p>
                </div>
            </div>

            <div className="space-y-3">
                {currentGuide.map((section, idx) => {
                    const Icon = section.icon;
                    const isExpanded = expandedSection === idx;
                    return (
                        <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden transition-all duration-200">
                            <button
                                onClick={() => toggleSection(idx)}
                                className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-white text-left font-bold text-sm text-gray-800 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={18} className="text-primary" />
                                    <span>{section.title}</span>
                                </div>
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            
                            {isExpanded && (
                                <div className="p-4 bg-white border-t border-gray-50 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                    <ul className="space-y-2.5">
                                        {section.steps.map((step, sIdx) => (
                                            <li key={sIdx} className="flex gap-2.5 text-xs text-muted-foreground font-semibold leading-relaxed">
                                                <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">{sIdx + 1}</span>
                                                <span className="pt-0.5">{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
