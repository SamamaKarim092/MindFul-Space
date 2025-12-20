"use client";

import { motion } from "framer-motion";
import { Cpu, Zap, Database, BarChart3 } from "lucide-react";

const features = [
  {
    title: "Real-time Processing",
    description:
      "n8n webhooks instantly trigger sentiment analysis the moment you save a journal entry.",
    icon: Zap,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    title: "AI Orchestration",
    description:
      "Seamlessly connects your thoughts to Groq's advanced LLMs for deep emotional understanding.",
    icon: Cpu,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    title: "Automated Insights",
    description:
      "Complex data transformation workflows convert raw text into actionable mood scores.",
    icon: BarChart3,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    title: "Secure Data Sync",
    description:
      "Automatically updates your personal dashboard with the latest sentiment metrics.",
    icon: Database,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
];

export default function N8NAutomation() {
  return (
    <section className="py-24 bg-[#0F0714] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            Powered by <span className="text-indigo-400">n8n Automation</span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            We use enterprise-grade automation to ensure your mental health
            insights are processed accurately, securely, and instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all group"
            >
              <div
                className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Workflow Visualization Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
        >
          <div className="bg-[#1A0B2E] rounded-[22px] p-8 md:p-12 overflow-hidden relative">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="text-left max-w-md">
                <h3 className="text-2xl font-bold text-white mb-4">
                  The Sentiment Pipeline
                </h3>
                <p className="text-gray-400 mb-6">
                  Our n8n workflow acts as the brain of the application,
                  coordinating between your journal, the AI analysis engine, and
                  your secure database.
                </p>
                <div className="flex items-center gap-4 text-sm font-mono text-indigo-300">
                  <span className="px-3 py-1 bg-indigo-500/10 rounded border border-indigo-500/20">
                    Webhook
                  </span>
                  <span>→</span>
                  <span className="px-3 py-1 bg-purple-500/10 rounded border border-purple-500/20">
                    Groq AI
                  </span>
                  <span>→</span>
                  <span className="px-3 py-1 bg-green-500/10 rounded border border-green-500/20">
                    Postgres
                  </span>
                </div>
              </div>
              <div className="w-full md:w-1/2 aspect-video bg-black/40 rounded-xl border border-white/5 flex items-center justify-center">
                <div className="text-indigo-400 font-mono text-sm animate-pulse">
                  [ n8n Workflow Active ]
                </div>
              </div>
            </div>
            {/* Decorative glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
