# n8n Mood Suggestion Workflow Setup Guide

This guide explains how to create the **AI Mood Suggestion** workflow in n8n that returns multiple mood suggestions **along with their color categories** based on the user's text.

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
      "content": "You are an expert in emotional intelligence and sentiment analysis. Your task is to analyze journal entries and identify the emotional states present.\n\nAnalyze the user's journal entry carefully and identify 3-5 distinct mood labels that best represent the emotions expressed.\n\nFor each mood label you identify, assign ONE color category from this exact list:\n- GREEN: happiness, contentment, peace, growth, satisfaction, hope, calm positivity\n- BLUE: sadness, melancholy, grief, loneliness, reflective calmness, pensiveness\n- YELLOW: excitement, energy, enthusiasm, motivation, nervousness, restlessness, anticipation\n- PURPLE: contemplation, spirituality, mystery, complexity, introspection, wonder\n- RED: anger, frustration, intensity, passion, irritation, agitation\n\nIMPORTANT FORMATTING RULES:\n1. Return ONLY a valid JSON array\n2. Do NOT include markdown code blocks or backticks\n3. Do NOT include any explanatory text\n4. Each object must have exactly two fields: \"label\" and \"color_category\"\n5. Use proper JSON syntax with double quotes\n\nExample of correct output format:\n[\n  {\"label\": \"Nostalgic\", \"color_category\": \"BLUE\"},\n  {\"label\": \"Determined\", \"color_category\": \"YELLOW\"},\n  {\"label\": \"Peaceful\", \"color_category\": \"GREEN\"}\n]"
    },
    {
      "role": "user",
      "content": "Please analyze this journal entry and identify the moods present:\n\n{{ $json.body.text }}"
    }
  ],
  "temperature": 0.3,
  "max_tokens": 200
}
```

**⚠️ EXPRESSION MODE SETUP (CRITICAL)**:

1. Click on the user `content` field in HTTP Request node
2. Click the **fx** icon to enable **EXPRESSION MODE**
3. The field will turn blue/highlighted
4. Enter exactly: `{{ $json.body.text }}`
5. Verify it shows "EXPRESSION" mode, NOT "STATIC" mode
6. **Save** the workflow

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
  // Remove markdown code blocks and any extra whitespace
  const cleanContent = content
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  
  suggestions = JSON.parse(cleanContent);

  // Validate that it's an array
  if (!Array.isArray(suggestions)) {
    throw new Error("Response is not an array");
  }

  // Validate structure of each suggestion
  suggestions = suggestions.filter(s => 
    s && 
    typeof s.label === 'string' && 
    typeof s.color_category === 'string'
  );

  // Limit to 5 suggestions
  suggestions = suggestions.slice(0, 5);
  
  // Final check - ensure we have at least one valid suggestion
  if (suggestions.length === 0) {
    throw new Error("No valid suggestions found");
  }
} catch (error) {
  console.error("Failed to parse AI response:", error);
  
  // Fallback if parsing fails
  suggestions = [{ label: "Reflective", color_category: "BLUE" }];
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
  "suggestions": [
    { "label": "Overwhelmed", "color_category": "RED" },
    { "label": "Exhausted", "color_category": "BLUE" },
    { "label": "Stressed", "color_category": "YELLOW" }
  ]
}
```

---

## Testing the Workflow

### Test 1: Positive Text

**Input:**
```json
{ "text": "I just crushed my workout at the gym!" }
```

**Expected Output:**
```json
{
  "suggestions": [
    { "label": "Accomplished", "color_category": "YELLOW" },
    { "label": "Energized", "color_category": "YELLOW" },
    { "label": "Proud", "color_category": "GREEN" }
  ]
}
```

### Test 2: Negative Text

**Input:**
```json
{ "text": "Had a rough day at office, feeling overwhelmed" }
```

**Expected Output:**
```json
{
  "suggestions": [
    { "label": "Overwhelmed", "color_category": "RED" },
    { "label": "Drained", "color_category": "BLUE" }
  ]
}
```

---

## Environment Variable

Add this to your `apps/api/.env`:

```env
N8N_MOOD_SUGGESTION_URL=http://localhost:5678/webhook/suggest-mood
```