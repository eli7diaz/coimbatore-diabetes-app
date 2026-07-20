"use client";

import { useState } from "react";
import { MessageSquare, Sparkles, Send, X, Bot } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageContext";

export default function AIAssistant() {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "ai.greeting", isKey: true }
    ]);
    const [input, setInput] = useState("");

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessages = [...messages, { role: "user", content: input, isKey: false }];
        setMessages(newMessages);
        setInput("");

        // Simulated response
        setTimeout(() => {
            setMessages([...newMessages, {
                role: "assistant",
                content: "ai.analyzing",
                isKey: true
            }]);
        }, 800);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            {isOpen ? (
                <div className="w-[380px] h-[500px] flex flex-col bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="bg-primary p-4 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                                <Bot size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold">India-GPT</h3>
                                <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">{t("ai.role")}</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-medium ${m.role === "user"
                                    ? "bg-primary text-white"
                                    : "bg-white border border-gray-100 text-gray-800 shadow-sm"
                                    }`}>
                                    {m.isKey ? t(m.content) : m.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSend} className="p-4 border-t bg-white flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t("ai.placeholder")}
                            className="flex-1 px-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <button type="submit" className="h-10 w-10 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all group relative"
                >
                    <div className="absolute -top-2 -right-2 h-5 w-5 bg-glucose-high rounded-full border-2 border-white animate-bounce" />
                    <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
                </button>
            )}
        </div>
    );
}
