# 🚀 Your Gemini API Setup - Quick Reference

## ✅ You're All Set!

You already have everything you need:

- **API Key**: `AIzaSyCjkEGWWidv6nOgFgLJ_jt38NfqwNSDfjE`
- **Free Tier**: 1500 requests per day
- **Model**: Gemini Flash (Latest)
- **No credit card required** ✨

---// Debug: Print everything to see what we have
console.log("Input items:", JSON.stringify(items, null, 2));
console.log("$input.first():", JSON.stringify($input.first(), null, 2));

// Get sentiment from Gemini response
const text = $input.first().json.candidates[0].content.parts[0].text;
const sentiment = parseFloat(text.trim());

// Try to get entryId from wherever it is
let entryId = "NOT_FOUND";

// Try different paths
if (items[0]?.json?.body?.entryId) {
  entryId = items[0].json.body.entryId;
} else if (items[0]?.json?.entryId) {
  entryId = items[0].json.entryId;
}

console.log("Final entryId:", entryId);
console.log("Final sentiment:", sentiment);

return {
  json: {
    entryId: entryId,
    sentiment: sentiment,
  },
};

## 📋 n8n Workflow Configuration

Follow the **QUICK_START_SENTIMENT_ANALYSIS.md** guide with these Gemini-specific settings:

### Node 1: Webhook ✅

Already covered in the guide - no changes needed.

### Node 2: HTTP Request (Gemini API)

**Settings:**

- Method: `POST`
- URL:
  ```
  https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=AIzaSyCjkEGWWidv6nOgFgLJ_jt38NfqwNSDfjE
  ```
- Body Content Type: `JSON`
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

### Node 3: Code (Function)

**Paste this code:**

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

### Node 4: Postgres ✅

Already covered in the guide - no changes needed.

---

## 🧪 Test Your Gemini Integration

Once your workflow is set up, test it with curl:

```bash
curl -X POST http://localhost:5678/webhook/sentiment-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "entryId": "test-123",
    "content": "I am feeling incredibly happy and grateful today! Everything is amazing!"
  }'
```

**Expected Response from Gemini:**

- Input: "I am feeling incredibly happy and grateful today!"
- Gemini Output: `0.9` or `0.85` (high positive sentiment)

---

## 💡 Why Gemini is Perfect for This

1. **Generous Free Tier**: 1500 requests/day = ~50 journal entries/day
2. **Fast**: Responses in 1-2 seconds (Flash model is optimized for speed)
3. **Accurate**: Gemini Flash understands nuanced emotions very well
4. **Simple**: Just one API call, no complex setup
5. **Reliable**: Google's infrastructure = 99.9% uptime

---

## 📊 Expected Sentiment Scores

Here's what Gemini typically returns:

| Journal Content                           | Expected Score | Interpretation |
| ----------------------------------------- | -------------- | -------------- |
| "I feel terrible and everything is wrong" | -0.8 to -0.9   | Very negative  |
| "Today was difficult and I struggled"     | -0.4 to -0.6   | Negative       |
| "Things are okay, nothing special"        | -0.1 to 0.1    | Neutral        |
| "I had a good day and felt content"       | 0.4 to 0.6     | Positive       |
| "I'm incredibly happy and grateful!"      | 0.8 to 0.9     | Very positive  |

---

## 🔍 Troubleshooting Gemini-Specific Issues

### Issue: "API key not valid"

**Solution**:

- Make sure you copied the full API key
- Check if you enabled the Gemini API in Google AI Studio
- Try regenerating the API key

### Issue: Rate limit errors

**Solution**:

- Free tier: 1500 requests/day
- If you hit the limit, wait until the next day
- Or upgrade to paid tier for more requests

### Issue: Gemini returns text instead of number

**Solution**:

- The prompt is very specific: "respond with ONLY a single number"
- Gemini should always return just a number
- If it doesn't, check the Function node is parsing correctly with `parseFloat()`

---

## 🎯 Next Steps

1. ✅ You have the API key
2. ⏳ Follow **QUICK_START_SENTIMENT_ANALYSIS.md**
3. ⏳ Use the Gemini configuration above
4. ⏳ Test with a journal entry
5. ⏳ Check your dashboard for mood data!

Total setup time: **~10 minutes**

---

## 🌟 Pro Tips

1. **Journal Entry Length**: Gemini handles long entries well (up to 30k characters)
2. **Multiple Languages**: Gemini supports 100+ languages automatically
3. **Consistency**: Gemini is very consistent - same entry = same score
4. **Context Understanding**: Gemini understands sarcasm and complex emotions better than simpler models

---

Ready to go! Follow the quick start guide and you'll have sentiment analysis working in no time! 🚀
