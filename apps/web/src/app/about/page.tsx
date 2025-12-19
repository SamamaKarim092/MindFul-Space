"use client";

import { motion } from "framer-motion";
import Navbar from "@/app/components/home/Navbar";
import {
  Cpu,
  Globe,
  ShieldCheck,
  Zap,
  Code2,
  Database,
  Layers,
  Workflow,
} from "lucide-react";

const techStack = [
  {
    name: "NestJS",
    role: "Backend Framework",
    why: "We chose NestJS for its modular architecture and first-class TypeScript support. It provides a robust, scalable foundation that ensures our API remains maintainable as we add complex features like AI integration.",
    icon: Code2,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    name: "Next.js 15",
    role: "Frontend Framework",
    why: "Next.js allows us to build a lightning-fast, SEO-friendly user interface. With App Router and Server Components, we deliver a seamless experience that feels like a native application.",
    icon: Globe,
    color: "text-white",
    bg: "bg-white/10",
  },
  {
    name: "n8n",
    role: "Workflow Automation",
    why: "n8n is the 'brain' of our sentiment analysis pipeline. It allows us to orchestrate complex data flows between our database, AI models, and external services without writing thousands of lines of glue code.",
    icon: Workflow,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    name: "Groq AI",
    role: "Inference Engine",
    why: "To provide instant emotional feedback, we use Groq. Its LPU (Language Processing Unit) technology offers the fastest inference speeds available, making our sentiment analysis feel instantaneous.",
    icon: Zap,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    name: "Supabase & Prisma",
    role: "Database & ORM",
    why: "Security is paramount for mental health data. Supabase provides enterprise-grade PostgreSQL with built-in Auth, while Prisma ensures type-safe database interactions across our entire stack.",
    icon: Database,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    name: "GraphQL",
    role: "API Layer",
    why: "GraphQL enables our frontend to request exactly the data it needs and nothing more. This reduces bandwidth and improves performance, especially on mobile devices.",
    icon: Layers,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0F0714] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-indigo-600/10 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Bridging Technology and <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Mental Wellbeing
              </span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              MindJournal was born from a simple idea: what if technology could
              help us understand our emotions as clearly as it tracks our
              physical health?
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Privacy First</h3>
              <p className="text-gray-400">
                Your thoughts are yours alone. We use industry-standard
                encryption to ensure your data remains private and secure.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Cpu className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI-Driven</h3>
              <p className="text-gray-400">
                We leverage the latest advancements in Large Language Models to
                provide nuanced, empathetic insights into your journaling.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Real-time</h3>
              <p className="text-gray-400">
                No waiting for reports. Our automation pipeline processes your
                entries instantly, giving you immediate feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Technology Stack</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We've carefully selected every piece of our stack to ensure the
              best possible performance, security, and user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${tech.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <tech.icon className={`w-6 h-6 ${tech.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-1">{tech.name}</h3>
                <p className="text-indigo-400 text-sm font-medium mb-4">
                  {tech.role}
                </p>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {tech.why}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer-like CTA */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Ready to start your journey?
          </h2>
          <div className="flex justify-center gap-4">
            <a
              href="/signup"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold transition-all"
            >
              Get Started
            </a>
            <a
              href="/"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-bold border border-white/10 transition-all"
            >
              Back to Home
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
