# 🧠 AI Coach Integration: From Reflection to Conversation

## 🌟 The Concept
This feature bridges the gap between **solitary journaling** and **interactive therapy**. 

Often, users write about difficult emotions but get stuck asking, *"Now what?"* By offering a "Wanna talk about it?" button right at that moment of vulnerability, we turn a static diary into an active support system.

### Why this is a Great Idea
*   **Immediate Intervention:** Catches the user exactly when they are processing an emotion.
*   **Seamless Handoff:** Saves the user from having to re-explain their context to the AI.
*   **Closure:** Ensures the journal entry is safely stored before moving to the conversation.

---

## 🔄 User Flow

1.  **Typing:** User types in the `JournalEditor`.
    *   *Example:* "I'm feeling really anxious about the presentation tomorrow."
2.  **AI Detection:** The "Active Listener" detects the anxiety.
3.  **Coach Bubble:** A small, friendly bubble appears:
    *   *Text:* "That sounds stressful. Big presentations can be daunting."
    *   *Action:* **[ 💬 Wanna talk about it? ]**
4.  **The Pivot (Dialog):** User clicks the button.
    *   *System Dialog:* "Your entry has been saved. Ready to chat with your AI companion?"
    *   *Choice:* [Cancel] or [**Let's Talk**]
5.  **Transition:**
    *   The Journal Entry is **saved** to the database.
    *   The user is redirected to `/dashboard/chat` (or `/therapist`).
6.  **The Conversation:**
    *   The AI Chat opens **pre-loaded** with the context: *"I saw you were writing about your presentation. What specific part is worrying you the most?"*

---

## 🛠️ Technical Implementation

### 1. Frontend: The "Coach Bubble"
We need a new component in `apps/web/src/app/components/journal/CoachBubble.tsx`.
*   **Props:** `suggestion`, `onTalkClick`, `isLoading`.
*   **UI:** A floating card with a "typing" animation and the Call-to-Action button.

### 2. The "Handoff" Logic (JournalEditor.tsx)
We need to handle the save-and-redirect sequence.

```typescript
const handleTalkAboutIt = async () => {
  // 1. Show Confirmation Dialog
  const confirmed = await showDialog({
    title: "Switch to Chat?",
    message: "We'll save your entry so far. Ready to talk it through?"
  });

  if (!confirmed) return;

  // 2. Save the Entry
  const savedEntry = await createEntry({ ... });

  // 3. Redirect with Context
  // We pass the entry ID so the Chat knows what we are talking about
  router.push(`/dashboard/chat?contextEntryId=${savedEntry.id}`);
};
```

### 3. The Backend: "Contextual Chat"
The Chat page needs to know *why* the user is there.

*   **API Update:** The Chat initialization endpoint needs to accept an optional `entryId`.
*   **AI Prompting:** If an `entryId` is present, the System Prompt for the AI changes:
    *   *Standard:* "Hello, how can I help?"
    *   *Contextual:* "The user just wrote this journal entry: [Entry Content]. Start the conversation by acknowledging this and asking a supportive follow-up question."

### 4. Database Schema
We might want to link Chats to Entries.
*   Add `entryId` (optional) to the `Chat` model in `schema.prisma`.
*   This allows us to see "This chat session was about Journal Entry #123".

---

## 🚀 Refinements & Suggestions

### A. The "Side Drawer" Alternative
Instead of leaving the page entirely, the Chat could slide in from the right side (a Drawer).
*   **Pro:** The user can still see their journal while chatting.
*   **Con:** Might feel cluttered on mobile.
*   **Recommendation:** Stick to your page navigation idea for now—it's cleaner and encourages focus.

### B. Auto-Save (Frictionless)
Instead of asking "Do you want to save?", you could **Auto-Save** immediately when they click "Wanna talk about it?".
*   *User Experience:* Click "Talk" -> Toast Notification "Entry Saved" -> Instant Redirect.
*   *Why:* Reduces clicks. If they clicked "Talk", they obviously want to move on.

### C. The "Summary" Handoff
Pass a summary to the AI, not just the raw text.
*   *N8n Workflow:* When saving, have N8n generate a "Therapist Brief" (e.g., "User is anxious about public speaking").
*   Pass this brief to the Chat context.

---

## 📝 Next Steps Checklist

- [ ] **Component:** Build `<CoachBubble />` with the "Talk" button.
- [ ] **State:** Add logic to `JournalEditor` to trigger the AI suggestion.
- [ ] **Routing:** Implement `handleTalkAboutIt` with the save-and-redirect logic.
- [ ] **Chat Page:** Update the Chat interface to read `?contextEntryId=...` from the URL.
- [ ] **Backend:** Ensure the Chat service can look up the Entry content to prime the AI.
