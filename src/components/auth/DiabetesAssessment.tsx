"use client";

import { useState } from "react";
import { Check, AlertCircle, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

interface AssessmentProps {
    onComplete: (result: string) => void;
    onCancel: () => void;
}

export default function DiabetesAssessment({ onComplete, onCancel }: AssessmentProps) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});

    const questions = [
        {
            id: "symptoms",
            title: "What symptoms are you experiencing?",
            subtitle: "Select all that apply",
            type: "multiselect",
            options: [
                { id: "thirst", label: "Extreme Thirst / Dry Mouth" },
                { id: "urination", label: "Frequent Urination (especially at night)" },
                { id: "hunger", label: "Extreme Hunger (even after eating)" },
                { id: "weightloss", label: "Unexplained Weight Loss" },
                { id: "fatigue", label: "Extreme Fatigue / Lethargy" },
                { id: "vision", label: "Blurred Vision" },
                { id: "healing", label: "Slow-healing sores or frequent infections" },
                { id: "tingling", label: "Tingling, pain, or numbness in hands/feet" },
                { id: "None", label: "None of these" },
            ],
        },
        {
            id: "physical",
            title: "Physical Profile",
            subtitle: "Body composition can be a significant factor",
            type: "select",
            options: [
                { id: "underweight", label: "Underweight" },
                { id: "healthy", label: "Healthy Weight" },
                { id: "overweight", label: "Overweight" },
                { id: "obese", label: "Obese" },
            ],
        },
        {
            id: "age_onset",
            title: "How old are you?",
            subtitle: "Age can sometimes indicate type",
            type: "select",
            options: [
                { id: "child", label: "Under 18" },
                { id: "adult_young", label: "18 - 35" },
                { id: "adult_mid", label: "36 - 60" },
                { id: "senior", label: "Over 60" },
            ],
        },
        {
            id: "history",
            title: "Personal History",
            subtitle: "Help us understand your context",
            type: "multiselect",
            options: [
                { id: "family", label: "Family history of Diabetes" },
                { id: "pregnant", label: "Currently Pregnant" },
                { id: "pcos", label: "History of PCOS" },
                { id: "inactive", label: "Relatively inactive lifestyle" },
            ],
        },
    ];

    const handleNext = () => {
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            setStep(step + 1); // Move to result screen
        }
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
        else onCancel();
    };

    const toggleAnswer = (qId: string, optId: string) => {
        const current = answers[qId] || [];
        if (current.includes(optId)) {
            setAnswers({ ...answers, [qId]: current.filter((i: string) => i !== optId) });
        } else {
            setAnswers({ ...answers, [qId]: [...current, optId] });
        }
    };

    const setSingleAnswer = (qId: string, optId: string) => {
        setAnswers({ ...answers, [qId]: [optId] });
    };

    const getRecommendation = () => {
        const symptoms = answers["symptoms"] || [];
        const onset = (answers["age_onset"] || [])[0];
        const history = answers["history"] || [];
        const physical = (answers["physical"] || [])[0];

        // 1. Check for Gestational
        if (history.includes("pregnant")) return "Gestational";

        // 2. Likely Type 1 (Autoimmune, often younger, sudden weight loss)
        if (symptoms.includes("weightloss") && (onset === "child" || onset === "adult_young")) {
            return "Type 1 Diabetes";
        }

        // 3. Likely Type 2 (Insulin resistance, family history, inactive, overweight/obese)
        if (
            physical === "obese" ||
            physical === "overweight" ||
            history.includes("inactive") ||
            history.includes("family") ||
            symptoms.length > 3
        ) {
            return "Type 2 Diabetes";
        }

        // 4. Prediabetic risk
        if (symptoms.length > 0 || history.includes("family")) {
            return "Prediabetic";
        }

        return "Type 2 Diabetes"; // Default to most likely if symptoms exist
    };

    const currentQuestion = questions[step];
    const recommendation = step === questions.length ? getRecommendation() : null;

    return (
        <div className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-300">
            {step < questions.length ? (
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Assessment Protocol</span>
                            <span className="text-xs font-bold text-gray-400">{step + 1} / {questions.length}</span>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">
                            {currentQuestion.title}
                        </h2>
                        <p className="text-sm font-medium text-muted-foreground">{currentQuestion.subtitle}</p>
                    </div>

                    <div className="grid gap-3">
                        {currentQuestion.options.map((opt) => {
                            const isSelected = (answers[currentQuestion.id] || []).includes(opt.id);
                            return (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => currentQuestion.type === "multiselect" ? toggleAnswer(currentQuestion.id, opt.id) : setSingleAnswer(currentQuestion.id, opt.id)}
                                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${isSelected
                                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                                        : "border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-200"
                                        }`}
                                >
                                    <span className="font-bold">{opt.label}</span>
                                    {isSelected && <Check size={18} />}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="h-14 w-14 flex items-center justify-center rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={!(answers[currentQuestion.id]?.length > 0)}
                            className="flex-1 h-14 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50"
                        >
                            Next Module
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center space-y-6 py-4">
                    <div className="h-20 w-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Sparkles size={40} />
                    </div>

                    <div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Assessment Result</h2>
                        <p className="text-sm font-medium text-muted-foreground px-4">
                            Based on our clinical algorithm, we recommend registering as:
                        </p>
                    </div>

                    <div className="p-6 bg-primary/5 rounded-3xl border border-primary/20">
                        <span className="text-3xl font-black text-primary block">{recommendation}</span>
                        <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-primary/60">
                            <AlertCircle size={14} />
                            Always consult a certified medical professional
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            type="button"
                            onClick={() => recommendation && onComplete(recommendation)}
                            className="h-14 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Apply to Registration
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="h-14 text-gray-500 font-bold hover:text-gray-900 transition-colors"
                        >
                            Reset & Try Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
