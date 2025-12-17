# How to Implement Sentiment Analysis

This guide provides a step-by-step plan for adding "Know Your Mood" (Sentiment Analysis) to your application.

We will use **n8n** to handle the analysis. This is the best approach because it keeps your app fast for the user and makes it more reliable. The analysis will happen in the background without making the user wait.

---

## The 4 Main Steps

1.  **Update the Database:** Add new columns to your database to store the mood score.
2.  **Create an n8n Workflow:** Build the automated process that reads the text, gets the mood from an AI, and updates the database.
3.  **Modify the API:** Tell your main server to trigger the n8n workflow whenever a new entry is created.
4.  **Update the Frontend:** Display the new mood data in your dashboard's charts and stats.

---

### Step 1: Update Your Database Schema

First, we need a place to store the analysis results.

1.  **Edit Your Schema File:**
    *   Open the file: `packages/prisma/prisma/schema.prisma`

2.  **Add New Fields to the `Entry` Model:**
    *   Find the `model Entry { ... }` block and add the following new lines. This is where we will store the mood score and a simple label like "Positive" or "Negative".

    ```prisma
    model Entry {
      id        String   @id @default(cuid())
      createdAt DateTime @default(now())
      updatedAt DateTime @updatedAt
      userId    String
      content   String

      // --- ADD THESE NEW LINES ---
      sentimentScore Float? // The mood score, e.g., from -1.0 (negative) to 1.0 (positive)
      sentimentLabel String? // A simple text label, e.g., "Positive", "Negative", "Neutral"
      // --------------------------

      @@index([userId])
    }
    ```

3.  **Apply the Database Changes:**
    *   To update your database with these new columns, you will need to run this command in your project's terminal:
    *   `npx prisma db push`

### Step 2: Create the n8n Workflow

Next, we build the automated workflow in n8n. This is the core of the feature.

*(You will need n8n running. You can set it up easily using Docker if you haven't already.)*

1.  **Node 1: The Trigger (Webhook)**
    *   **What to do:** Create a new "Webhook" node in an n8n workflow.
    *   **Result:** n8n will give you a **Webhook URL**. Copy this URL.
    *   **Purpose:** This node will wait for your API to send it a signal. We will tell it to expect the `entryId` and the `content` of a new journal entry.

2.  **Node 2: The Brain (AI Service Call)**
    *   **What to do:** You need to choose an AI service to do the analysis. The **Google Natural Language API** is a great choice for this. You'll need to get an API key from your Google Cloud account.
    *   In n8n, add a new **"HTTP Request"** node.
    *   Configure this node to send the journal `content` (which it got from the webhook node) to the Google API endpoint.
    *   **Purpose:** This node sends the text to the AI and gets back the mood score.

3.  **Node 3: The Action (Update Database)**
    *   **What to do:** Add a "Postgres" node (or the node for whichever database you use).
    *   Configure this node with your database connection details (host, user, password, database name).
    *   Write a simple SQL command in the node's settings.
    *   **Example SQL:**
        ```sql
        UPDATE "Entry"
        SET "sentimentScore" = {{ $json.score }}, "sentimentLabel" = '{{ $json.label }}'
        WHERE id = '{{ $json.entryId }}';
        ```
    *   **Purpose:** This node takes the mood score from the AI (Node 2) and saves it in the correct entry in your database, finding it via the `entryId` from the Webhook (Node 1).

### Step 3: Modify Your API to Trigger the Workflow

Now, we'll tell your main application's server to send the signal to n8n.

1.  **File to Edit:**
    *   Open `apps/api/src/entries/entries.service.ts`.

2.  **Logic to Add:**
    *   Find the function responsible for creating a new journal entry (it's probably named `create` or `createEntry`).
    *   Right **after** the line of code that successfully saves the new entry to the database (e.g., after `this.prisma.entry.create(...)`), you will add a new piece of code.

3.  **What the New Code Does:**
    *   This new code will use a simple HTTP client (like `axios` or `fetch`) to make a `POST` request.
    *   **URL:** The destination is the **n8n Webhook URL** you copied from Step 2.
    *   **Body:** The request will send a small JSON object containing the new entry's `id` and `content`.

### Step 4: Display the Mood on the Frontend

Finally, let's make your dashboard show the new mood data.

1.  **Fetch the Full Data:**
    *   In your frontend components (`apps/web/src/app/components/dashboard/...`), modify the code that fetches the journal entries to make sure it also gets the new `sentimentScore`.

2.  **Update Your Components (`MoodChart`, `StatsCards`):**
    *   Your components will now receive the entries, some of which will have a mood score.
    *   **Handle Missing Data:** It's important to add a check. If an entry's `sentimentScore` is empty (`null`), it means n8n hasn't finished processing it yet. Your code should simply ignore these entries for now when calculating stats or drawing the chart.
    *   **Calculations:**
        *   **`MoodChart`:** Will use the `sentimentScore` of each entry as a data point on the chart.
        *   **`StatsCards`:** The "Average Mood" card will calculate the average of all the available `sentimentScore` values.