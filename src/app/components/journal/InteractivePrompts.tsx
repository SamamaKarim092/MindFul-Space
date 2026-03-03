"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useMood } from "@/app/context/MoodContext";

const PROMPTS = {
  NEUTRAL: [
    "What's on your mind right now?",
    "How was your day, in one sentence?",
    "What's something you're looking forward to?",
  ],
  HAPPY: [
    "What's the best thing that happened today?",
    "Who made you smile recently?",
    "What are you most proud of right now?",
  ],
  SAD: [
    "It's okay to feel this way. What's weighing on you?",
    "What's one small thing that could make today 1% better?",
    "If your sadness was a weather pattern, what would it be?",
  ],
  ANXIOUS: [
    "Let's ground ourselves. What are 3 things you can see right now?",
    "What's one thing you can control in this moment?",
    "Take a deep breath. What's the root of this feeling?",
  ],
  CALM: [
    "What does peace feel like in your body right now?",
    "What's a quiet moment you enjoyed today?",
    "How can you carry this stillness into tomorrow?",
  ],
};

export default function InteractivePrompts() {
  const { currentMood } = useMood();
  const [mood, setMood] = useState("NEUTRAL");
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  useEffect(() => {
    // 1. Sync React State with Context Mood on mount
    if (currentMood?.name) {
      setMood(currentMood.name.toUpperCase());
    }

    // 2. Setup the custom event listener typing
    const handleMoodUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ mood?: string }>;
      const newMood = customEvent.detail?.mood?.toUpperCase() || "NEUTRAL";
      if (PROMPTS[newMood as keyof typeof PROMPTS]) {
        setMood(newMood);
        setCurrentPromptIndex(0);
      }
    };
    window.addEventListener("moodUpdate", handleMoodUpdate);
    return () => window.removeEventListener("moodUpdate", handleMoodUpdate);
  }, [currentMood]);

  const activePrompts =
    PROMPTS[mood as keyof typeof PROMPTS] || PROMPTS.NEUTRAL;

  // Auto-cycle prompts every 2.5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPromptIndex((prev) => (prev + 1) % activePrompts.length);
    }, 2500);

    return () => clearInterval(intervalId);
  }, [activePrompts]);

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
        <Sparkles
          className={`w-5 h-5 transition-colors duration-500 ${currentMood?.accent || "text-purple-400"}`}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span
          className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${currentMood?.accent || "text-purple-400"}`}
        >
          Guided Reflection
        </span>

        <AnimatePresence mode="wait">
          <motion.p
            key={`${mood}-${currentPromptIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-lg text-white/90 font-medium leading-relaxed"
          >
            {activePrompts[currentPromptIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex gap-2">
        {activePrompts.map((_, i) => {
          // Map from text accent to background color for indicator dots
          const accentToBg: Record<string, string> = {
            "text-purple-400": "bg-purple-400",
            "text-yellow-400": "bg-yellow-400",
            "text-blue-400": "bg-blue-400",
            "text-orange-400": "bg-orange-400",
            "text-emerald-400": "bg-emerald-400",
            "text-pink-400": "bg-pink-400",
            "text-red-400": "bg-red-400",
            "text-indigo-400": "bg-indigo-400",
            "text-purple-300": "bg-purple-300",
            "text-green-400": "bg-green-400",
          };
          const accentBg =
            currentMood?.accent && accentToBg[currentMood.accent]
              ? accentToBg[currentMood.accent]
              : "bg-purple-400";

          return (
            <button
              key={i}
              onClick={() => setCurrentPromptIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === currentPromptIndex
                  ? `w-8 ${accentBg}`
                  : "w-2 bg-white/10 hover:bg-white/20"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
