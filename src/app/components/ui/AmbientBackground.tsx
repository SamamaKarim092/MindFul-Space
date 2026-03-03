"use client";

import React from "react";
import { useMood } from "@/app/context/MoodContext";
import { motion, AnimatePresence } from "framer-motion";

export default function AmbientBackground() {
  const { currentMood, selectedMoods } = useMood();
  const isMixedMood = selectedMoods.length > 1;

  // Create a unique key for the mood combination
  const moodKey = selectedMoods
    .map((m) => m.name)
    .sort()
    .join("-");

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Base Background with smooth transition */}
      <motion.div
        initial={false}
        animate={{ backgroundColor: getHexForBg(currentMood.baseBg) }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute inset-0"
      />

      <AnimatePresence mode="popLayout">
        <motion.div
          key={moodKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          {isMixedMood ? (
            // Mixed mood: render multiple gradient blobs for each selected mood
            <>
              {selectedMoods.map((mood, index) => {
                const positions = [
                  { top: "-10%", left: "-10%" },
                  { bottom: "-10%", right: "-10%" },
                  { top: "20%", right: "-5%" },
                  { bottom: "20%", left: "-5%" },
                  { top: "50%", left: "50%" },
                ];
                const position = positions[index % positions.length];
                const size =
                  index === 0 ? "60vw" : index === 1 ? "70vw" : "50vw";
                const blur =
                  index === 0 ? "120px" : index === 1 ? "150px" : "100px";
                const opacity = index === 0 ? 0.5 : index === 1 ? 0.4 : 0.3;

                return (
                  <div
                    key={`${mood.name}-${index}`}
                    className={`absolute rounded-full bg-linear-to-br ${mood.gradient1} ${mood.gradient2} animate-pulse`}
                    style={{
                      width: size,
                      height: size,
                      ...position,
                      filter: `blur(${blur})`,
                      opacity: opacity,
                      animationDuration: `${8 + index * 2}s`,
                      animationDelay: `${index * 0.5}s`,
                    }}
                  />
                );
              })}
              {/* Center Mixed Glow */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[40vh] rounded-full opacity-20"
                style={{
                  background: `linear-gradient(to right, ${selectedMoods
                    .map(
                      (m) =>
                        `var(--tw-gradient-stops) ${m.gradient1.replace("from-", "")}`,
                    )
                    .join(", ")})`,
                  filter: "blur(180px)",
                }}
              />
            </>
          ) : (
            // Single mood: original blob layout
            <>
              <div
                className={`absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-linear-to-br ${currentMood.gradient1} blur-[120px] animate-pulse opacity-80`}
                style={{ animationDuration: "8s" }}
              />
              <div
                className={`absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-linear-to-tl ${currentMood.gradient2} blur-[150px] animate-pulse opacity-70`}
                style={{ animationDuration: "12s", animationDelay: "2s" }}
              />
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[40vh] rounded-full bg-linear-to-r ${currentMood.gradient1} to-transparent blur-[180px] opacity-50`}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}

// Helper to map Tailwind classes to Hex for Framer Motion animation
// In a real app, you might store hex codes in the theme object directly
function getHexForBg(bgClass: string): string {
  const mapping: Record<string, string> = {
    "bg-[#130919]": "#130919",
    "bg-[#251b07]": "#251b07",
    "bg-[#070e25]": "#070e25",
    "bg-[#0e0725]": "#0e0725",
    "bg-[#150725]": "#150725",
    "bg-[#250707]": "#250707",
    "bg-[#07250e]": "#07250e",
    "bg-[#250719]": "#250719", // LOVING mood pink background
    "bg-[#2a0404]": "#2a0404", // ANGRY mood
  };
  return mapping[bgClass] || "#130919";
}
