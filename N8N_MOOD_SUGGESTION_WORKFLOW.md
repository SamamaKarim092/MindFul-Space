# n8n Mood Suggestion Workflow Setup Guide

This guide explains how to create the **AI Mood Suggestion** workflow in n8n that returns multiple mood suggestions based on the user's text.

## Workflow Structure

```
Webhook (POST) → HTTP Request (Groq/Llama) → Code Node (Parse) → Respond to Webhook
```

---

## Step 1: Create the Webhook Node

1. Add a **Webhook** node
2. Configure:
   - **Path**: `/webhook/suggest-mood`
   - **Method**: `POST`
   - **Authentication**: None (or Header Auth if preferred)
   - **Response Mode**: `When Last Node Finishes`

**Expected Input:**

```json
{
  "text": "Had a rough day at office"
}
```

---

## Step 2: HTTP Request to Groq

1. Add an **HTTP Request** node
2. Configure:
   - **Method**: `POST`
   - **URL**: `https://api.groq.com/openai/v1/chat/completions`
   - **Authentication**: `Generic Credential Type` → API Key
     - **Header Name**: `Authorization`
     - **Header Value**: `Bearer YOUR_GROQ_API_KEY`
   - **Send Headers**: Yes
     - Add header: `Content-Type: application/json`

**Body (JSON):**

⚠️ **CRITICAL**: The user content field MUST be in **EXPRESSION MODE** (click fx icon):

```json
{
  "model": "meta-llama/llama-4-scout-17b-16e-instruct",
  "messages": [
    {
      "role": "system",
      "content": "You are an expert mood and emotion analyzer. Your task is to carefully read what the user writes and infer their emotional state from the context and tone of their message.\n\nIMPORTANT GUIDELINES:\n- Analyze the CONTENT and CONTEXT of what they're describing, not just keywords\n- Consider what emotions someone would likely feel in the situation they describe\n- If they mention a negative situation, identify stress-related emotions\n- If they mention accomplishments, identify positive/productive emotions\n- Be nuanced - people can feel multiple emotions at once\n\nYou must return EXACTLY a JSON array with 4-5 specific mood words. Return ONLY the JSON array with NO other text.\n\nValid moods: Stressed, Frustrated, Overwhelmed, Exhausted, Anxious, Irritated, Burnt out, Drained, Accomplished, Relieved, Satisfied, Productive, Motivated, Content, Proud, Energized, Focused, Determined, Happy, Excited, Grateful, Peaceful, Calm, Hopeful, Restless, Nervous, Uncertain, Conflicted\n\nFormat: [\"Mood1\", \"Mood2\", \"Mood3\", \"Mood4\", \"Mood5\"]"
    },
    {
      "role": "user",
      "content": "{{ $json.body.text }}"
    }
  ],
  "temperature": 0.3,
  "max_tokens": 100
}
```

**⚠️ EXPRESSION MODE SETUP (CRITICAL)**:

1. Click on the user `content` field in HTTP Request node
2. Click the **fx** icon to enable **EXPRESSION MODE**
3. The field will turn blue/highlighted
4. Enter exactly: `{{ $json.body.text }}`
5. Verify it shows "EXPRESSION" mode, NOT "STATIC" mode
6. **Save** the workflow

**Common Error**: If you see "You haven't provided any text for me to analyze" in responses, it means the expression wasn't enabled. The expression must be dynamic, not static text!

---

## Step 3: Code Node (Parse Response)

1. Add a **Code** node
2. **JavaScript Code**:

```javascript
// Get the AI response
const groqResponse = $input.first().json;
const content = groqResponse.choices[0].message.content.trim();

console.log("Groq AI returned:", content);

let suggestions = [];

try {
  // Try to parse as JSON array
  suggestions = JSON.parse(content);

  // Validate that it's an array of strings
  if (!Array.isArray(suggestions)) {
    throw new Error("Response is not an array");
  }

  // Clean up and validate suggestions
  suggestions = suggestions
    .filter((s) => typeof s === "string" && s.length > 0)
    .map((s) => s.trim())
    .slice(0, 5); // Limit to 5 suggestions
} catch (error) {
  console.error("Failed to parse AI response:", error);

  // Fallback: Try to extract words from the response
  const words = content.match(/[A-Z][a-z]+/g) || [];
  suggestions = words.slice(0, 5);

  // If still empty, default to generic mood
  if (suggestions.length === 0) {
    suggestions = ["Neutral"];
  }
}

console.log("Final suggestions:", suggestions);

return {
  json: {
    suggestions: suggestions,
  },
};
```

---

## Step 4: Respond to Webhook

1. Add a **Respond to Webhook** node
2. Configure:
   - **Respond With**: `JSON`
   - **Response Body**: `{{ $json }}`

**Expected Output:**

```json
{
  "suggestions": ["Overwhelmed", "Stressed", "Exhausted", "Frustrated"]
}
```

---

## Testing the Workflow

### Test 1: Positive Text

**Input:**

```json
{
  "text": "I just crushed my workout at the gym!"
}
```

**Expected Output:**

```json
{
  "suggestions": ["Accomplished", "Energized", "Proud", "Strong"]
}
```

### Test 2: Negative Text

**Input:**

```json
{
  "text": "Had a rough day at office, feeling overwhelmed"
}
```

**Expected Output:**

```json
{
  "suggestions": ["Overwhelmed", "Stressed", "Exhausted", "Frustrated"]
}
```

### Test 3: Mixed/Complex Text

**Input:**

```json
{
  "text": "Finished a big project but exhausted"
}
```

**Expected Output:**

```json
{
  "suggestions": ["Accomplished", "Drained", "Relieved", "Tired"]
}
```

---

## Environment Variable

Add this to your `apps/api/.env`:

```env
N8N_MOOD_SUGGESTION_URL=http://localhost:5678/webhook/suggest-mood
```

---

## How It Works in the App

1. User types: **"Had a rough day at office, feeling overwhelmed"**
2. Frontend waits 1 second (debounce)
3. Checks keyword map first → No match
4. Calls GraphQL query → Calls NestJS → Calls n8n webhook
5. n8n sends to Groq AI → Returns: `["Overwhelmed", "Stressed", "Exhausted", "Frustrated"]`
6. Frontend shows **4 NEW clickable mood chips** with sparkle icon
7. User clicks **"Overwhelmed"** → Custom mood captured ✅

---

## Performance Tips

- **Timeout**: Set HTTP request timeout to 5 seconds
- **Caching**: Consider caching similar text inputs (optional)
- **Model**: Use `llama-3.3-70b-versatile` for best accuracy
- **Temperature**: Keep at 0.3 for consistent results
