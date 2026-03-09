"use client";

import { motion } from "framer-motion";
import { Database, Globe, Layers, Sparkles, Workflow, Zap } from "lucide-react";
import { fadeUp } from "./animations";

const stackCards = [
  {
    title: "Next.js 16 + React 19",
    role: "Product surface",
    description:
      "The app uses the App Router for a cohesive full-stack structure and a fast UI that feels native across auth, journaling, and dashboard flows.",
    benefit:
      "Fewer boundaries between frontend and backend means faster product iteration.",
    icon: Globe,
    tones: "from-slate-950 to-slate-800",
    text: "text-white",
  },
  {
    title: "Tailwind CSS 4 + Framer Motion",
    role: "Experience layer",
    description:
      "The visual system is built for fast experimentation, premium layout control, and motion that supports the emotional tone instead of distracting from it.",
    benefit:
      "Design stays expressive, calm, and consistent as the product evolves.",
    icon: Sparkles,
    tones: "from-[#fff8ef] to-[#efe4d5]",
    text: "text-slate-950",
  },
  {
    title: "Supabase Auth + Prisma + PostgreSQL",
    role: "Trust and data integrity",
    description:
      "Authentication, relational data, and typed database access are all aligned around secure user-specific journaling and long-term product reliability.",
    benefit:
      "Private data remains scoped correctly and the backend stays maintainable.",
    icon: Database,
    tones: "from-emerald-500/90 to-teal-600/90",
    text: "text-white",
  },
  {
    title: "n8n workflows + AI inference",
    role: "Automation and intelligence",
    description:
      "Sentiment analysis, mood suggestions, and chat responses are separated into workflows so intelligence can grow without making the app itself brittle.",
    benefit:
      "AI remains flexible while the core product stays fast and stable.",
    icon: Workflow,
    tones: "from-[#1e3a8a] to-[#312e81]",
    text: "text-white",
  },
  {
    title: "SWR + API routes",
    role: "Data delivery",
    description:
      "SWR keeps journal, chat, and dashboard data fresh with a simple client-side model built on Next.js route handlers.",
    benefit:
      "Users see responsive data without heavyweight state-management overhead.",
    icon: Zap,
    tones: "from-amber-300 to-orange-300",
    text: "text-slate-950",
  },
  {
    title: "Recharts + dashboard widgets",
    role: "Meaningful feedback",
    description:
      "Trend views and summary widgets make emotional patterns visible instead of leaving journaling as disconnected one-off moments.",
    benefit:
      "The product helps users notice progress, cycles, and signals over time.",
    icon: Layers,
    tones: "from-fuchsia-500/90 to-pink-500/90",
    text: "text-white",
  },
];

export default function StackExplainer() {
  return (
    <section className="px-6 pb-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.75 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <Database className="h-4 w-4 text-emerald-600" />
            Why this stack was chosen
          </span>
          <h2 className="mt-6 text-balance text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
            Every technology choice is there to improve trust, speed, iteration,
            or emotional clarity.
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {stackCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.article
                key={card.title}
                {...fadeUp}
                transition={{ duration: 0.7, delay: index * 0.05 }}
                className={`rounded-4xl border border-slate-900/10 bg-linear-to-br ${card.tones} p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ${card.text}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.2em] opacity-70">
                      {card.role}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold leading-tight">
                      {card.title}
                    </h3>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-xl">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-6 text-base leading-7 opacity-85">
                  {card.description}
                </p>
                <div className="mt-6 rounded-3xl border border-white/12 bg-black/10 p-4 text-sm leading-6 backdrop-blur-xl">
                  {card.benefit}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
