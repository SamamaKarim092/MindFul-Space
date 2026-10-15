"use client";

import { useState, useEffect } from "react";
import { Cloud, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isBackendWarm, markBackendWarm } from "@/lib/api/warm-tracker";

export default function BackendColdStartBanner() {
  const [status, setStatus] = useState<"idle" | "slow" | "ready">("idle");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleColdStartEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ state: "slow" | "ready" }>;
      const nextState = customEvent.detail?.state;

      // Never show the cold start dialog if the backend is already warm
      if (nextState === "slow") {
        if (isBackendWarm()) return;
        setDismissed(false);
        setStatus("slow");
      } else if (nextState === "ready") {
        markBackendWarm();
        setStatus("ready");
        const timer = setTimeout(() => {
          setStatus("idle");
        }, 2800);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener("render-backend-cold-start", handleColdStartEvent);
    return () => {
      window.removeEventListener("render-backend-cold-start", handleColdStartEvent);
    };
  }, []);

  if (status === "idle" || dismissed || (status === "slow" && isBackendWarm())) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -80, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -80, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-lg pointer-events-auto"
      >
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 dark:border-amber-400/20 bg-white/95 dark:bg-[#140b1e]/95 backdrop-blur-2xl p-4 shadow-2xl shadow-amber-500/10 text-slate-800 dark:text-white">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
              {status === "ready" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <Cloud className="w-5 h-5 animate-pulse text-amber-500" />
              )}
            </div>

            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold tracking-tight">
                  {status === "ready"
                    ? "Backend Connected!"
                    : "Waking Up Cloud Backend..."}
                </h4>
                {status === "slow" && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300">
                    Render Cold Start
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-gray-300 mt-1 leading-relaxed">
                {status === "ready"
                  ? "Render server is active and ready. Your data is synchronized."
                  : "Render's free-tier spins down when idle and takes ~30–50s to boot on the first visit. Thank you for your patience! ✨"}
              </p>
            </div>

            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-500/10 transition-colors shrink-0"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Animated bottom progress bar for slow state */}
          {status === "slow" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 via-purple-500 to-pink-500 w-1/3 animate-[indeterminate_2s_infinite_linear]" />
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
