# 🚀 Quick Start: Set Up Sentiment Analysis in 10 Minutes

This is the fastest path to get sentiment analysis working. For detailed explanations, see `SENTIMENT_ANALYSIS_IMPLEMENTATION_SUMMARY.md`.

---

## ✅ Prerequisites

- [x] Code changes already implemented
- [x] n8n installed (you mentioned this is done)
- [ ] AI service account (choose one option below)

---

## 🎯 Quick Setup Steps

### Step 1: Start n8n (2 minutes)

Open a new terminal and run:

```bash
npx n8n
```

Wait for it to start. You'll see: "Editor is now accessible via: http://localhost:5678"

Open your browser: **http://localhost:5678**

---

### Step 2: Create n8n Workflow (5 minutes)

#### 2.1 Create New Workflow

1. Click **"+ Create New Workflow"**
2. Name it: "Sentiment Analysis"

#### 2.2 Add Webhook Node

1. Click **"+"** → Search "Webhook" → Click it
2. Settings:
   - HTTP Method: **POST**
   - Path: **sentiment-analysis**
3. Click **"Execute Node"** to get the URL
4. **COPY THE WEBHOOK URL** (example: `http://localhost:5678/webhook/sentiment-analysis`)

#### 2.3 Add AI Service Node

**RECOMMENDED OPTION - Google AI Studio / Gemini (Free, Already Have Key!):**

1. In n8n, click **"+"** → Search "HTTP Request"
2. Settings:
   - Method: **POST**
   - URL: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCjkEGWWidv6nOgFgLJ_jt38NfqwNSDfjE`
   - Body Content Type: **JSON**
   - JSON Body:
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

**Why Gemini?** 1500 free requests per day, very accurate, no credit card needed!

<details>
<summary><b>Alternative: Hugging Face (also free)</b></summary>

1. Get free API token:
   - Go to https://huggingface.co
   - Sign up (free)
   - Settings → Access Tokens → New Token
   - Copy the token

2. In n8n, click **"+"** → Search "HTTP Request"
3. Settings:
   - Method: **POST**
   - URL: `https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english`
   - Add Header:
     - Name: `Authorization`
     - Value: `Bearer YOUR_TOKEN_HERE` (paste your token)
   - Body Content Type: **JSON**
   - JSON Body:
   ```json
   {
     "inputs": "={{ $json.body.content }}"
   }
   ```
   </details>

#### 2.4 Add Function Node

1. Click **"+"** → Search "Code" → Select "Code"
2. Paste this code:

**For Gemini:**

```javascript
// Get sentiment from Gemini response
const text = $input.first().json.candidates[0].content.parts[0].text;
const sentiment = parseFloat(text.trim());

// Get entry ID from webhook
const entryId = $("Webhook").first().json.body.entryId;

return {
  json: {
    entryId: entryId,
    sentiment: sentiment,
  },
};
```

<details>
<summary><b>For Hugging Face (if using alternative)</b></summary>

```javascript
// Get sentiment from Hugging Face response
const results = $input.first().json[0];
const positiveScore = results.find((r) => r.label === "POSITIVE")?.score || 0;
const negativeScore = results.find((r) => r.label === "NEGATIVE")?.score || 0;

// Convert to -1 to 1 scale
const sentiment = positiveScore - negativeScore;

// Get entry ID from webhook
const entryId = $("Webhook").first().json.body.entryId;

return {
  json: {
    entryId: entryId,
    sentiment: sentiment,
  },
};
```

</details>

#### 2.5 Add Database Node

1. Click **"+"** → Search "Postgres"
2. Click **"Create New Credential"**:
   - Host: `aws-1-ap-northeast-2.pooler.supabase.com`
   - Database: `postgres`
   - User: `postgres.tlskpfihsjghjoffzoii`
   - Password: `fhsjdkh4324`
   - Port: `5432`
   - SSL: **Enable** (toggle on)
3. Operation: **Execute Query**
4. Query:

```sql
UPDATE entries
SET sentiment = {{ $json.sentiment }}
WHERE id = '{{ $json.entryId }}';
```

#### 2.6 Connect and Activate

1. Connect nodes: Webhook → HTTP Request → Code → Postgres
2. Click **"Save"** (top right)
3. Toggle **"Active"** switch to ON

---

### Step 3: Configure Your App (1 minute)

1. Open: `apps/api/.env`
2. Find the line: `N8N_WEBHOOK_URL=`
3. Paste your webhook URL:
   ```env
   N8N_WEBHOOK_URL=http://localhost:5678/webhook/sentiment-analysis
   ```
4. Save the file

---

### Step 4: Restart API Server (1 minute)

Stop your current dev server (Ctrl+C) and restart:

```bash
pnpm dev
```

---

### Step 5: Test It! (1 minute)

1. Go to your app: http://localhost:3000
2. Login if needed
3. Go to **Journal** page
4. Create a new entry with emotional content:
   ```
   Title: Great Day
   Content: I'm feeling amazing today! Everything is going wonderfully and I'm so grateful for all the good things happening in my life!
   ```
5. Submit the entry
6. Wait 10 seconds
7. Go to **Dashboard**
8. Check the "Average Mood" card - should show a score!
9. Check the "Mood Overview" chart - should show a data point!

---

## 🐛 If Something Goes Wrong

### Check n8n

- Is n8n running? (`npx n8n`)
- Is workflow Active? (toggle switch should be ON)
- Click "Executions" tab to see if webhook was triggered

### Check API Logs

Look for: `[EntriesService] Triggered sentiment analysis for entry...`

If you see: `N8N_WEBHOOK_URL not configured` → Check .env file

### Check Database

```sql
SELECT title, sentiment FROM entries ORDER BY created_at DESC LIMIT 3;
```

Should see sentiment values (numbers between -1 and 1)

---

## 🎉 Success Indicators

✅ Entry created instantly (no delay for user)  
✅ API logs show "Triggered sentiment analysis"  
✅ n8n shows green checkmarks in execution  
✅ Database has sentiment values  
✅ Dashboard shows real mood scores  
✅ Chart displays mood trends

---

## 📚 Next Steps

- Read `SENTIMENT_ANALYSIS_IMPLEMENTATION_SUMMARY.md` for full details
- See `N8N_WORKFLOW_SETUP_GUIDE.md` for alternative AI services
- Try different time periods in the Mood Chart (7/14/30 days)

---

## 💡 Pro Tips

1. **Create multiple entries** with different moods to see trends
2. **Test with clearly positive/negative text** first
3. **Hugging Face free tier** is limited - if you hit rate limits, wait a few minutes
4. **Mood chart updates** every 60 seconds (refresh if needed)
5. **Stats card updates** every 30 seconds

---

That's it! You now have AI-powered sentiment analysis! 🚀
