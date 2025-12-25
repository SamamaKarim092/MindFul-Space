# 🤖 AI Coach & Active Listener - n8n Workflow Guide

This guide details how to set up the **two** n8n workflows required for the complete "AI Coach" experience:
1.  **The Active Listener:** Generates the short "Wanna talk about it?" suggestions while the user journals.
2.  **The Compassionate Chat:** Handles the deep, contextual conversation when the user decides to talk.

---

## 🔑 Prerequisites

Before you start, ensure you have:
1.  **n8n Installed** (Self-hosted or Cloud).
2.  **Groq API Key** (or OpenAI Key) for the LLM.
3.  **n8n Credentials Set Up:**
    *   Go to n8n > Credentials > New > "Header Auth"
    *   Name: `Groq Auth`
    *   Header Name: `Authorization`
    *   Value: `Bearer gsk_your_groq_api_key_here`

---

#  PART 1: The "Active Listener" (Coach Bubble)
*This workflow runs silently while the user types. It reads their draft and suggests a follow-up question.*

### 🛠️ Workflow Diagram
```mermaid
[Webhook: POST /suggest-follow-up] --> [AI Agent: Generate Question] --> [Response: JSON]
```

### 📝 Step-by-Step Setup

#### Node 1: Webhook (Trigger)
*   **Node Type:** Webhook
*   **Action:** On webhook call
*   **Method:** `POST`
*   **Path:** `/suggest-follow-up`
*   **Authentication:** None (or Header Auth if preferred)
*   **Respond:** "Using 'Respond to Webhook' Node"
*   **Purpose:** Receives the `text` from the Journal Editor.

#### Node 2: AI Agent (Groq/OpenAI)
*   **Node Type:** HTTP Request
*   **Method:** `POST`
*   **URL:** `https://api.groq.com/openai/v1/chat/completions`
*   **Authentication:** Select "Predefined Credential Type" -> `Header Auth` -> Choose `Groq Auth`.
*   **Headers:**
    *   `Content-Type`: `application/json`
*   **Body:** `JSON`
*   **JSON Parameter:**
    ```json
    {
      "model": "meta-llama/llama-4-scout-17b-16e-instruct",
      "messages": [
        {
          "role": "system",
          "content": "You are an empathetic listener. The user is writing a journal entry. Read their text. If it is emotional or they seem stuck, generate ONE short, gentle follow-up question (max 15 words) that encourages them to explore the 'why'. If the text is too short or just a list, return 'null'. JSON Output: { \"suggestion\": \"Your question here\" }"
        },
        {
          "role": "user",
          "content": "{{ $json.body.text }}"
        }
      ],
      "response_format": { "type": "json_object" }
    }
    ```
*   **Purpose:** Analyzes the text and creates the question.

#### Node 3: Parse & Respond
*   **Node Type:** Respond to Webhook
*   **Respond With:** `JSON`
*   **Response Body:**
    ```json
    {{ $json.choices[0].message.content }}
    ```
*   **Purpose:** Sends the suggestion back to the frontend.

---

# PART 2: The "Compassionate Chat" (Deep Conversation)
*This workflow handles the actual chat session when the user clicks "Let's Talk".*

### 🛠️ Workflow Diagram
```mermaid
[Webhook: POST /ai-chat] --> [IF: Has Context?] --> [Prompt: Contextual vs Standard] --> [AI Agent] --> [Response]
```

### 📝 Step-by-Step Setup

#### Node 1: Webhook (Chat Receiver)
*   **Node Type:** Webhook
*   **Method:** `POST`
*   **Path:** `/ai-chat`
*   **Purpose:** Receives the user's message, plus `contextEntry` (what they wrote in the journal).

#### Node 2: IF Node (Context Checker)
*   **Node Type:** If
*   **Condition:**
    *   Value 1: `{{ $json.body.contextEntry }}`
    *   Operator: `Is Not Empty`
*   **Purpose:** Checks if the user just came from the Journal (Contextual) or is just chatting normally (Standard).

#### Node 3A: Set System Prompt (True Branch - Contextual)
*   **Node Type:** Code (JavaScript)
*   **Code:**
    ```javascript
    const context = $json.body.contextEntry;
    const sysPrompt = `You are a warm, wise AI therapist. 
    The user just wrote this journal entry: "${context.content}". 
    Title: "${context.title}".
    
    Your goal is to help them process this specific entry. 
    Start by acknowledging their feelings about this topic. 
    Do not be repetitive. Be conversational.`;
    
    return { systemPrompt: sysPrompt };
    ```

#### Node 3B: Set System Prompt (False Branch - Standard)
*   **Node Type:** Code (JavaScript)
*   **Code:**
    ```javascript
    return { systemPrompt: "You are a warm, wise AI therapist. Help the user explore their feelings." };
    ```

#### Node 4: Merge
*   **Node Type:** Merge
*   **Mode:** Append
*   **Purpose:** Recombines the two branches so both go to the AI node.

#### Node 5: AI Agent (Groq)
*   **Node Type:** HTTP Request
*   **Method:** `POST`
*   **URL:** `https://api.groq.com/openai/v1/chat/completions`
*   **Authentication:** `Groq Auth`
*   **Body:** `JSON`
*   **JSON Parameter:**
    ```json
    {
      "model": "meta-llama/llama-4-scout-17b-16e-instruct",
      "messages": [
        {
          "role": "system",
          "content": "{{ $json.systemPrompt }}"
        },
        // We assume chatHistory is passed as an array of objects
        ...{{ $json.body.chatHistory }},
        {
          "role": "user",
          "content": "{{ $json.body.message }}"
        }
      ]
    }
    ```

#### Node 6: Respond
*   **Node Type:** Respond to Webhook
*   **Response Body:**
    ```json
    {
      "response": "{{ $json.choices[0].message.content }}"
    }
    ```

---

## 🔗 Integration Guide (Frontend/Backend)

### 1. The Coach Bubble (Frontend)
In `JournalEditor.tsx`, you call the Part 1 Webhook (`/suggest-follow-up`) after the user stops typing for 3 seconds.
*   **Input:** `{ "text": "I feel sad about..." }`
*   **Output:** `{ "suggestion": "What specifically is making you feel this way?" }`

### 2. The Handoff (Frontend Logic)
When the user clicks "Wanna talk about it?":
1.  Save the entry via GraphQL `createEntry`.
2.  Get the `entryId` from the response.
3.  Redirect: `router.push('/dashboard/chat?contextEntryId=' + entryId)`.

### 3. The Chat Initialization (Backend)
In `ChatsService`, when a chat starts with `contextEntryId`:
1.  Fetch the entry content from the database.
2.  Call the Part 2 Webhook (`/ai-chat`) passing:
    ```json
    {
      "message": "I want to talk about this entry.",
      "contextEntry": {
         "title": "My Sad Day",
         "content": "I feel sad about..."
      }
    }
    ```
3.  The AI will respond with a context-aware opener.