"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const applyPlaybackRate = () => {
      video.playbackRate = 0.6;
    };

    applyPlaybackRate();
    video.addEventListener("loadeddata", applyPlaybackRate);

    return () => {
      video.removeEventListener("loadeddata", applyPlaybackRate);
    };
  }, []);

  return (
    <section className="sticky top-0 h-screen w-full isolate flex items-center justify-center overflow-hidden bg-[#f6f1eb]">
      <motion.div
        initial={{
          width: "0%",
          height: "0%",
          borderRadius: "100vw",
          opacity: 0,
        }}
        animate={{
          width: "100%",
          height: "100%",
          borderRadius: "0px",
          opacity: 1,
        }}
        transition={{
          duration: 1.4,
          ease: [0.76, 0, 0.24, 1],
        }}
        className="relative overflow-hidden w-full h-full"
      >
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            className="h-full w-full object-cover motion-reduce:hidden"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source src="/131999-751915336_medium.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-[6%] top-[12%] h-56 w-56 rounded-full bg-yellow-400/40 blur-3xl" />
            <div className="absolute right-[10%] top-[18%] h-72 w-72 rounded-full bg-pink-400/35 blur-3xl" />
            <div className="absolute bottom-[28%] left-[14%] h-64 w-64 rounded-full bg-blue-400/35 blur-3xl" />
            <div className="absolute bottom-[18%] right-[18%] h-60 w-60 rounded-full bg-emerald-400/35 blur-3xl" />
            <div className="absolute left-1/2 top-[16%] h-80 w-80 -translate-x-1/2 rounded-full bg-purple-400/35 blur-3xl" />
            <div className="absolute bottom-[34%] right-[36%] h-40 w-40 rounded-full bg-orange-400/35 blur-3xl" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.75),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(236,72,153,0.22),transparent_25%),linear-gradient(180deg,rgba(246,241,235,0.18)_0%,rgba(246,241,235,0.62)_38%,rgba(246,241,235,0.94)_72%,#f6f1eb_100%)]" />
          <div className="absolute inset-0 bg-slate-950/14" />
        </div>

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center lg:px-10 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 2.0, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto flex max-w-4xl flex-col items-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_16px_40px_rgba(255,255,255,0.24)] backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              Your mental health journal
            </span>

            <h1 className="mt-8 text-balance text-6xl font-semibold tracking-tight text-slate-950 sm:text-7xl lg:text-[7.5rem] lg:leading-[0.9]">
              Mindful Space
            </h1>

            <p className="mt-8 max-w-2xl text-balance text-lg leading-8 text-slate-800 sm:text-xl">
              Quietly translating your thoughts into useful clarity. Turn
              private reflection into emotional insight with guided journaling
              and gentle AI mood analysis.
            </p>

            <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-slate-950/20 transition-all hover:scale-105 hover:bg-slate-800"
              >
                Start your journey
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-900/10 bg-white/75 px-8 py-4 text-base font-semibold text-slate-900 shadow-xl shadow-slate-200/20 backdrop-blur-xl transition-all hover:scale-105 hover:border-slate-900/20 hover:bg-white"
              >
                See how it works
                <PlayCircle className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-[#f6f1eb] z-20" />
    </section>
  );
}
