/**
 * Mood Keyword Mapping for Live Detection
 * Maps keywords/phrases to mood labels for instant, zero-latency mood suggestion
 */

export type MoodLabel = "Happy" | "Sad" | "Anxious" | "Energetic" | "Neutral" | "Calm" | "Angry" | "Grateful";

export interface KeywordMoodMap {
  [keyword: string]: MoodLabel;
}

export interface AIMoodSuggestion {
  label: MoodLabel;
  confidence: number;
}

export interface MoodSuggestionResult {
  suggestions: MoodLabel[];
  source: 'keyword' | 'ai';
}

export const moodKeywords: KeywordMoodMap = {
  // Energetic/Active
  gym: "Energetic",
  workout: "Energetic",
  run: "Energetic",
  running: "Energetic",
  exercise: "Energetic",
  training: "Energetic",
  motivated: "Energetic",
  productive: "Energetic",
  accomplished: "Energetic",
  "crushed it": "Energetic",
  energized: "Energetic",
  pumped: "Energetic",
  
  // Happy/Positive
  happy: "Happy",
  joy: "Happy",
  joyful: "Happy",
  great: "Happy",
  amazing: "Happy",
  wonderful: "Happy",
  excited: "Happy",
  love: "Happy",
  loved: "Happy",
  celebrate: "Happy",
  celebration: "Happy",
  win: "Happy",
  success: "Happy",
  proud: "Happy",
  
  // Grateful
  grateful: "Grateful",
  thankful: "Grateful",
  blessed: "Grateful",
  appreciate: "Grateful",
  gratitude: "Grateful",
  
  // Calm/Peaceful
  calm: "Calm",
  peaceful: "Calm",
  relaxed: "Calm",
  meditation: "Calm",
  meditate: "Calm",
  serene: "Calm",
  tranquil: "Calm",
  
  // Sad/Down
  sad: "Sad",
  cry: "Sad",
  crying: "Sad",
  depressed: "Sad",
  down: "Sad",
  lonely: "Sad",
  heartbroken: "Sad",
  disappointed: "Sad",
  hurt: "Sad",
  
  // Anxious/Worried
  anxious: "Anxious",
  anxiety: "Anxious",
  worried: "Anxious",
  worry: "Anxious",
  stress: "Anxious",
  stressed: "Anxious",
  nervous: "Anxious",
  overwhelmed: "Anxious",
  panic: "Anxious",
  fear: "Anxious",
  
  // Angry
  angry: "Angry",
  frustrated: "Angry",
  frustration: "Angry",
  annoyed: "Angry",
  irritated: "Angry",
  mad: "Angry",
  furious: "Angry",
  rage: "Angry",
  
  // Neutral
  tired: "Neutral",
  sleep: "Neutral",
  sleepy: "Neutral",
  bored: "Neutral",
  okay: "Neutral",
  meh: "Neutral",
  fine: "Neutral",
};

/**
 * Detects mood from text content using keyword matching
 * @param content - The journal entry text
 * @returns The detected mood label or null if no match
 */
export function detectMoodFromText(content: string): MoodLabel | null {
  if (!content || content.trim().length < 3) {
    return null;
  }

  const lowerContent = content.toLowerCase();
  
  // Check for keyword matches
  for (const [keyword, moodLabel] of Object.entries(moodKeywords)) {
    // Use word boundary matching for better accuracy
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(lowerContent)) {
      return moodLabel;
    }
  }

  return null;
}

/**
 * Calls AI service to get multiple mood suggestions
 * @param text - The journal entry text
 * @returns Array of suggested mood labels
 */
export async function getAIMoodSuggestions(text: string): Promise<MoodLabel[]> {
  try {
    const response = await fetch('/api/entries/suggest-mood', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: text }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI suggestions');
    }

    const data = await response.json();
    return data.suggestions || [];
  } catch (error) {
    console.error('AI mood suggestion error:', error);
    return [];
  }
}
