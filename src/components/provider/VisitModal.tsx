"use client";

import { X, User, Activity, Clock, FileText, ChevronRight, Check } from "lucide-react";

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

export default function VisitModal({ visit, onClose }: VisitModalProps) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b flex items-center justify-between bg-primary text-white">
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

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    </div>

                    {/* Timeline/Notes */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <FileText size={16} className="text-primary" />
                            Clinical Notes
                        </h4>
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl border border-dashed border-gray-200">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-gray-900">Last Visit (Jan 12)</span>
                                    <Check size={14} className="text-primary" />
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    "Patient reports occasional post-prandial fatigue. Recommended higher fiber intake during dinner and adjusted basal rate by 0.5 units."
                                </p>
                            </div>
                            <button className="w-full py-3 bg-primary/5 text-primary text-sm font-bold rounded-xl border border-primary/20 hover:bg-primary/10 transition-colors flex items-center justify-center gap-2">
                                Add Clinical Note
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t flex gap-4">
                    <button className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        Start Digital Consultation
                    </button>
                    <button className="px-6 py-4 border bg-white font-bold rounded-2xl hover:bg-gray-50 transition-colors text-gray-700">
                        View Full History
                    </button>
                </div>
            </div>
        </div>
    );
}
