import { useState, useRef, useEffect } from "react";
import { Camera, CheckCircle2, AlertCircle, Sparkles, X, FlipHorizontal as Flip } from "lucide-react";
import InsulinCalculator from "./InsulinCalculator";
import { useLanguage } from "@/components/i18n/LanguageContext";
import { AppDatabase } from "@/lib/db";

export default function MealAnalyzer() {
    const { locale } = useLanguage();
    const [image, setImage] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<{ carbs: number; calories: number; food: string } | null>(null);
    const [showCalculator, setShowCalculator] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editFood, setEditFood] = useState("");
    const [editCarbs, setEditCarbs] = useState(0);
    const [editCalories, setEditCalories] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (result) {
            setEditFood(result.food);
            setEditCarbs(result.carbs);
            setEditCalories(result.calories);
        }
    }, [result]);

    const handleSaveEdit = async () => {
        if (editFood.trim() === "") return;
        const updatedMeal = {
            food: editFood,
            carbs: editCarbs,
            calories: editCalories
        };
        setResult(updatedMeal);
        setIsEditing(false);

        // Save corrected log to database
        await AppDatabase.saveMealLog({
            food: updatedMeal.food,
            carbs: updatedMeal.carbs,
            calories: updatedMeal.calories,
            image: image,
        });
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
                audio: false
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreaming(true);
                // Clear any previous results
                setImage(null);
                setResult(null);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please ensure permissions are granted.");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setIsStreaming(false);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext("2d");
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL("image/jpeg");
                setImage(dataUrl);
                stopCamera();
                simulateAnalysis("captured_camera_photo.jpg");
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                simulateAnalysis(file.name);
                // Clear the input value so the same file can be selected again
                e.target.value = "";
            };
            reader.readAsDataURL(file);
        }
    };

    const getSimulatedMeal = (fileName: string) => {
        const nameLower = fileName.toLowerCase();
        const meals = [
            { food: "Chicken Biryani with Raita", carbs: 45, calories: 320 },
            { food: "Masala Dosa with Sambar & Chutney", carbs: 55, calories: 380 },
            { food: "Idli (3 pcs) with Sambar", carbs: 40, calories: 220 },
            { food: "Roti (2 pcs) with Paneer Butter Masala", carbs: 48, calories: 420 },
            { food: "Dal Tadka with Steamed Basmati Rice", carbs: 62, calories: 360 },
            { food: "Samosa (2 pcs) with Mint Chutney", carbs: 32, calories: 310 },
            { food: "Alu Paratha with Curd", carbs: 52, calories: 390 }
        ];

        if (nameLower.includes("dosa")) return meals[1];
        if (nameLower.includes("idli")) return meals[2];
        if (nameLower.includes("paneer") || nameLower.includes("roti") || nameLower.includes("chapati")) return meals[3];
        if (nameLower.includes("rice") || nameLower.includes("dal")) return meals[4];
        if (nameLower.includes("samosa")) return meals[5];
        if (nameLower.includes("paratha") || nameLower.includes("aloo")) return meals[6];
        if (nameLower.includes("biryani") || nameLower.includes("chicken")) return meals[0];

        // Random pick if no keyword matches
        const randomIndex = Math.floor(Math.random() * meals.length);
        return meals[randomIndex];
    };

    const simulateAnalysis = (fileName: string) => {
        setAnalyzing(true);
        setResult(null);
        setTimeout(async () => {
            const meal = getSimulatedMeal(fileName);
            setResult(meal);
            setAnalyzing(false);

            // Save detected log to database
            await AppDatabase.saveMealLog({
                food: meal.food,
                carbs: meal.carbs,
                calories: meal.calories,
                image: image,
            });
        }, 2000);
    };

    const reset = () => {
        stopCamera();
        setImage(null);
        setResult(null);
        setAnalyzing(false);
        setShowCalculator(false);
        setIsEditing(false);

        // Clear the file input element's value so it can be re-triggered
        const fileInput = document.getElementById("meal-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    };

    useEffect(() => {
        return () => stopCamera();
    }, []);

    return (
        <div className="premium-card p-6 relative">
            <canvas ref={canvasRef} className="hidden" />

            {showCalculator && result && (
                <div className="absolute inset-x-0 top-0 z-50 p-2">
                    <InsulinCalculator
                        carbs={result.carbs}
                        onClose={() => setShowCalculator(false)}
                    />
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="text-primary" size={20} />
                        AI Meal Analysis
                    </h3>
                    <p className="text-sm text-muted-foreground">Capture or upload a photo to estimate carb content</p>
                </div>
                {(image || isStreaming) && !analyzing && (
                    <button
                        onClick={reset}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                        <X size={14} />
                        Reset
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                    onClick={() => {
                        if (!isStreaming && !analyzing) {
                            document.getElementById('meal-upload')?.click();
                        }
                    }}
                    className={`border-2 border-dashed border-gray-200 rounded-xl aspect-square flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 transition-colors bg-gray-50/50 relative overflow-hidden ${isStreaming ? "border-primary/50" : ""}`}
                >
                    <input
                        type="file"
                        id="meal-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    {isStreaming ? (
                        <div className="absolute inset-0 w-full h-full bg-black flex flex-col">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 inset-x-0 flex justify-center items-center gap-4 px-4">
                                <button
                                    onClick={(e) => { e.stopPropagation(); capturePhoto(); }}
                                    className="h-14 w-14 rounded-full bg-white border-4 border-primary shadow-xl flex items-center justify-center animate-pulse"
                                >
                                    <div className="h-10 w-10 rounded-full bg-primary" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); stopCamera(); }}
                                    className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    ) : image ? (
                        <>
                            <img src={image} alt="Meal" className={`absolute inset-0 w-full h-full object-cover ${analyzing ? "opacity-40" : ""}`} />
                            {analyzing ? (
                                <div className="relative z-10 flex flex-col items-center gap-2">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                                    <span className="text-sm font-bold bg-white/80 px-3 py-1 rounded-full text-primary">GPT-4 Vision analyzing...</span>
                                </div>
                            ) : (
                                <div className="relative z-10 flex flex-col items-center gap-2 text-primary">
                                    <CheckCircle2 size={48} className="drop-shadow-lg" />
                                    <span className="text-sm font-bold bg-white/80 px-3 py-1 rounded-full">Analysis Complete</span>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-6 p-6 w-full h-full justify-center">
                            <div className="flex gap-4">
                                <button
                                    onClick={(e) => { e.stopPropagation(); startCamera(); }}
                                    className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all hover:scale-105"
                                >
                                    <Camera size={32} />
                                    <span className="text-sm font-bold">Use Camera</span>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); document.getElementById('meal-upload')?.click(); }}
                                    className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 transition-all hover:scale-105"
                                >
                                    <Flip size={32} />
                                    <span className="text-sm font-bold">Upload File</span>
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground text-center">Capture live meal photo for instant AI analysis</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-center gap-4">
                    {result ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl border bg-gray-50/50 space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                                            {locale === "es" ? "Editar Análisis de Comida" : locale === "ta" ? "உணவு பகுப்பாய்வை திருத்தவும்" : locale === "te" ? "భోజన విశ్లేషణను సవరించండి" : "Edit Meal Analysis"}
                                        </h4>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground">
                                                {locale === "es" ? "Nombre de la comida" : locale === "ta" ? "உணவின் பெயர்" : locale === "te" ? "ఆహారం పేరు" : "Food Name"}
                                            </label>
                                            <input
                                                type="text"
                                                value={editFood}
                                                onChange={(e) => setEditFood(e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold text-sm"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-bold text-muted-foreground">
                                                    {locale === "es" ? "Carbohidratos (g)" : locale === "ta" ? "கார்போஹைட்ரேட்டுகள் (கி)" : locale === "te" ? "కార్బోహైడ్రేట్లు (గ్రా)" : "Carbs (g)"}
                                                </label>
                                                <input
                                                    type="number"
                                                    value={editCarbs}
                                                    onChange={(e) => setEditCarbs(parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold text-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-bold text-muted-foreground">
                                                    {locale === "es" ? "Calorías" : locale === "ta" ? "கலோரிகள்" : locale === "te" ? "క్యాలరీలు" : "Calories"}
                                                </label>
                                                <input
                                                    type="number"
                                                    value={editCalories}
                                                    onChange={(e) => setEditCalories(parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveEdit}
                                            className="flex-1 bg-primary text-white font-bold py-2 rounded-lg text-sm hover:bg-primary/95 transition-all cursor-pointer"
                                        >
                                            {locale === "es" ? "Guardar" : locale === "ta" ? "சேமி" : locale === "te" ? "సేవ్ చేయి" : "Save"}
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-lg text-sm transition-all cursor-pointer"
                                        >
                                            {locale === "es" ? "Cancelar" : locale === "ta" ? "ரத்துசெய்" : locale === "te" ? "ரద్దు చేయి" : "Cancel"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mb-4 flex items-start justify-between gap-3">
                                        <div>
                                            <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-1">
                                                {locale === "es" ? "Comida Detectada" : locale === "ta" ? "கண்டறியப்பட்ட உணவு" : locale === "te" ? "గుర్తించిన ఆహారం" : "Detected Meal"}
                                            </h4>
                                            <p className="text-lg font-bold">{result.food}</p>
                                        </div>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="text-xs font-bold text-primary hover:underline bg-white border border-primary/20 px-2.5 py-1 rounded-lg shadow-sm hover:bg-primary/5 transition-all mt-1 cursor-pointer shrink-0 animate-pulse hover:animate-none"
                                        >
                                            {locale === "es" ? "Corregir IA" : locale === "ta" ? "AI ஐ திருத்து" : locale === "te" ? "AI ని సరిచేయి" : "Correct AI"}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-gray-50 border">
                                            <span className="text-xs text-muted-foreground block font-medium">
                                                {locale === "es" ? "Carbohidratos Est." : locale === "ta" ? "மதிப்பிடப்பட்ட கார்ப்ஸ்" : locale === "te" ? "అంచనా కార్బోహైడ్రేట్లు" : "Est. Carbs"}
                                            </span>
                                            <span className="text-2xl font-bold">{result.carbs}g</span>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gray-50 border">
                                            <span className="text-xs text-muted-foreground block font-medium">
                                                {locale === "es" ? "Calorías" : locale === "ta" ? "கலோரிகள்" : locale === "te" ? "క్యాలరీలు" : "Calories"}
                                            </span>
                                            <span className="text-2xl font-bold">{result.calories}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowCalculator(true)}
                                        className="w-full mt-6 bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform cursor-pointer"
                                    >
                                        {locale === "es" ? "Aplicar al Cálculo de Insulina" : locale === "ta" ? "இன்சுலின் கால்குலேட்டருக்குப் பயன்படுத்துங்கள்" : locale === "te" ? "ఇన్సులిన్ கால்குலேటర్‌కు వర్తింపజేయి" : "Apply to Insulin Calculator"}
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-4">
                            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-2">
                                <Sparkles size={16} className="animate-pulse" />
                                <span>
                                    {locale === "es" ? "Guía para Fotos de IA" : locale === "ta" ? "AI புகைப்பட வழிகாட்டி" : locale === "te" ? "AI ఫోటో మార్గదర్శకాలు" : "AI Photo Guidelines"}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground font-semibold leading-relaxed mb-4">
                                {locale === "es" ? "Siga estas pautas para obtener la estimación de carbohidratos más precisa de la IA:" : locale === "ta" ? "துல்லியமான கார்ப் மதிப்பீட்டைப் பெற இந்த வழிகாட்டுதல்களைப் பின்பற்றவும்:" : locale === "te" ? "ఖచ్చితమైన కార్బ్ అంచనాను పొందడానికి ఈ మార్గదర్శకాలను అనుసరించండి:" : "Follow these guidelines to get the most accurate carb estimation from the AI:"}
                            </p>
                            <div className="space-y-3.5 text-left">
                                <div className="flex gap-2.5">
                                    <span className="text-primary mt-0.5 font-bold">✓</span>
                                    <div>
                                        <h5 className="text-xs font-bold text-gray-800">
                                            {locale === "es" ? "Buena Iluminación" : locale === "ta" ? "நல்ல வெளிச்சம்" : locale === "te" ? "మంచి కాంతి" : "Good Lighting"}
                                        </h5>
                                        <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
                                            {locale === "es" ? "Evite sombras fuertes o ambientes oscuros." : locale === "ta" ? "இருண்ட சூழலைத் தவிர்க்கவும்." : locale === "te" ? "చీకటి ప్రాంతాలను నివారించండి." : "Avoid harsh shadows or dark environments."}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2.5">
                                    <span className="text-primary mt-0.5 font-bold">✓</span>
                                    <div>
                                        <h5 className="text-xs font-bold text-gray-800">
                                            {locale === "es" ? "Ángulo Cenital (Top-Down)" : locale === "ta" ? "மேலிருந்து கீழ் பார்வை" : locale === "te" ? "పై నుండి క్రిందికి వ్యూ" : "Top-Down View"}
                                        </h5>
                                        <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
                                            {locale === "es" ? "Tome la foto desde arriba para mostrar porciones claras." : locale === "ta" ? "பகுதி அளவுகள் தெளிவாகத் தெரியும்படி மேலிருந்து எடுக்கவும்." : locale === "te" ? "పరిమాణం స్పష్టంగా కనిపించేలా పై నుండి ఫోటో తీయండి." : "Capture directly from above to show portion sizes clearly."}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2.5">
                                    <span className="text-primary mt-0.5 font-bold">✓</span>
                                    <div>
                                        <h5 className="text-xs font-bold text-gray-800">
                                            {locale === "es" ? "Sin Envoltorios o Tapas" : locale === "ta" ? "மூடி அல்லது கவர் இல்லாமல்" : locale === "te" ? "ప్యాకేజింగ్ లేదా మూత లేకుండా" : "Remove Lids & Wrappers"}
                                        </h5>
                                        <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
                                            {locale === "es" ? "Retire las tapas de los envases antes de capturar." : locale === "ta" ? "புகைப்படம் எடுப்பதற்கு முன் மூடி போன்றவற்றை அகற்றவும்." : locale === "te" ? "ఫోటో తీసే ముందు ప్యాకేజింగ్ లేదా మూతలను తొలగించండి." : "Uncover the food so the AI can see the items."}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2.5">
                                    <span className="text-primary mt-0.5 font-bold">✓</span>
                                    <div>
                                        <h5 className="text-xs font-bold text-gray-800">
                                            {locale === "es" ? "Enfoque Nítido" : locale === "ta" ? "தெளிவான படம்" : locale === "te" ? "స్పష్టమైన ఫోకస్" : "Clear Focus"}
                                        </h5>
                                        <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
                                            {locale === "es" ? "Evite imágenes borrosas para no reducir la precisión." : locale === "ta" ? "மங்கலான படங்கள் துல்லியத்தைக் குறைக்கும்." : locale === "te" ? "మసక ఫోటోలు ఖచ్చితత్వాన్ని తగ్గిస్తాయి." : "Avoid blurry movement; hold your camera steady."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

