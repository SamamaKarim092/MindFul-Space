"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function JournalCompanion() {
  const [mood, setMood] = useState("NEUTRAL");
  const [isTyping, setIsTyping] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Pre-generate random values for the "float" animation to avoid hydration mismatch
  const floatValues = useMemo(
    () => ({
      y: [0, -10, 0],
      rotate: [0, 2, -2, 0],
      scale: [1, 1.02, 0.98, 1],
    }),
    [],
  );

  useEffect(() => {
    const handleMoodUpdate = (e: any) => {
      setMood(e.detail.mood?.toUpperCase() || "NEUTRAL");
    };

    let typingTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleTyping = () => {
      setIsTyping(true);
      if (typingTimeout) clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => setIsTyping(false), 1000);
    };

    const handleMilestone = () => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    };

    const handleWordCountUpdate = (e: any) => {
      if (e.detail.count > 0 && e.detail.count % 50 === 0) handleMilestone();
    };

    window.addEventListener("moodUpdate", handleMoodUpdate);
    window.addEventListener("wordCountUpdate", handleWordCountUpdate);

    return () => {
      window.removeEventListener("moodUpdate", handleMoodUpdate);
      window.removeEventListener("wordCountUpdate", handleWordCountUpdate);
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, []);

  const getCompanionColor = () => {
    switch (mood) {
      case "HAPPY":
        return "from-yellow-400 to-orange-500";
      case "SAD":
        return "from-blue-500 to-indigo-600";
      case "ANXIOUS":
        return "from-purple-400 to-violet-600";
      case "ENERGETIC":
        return "from-orange-500 to-red-600";
      case "CALM":
        return "from-emerald-400 to-teal-600";
      case "GRATEFUL":
        return "from-pink-400 to-rose-500";
      case "ANGRY":
        return "from-red-600 to-rose-700";
      default:
        return "from-purple-500 to-blue-600";
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Simple CSS Confetti could go here */}
            <div className="text-2xl absolute -top-10 left-0 animate-bounce">
              ✨
            </div>
            <div className="text-2xl absolute -top-12 right-0 animate-bounce delay-100">
              🎉
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heart decorations for Grateful - above the emoji */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: mood === "GRATEFUL" ? 1 : 0,
          scale: mood === "GRATEFUL" ? [1, 1.2, 1] : 1,
          y: mood === "GRATEFUL" ? [0, -5, 0] : 0,
        }}
        transition={{
          duration: 1.5,
          repeat: mood === "GRATEFUL" ? Infinity : 0,
        }}
        className="absolute -top-6 left-4 text-lg pointer-events-none z-10"
      >
        💕
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: mood === "GRATEFUL" ? 1 : 0,
          scale: mood === "GRATEFUL" ? [1, 1.3, 1] : 1,
          y: mood === "GRATEFUL" ? [0, -8, 0] : 0,
        }}
        transition={{
          duration: 1.5,
          repeat: mood === "GRATEFUL" ? Infinity : 0,
          delay: 0.5,
        }}
        className="absolute -top-4 right-6 text-lg pointer-events-none z-10"
      >
        💖
      </motion.div>

      {/* Fire decoration for Angry */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: mood === "ANGRY" ? 1 : 0,
          y: mood === "ANGRY" ? [0, -6, 0] : 0,
          scale: mood === "ANGRY" ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 0.8,
          repeat: mood === "ANGRY" ? Infinity : 0,
          delay: 0.3,
        }}
        className="absolute -top-4 right-4 text-lg pointer-events-none z-10"
      >
        🔥
      </motion.div>

      <motion.div
        animate={{
          y: floatValues.y,
          rotate: isTyping ? [0, -5, 5, 0] : floatValues.rotate,
          scale: isTyping ? 1.1 : floatValues.scale,
        }}
        transition={{
          duration: isTyping ? 0.3 : 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`w-32 h-32 rounded-full bg-gradient-to-br ${getCompanionColor()} shadow-2xl shadow-purple-500/20 flex items-center justify-center relative overflow-hidden`}
      >
        {/* Face Container */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Eyes Container */}
          <div className="absolute top-[35%] w-full flex justify-center gap-6">
            {/* Left Eye */}
            <motion.div
              initial={false}
              animate={mood}
              variants={{
                NEUTRAL: {
                  height: 8,
                  width: 8,
                  borderRadius: "50%",
                  scaleY: 1,
                },
                HAPPY: {
                  height: 8,
                  width: 8,
                  borderRadius: "50%",
                  scaleY: 1,
                  y: -2,
                },
                SAD: {
                  height: 8,
                  width: 8,
                  borderRadius: "50%",
                  scaleY: 1,
                  rotate: -15,
                },
                ANXIOUS: {
                  height: 10,
                  width: 10,
                  borderRadius: "50%",
                  scaleY: 1,
                },
                ENERGETIC: {
                  height: 12,
                  width: 12,
                  borderRadius: "50%",
                  scaleY: 1,
                  y: -2,
                },
                CALM: {
                  height: 3,
                  width: 10,
                  borderRadius: "10px",
                  scaleY: 0.5,
                  rotate: 0,
                }, // Closed/Relaxed
                GRATEFUL: {
                  height: 6,
                  width: 8,
                  borderRadius: "50% 50% 50% 50%",
                  scaleY: 0.7,
                  y: -1,
                  rotate: -20,
                }, // Heart-like squinted eyes
                ANGRY: {
                  height: 4,
                  width: 14,
                  borderRadius: "3px",
                  scaleY: 1,
                  y: 2,
                  rotate: 25,
                }, // Sharp, flat slanted angry eye
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white"
            />
            {/* Right Eye */}
            <motion.div
              initial={false}
              animate={mood}
              variants={{
                NEUTRAL: {
                  height: 8,
                  width: 8,
                  borderRadius: "50%",
                  scaleY: 1,
                },
                HAPPY: {
                  height: 8,
                  width: 8,
                  borderRadius: "50%",
                  scaleY: 1,
                  y: -2,
                },
                SAD: {
                  height: 8,
                  width: 8,
                  borderRadius: "50%",
                  scaleY: 1,
                  rotate: 15,
                },
                ANXIOUS: {
                  height: 10,
                  width: 10,
                  borderRadius: "50%",
                  scaleY: 1,
                },
                ENERGETIC: {
                  height: 12,
                  width: 12,
                  borderRadius: "50%",
                  scaleY: 1,
                  y: -2,
                },
                CALM: {
                  height: 3,
                  width: 10,
                  borderRadius: "10px",
                  scaleY: 0.5,
                  rotate: 0,
                }, // Closed/Relaxed
                GRATEFUL: {
                  height: 6,
                  width: 8,
                  borderRadius: "50% 50% 50% 50%",
                  scaleY: 0.7,
                  y: -1,
                  rotate: 20,
                }, // Heart-like squinted eyes
                ANGRY: {
                  height: 4,
                  width: 14,
                  borderRadius: "3px",
                  scaleY: 1,
                  y: 2,
                  rotate: -25,
                }, // Sharp, flat slanted angry eye
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white"
            />
          </div>

          {/* Cheeks (for Grateful/Happy) - Enhanced for Grateful */}
          <motion.div
            animate={{
              opacity: mood === "GRATEFUL" ? 0.6 : mood === "HAPPY" ? 0.4 : 0,
              scale: mood === "GRATEFUL" ? 1.3 : 1,
            }}
            className="absolute top-[45%] w-full flex justify-center gap-10 pointer-events-none"
          >
            <div className="w-3 h-2 rounded-full bg-pink-300 blur-sm" />
            <div className="w-3 h-2 rounded-full bg-pink-300 blur-sm" />
          </motion.div>

          {/* Mouth */}
          <motion.div
            initial={false}
            animate={mood}
            variants={{
              NEUTRAL: {
                width: 20,
                height: 4,
                borderRadius: "4px",
                y: 20,
                rotate: 0,
              },
              HAPPY: {
                width: 24,
                height: 12,
                borderRadius: "0 0 12px 12px",
                y: 20,
                rotate: 0,
              },
              SAD: {
                width: 20,
                height: 8,
                borderRadius: "12px 12px 0 0",
                y: 24,
                rotate: 0,
              },
              ANXIOUS: {
                width: 10,
                height: 6,
                borderRadius: "50%",
                y: 22,
                rotate: 0,
                scale: [1, 1.2, 1], // Nervous breathing effect
                transition: { repeat: Infinity, duration: 1 },
              },
              ENERGETIC: {
                width: 28,
                height: 14,
                borderRadius: "0 0 14px 14px",
                y: 20,
                rotate: -5,
              },
              CALM: {
                width: 18,
                height: 6,
                borderRadius: "0 0 10px 10px",
                y: 22,
                rotate: 0,
              },
              GRATEFUL: {
                width: 26,
                height: 8,
                borderRadius: "0 0 14px 14px",
                y: 18,
                rotate: 0, // Wider, gentler smile
              },
              ANGRY: {
                width: 24,
                height: 6,
                borderRadius: "2px",
                y: 24,
                rotate: 0, // Gritted teeth, flat
                x: [-1, 1, -1, 1, 0], // Trembling mouth
                transition: {
                  repeat: Infinity,
                  duration: 0.5,
                  repeatType: "mirror",
                },
              },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute bg-white/90"
          />

          {/* Anime Anger Vein on Forehead */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: mood === "ANGRY" ? 1 : 0,
              scale: mood === "ANGRY" ? [1, 1.2, 1] : 1,
              rotate: mood === "ANGRY" ? [0, 5, -5, 0] : 0,
            }}
            transition={{
              duration: 0.6,
              repeat: mood === "ANGRY" ? Infinity : 0,
            }}
            className="absolute top-[1%] left-[15%] text-2xl pointer-events-none drop-shadow-[0_0_8px_rgba(255,255,255,1)]"
            style={{ textShadow: "0 0 4px white, 0 0 10px white" }}
          >
            💢
          </motion.div>
        </div>

        {/* Inner Glow */}
        <div className="absolute inset-0 bg-white/10 mix-blend-overlay pointer-events-none" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-xs text-white/70 font-medium"
      >
        {isTyping
          ? "Listening closely..."
          : mood === "NEUTRAL"
            ? "How are you feeling?"
            : `Feeling ${mood.toLowerCase()}?`}
      </motion.div>
    </div>
  );
}
