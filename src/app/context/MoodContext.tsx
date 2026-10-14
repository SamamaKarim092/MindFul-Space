"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

export type MoodTheme = {
  name: string;
  baseBg: string;
  gradient1: string;
  gradient2: string;
  accent: string;
};

export type UIThemeKey =
  | "AMETHYST"
  | "ROSE_QUARTZ"
  | "AMBER_SUN"
  | "SAGE_EMERALD"
  | "OCEAN_COBALT"
  | "OBSIDIAN_SLATE";

export interface UIThemePreset {
  id: UIThemeKey;
  label: string;
  description: string;
  previewBg: string;
  previewAccent: string;
  swatchGradient: string;
  theme: MoodTheme;
}

export const MOOD_THEMES: Record<string, MoodTheme> = {
  NEUTRAL: {
    name: "Neutral",
    baseBg: "bg-[#130919]",
    gradient1: "from-purple-900/40",
    gradient2: "to-blue-900/40",
    accent: "text-purple-600 dark:text-purple-400",
  },
  HAPPY: {
    name: "Happy",
    baseBg: "bg-[#251b07]",
    gradient1: "from-yellow-500/50",
    gradient2: "to-orange-500/40",
    accent: "text-amber-600 dark:text-yellow-400",
  },
  GRATEFUL: {
    name: "Grateful",
    baseBg: "bg-[#250719]",
    gradient1: "from-pink-500/50",
    gradient2: "to-rose-400/40",
    accent: "text-pink-600 dark:text-pink-400",
  },
  SAD: {
    name: "Sad",
    baseBg: "bg-[#070e25]",
    gradient1: "from-blue-900/60",
    gradient2: "to-teal-900/40",
    accent: "text-blue-600 dark:text-blue-400",
  },
  REFLECTIVE: {
    name: "Reflective",
    baseBg: "bg-[#0e0725]",
    gradient1: "from-indigo-900/60",
    gradient2: "to-purple-900/40",
    accent: "text-indigo-600 dark:text-indigo-400",
  },
  ANXIOUS: {
    name: "Anxious",
    baseBg: "bg-[#150725]",
    gradient1: "from-violet-500/40",
    gradient2: "to-indigo-900/60",
    accent: "text-violet-600 dark:text-purple-300",
  },
  ENERGETIC: {
    name: "Energetic",
    baseBg: "bg-[#250707]",
    gradient1: "from-orange-600/50",
    gradient2: "to-pink-600/40",
    accent: "text-orange-600 dark:text-orange-400",
  },
  CALM: {
    name: "Calm",
    baseBg: "bg-[#07250e]",
    gradient1: "from-emerald-900/60",
    gradient2: "to-teal-900/40",
    accent: "text-emerald-600 dark:text-emerald-400",
  },
  FRUSTRATED: {
    name: "Frustrated",
    baseBg: "bg-[#250707]",
    gradient1: "from-red-600/50",
    gradient2: "to-orange-600/40",
    accent: "text-red-600 dark:text-red-400",
  },
  ANGRY: {
    name: "Angry",
    baseBg: "bg-[#2a0404]",
    gradient1: "from-red-700/60",
    gradient2: "to-rose-600/40",
    accent: "text-red-600 dark:text-red-500",
  },
  LOVING: {
    name: "Loving",
    baseBg: "bg-[#250719]",
    gradient1: "from-pink-500/50",
    gradient2: "to-rose-400/40",
    accent: "text-pink-600 dark:text-pink-400",
  },
};

