export const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

export const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  },
  viewport: { once: true, amount: 0.2 },
};

export const elegantReveal = {
  initial: { opacity: 0, y: 40, filter: "blur(12px)", scale: 0.96 },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 },
  viewport: { once: true, amount: 0.2 },
};

export const gentleSlide = {
  initial: { opacity: 0, y: 20, filter: "blur(6px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.2 },
};
