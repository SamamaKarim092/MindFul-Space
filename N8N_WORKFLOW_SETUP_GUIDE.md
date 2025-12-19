# n8n Sentiment Analysis Workflow Setup Guide

This guide will walk you through setting up the sentiment analysis workflow in n8n.

## Prerequisites

- ✅ n8n installed and running (default: http://localhost:5678)
- ✅ Google Cloud account with Natural Language API enabled (or alternative AI service)
- ✅ Database credentials (already configured in your project)

---

## Step-by-Step Setup

### Step 1: Start n8n

If you haven't started n8n yet, run:

```bash
npx n8n
```

Or if you installed it globally:

```bash
n8n start
```

n8n will be accessible at: **http://localhost:5678**

---

### Step 2: Create a New Workflow

1. Open n8n in your browser: http://localhost:5678
2. Click **"Create New Workflow"**
3. Give it a name: **"Mental Health Journal - Sentiment Analysis"**

---

### Step 3: Add the Webhook Node (Trigger)

**This node receives the journal entry data from your API**

1. Click the **"+"** button to add a new node
2. Search for and select **"Webhook"**
3. Configure the webhook:
   - **HTTP Method**: `POST`
   - **Path**: `sentiment-analysis` (or any name you prefer)
   - **Response Mode**: `Immediately`
   - **Response Code**: `200`

4. **IMPORTANT**: Click "Execute Node" or save the workflow to generate the webhook URL
5. **Copy the webhook URL** - it will look like:
   ```
   http://localhost:5678/webhook/sentiment-analysis
   ```
6. **Paste this URL** into your `.env` file:
   ```
   N8N_WEBHOOK_URL=http://localhost:5678/webhook/sentiment-analysis
   ```

**Expected Data from Webhook:**

```json
{
  "entryId": "550e8400-e29b-41d4-a716-446655440000",
  "content": "Today I felt amazing and accomplished so much!"
}
```

---

### Step 4: Add Sentiment Analysis Node

You have several options for sentiment analysis. Choose one:

#### Option A: Hugging Face Inference API (Recommended - Free & Stable)

1. Add a new **"HTTP Request"** node
2. Connect it to the Webhook node
3. Configure:
   - **Method**: `POST`
   - **URL**: `https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest`
   - **Headers**:
     - Name: `Authorization`
     - Value: `Bearer YOUR_HUGGING_FACE_TOKEN`
   - **Body Content Type**: `JSON`
   - **Body**:
   ```json
   {
     "inputs": "{{ $json.body.content }}"
   }
   ```

#### Option B: Google Gemini API (Alternative)

1. Add a new **"HTTP Request"** node
2. Connect it to the Webhook node
3. Configure:
   - **Method**: `POST`
   - **URL**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=YOUR_GEMINI_API_KEY`
   - **Body Content Type**: `JSON`
   - **Body**:
   ```json
   {
     "contents": [
       {
         "parts": [
           {
             "text": "Analyze the sentiment of this text and respond with ONLY a single number between -1.0 (very negative) and 1.0 (very positive). No explanation, just the number.\n\nText: {{ $json.body.content }}"
           }
         ]
       }
     ]
   }
   ```

**Getting Gemini API Key:**

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click **"Get API key"**
3. Copy the API key and replace the key in the URL above

**Response Format:**

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "0.8"
          }
        ]
      }
    }
  ]
}
```

#### Option B: Google Cloud Natural Language API (Alternative)

1. Add a new **"HTTP Request"** node
2. Connect it to the Webhook node
3. Configure:
   - **Method**: `POST`
   - **URL**: `https://language.googleapis.com/v1/documents:analyzeSentiment?key=YOUR_API_KEY`
   - **Body Content Type**: `JSON`
   - **Body**:
   ```json
   {
     "document": {
       "type": "PLAIN_TEXT",
       "content": "{{ $json.body.content }}"
     },
     "encodingType": "UTF8"
   }
   ```

**Getting Google Cloud API Key:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Cloud Natural Language API"
4. Go to **APIs & Services > Credentials**
5. Click **Create Credentials > API Key**
6. Copy the API key and replace `YOUR_API_KEY` in the URL above

**Response Format:**

```json
{
  "documentSentiment": {
    "score": 0.8, // Range: -1.0 (negative) to 1.0 (positive)
    "magnitude": 0.8
  }
}
```

#### Option C: Hugging Face Inference API (Free Alternative)

1. Add a new **"HTTP Request"** node
2. Configure:
   - **Method**: `POST`
   - **URL**: `https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest`
   - **Headers**:
     - **Name**: `Authorization`
     - **Value**: `Bearer YOUR_HUGGINGFACE_TOKEN`
   - **Body Content Type**: `JSON`
   - **Body**:
   ```json
   {
     "inputs": "{{ $json.body.content }}"
   }
   ```

**Getting Hugging Face Token:**

1. Go to [huggingface.co](https://huggingface.co/)
2. Sign up/login
3. Go to Settings > Access Tokens
4. Create a new token
5. Copy and use in the Authorization header

**Response Format:**

```json
[
  [
    { "label": "POSITIVE", "score": 0.9998 },
    { "label": "NEGATIVE", "score": 0.0002 }
  ]
]
```

#### Option C: OpenAI API

1. Add a new **"HTTP Request"** node
2. Configure:
   - **Method**: `POST`
   - **URL**: `https://api.openai.com/v1/chat/completions`
   - **Headers**:
     - **Name**: `Authorization`
     - **Value**: `Bearer YOUR_OPENAI_API_KEY`
     - **Name**: `Content-Type`
     - **Value**: `application/json`
   - **Body**:
   ```json
   {
     "model": "gpt-3.5-turbo",
     "messages": [
       {
         "role": "system",
         "content": "Analyze the sentiment of the following text and return ONLY a number between -1.0 (very negative) and 1.0 (very positive). Return only the number, nothing else."
       },
       {
         "role": "user",
         "content": "{{ $json.body.content }}"
       }
     ],
     "temperature": 0.3
   }
   ```

#### Option D: Google AI Studio / Gemini API (Recommended - Great Free Tier!)

**Why Gemini?**

- 🆓 1500 requests per day free
- ⚡ Fast and accurate
- 🎯 Built-in sentiment understanding
- 🔑 No credit card required

1. Add a new **"HTTP Request"** node
2. Configure:
   - **Method**: `POST`
   - **URL**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=YOUR_GEMINI_API_KEY`
   - **Body Content Type**: `JSON`
   - **Body**:
   ```json
   {
     "contents": [
       {
         "parts": [
           {
             "text": "Analyze the sentiment of this text and respond with ONLY a single number between -1.0 (very negative) and 1.0 (very positive). No explanation, just the number.\n\nText: {{ $json.body.content }}"
           }
         ]
       }
     ]
   }
   ```

**Response Format:**

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "0.8"
          }
        ]
      }
    }
  ]
}
```

---

### Step 5: Add Function Node (Data Transformation)

**This node normalizes the AI response into a consistent format**

1. Add a **"Function"** node
2. Connect it to the sentiment analysis node
3. Add this code:

**For Google Cloud:**

```javascript
// Extract sentiment score from Google Cloud response
const score = $input.first().json.documentSentiment.score;

// Get entry ID from the original webhook data
const entryId = $("Webhook").first().json.body.entryId;

return {
  json: {
    entryId: entryId,
    sentiment: score,
  },
};
```

**For Hugging Face:**

```javascript
// Extract sentiment score from Hugging Face response (cardiffnlp model)
const results = $input.first().json[0];
const positiveScore = results.find((r) => r.label === "positive")?.score || 0;
const negativeScore = results.find((r) => r.label === "negative")?.score || 0;

// Convert to -1 to 1 scale
const sentiment = positiveScore - negativeScore;

// Get entry ID from the original webhook data
const entryId = $("Webhook").first().json.body.entryId;

return {
  json: {
    entryId: entryId,
    sentiment: parseFloat(sentiment.toFixed(2)),
  },
};
```

**For OpenAI:**

```javascript
// Extract sentiment score from OpenAI response
const content = $input.first().json.choices[0].message.content;
const sentiment = parseFloat(content.trim());

// Get entry ID from the original webhook data
const entryId = $("Webhook").first().json.body.entryId;

return {
  json: {
    entryId: entryId,
    sentiment: sentiment,
  },
};
```

**For Google AI Studio / Gemini:**

```javascript
// Extract sentiment score from Gemini response
const text = $input.first().json.candidates[0].content.parts[0].text;
const sentiment = parseFloat(text.trim());

// Get entry ID from the original webhook data
const entryId = $("Webhook").first().json.body.entryId;

return {
  json: {
    entryId: entryId,
    sentiment: sentiment,
  },
};
```

---

### Step 6: Add the Update Node (Choose ONE Option)

You can update the database directly (Option A) or use the API (Option B - Recommended).

#### Option A: Postgres Node (Direct Database Update)

1. Add a **"Postgres"** node
2. Connect it to the Function node
3. Configure the connection with your database details from `.env`
4. Configure the query:
   - **Operation**: `Execute Query`
   - **Query**:
   ```sql
   UPDATE entries
   SET sentiment = {{ $json.sentiment }}
   WHERE id = '{{ $json.entryId }}'::uuid;
   ```
   _Note: The `::uuid` is required because your database uses UUID types._

#### Option B: HTTP Request Node (API Update - Recommended)

This is cleaner as it doesn't require sharing database credentials with n8n.

1. Add an **"HTTP Request"** node
2. Connect it to the Function node
3. Configure:
   - **Method**: `POST`
   - **URL**: `http://localhost:3001/graphql` (Your API URL)
   - **Body Content Type**: `JSON`
   - **Body**:
   ```json
   {
     "query": "mutation UpdateSentiment($id: String!, $sentiment: Float!) { updateEntrySentiment(id: $id, sentiment: $sentiment) { id sentiment } }",
     "variables": {
       "id": "{{ $json.entryId }}",
       "sentiment": {{ $json.sentiment }}
     }
   }
   ```

---

### Step 7: Save and Activate the Workflow

1. Click **"Save"** in the top right
2. Toggle the **"Active"** switch to ON
3. Your workflow is now live and ready to receive requests!

---

## Testing Your Workflow

### Test 1: Test in n8n

1. In the Webhook node, click **"Listen for Test Event"**
2. Open a new terminal and run:
   ```bash
   curl -X POST http://localhost:5678/webhook/sentiment-analysis \
     -H "Content-Type: application/json" \
     -d '{
       "entryId": "550e8400-e29b-41d4-a716-446655440000",
       "content": "I am feeling incredibly happy and grateful today!"
     }'
   ```
3. Watch the workflow execute in real-time
4. Check if each node shows successful execution (green checkmarks)

### Test 2: Test from Your Application

1. Make sure your API server is running
2. Make sure n8n workflow is active
3. Create a new journal entry through your frontend
4. Check the database to see if the sentiment score was updated:
   ```sql
   SELECT id, title, content, sentiment FROM entries ORDER BY "created_at" DESC LIMIT 1;
   ```

---

## Troubleshooting

### Issue: Webhook not receiving data

- **Solution**: Make sure the workflow is Active (toggle in top right)
- **Solution**: Check that `N8N_WEBHOOK_URL` in `.env` matches the webhook URL exactly
- **Solution**: Restart your API server after updating `.env`

### Issue: AI API returns errors

- **Solution**: Check your API key is valid
- **Solution**: Make sure you've enabled the API in your cloud console
- **Solution**: Check API rate limits (free tiers have limitations)

### Issue: Database update fails

- **Solution**: Verify database credentials are correct
- **Solution**: Check the entry ID exists in the database
- **Solution**: Ensure the sentiment field exists in the schema

### Issue: Sentiment score is null in database

- **Solution**: Check the Function node output to ensure it's formatting correctly
- **Solution**: Verify the SQL query is using the correct field names
- **Solution**: Check n8n execution logs for errors

---

## Workflow JSON Export (Quick Setup)

Once you've created your workflow, you can export it:

1. Click the **"..."** menu in n8n
2. Select **"Download"**
3. Save the JSON file
4. Share with team members who can import it directly

---

## Next Steps

After your n8n workflow is set up and working:

1. ✅ The sentiment scores will automatically be calculated for new journal entries
2. ✅ The frontend will display the sentiment data in the dashboard
3. ✅ Users can see their mood trends over time

Happy analyzing! 🎉