export const UI_THEME_PRESETS: Record<UIThemeKey, UIThemePreset> = {
  AMETHYST: {
    id: "AMETHYST",
    label: "Amethyst Purple",
    description: "Serene violet and amethyst glow for spiritual calm and clarity",
    previewBg: "#130919",
    previewAccent: "#c084fc",
    swatchGradient: "from-purple-600 to-indigo-500",
    theme: {
      name: "Amethyst",
      baseBg: "bg-[#130919]",
      gradient1: "from-purple-900/50",
      gradient2: "to-indigo-900/40",
      accent: "text-purple-600 dark:text-purple-400",
    },
  },
  ROSE_QUARTZ: {
    id: "ROSE_QUARTZ",
    label: "Rose Quartz",
    description: "Warm pink and gentle rose tones of self-compassion and gratitude",
    previewBg: "#250719",
    previewAccent: "#f472b6",
    swatchGradient: "from-pink-500 to-rose-400",
    theme: {
      name: "Rose Quartz",
      baseBg: "bg-[#250719]",
      gradient1: "from-pink-500/50",
      gradient2: "to-rose-400/40",
      accent: "text-pink-600 dark:text-pink-400",
    },
  },
  AMBER_SUN: {
    id: "AMBER_SUN",
    label: "Amber Sun",
    description: "Vibrant golden warmth, optimism, and energizing focus",
    previewBg: "#251b07",
    previewAccent: "#f59e0b",
    swatchGradient: "from-amber-500 to-yellow-400",
    theme: {
      name: "Amber Sun",
      baseBg: "bg-[#251b07]",
      gradient1: "from-yellow-500/50",
      gradient2: "to-orange-500/40",
      accent: "text-amber-600 dark:text-yellow-400",
    },
  },
  SAGE_EMERALD: {
    id: "SAGE_EMERALD",
    label: "Sage Emerald",
    description: "Grounding earthy green for breathwork, grounding, and peace",
    previewBg: "#07250e",
    previewAccent: "#34d399",
    swatchGradient: "from-emerald-500 to-teal-400",
    theme: {
      name: "Sage Emerald",
      baseBg: "bg-[#07250e]",
      gradient1: "from-emerald-900/60",
      gradient2: "to-teal-900/40",
      accent: "text-emerald-600 dark:text-emerald-400",
    },
  },
  OCEAN_COBALT: {
    id: "OCEAN_COBALT",
    label: "Ocean Cobalt",
    description: "Deep contemplative blue of stillness, balance, and quiet thoughts",
    previewBg: "#070e25",
    previewAccent: "#60a5fa",
    swatchGradient: "from-blue-600 to-cyan-500",
    theme: {
      name: "Ocean Cobalt",
      baseBg: "bg-[#070e25]",
      gradient1: "from-blue-900/60",
      gradient2: "to-cyan-900/40",
      accent: "text-blue-600 dark:text-blue-400",
    },
  },
  OBSIDIAN_SLATE: {
    id: "OBSIDIAN_SLATE",
    label: "Obsidian Slate",
    description: "Minimalist, distraction-free monochrome charcoal aesthetic",
    previewBg: "#0c0d12",
    previewAccent: "#94a3b8",
    swatchGradient: "from-slate-600 to-zinc-700",
    theme: {
      name: "Obsidian Slate",
      baseBg: "bg-[#0c0d12]",
      gradient1: "from-slate-800/40",
      gradient2: "to-zinc-900/50",
      accent: "text-slate-400 dark:text-slate-300",
    },
  },
};

// Map n8n color categories to mood theme names
export const COLOR_CATEGORY_TO_MOOD: Record<string, string> = {
  YELLOW: "HAPPY",
  BLUE: "SAD",
  ORANGE: "ENERGETIC",
  PURPLE: "REFLECTIVE",
  RED: "ANGRY",
  PINK: "LOVING",
  GREEN: "CALM",
};

