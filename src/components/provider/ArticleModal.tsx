"use client";

import { X, Newspaper } from "lucide-react";

interface Article {
    title: string;
    date: string;
    category: string;
}

interface ArticleModalProps {
    article: Article;
    onClose: () => void;
}

const ARTICLE_BODY: Record<string, string> = {
    "Managing Type 2 in Urban India": "Urban lifestyles in India are associated with rising Type 2 diabetes incidence due to sedentary work patterns and calorie-dense diets. This brief covers practical counseling points: structured meal timing around traditional Indian cuisine, walkability interventions for desk workers, and culturally adapted exercise recommendations for patients in metro areas.",
    "New CGM Guidelines by ICMR 2026": "The ICMR's updated 2026 guidance recommends continuous glucose monitoring as first-line for all Type 1 patients and Type 2 patients on intensive insulin therapy. Key changes include revised Time-in-Range targets (70% TIR for most adults) and new reimbursement pathways for CGM devices under India's public health schemes.",
    "Fiber-rich Diet for South Indian Meals": "Traditional South Indian staples like idli, dosa, and rice can be adapted for better glycemic control by increasing fiber content. This article outlines substitutions (millets for polished rice, added legumes in sambar) and portion guidance that maintain cultural food preferences while improving post-prandial glucose response.",
};

export default function ArticleModal({ article, onClose }: ArticleModalProps) {
    const body = ARTICLE_BODY[article.title] ?? "Full article content is being prepared by the India-GPT clinical editorial team and will be available shortly.";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
                <div className="p-6 border-b flex items-start justify-between gap-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                            <Newspaper size={20} />
                        </div>
                        <div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-primary block mb-1">{article.category}</span>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">{article.title}</h3>
                            <span className="text-[10px] text-muted-foreground font-medium mt-1 block">{article.date}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-muted-foreground shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">{body}</p>
                </div>
            </div>
        </div>
    );
}
