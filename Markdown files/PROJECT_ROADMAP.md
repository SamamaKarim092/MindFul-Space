# Mental Health Sentiment Journal - Project Roadmap

This document consolidates all planned, upcoming, and to-do features for the application, streamlining previous design documents and guides.

*(Note: Basic Sentiment Analysis for journal entries has already been implemented via n8n, NestJS, and Next.js).*

---

## 1. 🤖 AI Coach Integration ("Active Listener")

**Goal:** Turn solitary journaling into an interactive support system by offering real-time conversation.

*   **Coach Bubble (Frontend):** A small UI element that appears while the user types, offering a gentle follow-up question based on their text (e.g., "Wanna talk about it?").
*   **Chat Handoff:** Clicking the bubble saves the current journal entry and redirects the user to the AI Chat, pre-loading the chat context with the entry's content.
*   **n8n Workflow - Active Listener:** A webhook triggered by a frontend debounce function. It sends the draft to an LLM to generate a short, contextual question.
*   **n8n Workflow - Compassionate Chat:** Handles the deep chat session. If the user comes from a journal entry, the system prompt is adjusted to focus on processing that specific entry.

## 2. 🎨 Immersive Journal Experience (Ambient Gradients)

**Goal:** Make the application feel "alive" by having the background react to the user's current or detected mood.

*   **Global Mood State:** Implement a `MoodContext` in React to manage the mood state across the entire dashboard.
*   **AmbientBackground Component:** A full-page, animated mesh gradient background that sits behind the application and slowly transitions colors (1-2 seconds) based on the current mood.
*   **Color Mapping:**
    *   *Neutral:* Deep Charcoal
    *   *Happy/Grateful:* Warm Gold / Soft Peach
    *   *Sad:* Deep Ocean Blue
    *   *Anxious:* Soft Lavender / Indigo
    *   *Energetic:* Vibrant Orange / Hot Pink
    *   *Calm:* Sage Green / Earthy Brown

## 3. ⚡ Live Mood Detection

**Goal:** Automatically suggest moods to the user as they type their journal entry.

*   **Instant Keyword Match (Client-Side):** Zero-latency matching for common words (e.g., typing "gym" instantly suggests "Energetic").
*   **AI Analysis (n8n):** A synchronous webhook that analyzes complex text and returns a specific mood suggestion and color category (e.g., returning "Overwhelmed" -> "RED").
*   **UI Interaction:** The UI should gently highlight or make the suggested mood button "glow", rather than forcing the selection, keeping the user in control.

## 4. 📊 Advanced Dashboard Analytics

**Goal:** Extract more value from journal entries to provide deeper personal insights.

*   **Keyword & Theme Extraction:** Use n8n/AI to find recurring topics in entries (e.g., "work", "sleep", "family") and correlate them with the user's mood scores.
*   **Memory Lane Widget:** A dashboard widget that surfaces meaningful past entries (e.g., "On this day last year...").

## 5. ⚙️ Proactive Automations (n8n)

**Goal:** Use background processing to provide support without the user actively asking for it.

*   **Weekly Mood Report:** A scheduled n8n workflow (e.g., every Sunday) that calculates average moods and top themes, sending a friendly summary email to the user.
*   **Proactive Alerts:** A workflow that monitors sentiment scores. If a user's mood is consistently very low for several days, it triggers a gentle in-app notification or email suggesting helpful resources or the AI Coach.