"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Cpu } from "lucide-react";
import { fadeUp } from "./animations";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-32 sm:px-8 lg:px-12 lg:pb-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),transparent_32%),radial-gradient(circle_at_20%_30%,rgba(236,72,153,0.16),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.18),transparent_30%)]" />
      <div className="absolute left-1/2 top-32 h-112 w-md -translate-x-1/2 rounded-full bg-white/10 blur-[140px]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur-xl">
            <Cpu className="h-4 w-4 text-sky-300" />
            Engineering the quiet layer behind mental-health journaling
          </span>
          <h1 className="mt-8 text-balance text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            A journaling product built to make emotion tracking feel thoughtful,
            private, and usable.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
            This project combines full-stack product engineering, workflow
            automation, and a calm interface to help people write, reflect, and
            understand their patterns without turning the experience into a
            sterile analytics tool.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-base font-semibold text-slate-950 transition hover:scale-[1.02] hover:bg-slate-100"
            >
              Explore the product
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="https://github.com/SamamaKarim092/Mental-Health-Sentiment-Journal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/6 px-7 py-4 text-base font-semibold text-white backdrop-blur-xl transition hover:bg-white/10"
            >
              View the repository
            </Link>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-4"
        >
          <div className="rounded-4xl border border-white/10 bg-white/8 p-6 backdrop-blur-2xl shadow-[0_30px_90px_rgba(15,23,42,0.35)]">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
              What the app balances
            </p>
            <div className="mt-5 grid gap-4 text-sm text-slate-200 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-black/10 p-4">
                <p className="text-2xl font-semibold text-white">Journal</p>
                <p className="mt-2 text-slate-400">
                  A place to write without friction.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/10 p-4">
                <p className="text-2xl font-semibold text-white">Analyze</p>
                <p className="mt-2 text-slate-400">
                  Sentiment and trends shaped into usable signals.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/10 p-4">
                <p className="text-2xl font-semibold text-white">Support</p>
                <p className="mt-2 text-slate-400">
                  AI conversation that stays contextual and calm.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-4xl border border-white/10 bg-linear-to-br from-sky-500/18 to-indigo-500/12 p-6 backdrop-blur-xl">
              <p className="text-sm text-slate-300">Verified stack</p>
              <p className="mt-3 text-3xl font-semibold text-white">
                Next.js, Prisma, Supabase, n8n
              </p>
            </div>
            <div className="rounded-4xl border border-white/10 bg-linear-to-br from-emerald-500/18 to-teal-500/12 p-6 backdrop-blur-xl">
              <p className="text-sm text-slate-300">Core principle</p>
              <p className="mt-3 text-3xl font-semibold text-white">
                Intelligence should stay behind the scenes.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
