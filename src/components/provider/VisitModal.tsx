"use client";

import { useState } from "react";
import { X, User, Activity, FileText, ChevronRight, Check, Video, Mic, MicOff, PhoneOff, History } from "lucide-react";

interface VisitModalProps {
    visit: {
        name: string;
        time: string;
        type: string;
        status: string;
        glucose: string;
    };
    onClose: () => void;
}

interface Note {
    date: string;
    content: string;
}

const pastVisits = [
    { date: "Jan 12", type: "CGM Review", summary: "Adjusted basal rate by 0.5 units. HBA1C stable at 7.2%." },
    { date: "Dec 18", type: "Regular Checkup", summary: "Discussed dietary fiber intake. BP normal at 126/82." },
    { date: "Nov 22", type: "Insulin Adjustment", summary: "Increased ISF to 50 mg/dL following hypo episodes." },
];

export default function VisitModal({ visit, onClose }: VisitModalProps) {
    const [notes, setNotes] = useState<Note[]>([
        { date: "Last Visit (Jan 12)", content: "Patient reports occasional post-prandial fatigue. Recommended higher fiber intake during dinner and adjusted basal rate by 0.5 units." },
    ]);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [draftNote, setDraftNote] = useState("");
    const [consultState, setConsultState] = useState<"idle" | "connecting" | "live">("idle");
    const [micOn, setMicOn] = useState(true);
    const [showHistory, setShowHistory] = useState(false);

    const handleSaveNote = () => {
        if (!draftNote.trim()) return;
        setNotes([{ date: "Today", content: draftNote.trim() }, ...notes]);
        setDraftNote("");
        setIsAddingNote(false);
    };

    const handleStartConsultation = () => {
        setConsultState("connecting");
        setTimeout(() => setConsultState("live"), 1500);
    };

    const handleEndConsultation = () => {
        setConsultState("idle");
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                <div className="p-6 border-b flex items-center justify-between bg-primary text-white shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                            {visit.name[0]}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{visit.name}</h3>
                            <p className="text-sm text-white/70 font-medium">Patient ID: PAT-99283 • {visit.type}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {consultState !== "idle" ? (
                    <div className="bg-gray-950 aspect-video flex flex-col items-center justify-center relative">
                        {consultState === "connecting" ? (
                            <div className="flex flex-col items-center gap-4 text-white">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                                <p className="text-sm font-bold">Connecting securely to {visit.name}...</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col items-center gap-3 text-white">
                                    <div className="h-20 w-20 rounded-full border-4 border-primary/50 bg-gray-800 flex items-center justify-center">
                                        <User size={36} className="text-gray-400" />
                                    </div>
                                    <p className="text-sm font-bold text-primary">Live • Digital Consultation</p>
                                </div>
                                <div className="absolute bottom-6 flex items-center gap-4">
                                    <button
                                        onClick={() => setMicOn(!micOn)}
                                        className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${micOn ? "bg-white/10 text-white hover:bg-white/20" : "bg-red-500 text-white"}`}
                                    >
                                        {micOn ? <Mic size={18} /> : <MicOff size={18} />}
                                    </button>
                                    <button
                                        onClick={handleEndConsultation}
                                        className="h-12 w-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl hover:bg-red-700 transition-all"
                                    >
                                        <PhoneOff size={20} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto">
                        {/* Vitals */}
                        <div className="space-y-6">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Activity size={16} className="text-primary" />
                                Current Vitals
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-gray-50 border">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Blood Glucose</span>
                                    <p className="text-xl font-black text-gray-900">{visit.glucose}</p>
                                    <span className="text-[10px] text-yellow-600 font-bold">↑ 8% from last</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 border">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">HBA1C</span>
                                    <p className="text-xl font-black text-gray-900">7.2%</p>
                                    <span className="text-[10px] text-green-600 font-bold">Stable Range</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 border">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">BP</span>
                                    <p className="text-xl font-black text-gray-900">128/84</p>
                                    <span className="text-[10px] text-gray-400 font-bold">Normal</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 border">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Weight</span>
                                    <p className="text-xl font-black text-gray-900">74 kg</p>
                                    <span className="text-[10px] text-red-600 font-bold">+1.2kg (30d)</span>
                                </div>
                            </div>

                            {showHistory && (
                                <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <History size={16} className="text-primary" />
                                        Visit History
                                    </h4>
                                    {pastVisits.map((v, i) => (
                                        <div key={i} className="p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold text-gray-900">{v.date}</span>
                                                <span className="text-[10px] font-bold text-primary">{v.type}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{v.summary}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Timeline/Notes */}
                        <div className="space-y-6">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <FileText size={16} className="text-primary" />
                                Clinical Notes
                            </h4>
                            <div className="space-y-4">
                                {notes.map((note, i) => (
                                    <div key={i} className="p-4 rounded-2xl border border-dashed border-gray-200">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold text-gray-900">{note.date}</span>
                                            <Check size={14} className="text-primary" />
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            "{note.content}"
                                        </p>
                                    </div>
                                ))}

                                {isAddingNote ? (
                                    <div className="p-4 rounded-2xl border-2 border-primary/20 bg-primary/5 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                        <textarea
                                            autoFocus
                                            value={draftNote}
                                            onChange={(e) => setDraftNote(e.target.value)}
                                            placeholder="Enter clinical observation..."
                                            rows={3}
                                            className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium resize-none"
                                        />
                                        <div className="flex items-center gap-2 justify-end">
                                            <button
                                                onClick={() => { setIsAddingNote(false); setDraftNote(""); }}
                                                className="px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveNote}
                                                className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded-lg shadow-md shadow-primary/20 transition-all"
                                            >
                                                Save Note
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsAddingNote(true)}
                                        className="w-full py-3 bg-primary/5 text-primary text-sm font-bold rounded-xl border border-primary/20 hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Add Clinical Note
                                        <ChevronRight size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {consultState === "idle" && (
                    <div className="p-6 bg-gray-50 border-t flex gap-4 shrink-0">
                        <button
                            onClick={handleStartConsultation}
                            className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <Video size={18} />
                            Start Digital Consultation
                        </button>
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="px-6 py-4 border bg-white font-bold rounded-2xl hover:bg-gray-50 transition-colors text-gray-700"
                        >
                            {showHistory ? "Hide Full History" : "View Full History"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
