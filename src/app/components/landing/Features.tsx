"use client";

import { motion } from "framer-motion";
import {
  Brain,
  LockKeyhole,
  Sparkles,
  TrendingUp,
  MessageCircleHeart,
  ShieldCheck,
  Fingerprint,
} from "lucide-react";

export default function Features() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24 sm:py-32">
      {/* Background Noise & Radial Gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-multiply" />
      <div className="absolute top-0 right-1/4 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-blue-400/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-[500px] w-[500px] translate-y-1/3 rounded-full bg-purple-400/20 blur-[100px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header Section */}
        <div className="mb-16 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4 text-purple-500" />
            Mindful Engineering
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
          >
            Everything you need.
            <br /> Nothing you don&apos;t.
          </motion.h2>
        </div>

        {/* Premium Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
          {/* Card 1: AI Insight (Span 2) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="group relative col-span-1 md:col-span-2 overflow-hidden rounded-[2.5rem] bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05),0_0_0_1px_rgba(15,23,42,0.03)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08),0_0_0_1px_rgba(15,23,42,0.05)] transition-all duration-500 p-8 sm:p-10"
          >
            {/* Visual Background */}
            <div className="absolute right-0 top-0 h-full w-2/3 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.15),transparent_60%)]" />

            {/* Mock Journal AI Scanning UI */}
            <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden lg:block w-72 h-44 rounded-2xl bg-white/60 backdrop-blur-2xl border border-purple-100 shadow-2xl p-5 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite]" />
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-purple-600" />
                </div>
                <div className="h-2 w-20 bg-slate-200 rounded-full" />
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-purple-400 rounded-full" />
                </div>
                <div className="h-2 w-4/5 bg-slate-100 rounded-full" />
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-purple-300 rounded-full delay-100" />
                </div>
                <div className="h-2 w-1/2 bg-slate-100 rounded-full" />
              </div>
            </div>

            <div className="relative z-10 flex h-full flex-col justify-between max-w-[60%]">
              <div className="h-14 w-14 rounded-2xl bg-[linear-gradient(135deg,#f3e8ff_0%,#e9d5ff_100%)] flex items-center justify-center border border-purple-200/50 shadow-inner mb-6 transition-transform duration-500 group-hover:scale-110">
                <Brain className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                  AI that reads between the lines
                </h3>
                <p className="text-slate-500 leading-relaxed text-lg font-medium">
                  Write exactly how you think. Our gentle AI analyzes your
                  entries to identify subtle emotional shifts and hidden stress
                  triggers.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Privacy (Span 1) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="group relative col-span-1 overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 sm:p-10 shadow-2xl"
          >
            {/* Dark Mode Grid Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            <div className="absolute top-0 right-0 h-full w-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_70%)]" />

            {/* Glowing Lock Graphic */}
            <div className="absolute top-10 right-8 text-emerald-400/20 group-hover:text-emerald-400/40 transition-colors duration-700">
              <Fingerprint className="h-32 w-32" strokeWidth={1} />
            </div>

            <div className="relative z-10 flex h-full flex-col justify-between text-white">
              <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/10 mb-6 transition-transform duration-500 group-hover:scale-110 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <LockKeyhole className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="mb-2">
                <h3 className="text-2xl font-bold mb-3 tracking-tight">
                  Your private sanctuary
                </h3>
                <p className="text-slate-400 leading-relaxed text-base font-medium">
                  We use bank-level encryption. Your reflections remain
                  completely confidential and entirely yours.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" /> End-to-end encrypted
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Mood Trends (Span 1) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="group relative col-span-1 overflow-hidden rounded-[2.5rem] bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05),0_0_0_1px_rgba(15,23,42,0.03)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08),0_0_0_1px_rgba(15,23,42,0.05)] transition-all duration-500 p-8 sm:p-10"
          >
            <div className="absolute bottom-0 left-0 h-1/2 w-full bg-[linear-gradient(0deg,rgba(56,189,248,0.1)_0%,transparent_100%)]" />

            {/* Mini bar chart UI */}
            <div className="absolute right-6 top-8 flex items-end gap-2 h-16 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
              {[40, 70, 45, 90, 60].map((height, idx) => (
                <motion.div
                  key={idx}
                  initial={{ height: 10 }}
                  whileInView={{ height: `${height}%` }}
                  transition={{
                    duration: 1,
                    delay: 0.1 * idx,
                    ease: "easeOut",
                  }}
                  className="w-3 rounded-t-full bg-sky-400"
                />
              ))}
            </div>

            <div className="relative z-10 flex h-full flex-col justify-end">
              <div className="h-14 w-14 rounded-2xl bg-[linear-gradient(135deg,#e0f2fe_0%,#bae6fd_100%)] flex items-center justify-center border border-sky-200/50 shadow-inner mb-6 transition-transform duration-500 group-hover:-translate-y-2">
                <TrendingUp className="h-6 w-6 text-sky-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                Notice the patterns
              </h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Beautiful, automated charts map your emotional landscape over
                time effortlessly.
              </p>
            </div>
          </motion.div>

          {/* Card 4: Interactive Companion (Span 2) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="group relative col-span-1 md:col-span-2 overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl p-8 sm:p-10 text-white"
          >
            {/* Elegant dark theme mesh background */}
            <div className="absolute inset-0 bg-slate-900" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.3),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.2),transparent_50%)]" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-white/20 to-transparent" />

            {/* Glowing Chat Interaction UI */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 hidden sm:flex flex-col gap-4 w-[380px] pointer-events-none perspective-[1000px] transform-gpu transition-transform duration-700 group-hover:-translate-x-4">
              <div className="self-end max-w-[80%] rounded-2xl rounded-tr-sm bg-white/10 backdrop-blur-xl border border-white/10 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                <div className="h-2 w-24 bg-white/30 rounded-full mb-3" />
                <div className="h-2 w-32 bg-white/20 rounded-full" />
              </div>

              <div className="self-start max-w-[85%] rounded-2xl rounded-tl-sm bg-[linear-gradient(135deg,#3b82f6_0%,#2563eb_100%)] p-4 shadow-[0_10px_30px_rgba(37,99,235,0.3)] border border-blue-400/30 flex gap-3 items-start">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/90">
                    It sounds like you need to rest. Be gentle to yourself
                    today.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex h-full flex-col justify-between max-w-[60%]">
              <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-6 shadow-inner transition-transform duration-500 group-hover:scale-110">
                <MessageCircleHeart className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                  Talk things through
                </h3>
                <p className="text-slate-300 leading-relaxed text-lg font-medium">
                  Sometimes you need more than a blank page. Chat securely with
                  an empathetic AI coach that helps reframe your thoughts and
                  offers gentle perspective.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Custom Keyframes for Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `,
        }}
      />
    </section>
  );
}
