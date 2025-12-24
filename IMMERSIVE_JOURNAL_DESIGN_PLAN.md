# Immersive Journal Experience: Design & Implementation Plan

## 🎯 Vision: "The Empathic Interface"
Our goal is to transform the journal from a static data entry form into a **living, reactive environment**. The application should not just record the user's emotions but *resonate* with them visually.

When a user writes about joy, the screen should feel warm and inviting. When they process anxiety, the environment should become calm, grounded, and steady. This creates a feedback loop that validates the user's feelings and encourages deeper reflection.

---

## 🎨 Feature: Ambient Mesh Gradients (Full Page Background)

Instead of limiting feedback to a small icon or border, the **entire application background** (including sidebar and main content areas) will shift to reflect the current mood.

### 1. Visual Language & Color Psychology
We will use **Mesh Gradients**—soft, multi-point gradient blobs that blend seamlessly—rather than flat colors. This avoids harsh transitions and feels more organic.

| Mood | Primary Tone | Secondary Tone | Accent | Vibe / Psychology |
| :--- | :--- | :--- | :--- | :--- |
| **Neutral (Default)** | Deep Charcoal (`#0F0714`) | Midnight Blue | Subtle Purple | Clean, ready, potential. |
| **Happy / Grateful** | Warm Gold (`#FFD700`) | Soft Peach (`#FF9966`) | White Glow | Sunny, optimistic, uplifting. |
| **Sad / Reflective** | Deep Ocean Blue (`#0F172A`) | Muted Teal (`#1E293B`) | Slate | Safe, deep, private. |
| **Anxious** | Soft Lavender (`#E0B0FF`) | Indigo (`#4B0082`) | Cool Blue | **Calming**, slowing down, breathing. |
| **Energetic** | Vibrant Orange (`#FF4500`) | Hot Pink (`#FF1493`) | Yellow | Dynamic, fast, intense. |
| **Calm** | Sage Green (`#84A98C`) | Earthy Brown (`#2F3E46`) | Soft White | Grounded, natural, steady. |

### 2. The "Breathing" Effect
The background shouldn't just change color; it should move.
- **Micro-Motion:** The gradient blobs will slowly rotate or drift (CSS Keyframes).
- **Transitions:** All color changes will have a `duration-1000` or `duration-2000` (1-2 seconds) ease-in-out. The room should "shift" slowly, like a cloud passing over the sun, not a light switch flicking on.

---

## 🛠️ Technical Implementation Plan

### Phase 1: Global Mood State Management
The `JournalEditor` currently holds the mood state locally. To affect the global background, we need to lift this state or use a Context provider.

**Strategy: The `MoodContext`**
1.  Create `apps/web/src/app/context/MoodContext.tsx`.
2.  This context will expose:
    -   `currentMood`: The active mood object (colors, label).
    -   `setMood`: Function to update the mood.
3.  Wrap the main Dashboard Layout (`apps/web/src/app/dashboard/layout.tsx`) with this provider.

### Phase 2: The Background Component
Create a new component: `apps/web/src/app/components/ui/AmbientBackground.tsx`.

**Structure:**
```tsx
// Pseudo-code
<div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
  {/* Layer 1: Base Background Color (Smooth Transition) */}
  <div className={`absolute inset-0 transition-colors duration-[2000ms] ${currentMood.baseBg}`} />

  {/* Layer 2: Gradient Blobs (Animated) */}
  <div className={`absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-r ${currentMood.gradient1} blur-[120px] animate-blob`} />
  <div className={`absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-r ${currentMood.gradient2} blur-[120px] animate-blob animation-delay-2000`} />
  
  {/* Layer 3: Noise Texture (Optional) */}
  <div className="absolute inset-0 opacity-[0.03] bg-noise-pattern" />
</div>
```

### Phase 3: Integration
1.  **Dashboard Layout:** Insert `<AmbientBackground />` into `layout.tsx`. It sits behind `children`.
2.  **Journal Editor:**
    -   Use `useMood()` hook.
    -   When `detectMoodFromText` or user selection runs, call `setMood(newMood)`.
    -   Remove the local mood styling from the *editor container* (since the whole page now provides the color) or make the editor semi-transparent glass (`bg-black/10 backdrop-blur-md`) so the background shows through.

---

## 🚀 Execution Steps for Team

1.  **Setup Context:** Create the `MoodContext` and wrap the dashboard.
2.  **Create Component:** Build the `AmbientBackground` with the Tailwind animations defined in `tailwind.config.ts` (we may need to add custom keyframes for the "blob" movement).
3.  **Connect Editor:** Refactor `JournalEditor.tsx` to push state to the context.
4.  **Refine & Polish:** Adjust opacity and blur levels to ensure text readability remains high (Accessibility check).

---

## ✅ Definition of Done
- [ ] User types "I am so happy today!", and the entire screen slowly warms to a golden glow.
- [ ] User types "I feel anxious," and the screen cools to a slow-moving lavender pulse.
- [ ] Navigating between dashboard pages maintains the last known mood state (optional) or resets gently.
- [ ] Text remains perfectly readable against all background variants.
