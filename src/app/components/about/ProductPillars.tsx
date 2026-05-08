"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BarChart3, Bot, HeartHandshake, Sparkles } from "lucide-react";
import { fadeUp } from "./animations";

const productPillars = [
  {
    title: "Private journaling",
    description:
      "A focused writing space for your entries and daily reflections. It stays completely private, ensuring your history remains yours alone, providing a safe harbor away from external noise.",
    icon: HeartHandshake,
    image:
      "https://img.freepik.com/free-photo/laptop-cup-table-dark-room-with-blank-screen-night_169016-47420.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    title: "AI sentiment guidance",
    description:
      "Integrated analysis works in the background to translate your raw writing into emotional signals. It detects shifts in tone without interrupting your natural flow.",
    icon: Bot,
    image:
      "https://plus.unsplash.com/premium_photo-1733266868412-cfc2ac17b497?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWklMjB0ZXh0fGVufDB8fDB8fHww",
  },
  {
    title: "Conversation support",
    description:
      "Advanced chat workflows respond dynamically using context extracted from your past entries. By remembering your history, it offers a uniquely personalized experience.",
    icon: Sparkles,
    image:
      "https://www.shutterstock.com/image-photo/ai-powers-workflow-automation-smart-600nw-2680667237.jpg",
  },
];

