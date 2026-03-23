"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { fadeUp } from "./animations";

export default function AboutCTA() {
  return (
    <section className="px-6 pb-24 sm:px-8 lg:px-12 lg:pb-28">
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-7xl overflow-hidden rounded-[2.75rem] border border-slate-900/10 bg-[linear-gradient(145deg,#fff8f1_0%,#f5efe6_42%,#efe6db_100%)] p-8 shadow-[0_34px_120px_rgba(15,23,42,0.12)] sm:p-12"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              Built for thoughtful iteration
            </span>
            <h2 className="mt-6 text-balance text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
              Explore the product, inspect the stack, and keep building the next
              version with the same calm visual language.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              The about page is only useful if it reflects the real product.
              This one is grounded in the current codebase, the current roadmap,
              and the experience quality already established on the landing
              page.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-4 text-base font-semibold text-white transition hover:bg-slate-800"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-900/10 bg-white/85 px-7 py-4 text-base font-semibold text-slate-900 transition hover:bg-white"
            >
              Back to home
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
