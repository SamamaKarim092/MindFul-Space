"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "0 1",
    title: "Your mind has a lot to say.\nWe just help you listen.",
    desc: "A secure, quiet space for you to untangle your thoughts and navigate your emotions without noise.",
    bg: "bg-[#fef3c7]",
  },
  {
    num: "0 2",
    title: "A private sanctuary for your raw, unedited thoughts.",
    desc: "Your data is encrypted and purely yours. Write freely, knowing you have complete privacy.",
    bg: "bg-[#dcfce7]",
  },
  {
    num: "0 3",
    title: "See your emotional landscape evolve over time.",
    desc: "Notice patterns in your mood, energy, and triggers through beautiful, automated insights.",
    bg: "bg-[#fae8ff]",
  },
];

function StepVisual({ i }: { i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="absolute inset-0 flex items-center justify-center p-10"
    >
      {i === 0 && (
        <div className="relative flex h-full w-full max-w-lg items-center justify-center">
          <div className="absolute h-96 w-96 rounded-full bg-amber-400 blur-3xl opacity-30 mix-blend-multiply animate-pulse duration-1000" />
          <motion.div
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-64 w-64 rounded-full bg-white/40 shadow-[0_0_80px_rgba(245,158,11,0.4)] backdrop-blur-2xl border border-white/60 flex items-center justify-center"
          >
            <div className="h-32 w-32 rounded-full bg-white/60 blur-md" />
          </motion.div>
        </div>
      )}
      {i === 1 && (
        <div className="relative flex h-full w-full max-w-lg items-center justify-center">
          <div className="absolute h-[500px] w-[500px] rounded-full bg-emerald-400 blur-3xl opacity-20 mix-blend-multiply" />
          <div className="grid grid-cols-2 gap-6 rotate-[8deg] transition-all duration-700 ease-out hover:rotate-0">
            <motion.div
              initial={{ y: 0 }}
              whileInView={{ y: -24 }}
              transition={{ duration: 1 }}
              className="h-72 w-48 rounded-[32px] bg-emerald-500/10 backdrop-blur-xl border border-white/50 shadow-2xl flex flex-col p-6"
            >
              <div className="h-8 w-20 rounded-full bg-emerald-600/20 mb-auto" />
              <div className="space-y-3">
                <div className="h-2 w-full rounded-full bg-emerald-600/10" />
                <div className="h-2 w-4/5 rounded-full bg-emerald-600/10" />
              </div>
            </motion.div>
            <motion.div
              initial={{ y: 0 }}
              whileInView={{ y: 24 }}
              transition={{ duration: 1 }}
              className="h-80 w-56 rounded-[32px] bg-white/50 backdrop-blur-2xl border border-white/70 shadow-[0_20px_60px_rgba(16,185,129,0.15)] flex items-end p-6"
            >
              <div className="w-full space-y-4">
                <div className="h-24 w-full rounded-2xl bg-[linear-gradient(0deg,rgba(16,185,129,0.2)_0%,transparent_100%)]" />
              </div>
            </motion.div>
          </div>
        </div>
      )}
      {i === 2 && (
        <div className="relative flex h-full w-full max-w-lg items-center justify-center">
          <div className="absolute h-full w-full max-w-md rounded-full bg-purple-400 blur-[100px] opacity-25 mix-blend-multiply" />
          <div className="relative flex items-center justify-center">
            <div className="absolute h-[450px] w-[450px] rounded-full border border-purple-400/30 animate-[spin_12s_linear_infinite]" />
            <div className="absolute h-[350px] w-[350px] rounded-full border border-purple-400/40 animate-[spin_8s_linear_infinite_reverse]" />
            <div className="absolute h-[250px] w-[250px] rounded-full border-2 border-purple-400/50 animate-[pulse_4s_ease-in-out_infinite]" />
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8 }}
              className="h-40 w-40 rounded-full bg-[linear-gradient(135deg,#f3e8ff_0%,#e9d5ff_100%)] shadow-[0_0_100px_rgba(168,85,247,0.3)] border border-white/80 backdrop-blur-sm"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function Philosophy() {
  return (
    <section className="relative z-10 w-full bg-transparent">
      {steps.map((step, i) => (
        <div
          key={step.num}
          className={`sticky top-0 flex h-screen w-full flex-col lg:flex-row items-center overflow-hidden transform-gpu rounded-t-[3rem] sm:rounded-t-[4rem] border-t border-white/50 shadow-[0_-30px_70px_rgba(0,0,0,0.06)] ${step.bg}`}
        >
          {/* Left Side: Text Box */}
          <div className="relative z-10 flex h-1/2 w-full flex-col justify-center px-8 md:px-16 lg:h-full lg:w-1/2 lg:pl-32 lg:pr-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex gap-6 lg:gap-10"
            >
              <div className="pt-3 text-sm lg:text-base font-bold tracking-[0.2em] text-slate-500/80 shrink-0">
                {step.num}
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-medium leading-[1.1] tracking-tight text-slate-900 text-balance whitespace-pre-wrap">
                  {step.title}
                </h2>
                {step.desc && (
                  <p className="mt-8 max-w-xl text-lg lg:text-xl text-slate-700/90 leading-relaxed text-balance">
                    {step.desc}
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Side: Colored Forms & Visuals */}
          <div className="relative w-full lg:w-1/2 h-1/2 lg:h-full overflow-hidden pointer-events-none">
            <StepVisual i={i} />
          </div>
        </div>
      ))}
    </section>
  );
}
