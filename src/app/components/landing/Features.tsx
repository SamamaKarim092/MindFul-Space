"use client";

import { motion } from "framer-motion";
import { Brain, Shield, Sparkles, History } from "lucide-react";

const features = [
  {
    title: "AI Sentiment Analysis",
    description:
      "Get instant feedback on your emotional state using state-of-the-art language models.",
    icon: Brain,
  },
  {
    title: "Privacy First",
    description:
      "Your thoughts are personal. We use secure encryption and Supabase for data protection.",
    icon: Shield,
  },
  {
    title: "Daily Inspiration",
    description:
      "Receive personalized quotes and insights based on your journaling history.",
    icon: Sparkles,
  },
  {
    title: "Mood Tracking",
    description:
      "Visualize your mental health journey with interactive charts and historical data.",
    icon: History,
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-[#0F0714]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
            >
              Everything you need to <br />
              <span className="text-indigo-400">master your emotions.</span>
            </motion.h2>
            <p className="text-gray-400 text-lg mb-8">
              Our platform combines traditional journaling with modern
              technology to give you a clearer picture of your mental health
              than ever before.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10 overflow-hidden flex items-center justify-center">
              {/* Mockup of the Dashboard */}
              <div className="w-[80%] h-[80%] bg-[#1A0B2E] rounded-2xl shadow-2xl border border-white/5 p-6">
                <div className="w-full h-4 bg-white/5 rounded mb-4" />
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="h-20 bg-indigo-500/20 rounded-lg border border-indigo-500/20" />
                  <div className="h-20 bg-purple-500/20 rounded-lg border border-purple-500/20" />
                  <div className="h-20 bg-pink-500/20 rounded-lg border border-pink-500/20" />
                </div>
                <div className="space-y-3">
                  <div className="w-full h-2 bg-white/5 rounded" />
                  <div className="w-[90%] h-2 bg-white/5 rounded" />
                  <div className="w-[95%] h-2 bg-white/5 rounded" />
                  <div className="w-[80%] h-2 bg-white/5 rounded" />
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-500/30 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