// This component handles the word-by-word reveal animation at the top of the section.
// As the user scrolls, `scrollYProgress` dictates the opacity of each word individually.
const TextReveal = ({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: any;
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  // Calculates scroll progress relative to specifically this <p> tag.
  const { scrollYProgress } = useScroll({
    target: ref,
    // Start tracking when the top of the text hits 85% down the viewport.
    // End tracking when the center of the text hits 50% (dead center) of the viewport.
    offset: ["start 85%", "center 50%"],
  });

  const words = text.split(" ");

  return (
    <motion.p ref={ref} className={className} style={style}>
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
    </motion.p>
  );
};

export default function ProductPillars() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Tracks the scroll progress specifically for the two-column layout (Text left, Images right)
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start start", "end end"],
  });

  // A separate scroll tracker just for the colors so they can trigger earlier
  // Starts tracking when the content block reaches 75% down the screen (early entry).
  const { scrollYProgress: colorScrollProgress } = useScroll({
    target: contentRef,
    offset: ["start 35%", "end end"],
  });

  // BACKGROUND COLOR TRANSITION:
  const backgroundColor = useTransform(
    colorScrollProgress,
    [0, 0.1, 0.5, 0.98, 1],
    ["#F6F1EB", "#005CE6", "#3b818f", "#929793", "#F6F1EB"],
  );

  // TEXT COLOR TRANSITION (HEADINGS):
  const headingColor = useTransform(
    colorScrollProgress,
    [0, 0.15, 0.97, 1],
    ["#0f172a", "#ffffff", "#ffffff", "#0f172a"],
  );

  // PARAGRAPH TEXT COLOR TRANSITION:
  const pColor = useTransform(
    colorScrollProgress,
    [0, 0.15, 0.95, 1],
    ["#475569", "#e2e8f0", "#e2e8f0", "#475569"],
  );

  // "What this product..." LABEL COLOR TRANSITION:
  const labelColor = useTransform(
    colorScrollProgress,
    [0, 0.15, 0.95, 1],
    ["#0f172a", "#f8fafc", "#f8fafc", "#0f172a"],
  );

  const iconContainerBg = useTransform(
    colorScrollProgress,
    [0, 0.15, 0.95, 1],
    ["#0f172a", "rgba(255,255,255,0.15)", "rgba(255,255,255,0.15)", "#0f172a"],
  );

  const iconBorderColor = useTransform(
    colorScrollProgress,
    [0, 0.15, 0.95, 1],
    [
      "rgba(15,23,42,0.1)",
      "rgba(255,255,255,0.2)",
      "rgba(255,255,255,0.2)",
      "rgba(15,23,42,0.1)",
    ],
  );

  return (
    <motion.section
      ref={sectionRef}
      style={{ backgroundColor }}
      className="relative px-6 py-24 sm:px-8 lg:px-12 transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-5xl flex flex-col items-center text-center pt-10 pb-16 md:pb-24">
          <motion.span
            style={{ color: labelColor }}
            className="text-sm font-bold tracking-[0.15em] uppercase mb-8 md:mb-12"
          >
            What this product is designed to do
          </motion.span>

          <TextReveal
            text="The product is not just a journal. It is a system for turning reflection into something a user can understand and revisit."
            className="text-3xl md:text-5xl lg:text-[54px] font-medium leading-[1.2] text-balance mb-8 md:mb-10"
            style={{ color: headingColor }}
          />

          <TextReveal
            text="The interface, automation layer, and data model all work toward one goal: helping users notice how they feel over time while keeping the experience emotionally light and technically solid."
            className="text-xl md:text-3xl lg:text-[40px] font-normal leading-[1.3] text-balance"
            style={{ color: pColor }}
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
                    transition={{ duration: 0.45, delay: 0.05 }}
                  >
                    <div className="md:hidden relative w-full h-[300px] mb-8 rounded-3xl overflow-hidden shadow-lg border border-slate-900/10">
                      <img
                        src={pillar.image}
                        alt={pillar.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-6 mb-6">
                      <motion.div
                        style={{
                          backgroundColor: iconContainerBg,
                          borderColor: iconBorderColor,
                        }}
                        className="hidden md:flex shrink-0 text-white rounded-2xl shadow-lg border p-3 lg:p-4 transition-colors duration-300"
                      >
                        <Icon className="h-8 w-8 lg:h-10 lg:w-10" />
                      </motion.div>
                      <motion.h3
                        style={{ color: headingColor }}
                        className="text-4xl lg:text-5xl font-extrabold tracking-tight transition-colors duration-300"
                      >
                        {pillar.title}
                      </motion.h3>
                    </div>
                    <motion.p
                      style={{ color: pColor }}
                      className="mt-6 text-2xl lg:text-[28px] leading-relaxed transition-colors duration-300"
                    >
                      {pillar.description}
                    </motion.p>
                  </motion.div>
                </div>
              );
            })}
          </div>

          <div className="hidden md:flex w-full md:w-[60%] sticky top-0 h-screen items-center justify-center">
            <div className="relative w-full h-[440px] lg:h-[480px] max-w-[540px] rounded-[2rem] overflow-hidden shadow-2xl flex items-center justify-center bg-slate-100">
              {productPillars.map((pillar, index) => {
                // To match GSAP aesthetics, we reveal images by wiping the top one away.
                // We layer them in reverse order (highest index at bottom) so the clip-path wipe reveals the one below it.
                // 1. Calculate inverted index: e.g. for 3 items: index 0 -> reversed 2 (Top), 1 -> 1, 2 -> 0 (Bottom)
                const reversedIndex = productPillars.length - 1 - index;
                const pillarData = productPillars[reversedIndex];

                // 2. Determine scroll boundaries based on total items
                // `step` is how much scroll real estate each item mathematically owns. e.g. 1/3 = 0.33
                const step = 1 / productPillars.length;

                // `wipeStart`: Scroll % where this specific image BEGINS wiping upward.
                //   `reversedIndex * step` finds its base starting point.
                //   `+ 0.15` delays the wipe so the user has time to read the text before the image moves.
                const wipeStart = reversedIndex * step + 0.15;

                // `wipeEnd`: Scroll % where the wipe FINISHES.
                //   The gap between wipeStart and wipeEnd controls HOW FAST it wipes.
                //   (e.g., 0.22 - 0.15 = 0.07. So it wipes completely over 7% of scroll distance)
                const wipeEnd = wipeStart + 0.22;

                // 3. Drive the CSS Clip-Path wipe
                const clipPathBottom = useTransform(
                  scrollYProgress,
                  [wipeStart, wipeEnd],
                  ["0%", "100%"],
                );

                // 4. Drive the Glass Divider Line (Visual scanning effect on the seams)
                const bottomPosition = useTransform(
                  scrollYProgress,
                  [wipeStart, wipeEnd],
                  ["0%", "100%"],
                );

                // 5. Fade the Glass Line in/out so it only appears DURING the wipe
                const lineOpacity = useTransform(
                  scrollYProgress,
                  [wipeStart, wipeStart + 0.02, wipeEnd - 0.02, wipeEnd],
                  [0, 1, 1, 0],
                );

                // 6. Slow downward image parallax (shifts image position from 50% to 65% slightly as it wipes)
                const objectPositionY = useTransform(
                  scrollYProgress,
                  [wipeStart, wipeEnd],
                  ["50%", "65%"],
                );

                // Determine if this is the foundational bottom item. The bottom item should NEVER wipe away.
                const isBottomItem =
                  reversedIndex === productPillars.length - 1;

                return (
                  <motion.div
                    key={`visual-${pillarData.title}`}
                    // Reverse z-index so the highest index is on top
                    style={{
                      zIndex: productPillars.length - reversedIndex,
                      clipPath: isBottomItem
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
                      className="w-full h-full object-cover relative z-0"
                    />

                    {/* Glass transition line effect - ONLY show on layers that wipe away */}
                    {!isBottomItem && (
                      <motion.div
                        style={{
                          bottom: bottomPosition,
                          opacity: lineOpacity,
                        }}
                        className="absolute left-0 right-0 h-[6px] z-10 
                          bg-gradient-to-b from-white/40 to-transparent 
                          backdrop-blur-md border-t border-white/60 
                          shadow-[0_-4px_16px_rgba(255,255,255,0.4)]"
                      />
                    )}
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
