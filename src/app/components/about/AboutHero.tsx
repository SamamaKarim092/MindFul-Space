"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Waves } from "lucide-react";
import { staggerContainer, elegantReveal, gentleSlide } from "./animations";
import { useEffect, useRef } from "react";

export default function AboutHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5; // Slow down the video for a calm effect
    }
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24 sm:px-8 lg:px-12">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src="/istockphoto-1365468767-640_adpp_is.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full scale-110 object-cover opacity-60 blur-[10px]"
        />
        {/* Soft dark overlays to ensure text remains readable */}
        <div className="absolute inset-0 bg-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-[#131c2c]/70" />
      </div>

      {/* 
        To move this block UP or DOWN, adjust the `-mt-20` on this div.
        -mt-20 moves it UP. Increase the number (e.g., -mt-32) to move it further up.
        Use mt-10 (positive) to move it DOWN.
      */}
      <div className="relative z-10 mx-auto max-w-4xl text-center mt-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          className="flex flex-col items-center"
        >
          <motion.span 
            variants={elegantReveal}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur-xl"
          >
            <Waves className="h-4 w-4 text-sky-300" />
            Engineering peace of mind
          </motion.span>
          
          <motion.h1 
            variants={elegantReveal}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            A quiet place for your thoughts.
          </motion.h1>
          
          <motion.p 
            variants={gentleSlide}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mt-8 max-w-2xl text-lg leading-8 text-slate-300"
          >
            MindFul-Space is built to help you reflect, understand your patterns, and find clarity without the noise. 
            We combine reflective journaling with private, calming, and intelligent insights.
          </motion.p>
          
          <motion.div 
            variants={gentleSlide}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-slate-950 transition hover:scale-[1.02] hover:bg-slate-100"
            >
              Start Journaling
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="https://github.com/SamamaKarim092/Mental-Health-Sentiment-Journal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-xl transition hover:bg-white/10"
            >
              View Repository
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
