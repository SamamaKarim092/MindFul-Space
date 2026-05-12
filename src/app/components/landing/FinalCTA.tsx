"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Twitter,
  Github,
  MessageSquare,
  Instagram,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function FinalCTA() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const applyPlaybackRate = () => {
      video.playbackRate = 0.5; // Calming, slow ambient background
    };

    video.addEventListener("loadeddata", applyPlaybackRate);
    return () => {
      video.removeEventListener("loadeddata", applyPlaybackRate);
    };
  }, []);

  return (
    <section className="relative h-screen w-full isolate flex flex-col justify-end overflow-hidden pb-8  bg-[#0f172a]">
      {/* Background Video */}
      <div className="absolute inset-0 -z-20 bg-[#0f172a]">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-[0.35] mix-blend-screen"
        >
          <source src="/131999-751915336_medium.mp4" type="video/mp4" />
        </video>
        {/* Gradient Overlay to fade smoothly */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10 flex flex-col items-center text-center justify-end h-full pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-5 py-2 text-sm font-medium text-slate-300 shadow-sm mb-8">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            Your Mindful Journey Awaits
          </span>

          <h2 className="text-balance text-5xl font-semibold tracking-tight text-white sm:text-7xl lg:text-[5.5rem] leading-[1.05] drop-shadow-xl">
            Clarity feels calm.
            <br />
            <span className="text-emerald-100/70 italic font-light font-serif">
              Start today.
            </span>
          </h2>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 drop-shadow-md">
            A private space for your thoughts, backed by subtle intelligence.
            Let the noise fade away while you focus on what truly
            matters—understanding your inner world.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link
              href="/signup"
              className="group relative inline-flex items-center justify-center gap-2 rounded-[2rem] bg-white px-8 py-4 text-lg font-medium text-slate-950 shadow-[0_10px_40px_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-105 hover:bg-slate-50 hover:shadow-[0_20px_60px_rgba(255,255,255,0.25)] overflow-hidden"
            >
              Start 14-day free trial
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-[2rem] border border-white/20 bg-black/20 backdrop-blur-md px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:bg-black/40 hover:border-white/40"
            >
              Log into account
            </Link>
          </div>
        </motion.div>

        {/* Spacer for bottom */}
        <div className="flex-1 min-h-[4rem]" />

        {/* Footer Bottom Links & Socials */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 1 }}
          className="w-full border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6"
        >
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/Logo.png"
              alt="MindJournal Logo"
              className="h-8 object-contain"
            />
            <img
              src="/Logo%20text.png"
              alt="MindJournal Text"
              className="h-5 object-contain mt-1"
            />
          </Link>

          <div className="flex gap-6 text-sm text-slate-400 font-medium">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <Link href="#" className="hover:text-white transition-colors">
              <Twitter strokeWidth={1.5} className="h-5 w-5" />
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              <Github strokeWidth={1.5} className="h-5 w-5" />
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              <MessageSquare strokeWidth={1.5} className="h-5 w-5" />
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              <Instagram strokeWidth={1.5} className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
