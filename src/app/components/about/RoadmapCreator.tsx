"use client";

import { motion } from "framer-motion";
import { HeartHandshake } from "lucide-react";
import { fadeUp } from "./animations";

const roadmap = [
  "AI coach prompts that respond while the user writes.",
  "Ambient mood-aware backgrounds across the dashboard.",
  "Deeper analytics like theme extraction and memory surfacing.",
  "Proactive reports and gentle support nudges when trends dip.",
];

export default function RoadmapCreator() {
  return (
    <section className="px-6 pb-24 sm:px-8 lg:px-12 lg:pb-32">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.75 }}
          className="rounded-[2.5rem] border border-slate-900/10 bg-white p-8 shadow-[0_30px_100px_rgba(15,23,42,0.12)] sm:p-10"
        >
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
            Roadmap
          </p>
          <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-slate-950">
            The next version of the project pushes toward more responsive, more
            ambient, and more supportive experiences.
          </h2>
          <div className="mt-8 grid gap-4">
            {roadmap.map((item, index) => (
              <motion.div
                key={item}
                {...fadeUp}
                transition={{ duration: 0.6, delay: index * 0.06 }}
                className="rounded-[1.75rem] border border-slate-900/10 bg-[#f8f4ed] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-slate-950 px-2 py-1 text-xs font-semibold text-white">
                    0{index + 1}
                  </div>
                  <p className="text-base leading-7 text-slate-700">{item}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.75, delay: 0.08 }}
          className="rounded-[2.5rem] bg-slate-950 p-8 text-white shadow-[0_34px_120px_rgba(15,23,42,0.22)] sm:p-10"
        >
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
            Creator story
          </p>
          <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight">
            The project is trying to prove that serious engineering can also
            feel humane.
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Instead of building a dashboard that only measures emotion, this
            product aims to build a calmer relationship with reflection. The
            technical stack matters because it determines whether that
            experience feels reliable, private, and worth returning to.
          </p>
          <div className="mt-8 rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/8 p-3">
                <HeartHandshake className="h-5 w-5 text-emerald-300" />
              </div>
              <p className="text-base leading-7 text-slate-300">
                The goal is not to overwhelm users with AI. It is to design a
                product where intelligence supports reflection, and where the
                interface always feels more like a companion than a machine.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
