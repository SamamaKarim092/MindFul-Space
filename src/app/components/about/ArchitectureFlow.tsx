"use client";

import { motion } from "framer-motion";
import { fadeUp } from "./animations";

const architectureFlow = [
  {
    title: "Write an entry",
    description:
      "A user creates a journal entry with title, content, mood labels, and optional context that should influence later support.",
  },
  {
    title: "Store it safely",
    description:
      "Next.js route handlers and Prisma persist data into PostgreSQL while keeping records scoped to the authenticated user.",
  },
  {
    title: "Trigger intelligence",
    description:
      "n8n webhooks handle sentiment analysis, suggestions, and chat workflows so the AI layer stays decoupled from the app shell.",
  },
  {
    title: "Return usable insight",
    description:
      "Scores, mood hints, dashboards, and contextual chat are surfaced back into the UI in a way that feels supportive instead of clinical.",
  },
];

export default function ArchitectureFlow() {
  return (
    <section className="px-6 py-24 sm:px-8 lg:px-12 bg-[#F6F1EB]">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.75 }}
          className="sticky top-24 rounded-[3rem] bg-[#060B19] p-10 text-white shadow-[0_34px_120px_rgba(15,23,42,0.3)] sm:p-14"
        >
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium tracking-[0.15em] text-slate-300 uppercase mb-8">
            Architecture story
          </div>
          <h2 className="text-balance text-4xl sm:text-5xl font-semibold leading-[1.15] tracking-tight">
            The system is designed so the writing experience stays simple, while
            the intelligence layer stays modular.
          </h2>
          <p className="mt-8 text-lg sm:text-xl leading-relaxed text-slate-300/90 font-light">
            That matters here. Mental-health products should not feel slow,
            noisy, or operationally fragile. The architecture keeps the UI calm
            while workflows do the heavier work in the background.
          </p>
        </motion.div>

        <div className="relative grid gap-8 lg:gap-12 lg:py-12">
          {/* Subtle connecting vertical timeline line for larger screens */}
          <div className="absolute left-[27px] top-12 bottom-12 w-px bg-slate-900/10 hidden md:block" />

          {architectureFlow.map((step, index) => (
            <motion.div
              key={step.title}
              {...fadeUp}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="relative flex gap-6 md:gap-10"
            >
              <div className="hidden md:flex relative z-10 shrink-0 h-14 w-14 items-center justify-center rounded-full bg-white border border-slate-200 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                <span className="text-sm font-bold text-slate-900 tracking-wider">
                  0{index + 1}
                </span>
              </div>

              <div className="w-full flex-col justify-center rounded-[2.5rem] border border-slate-200/80 bg-white/70 backdrop-blur-xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(15,23,42,0.05)] transition-all duration-300 hover:bg-white hover:shadow-[0_30px_80px_rgba(15,23,42,0.1)]">
                <p className="md:hidden mb-4 text-xs font-bold uppercase tracking-widest text-indigo-500">
                  Step 0{index + 1}
                </p>
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
