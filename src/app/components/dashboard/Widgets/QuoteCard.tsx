"use client";

import { Quote } from "lucide-react";
import { useQuote } from "@/hooks/use-api";
import { Loader2 } from "lucide-react";

export default function QuoteCard() {
  const { data: quote, isLoading, error } = useQuote();

  return (
    <div className="bg-linear-to-br from-purple-600/20 to-pink-600/20 border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center min-h-[200px]">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Quote className="w-24 h-24 text-white" />
      </div>

      <div className="relative z-10">
        <h3 className="text-sm font-medium text-purple-300 mb-4 uppercase tracking-wider">
          Quote of the Day
        </h3>
        
        {isLoading ? (
          <div className="flex items-center gap-2 text-purple-300/50">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading inspiration...</span>
          </div>
        ) : error || !quote ? (
          <blockquote className="text-xl md:text-2xl font-serif text-white italic mb-4 leading-relaxed">
            &ldquo;Be gentle with yourself. You're doing the best you can.&rdquo;
          </blockquote>
        ) : (
          <>
            <blockquote className="text-xl md:text-2xl font-serif text-white italic mb-4 leading-relaxed">
              &ldquo;{quote.content}&rdquo;
            </blockquote>
            {quote.author && (
              <cite className="text-gray-400 not-italic font-medium block text-right">
                — {quote.author}
              </cite>
            )}
          </>
        )}
      </div>
    </div>
  );
}
