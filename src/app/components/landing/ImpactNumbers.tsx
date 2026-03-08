"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, Users, Clock } from "lucide-react";

const cards = [
  {
    icon: Users,
    title: "10k+",
    subtitle:
      "Over 10,000 personal reflections safely analyzed to help users find clarity every day.",
    bgColor: "bg-white",
    textColor: "text-[#3b82f6]",
    descColor: "text-blue-600/80",
    iconBg: "bg-blue-50 text-blue-500 border-blue-100",
    top: "top-[15vh]",
    zIndex: 10,
  },
  {
    icon: ShieldCheck,
    title: "100%",
    subtitle:
      "End-to-end encrypted. We promise total data privacy—your emotional space belongs solely to you.",
    bgColor: "bg-[#71d960]",
    textColor: "text-white",
    descColor: "text-white/90",
    iconBg: "bg-white/20 text-white border-white/20",
    top: "top-[22vh]",
    zIndex: 20,
  },
  {
    icon: Clock,
    title: "24/7",
    subtitle:
      "A continuously available, empathetic AI coach ready to reframe your thoughts at any hour.",
    bgColor: "bg-[#ff6b6b]",
    textColor: "text-white",
    descColor: "text-white/90",
    iconBg: "bg-white/20 text-white border-white/20",
    top: "top-[29vh]",
    zIndex: 30,
  },
];

export default function ImpactNumbers() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth color transitions mapping to scroll progress.
  // 0% -> default bg
  // ~25% -> Blue for card 1
  // ~55% -> Green for card 2
  // ~80% -> Coral/Red for card 3
  // 95%-100% -> Transition back to original beige to exit cleanly
  const bg = useTransform(
    scrollYProgress,
    [0, 0.25, 0.55, 0.8, 0.95, 1],
    ["#f6f1eb", "#1e3a8a", "#064e3b", "#7f1d1d", "#7f1d1d", "#f6f1eb"],
  );

  // Text transitions to white as background darkens, then back to dark at the very end
  const headingColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.95, 1],
    ["#0f172a", "#ffffff", "#ffffff", "#0f172a"],
  );

  const pColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.95, 1],
    ["#334155", "#e2e8f0", "#e2e8f0", "#334155"],
  );

  const svgColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.55, 0.8, 0.95, 1],
    ["#e9d5ff", "#93c5fd", "#86efac", "#fca5a5", "#fca5a5", "#e9d5ff"],
  );

  return (
    <motion.section
      ref={containerRef}
      style={{ backgroundColor: bg }}
      className="relative w-full px-6 lg:px-12 pb-32 transition-colors duration-300 ease-out"
    >
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row items-start gap-10">
        {/* Left Content (Sticky) */}
        <div className="top-0 flex min-h-[50vh] lg:min-h-screen w-full lg:w-1/2 flex-col justify-center pt-24 lg:pt-0 lg:sticky z-10 transition-colors duration-300">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ color: headingColor }}
            className="text-5xl md:text-6xl lg:text-[5rem] font-medium leading-[1.05] tracking-tight"
          >
            A few numbers <br />
            behind the{" "}
            <span className="relative inline-block whitespace-nowrap">
              insights
              {/* Animated Squiggly underline SVG */}
              <motion.svg
                style={{ color: svgColor }}
                className="absolute -bottom-2 w-full h-4 left-0 -z-10"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,10 Q12.5,20 25,10 T50,10 T75,10 T100,10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </motion.svg>
            </span>
            <br />
            we deliver
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ color: pColor }}
            className="mt-8 max-w-md text-lg leading-relaxed font-medium"
          >
            These numbers are more than just metrics. They represent the depth
            of our commitment to your mental wellbeing, the security of our
            platform, and the real-world impact we help create for you.
          </motion.p>
        </div>

        {/* Right Content (Scrolling & Stacking Cards) */}
        <div className="relative w-full lg:w-1/2 pb-[10vh] lg:pb-[20vh] lg:pt-[15vh]">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`sticky ${card.top} mb-[20vh] last:mb-0 w-full max-w-[480px] lg:ml-auto h-[480px] rounded-[3rem] p-10 sm:p-12 flex flex-col justify-between ${card.bgColor} shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-transform duration-500`}
              style={{ zIndex: card.zIndex }}
            >
              {/* Top Icon Badge */}
              <div
                className={`self-end flex h-14 w-14 items-center justify-center rounded-full border ${card.iconBg}`}
              >
                <card.icon className="h-6 w-6" />
              </div>

              {/* Card Content */}
              <div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`text-[5.5rem] sm:text-[7rem] leading-none tracking-tight font-medium mb-6 ${card.textColor}`}
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className={`text-lg sm:text-xl font-medium leading-relaxed max-w-[85%] ${card.descColor}`}
                >
                  {card.subtitle}
                </motion.p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
