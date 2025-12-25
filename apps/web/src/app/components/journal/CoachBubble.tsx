"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Sparkles, X } from "lucide-react";
import { useMood } from "@/app/context/MoodContext";

interface CoachBubbleProps {
  suggestion: string;
  emotion: string;
  onTalkClick: () => void;
  onDismiss: () => void;
  isVisible: boolean;
  isLoading?: boolean;
}

export default function CoachBubble({
  suggestion,
  emotion,
  onTalkClick,
  onDismiss,
  isVisible,
  isLoading = false,
}: CoachBubbleProps) {
  const { currentMood } = useMood();

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm"
      >
        <div className="relative bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-5 shadow-2xl shadow-purple-500/20">
          {/* Close button */}
          <button
            onClick={onDismiss}
            className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* AI Avatar */}
          <div className="flex items-start gap-4">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>

            <div className="flex-1 pt-1">
              {/* Typing indicator or message */}
              {isLoading ? (
                <div className="flex gap-1.5">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                </div>
              ) : (
                <>
                  <p className="text-white/90 text-sm leading-relaxed mb-4 pr-6">
                    {suggestion}
                  </p>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onTalkClick}
                    className={`w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all shadow-lg ${
                      currentMood.accent.replace('text-', 'bg-').replace('-400', '-500')
                    } hover:brightness-110`}
                    style={{ 
                      background: 'linear-gradient(135deg, rgb(168 85 247 / 0.9), rgb(236 72 153 / 0.9))'
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    💬 Wanna talk about it?
                  </motion.button>

                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Your entry will be saved automatically
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Decorative gradient border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 pointer-events-none" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
