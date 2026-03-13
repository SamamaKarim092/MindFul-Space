"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BarChart3, Bot, HeartHandshake, Sparkles } from "lucide-react";
import { fadeUp } from "./animations";

const productPillars = [
  {
    title: "Private journaling",
    description:
      "A focused writing space dedicated solely to your entries, mood labels, and daily reflections. It stays completely private, ensuring that your personal history remains yours alone, providing a safe harbor where you can freely organize your thoughts away from external noise and distractions.",
    icon: HeartHandshake,
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "AI sentiment guidance",
    description:
      "Integrated, n8n-powered analysis works entirely in the background to help translate your raw, unfiltered writing into readable emotional signals. It detects subtle shifts in your tone without interrupting your natural flow, providing a gentle analytical overlay to your everyday logging.",
    icon: Bot,
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Conversation support",
    description:
      "Advanced chat workflows designed to respond dynamically using context directly extracted from your past journal entries. By remembering what you've documented previously, the platform offers a uniquely supportive, continuous, and highly personalized conversational experience.",
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Insightful analytics",
    description:
      "A suite of trends, emotional statistics, generated quotes, and interactive dashboard widgets that successfully turn your isolated daily entries into a longer-term, easily digestible picture of how you're doing, helping you spot critical patterns over weeks, months, or years.",
    icon: BarChart3,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
  },
];

const TextReveal = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "center 50%"],
  });

  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);

        return (
          <span key={i}>
            <motion.span style={{ opacity }}>{word}</motion.span>
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
};

export default function ProductPillars() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: contentRef, // Target the flex layout specifically to avoid early trigger from the header
    offset: ["start start", "end end"],
  });

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.31, 0.62, 0.93, 1],
    ["#F6F1EB", "#EDF9FF", "#F5F3FF", "#ECFDF5", "#F6F1EB"],
  );

  return (
    <motion.section
      ref={sectionRef}
      style={{ backgroundColor }}
      className="relative px-6 py-24 sm:px-8 lg:px-12 transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-5xl flex flex-col items-center text-center pt-10 pb-16 md:pb-24">
          <span className="text-sm font-bold tracking-[0.15em] text-slate-900 uppercase mb-8 md:mb-12">
            What this product is designed to do
          </span>

          <TextReveal
            text="The product is not just a journal. It is a system for turning reflection into something a user can understand and revisit."
            className="text-3xl md:text-5xl lg:text-[54px] font-medium leading-[1.2] text-slate-950 text-balance mb-8 md:mb-10"
          />

          <TextReveal
            text="The interface, automation layer, and data model all work toward one goal: helping users notice how they feel over time while keeping the experience emotionally light and technically solid."
            className="text-xl md:text-3xl lg:text-[40px] font-normal leading-[1.3] text-slate-800 text-balance"
          />
        </div>

        <div
          ref={contentRef}
          className="mt-14 xl:mt-24 flex flex-col md:flex-row items-start md:gap-16"
        >
          <div className="w-full md:w-1/2 flex flex-col pb-[10vh] md:pb-[20vh]">
            {productPillars.map((pillar, index) => {
              const Icon = pillar.icon;

              return (
                <div
                  key={pillar.title}
                  className="h-auto md:min-h-[100vh] py-16 md:py-32 flex flex-col justify-center"
                >
                  <motion.div
                    {...fadeUp}
                    transition={{ duration: 0.7, delay: 0.1 }}
                  >
                    <div className="md:hidden relative w-full h-[300px] mb-8 rounded-3xl overflow-hidden shadow-lg border border-slate-900/10">
                      <img
                        src={pillar.image}
                        alt={pillar.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="hidden md:inline-flex mb-6 text-white bg-slate-950 rounded-2xl shadow-lg border border-slate-900/10 p-4">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-3xl font-bold tracking-tight text-slate-950">
                      {pillar.title}
                    </h3>
                    <p className="mt-6 text-xl leading-8 text-slate-600">
                      {pillar.description}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>

          <div className="hidden md:flex w-full md:w-[60%] sticky top-0 h-screen items-center justify-center">
            <div className="relative w-full h-[440px] lg:h-[480px] max-w-[540px] rounded-[2rem] overflow-hidden shadow-2xl flex items-center justify-center bg-slate-100">
              {productPillars.map((pillar, index) => {
                // To match GSAP clipPath "inset(0px 0px 100%)" shifting to "inset(0)" naturally
                // 1st Item (Index 0): Initially visible. As it scrolls to index 1, its bottom inset increases to 100%.
                // 2nd Item (Index 1): Revealed from beneath as Item 0 wipes upward.
                // We layer them in reverse order (highest index at bottom) so the clip-path wipe reveals the one below it.

                const reversedIndex = productPillars.length - 1 - index;
                const pillarData = productPillars[reversedIndex];

                // Item 0 hides when scroll goes from 0 -> 0.33
                // Item 1 hides when scroll goes from 0.33 -> 0.66
                // Item 2 hides when scroll goes from 0.66 -> 1.0
                // Last item never hides via clip-path

                // We define specific scroll steps to match when the text reaches the center of the viewport
                // Text centers roughly at scrollYProgress: 0, 0.31, 0.62, 0.93
                const startPoint = reversedIndex * 0.31;

                // Start wiping early after leaving the last text, and take the entire distance gracefully
                const wipeStart = startPoint + 0.02;
                // Finish the wipe precisely as the next text title aligns into the top-center
                const wipeEnd = startPoint + 0.28;

                const clipPathBottom = useTransform(
                  scrollYProgress,
                  [wipeStart, wipeEnd],
                  ["0%", "100%"],
                );

                // For the GSAP objectPosition shift:
                // Shift origin slightly to create a slow parallax effect matching the wipe perfectly
                const objectPositionY = useTransform(
                  scrollYProgress,
                  [wipeStart, wipeEnd],
                  ["50%", "70%"],
                );

                const isLastItem = reversedIndex === 3;

                return (
                  <motion.div
                    key={`visual-${pillarData.title}`}
                    // Reverse z-index so index 0 is on top of index 1
                    style={{
                      zIndex: productPillars.length - reversedIndex,
                      clipPath: isLastItem
                        ? undefined
                        : useTransform(
                            clipPathBottom,
                            (val) => `inset(0px 0px ${val})`,
                          ),
                    }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <motion.img
                      src={pillarData.image}
                      alt={pillarData.title}
                      style={{
                        objectPosition: useTransform(
                          objectPositionY,
                          (val) => `50% ${val}`,
                        ),
                      }}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
