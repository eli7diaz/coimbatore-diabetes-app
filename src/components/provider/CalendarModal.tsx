"use client";

import { X, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";

interface CalendarModalProps {
    onClose: () => void;
}

const weekSchedule = [
    { day: "Mon", date: "Feb 16", visits: [{ time: "10:30 AM", name: "Arjun Sharma", type: "Regular Checkup" }, { time: "2:00 PM", name: "Lakshmi Rao", type: "Insulin Review" }] },
    { day: "Tue", date: "Feb 17", visits: [{ time: "11:15 AM", name: "Meera Iyer", type: "CGM Review" }] },
    { day: "Wed", date: "Feb 18", visits: [{ time: "9:00 AM", name: "Karthik Reddy", type: "Regular Checkup" }, { time: "12:00 PM", name: "Vijay Natarajan", type: "Insulin Adjustment" }, { time: "3:30 PM", name: "Divya Menon", type: "CGM Review" }] },
    { day: "Thu", date: "Feb 19", visits: [] },
    { day: "Fri", date: "Feb 20", visits: [{ time: "10:00 AM", name: "Sanjay Gupta", type: "Regular Checkup" }] },
];

export default function CalendarModal({ onClose }: CalendarModalProps) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <CalendarIcon size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">This Week's Schedule</h3>
                            <p className="text-sm text-muted-foreground font-medium">Feb 16 – Feb 20, 2026</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-muted-foreground"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-5 gap-4">
                    {weekSchedule.map((d) => (
                        <div key={d.day} className="space-y-3">
                            <div className="text-center pb-2 border-b border-gray-100">
                                <p className="text-xs font-black uppercase tracking-widest text-primary">{d.day}</p>
                                <p className="text-[10px] font-bold text-muted-foreground">{d.date}</p>
                            </div>
                            <div className="space-y-2">
                                {d.visits.length === 0 ? (
                                    <p className="text-[10px] text-center text-muted-foreground font-medium py-4">No visits</p>
                                ) : (
                                    d.visits.map((v, i) => (
                                        <div key={i} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-default">
                                            <div className="flex items-center gap-1 text-[9px] font-bold text-primary mb-1">
                                                <Clock size={9} />
                                                {v.time}
                                            </div>
                                            <p className="text-[11px] font-bold text-gray-900 leading-tight">{v.name}</p>
                                            <div className="flex items-center gap-1 text-[9px] text-muted-foreground mt-0.5">
                                                <MapPin size={9} />
                                                {v.type}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
