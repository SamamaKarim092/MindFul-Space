# Journal Experience Improvement & Live Mood Detection Guide

This document outlines a plan to transform the **Mental Health Sentiment Journal** from a standard logging tool into an engaging, interactive, and "alive" experience. It also details the technical implementation for the **Live Mood Detection** feature.

---

## 🎨 Part 1: The Vision - Making the App "Not Boring"

We want users to feel heard and understood, not just like they are filing paperwork. Here are three key strategies:

### 1. The "Live" Journaling Experience (Real-Time Feedback)
Instead of a static form, the editor reacts to what the user writes.
*   **Context-Aware Moods:** If a user types "I just crushed my deadlift PR," the app shouldn't wait for them to click "Energetic." It should highlight that mood button automatically.
*   **Dynamic Backgrounds:** As the detected mood shifts (e.g., from "tired" to "hopeful"), the background gradient of the editor could subtly shift colors (e.g., from grey-blue to warm orange).

### 2. AI Co-Pilot (The "Therapist" in the Machine)
Turn the monologue into a dialogue.
*   **Magic Title Generator:** Users often hate summarizing their day. A "✨ Generate Title" button reads their entry and proposes titles like "The Gym Breakthrough" or "A Quiet Sunday" instead of generic dates.
*   **"Deepen the Reflection" Prompts:** If a user writes a very short entry like "I felt bad today," an AI helper button could appear asking: *"Would you like to explore why? Was it a specific interaction or just low energy?"*

### 3. The "Alive" Dashboard
The dashboard should reflect the user's current state, not just show charts.
*   **Atmospheric Theming:** If the user's average mood this week is "Calm," the dashboard uses soothing blues/greens. If it's "Energetic," it uses vibrant yellows/reds.
*   **Memory Lane:** A widget that surfaces past wins. *"Remember this day last month? You felt great because you finished that project."*
*   **GitHub-Style Mood Map:** A heatmap calendar where the color intensity represents mood intensity, creating a satisfying visual of their emotional journey.

---

## ⚡ Part 2: "Live Mood Detection" - Implementation Guide

This section focuses on your specific request: **"User types 'gym' -> App suggests 'Energetic'."**

We will implement a **Hybrid Approach**:
1.  **Instant Keyword Match (Client-side):** For common words, it works instantly.
2.  **AI Analysis (n8n Workflow):** For complex sentences, we ask the AI.

### 🏗️ Architecture Overview

1.  **User types** in `JournalEditor.tsx`.
2.  **Debounce Function** waits for the user to stop typing for 1 second (to avoid spamming).
3.  **Frontend** sends the text to a new API endpoint: `POST /api/entries/suggest-mood`.
4.  **API** forwards this to a **Synchronous n8n Webhook**.
5.  **n8n** analyzes the text and returns a specific mood.
6.  **Frontend** updates the selected mood button with a "✨ Suggested" glow.

### 🔧 Step-by-Step Implementation

#### 1. The n8n Workflow (The Brain)

This workflow needs to be **fast**. We are not saving data here, just analyzing and returning.

*   **Node 1: Webhook (POST)**
    *   **Path:** `/webhook/suggest-mood`
    *   **Method:** POST
    *   **Authentication:** Header Auth (optional but recommended)
    *   **Expected Body:** `{ "text": "I am going to the gym" }`

*   **Node 2: AI Agent (Basic LLM Chain)**
    *   **Model:** Gemini Flash (Fast & Cheap) or GPT-3.5 Turbo.
    *   **System Prompt:**
        > You are a mood classifier.
        > Analyze the user's text and map it to EXACTLY ONE of these values: POSITIVE, NEUTRAL, NEGATIVE.
        > Also suggest a specific label from this list: Happy, Sad, Anxious, Energetic, Calm, Frustrated, Grateful.
        > Output JSON only: `{ "mood": "POSITIVE", "label": "Energetic" }`

*   **Node 3: Respond to Webhook**
    *   **Respond With:** JSON
    *   **Body:** Output from the AI node.

#### 2. The Backend (NestJS API)

We need a controller to talk to n8n safely.

**File:** `apps/api/src/entries/entries.controller.ts` (New Endpoint)

```typescript
@Post('suggest-mood')
async suggestMood(@Body() body: { content: string }) {
  // Call the n8n webhook
  const response = await axios.post(process.env.N8N_SUGGEST_WEBHOOK_URL, {
    text: body.content
  });
  return response.data; // Returns { mood: 'POSITIVE', label: 'Energetic' }
}
```

#### 3. The Frontend (JournalEditor.tsx)

We add the "listening" logic.

**Logic Flow:**

```typescript
// Inside JournalEditor component

// 1. Debounce Logic: Only check when user stops typing for 1000ms
useEffect(() => {
  const timeoutId = setTimeout(() => {
    if (content.length > 10) { // Only check if meaningful text exists
      checkMood(content);
    }
  }, 1000);
  return () => clearTimeout(timeoutId);
}, [content]);

// 2. The Check Function
const checkMood = async (text) => {
    // OPTION A: Instant Local Check (Super Fast)
    const lowerText = text.toLowerCase();
    if (lowerText.includes('gym') || lowerText.includes('run')) {
        setSuggestedMood('Energetic'); // Highlight Energetic
        return;
    }
    if (lowerText.includes('sad') || lowerText.includes('cry')) {
        setSuggestedMood('Sad'); // Highlight Sad
        return;
    }

    // OPTION B: AI Check (via n8n)
    // const response = await fetch('/api/entries/suggest-mood', ...);
    // setSuggestedMood(response.label);
};
```

### 🌟 How to Make the UI "Interactive"

When the mood is detected:
1.  Do **not** force-change the selection (this is annoying).
2.  Instead, make the suggested mood button **glow** or show a small tooltip.
3.  Add a generic message above the buttons: *"It sounds like you're feeling **Energetic**?"*

---

## 🚀 Summary of Work

To get this running, we will:

1.  **Frontend:** Update `JournalEditor.tsx` to listen to text changes.
2.  **Frontend:** Create a `keyword-map.ts` for instant "Gym" -> "Energetic" detection (Zero Latency).
3.  **Backend:** (Optional for now) Set up the AI route if the local keywords aren't smart enough.

**Recommendation:** Start with the **Frontend Keyword Map**. It requires NO server changes, is instant, and covers your specific "Gym" example immediately. We can add the AI layer later if you want it to understand complex emotions.
