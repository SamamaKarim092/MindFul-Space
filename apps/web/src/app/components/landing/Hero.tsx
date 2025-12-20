"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import FloatingLines from "@/app/components/ui/FloatingLines";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0F0714]">
      {/* Animated Background with FloatingLines */}
      <div className="absolute inset-0 w-full h-full">
        <FloatingLines
          linesGradient={["#e947f5", "#2f4ba2", "#e947f5"]}
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={5}
          lineDistance={5}
          animationSpeed={0.8}
          interactive={true}
          bendRadius={5}
          bendStrength={-0.5}
          parallax={true}
          parallaxStrength={0.2}
          mixBlendMode="normal"
          topWavePosition={{ x: 10.0, y: 0.5, rotate: -0.4 }}
          middleWavePosition={{ x: 5.0, y: 0.0, rotate: 0.2 }}
          bottomWavePosition={{ x: 2.0, y: -0.7, rotate: 0.4 }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider text-indigo-400 uppercase bg-indigo-400/10 rounded-full border border-indigo-400/20">
              AI-Powered Mental Wellness
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight drop-shadow-lg">
              Your Mental Health
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Journey Starts Here
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Combine the power of daily reflection with advanced AI sentiment
              analysis. Track your emotional patterns and gain deep insights
              into your mental wellbeing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Start Your Journey
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all backdrop-blur-sm"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
