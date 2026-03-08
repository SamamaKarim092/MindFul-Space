"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Heart,
  Shield,
  Activity,
  CalendarDays,
  Search,
  Mic,
  Plus,
} from "lucide-react";

export default function AppPreview() {
  return (
    <section className="relative overflow-hidden bg-[#f6f1eb] pb-24 pt-16 sm:pb-32">
      {/* Background gradients to merge with Hero */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f6f1eb] via-white/50 to-[#f6f1eb]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* The Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="rounded-[2.5rem] border border-slate-900/10 bg-white/40 p-2 sm:p-4 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
            <div className="rounded-[2rem] border border-slate-900/5 bg-white shadow-sm overflow-hidden">
              {/* App Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Mindful Space
                  </h3>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-500">
                  <span className="text-slate-900">Journal</span>
                  <span>Insights</span>
                  <span>Companion</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="h-9 w-9 rounded-full bg-slate-200" />
                </div>
              </div>

              {/* App Body */}
              <div className="grid md:grid-cols-[1fr_320px] h-[500px] sm:h-[600px] bg-slate-50/50">
                {/* Main Content Area */}
                <div className="p-6 sm:p-8 flex flex-col">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h4 className="text-2xl font-semibold text-slate-900">
                        Good morning, Sarah
                      </h4>
                      <p className="text-slate-500">
                        How are you feeling today?
                      </p>
                    </div>
                    <button className="hidden sm:flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-md">
                      <Plus className="h-4 w-4" /> New Entry
                    </button>
                  </div>

                  {/* Editor Simulation */}
                  <div className="flex-1 rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col">
                    <p className="text-slate-400 text-lg">
                      I woke up feeling...
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="flex gap-2">
                        <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-50 text-slate-400">
                          <Mic className="h-5 w-5" />
                        </button>
                      </div>
                      <button className="rounded-full bg-slate-900 px-6 py-2 text-sm font-medium text-white">
                        Save
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="hidden md:flex flex-col gap-6 border-l border-slate-100 bg-white p-6">
                  {/* Mood Chart Mini */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium text-slate-900">Mood Trend</h5>
                      <Activity className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="h-32 rounded-xl bg-slate-50 border border-slate-100 flex items-end justify-between px-4 pb-4 pt-8 gap-2">
                      {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                        <div
                          key={i}
                          className="w-full bg-emerald-400 rounded-t-sm opacity-80"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* AI Insight Mini */}
                  <div className="rounded-2xl bg-[linear-gradient(160deg,#fff8f4_0%,#f5f3ff_100%)] p-5 border border-purple-100/50">
                    <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 mb-2">
                      AI Insight
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      You&apos;ve been experiencing higher energy levels after
                      your morning walks. Keep it up!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative glowing blobs behind the mockup */}
          <div className="absolute -left-10 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-purple-400/20 blur-3xl mix-blend-multiply -z-10" />
          <div className="absolute -right-10 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-emerald-400/20 blur-3xl mix-blend-multiply -z-10" />
        </motion.div>

        {/* The Philosophy Section (Core Pillars) */}
        <div className="mx-auto mt-32 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
          >
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-5xl tracking-tight">
              Your mind has a lot to say.
              <br className="hidden sm:block" /> We just help you listen.
            </h2>
            <p className="mt-6 text-lg text-slate-600 leading-8 max-w-2xl mx-auto">
              We built Mindful Space not to be another task on your to-do list,
              but to be a quiet sanctuary where you can truly untangle your
              thoughts.
            </p>
          </motion.div>

          <div className="mt-20 grid gap-10 sm:grid-cols-3 text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center sm:items-start text-center sm:text-left"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100">
                <Brain className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">
                Mental Clarity
              </h3>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Write freely and let our gentle AI help you find patterns in
                your thoughts that you might have missed.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center sm:items-start text-center sm:text-left"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100">
                <Shield className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">
                Total Privacy
              </h3>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Your entries belong to you. We use enterprise-grade security to
                ensure your thoughts remain a private sanctuary.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center sm:items-start text-center sm:text-left"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100">
                <CalendarDays className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">
                Daily Growth
              </h3>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Watch your emotional landscape evolve over time with beautiful,
                easy-to-read mood trends and weekly insights.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
