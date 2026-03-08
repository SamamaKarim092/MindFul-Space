"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Book,
  MessageCircle,
  TrendingUp,
  PenLine,
  Quote,
  Activity,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function DashboardShowcase() {
  return (
    <section className="relative overflow-hidden bg-[#f6f1eb] py-24 sm:py-32">
      {/* Background radial gradients to merge harmoniously with light mode */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.6),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center md:max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-semibold text-slate-950 tracking-tight"
          >
            Your safe space, <br />
            beautifully realized.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg text-slate-600 leading-relaxed"
          >
            A calm, distraction-free environment designed to help you focus on
            what really matters: your thoughts. Dive into a seamless dark-mode
            experience that feels like a midnight sanctuary.
          </motion.p>
        </div>

        {/* Floating App Mockup (Dark Mode) */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-6xl"
        >
          {/* Outer glow and shadow to separate dark app from light background */}
          <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-b from-slate-200 to-slate-400 opacity-50 blur-lg" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[120%] w-[110%] rounded-[3rem] bg-fuchsia-500/10 blur-[100px] -z-10" />

          {/* Actual Mockup Container */}
          <div className="relative flex h-[600px] sm:h-[700px] w-full overflow-hidden rounded-[2rem] border border-slate-700/50 bg-[#0F0714] shadow-[0_40px_100px_rgba(15,7,20,0.4)]">
            {/* Ambient Background inside the Dashboard Mockup */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/30 blur-[100px] mix-blend-screen" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen" />
            </div>

            {/* Sidebar (Desktop Mock) */}
            <div className="hidden md:flex w-64 flex-col border-r border-white/10 bg-black/40 backdrop-blur-2xl z-10 px-4 py-6">
              <div className="mb-10 px-2 flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm bg-purple-500" />
                <span className="text-xl font-bold text-white tracking-wide">
                  Mindful
                </span>
              </div>

              <nav className="flex flex-col gap-2">
                {[
                  { icon: LayoutDashboard, label: "Dashboard", active: true },
                  { icon: Book, label: "Journal", active: false },
                  { icon: MessageCircle, label: "AI Coach", active: false },
                  { icon: TrendingUp, label: "Trends", active: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${item.active ? "bg-white/10 text-white" : "text-slate-400"}`}
                  >
                    <item.icon
                      className={`h-5 w-5 ${item.active ? "text-purple-400" : ""}`}
                    />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                ))}
              </nav>

              <div className="mt-auto px-3 py-4 border-t border-white/10 text-slate-400 text-sm flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-600 shrink-0" />
                <div className="truncate">
                  <p className="text-white font-medium">Sarah Jenkins</p>
                  <p className="text-xs opacity-70 truncate">
                    sarah@example.com
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col z-10 relative overflow-hidden">
              {/* Header mock */}
              <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/20 backdrop-blur-md">
                <div className="md:invisible flex items-center gap-2">
                  <div className="h-4 w-4 rounded-sm bg-purple-500" />
                  <span className="text-white font-bold">Mindful</span>
                </div>
                <div className="flex items-center gap-3 ml-auto">
                  <div className="h-8 w-32 rounded-full bg-white/5 border border-white/10" />
                  <div className="h-8 w-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6">
                {/* Greeting */}
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Welcome back, Sarah!
                  </h3>
                  <p className="text-slate-400 mt-1">
                    Here&apos;s your daily mental wellness overview.
                  </p>
                </div>

                {/* Stats Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      icon: PenLine,
                      label: "Total Entries",
                      val: "42",
                      color: "text-blue-400",
                      bg: "bg-blue-500/10",
                    },
                    {
                      icon: Activity,
                      label: "Current Streak",
                      val: "7 Days",
                      color: "text-purple-400",
                      bg: "bg-purple-500/10",
                    },
                    {
                      icon: Calendar,
                      label: "Days Tracked",
                      val: "30",
                      color: "text-emerald-400",
                      bg: "bg-emerald-500/10",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-md"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-12 w-12 rounded-full ${stat.bg} flex items-center justify-center`}
                        >
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-400">
                            {stat.label}
                          </p>
                          <p className="text-2xl font-bold text-white">
                            {stat.val}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Chart Mock */}
                  <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-semibold text-white">
                        Emotional Energy Trend
                      </h4>
                      <span className="text-xs font-medium bg-white/10 text-slate-300 px-3 py-1 rounded-full border border-white/5">
                        This Week
                      </span>
                    </div>
                    {/* Mock Chart Diagram */}
                    <div className="flex-1 flex items-end justify-between px-2 pb-2 gap-2 h-40">
                      {[40, 55, 30, 75, 60, 85, 70].map((h, i) => (
                        <div
                          key={i}
                          className="w-full relative group cursor-pointer flex flex-col justify-end h-full"
                        >
                          <motion.div
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            transition={{
                              duration: 1,
                              delay: i * 0.1,
                              ease: "easeOut",
                            }}
                            className="w-full bg-linear-to-t from-purple-600/80 to-blue-400/80 rounded-t-md opacity-70 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-3 pt-4 border-t border-white/10">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>

                  {/* Quote / Secondary Widget */}
                  <div className="lg:col-span-1 border border-white/10 bg-gradient-to-br from-purple-900/40 to-black/60 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 text-white/5 group-hover:text-white/10 transition-colors">
                      <Quote size={80} fill="currentColor" />
                    </div>
                    <h4 className="font-semibold text-purple-300 mb-4 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" /> Insight of the Day
                    </h4>
                    <p className="text-lg leading-relaxed text-white/90 italic font-medium relative z-10">
                      &quot;You&apos;ve shown incredible resilience this week.
                      The tension is softening into clarity.&quot;
                    </p>
                    <div className="mt-6 flex gap-2 z-10 relative">
                      <span className="px-3 py-1 text-xs rounded-full bg-white/10 text-slate-300 border border-white/10">
                        Calm
                      </span>
                      <span className="px-3 py-1 text-xs rounded-full bg-white/10 text-slate-300 border border-white/10">
                        Reflective
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
