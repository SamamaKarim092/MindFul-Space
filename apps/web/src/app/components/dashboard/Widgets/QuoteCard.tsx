"use client";

import { Quote } from "lucide-react";

export default function QuoteCard() {
  return (
    <div className="bg-linear-to-br from-purple-600/20 to-pink-600/20 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Quote className="w-24 h-24 text-white" />
      </div>

      <div className="relative z-10">
        <h3 className="text-sm font-medium text-purple-300 mb-4 uppercase tracking-wider">
          Quote of the Day
        </h3>
        <blockquote className="text-xl md:text-2xl font-serif text-white italic mb-4 leading-relaxed">
          "The only journey is the one within."
        </blockquote>
        <cite className="text-gray-400 not-italic font-medium block text-right">
          — Rainer Maria Rilke
        </cite>
      </div>
    </div>
  );
}
