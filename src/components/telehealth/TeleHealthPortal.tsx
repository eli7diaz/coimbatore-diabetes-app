"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Video, FileText, User, Share2, ShieldCheck, Search, X, Mic, MicOff, Camera, CameraOff, PhoneOff } from "lucide-react";

export default function TeleHealthPortal() {
    const [sharing, setSharing] = useState(true);
    const [trendReports, setTrendReports] = useState(true);
    const [remoteAccess, setRemoteAccess] = useState(true);
    const [isCalling, setIsCalling] = useState(false);
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const localVideoRef = useRef<HTMLVideoElement>(null);

    const startCall = async () => {
        setIsCalling(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing media devices:", err);
        }
    };

    const endCall = () => {
        if (localVideoRef.current && localVideoRef.current.srcObject) {
            const stream = localVideoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            localVideoRef.current.srcObject = null;
        }
        setIsCalling(false);
    };

    useEffect(() => {
        return () => endCall();
    }, []);

    if (isCalling) {
        return (
            <div className="premium-card overflow-hidden bg-gray-950 aspect-[4/5] flex flex-col animate-in fade-in zoom-in duration-300 relative">
                {/* Peer Video (Doctor - Mock) */}
                <div className="flex-1 relative bg-gray-900 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-40 blur-sm scale-110" />
                    <div className="relative z-10 flex flex-col items-center gap-4">
                        <div className="h-24 w-24 rounded-full border-4 border-primary/50 overflow-hidden bg-gray-800 flex items-center justify-center shadow-2xl">
                            <User size={48} className="text-gray-400" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-white">Dr. Savitri Venkat</h3>
                            <p className="text-sm text-primary font-bold">Connecting Securely...</p>
                        </div>
                    </div>
                </div>

                {/* Local Video (Patient) */}
                <div className="absolute top-6 right-6 w-32 aspect-[3/4] bg-black rounded-2xl border-2 border-white/20 shadow-2xl overflow-hidden z-20">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover ${cameraOn ? "opacity-100" : "opacity-0"}`}
                    />
                    {!cameraOn && (
                        <div className="absolute inset-0 flex items-center justify-center text-white/40">
                            <CameraOff size={24} />
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="p-6 flex items-center justify-center gap-4 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 inset-x-0 z-30">
                    <button
                        onClick={() => setMicOn(!micOn)}
                        className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${micOn ? "bg-white/10 text-white hover:bg-white/20" : "bg-red-500 text-white"}`}
                    >
                        {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                    </button>
                    <button
                        onClick={() => setCameraOn(!cameraOn)}
                        className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${cameraOn ? "bg-white/10 text-white hover:bg-white/20" : "bg-red-500 text-white"}`}
                    >
                        {cameraOn ? <Camera size={20} /> : <CameraOff size={20} />}
                    </button>
                    <button
                        onClick={endCall}
                        className="h-14 w-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl hover:bg-red-700 hover:scale-110 active:scale-95 transition-all"
                    >
                        <PhoneOff size={24} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="premium-card overflow-hidden">
            <div className="bg-primary p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full border-2 border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Dr. Savitri Venkat</h3>
                            <p className="text-xs text-white/70">Endocrinologist • India Medical Center</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={startCall}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <Video size={18} />
                        </button>
                        <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                            <MessageSquare size={18} />
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white/10 rounded-xl p-3 border border-white/5">
                    <ShieldCheck size={16} />
                    <p className="text-[10px] font-medium uppercase tracking-wider">Secure End-to-End Encrypted Link</p>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="font-bold flex items-center gap-2">
                        <Share2 size={18} className="text-primary" />
                        Clinical Data Sharing
                    </h4>
                    <div
                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${sharing ? "bg-primary" : "bg-gray-200"}`}
                        onClick={() => setSharing(!sharing)}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${sharing ? "translate-x-6" : ""}`} />
                    </div>
                </div>

                <div className={`space-y-4 transition-opacity duration-300 ${sharing ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                    <div className="p-4 rounded-xl border bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FileText size={18} className="text-muted-foreground" />
                            <span className="text-sm font-medium">Automatic Trend Reports</span>
                        </div>
                        <div
                            className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${trendReports ? "bg-primary" : "bg-gray-200"}`}
                            onClick={() => setTrendReports(!trendReports)}
                        >
                            <div className={`w-3 h-3 bg-white rounded-full transition-transform ${trendReports ? "translate-x-5" : ""}`} />
                        </div>
                    </div>

                    <div className="p-4 rounded-xl border bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Search size={18} className="text-muted-foreground" />
                            <span className="text-sm font-medium">Remote Logbook Access</span>
                        </div>
                        <div
                            className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${remoteAccess ? "bg-primary" : "bg-gray-200"}`}
                            onClick={() => setRemoteAccess(!remoteAccess)}
                        >
                            <div className={`w-3 h-3 bg-white rounded-full transition-transform ${remoteAccess ? "translate-x-5" : ""}`} />
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Recent Doctor Notes</h4>
                    <div className="p-4 rounded-xl border border-dashed border-primary/30 bg-primary/5">
                        <p className="text-sm leading-relaxed italic text-gray-700">
                            "Arjun, your post-lunch spikes are improving. Let's maintain the current basal rate. I've adjusted your reminder frequency to 2 hours for better visibility."
                        </p>
                        <p className="text-[10px] font-bold mt-2 text-primary">— 2 HOURS AGO</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