interface MoodContextType {
  currentMood: MoodTheme;
  selectedMoods: MoodTheme[];
  activeThemeKey: UIThemeKey;
  setMood: (moodName: string) => void;
  setMoods: (moodNames: string[]) => void;
  setMoodByColorCategory: (label: string, colorCategory: string) => void;
  setUserTheme: (themeKey: UIThemeKey) => void;
  resetToUserTheme: () => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function MoodProvider({ children }: { children: ReactNode }) {
  const [activeThemeKey, setActiveThemeKey] = useState<UIThemeKey>("AMETHYST");
  const [currentMood, setCurrentMoodState] = useState<MoodTheme>(
    UI_THEME_PRESETS.AMETHYST.theme
  );
  const [selectedMoods, setSelectedMoods] = useState<MoodTheme[]>([
    UI_THEME_PRESETS.AMETHYST.theme,
  ]);

  // Load persisted theme preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mindful_ui_theme") as UIThemeKey | null;
      if (saved && UI_THEME_PRESETS[saved]) {
        setActiveThemeKey(saved);
        setCurrentMoodState(UI_THEME_PRESETS[saved].theme);
        setSelectedMoods([UI_THEME_PRESETS[saved].theme]);
      }
    } catch {
      // localStorage may be unavailable
    }
  }, []);

  const setUserTheme = useCallback((themeKey: UIThemeKey) => {
    if (UI_THEME_PRESETS[themeKey]) {
      setActiveThemeKey(themeKey);
      setCurrentMoodState(UI_THEME_PRESETS[themeKey].theme);
      setSelectedMoods([UI_THEME_PRESETS[themeKey].theme]);
      try {
        localStorage.setItem("mindful_ui_theme", themeKey);
      } catch {
        // Ignore storage errors
      }
    }
  }, []);

  const resetToUserTheme = useCallback(() => {
    const base = UI_THEME_PRESETS[activeThemeKey]?.theme || UI_THEME_PRESETS.AMETHYST.theme;
    setCurrentMoodState(base);
    setSelectedMoods([base]);
  }, [activeThemeKey]);

  const setMood = useCallback(
    (moodName: string) => {
      const normalizedMood = moodName.toUpperCase();
      if (MOOD_THEMES[normalizedMood]) {
        setCurrentMoodState(MOOD_THEMES[normalizedMood]);
        setSelectedMoods([MOOD_THEMES[normalizedMood]]);
      } else {
        resetToUserTheme();
      }
    },
    [resetToUserTheme]
  );

  const setMoods = useCallback(
    (moodNames: string[]) => {
      if (moodNames.length === 0) {
        resetToUserTheme();
        return;
      }

      const moodThemes = moodNames
        .map((name) => {
          const normalizedMood = name.toUpperCase();
          return MOOD_THEMES[normalizedMood] || null;
        })
        .filter((mood): mood is MoodTheme => mood !== null);

      if (moodThemes.length > 0) {
        setCurrentMoodState(moodThemes[0]);
        setSelectedMoods(moodThemes);
      } else {
        resetToUserTheme();
      }
    },
    [resetToUserTheme]
  );

  const setMoodByColorCategory = useCallback(
    (label: string, colorCategory: string) => {
      const normalizedLabel = label.toUpperCase();
      if (MOOD_THEMES[normalizedLabel]) {
        setCurrentMoodState(MOOD_THEMES[normalizedLabel]);
        setSelectedMoods([MOOD_THEMES[normalizedLabel]]);
        return;
      }

      const moodName = COLOR_CATEGORY_TO_MOOD[colorCategory] || "NEUTRAL";
      const theme = MOOD_THEMES[moodName];
      if (theme) {
        setCurrentMoodState(theme);
        setSelectedMoods([theme]);
      } else {
        resetToUserTheme();
      }
    },
    [resetToUserTheme]
  );

  const value = useMemo(
    () => ({
      currentMood,
      selectedMoods,
      activeThemeKey,
      setMood,
      setMoods,
      setMoodByColorCategory,
      setUserTheme,
      resetToUserTheme,
    }),
    [
      currentMood,
      selectedMoods,
      activeThemeKey,
      setMood,
      setMoods,
      setMoodByColorCategory,
      setUserTheme,
      resetToUserTheme,
    ]
  );

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
}

export function useMood() {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error("useMood must be used within a MoodProvider");
  }
  return context;
}
