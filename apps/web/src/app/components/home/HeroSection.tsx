"use client";

import Link from "next/link";
import FloatingLines from "@/app/components/ui/FloatingLines";

export default function HeroSection() {
  return (
    <div className="relative h-screen overflow-hidden bg-[#0F0714]">
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

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        {/* Hero Content */}
        <main className="flex-grow flex items-center justify-center pointer-events-auto">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Your Mental Health
              <br />
              <span className="text-yellow-200">Journey Starts Here</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 drop-shadow-md">
              Track your moods, journal your thoughts, and chat with an AI
              therapist. All in one place to help you understand and improve
              your mental wellbeing.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl text-lg transition-all hover:shadow-2xl hover:scale-105 shadow-lg"
              >
                Start Free Today
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 border-2 border-white text-white font-medium rounded-xl text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                I Have an Account
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
