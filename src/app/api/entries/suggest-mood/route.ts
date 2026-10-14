// POST /api/entries/suggest-mood — AI mood suggestion via Groq (with n8n and keyword fallbacks)

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, AuthError } from '@/lib/auth/api';
import { moodKeywords } from '@/lib/mood-detection';

const VALID_COLOR_CATEGORIES = new Set([
  'YELLOW',
  'GREEN',
  'PINK',
  'ORANGE',
  'BLUE',
  'PURPLE',
  'RED',
]);

const MOOD_COLOR_MAP: Record<string, string> = {
  happy: 'YELLOW',
  joy: 'YELLOW',
  joyful: 'YELLOW',
  optimistic: 'YELLOW',
  proud: 'YELLOW',
  excited: 'YELLOW',
  cheerful: 'YELLOW',
  calm: 'GREEN',
  peaceful: 'GREEN',
  relaxed: 'GREEN',
  mindful: 'GREEN',
  grounded: 'GREEN',
  serene: 'GREEN',
  tranquil: 'GREEN',
  grateful: 'PINK',
  thankful: 'PINK',
  blessed: 'PINK',
  loving: 'PINK',
  appreciative: 'PINK',
  energetic: 'ORANGE',
  motivated: 'ORANGE',
  productive: 'ORANGE',
  inspired: 'ORANGE',
  pumped: 'ORANGE',
  active: 'ORANGE',
  sad: 'BLUE',
  depressed: 'BLUE',
  down: 'BLUE',
  lonely: 'BLUE',
  hurt: 'BLUE',
  disappointed: 'BLUE',
  heartbroken: 'BLUE',
  anxious: 'PURPLE',
  stressed: 'PURPLE',
  overwhelmed: 'PURPLE',
  worried: 'PURPLE',
  nervous: 'PURPLE',
  tired: 'PURPLE',
  exhausted: 'PURPLE',
  neutral: 'PURPLE',
  reflective: 'PURPLE',
  thoughtful: 'PURPLE',
  confused: 'PURPLE',
  angry: 'RED',
  frustrated: 'RED',
  annoyed: 'RED',
  irritated: 'RED',
  mad: 'RED',
  furious: 'RED',
};

function normalizeColorCategory(label: string, rawColor?: string): string {
  if (rawColor && VALID_COLOR_CATEGORIES.has(rawColor.toUpperCase())) {
    return rawColor.toUpperCase();
  }
  const lower = (label || '').toLowerCase().trim();
  return MOOD_COLOR_MAP[lower] || 'PURPLE';
}

function sanitizeSuggestions(raw: any[]): Array<{ label: string; color_category: string }> {
  if (!Array.isArray(raw)) return [];

  const seen = new Set<string>();
  const sanitized: Array<{ label: string; color_category: string }> = [];

  for (const item of raw) {
    if (!item) continue;

    let label = '';
    let color = '';

    if (typeof item === 'string') {
      label = item.trim();
    } else if (typeof item === 'object') {
      label = (item.label || item.mood || item.name || '').trim();
      color = item.color_category || item.color || '';
    }

    if (!label) continue;

    // Capitalize first letter of label
    const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);
    const key = formattedLabel.toLowerCase();

    if (!seen.has(key)) {
      seen.add(key);
      sanitized.push({
        label: formattedLabel,
        color_category: normalizeColorCategory(formattedLabel, color),
      });
    }

    if (sanitized.length >= 4) break;
  }

  return sanitized;
}

export async function POST(request: NextRequest) {
  try {
    await getAuthUser(request);

    const body = await request.json().catch(() => ({}));
    const { content, title } = body;

    const combinedText = `${title || ''} ${content || ''}`.trim();

    if (!combinedText || combinedText.length < 3) {
      return NextResponse.json({ suggestions: [] });
    }

    // 1. Primary: Direct Groq AI Inference (ultra-fast, ~150ms)
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      try {
        const groqController = new AbortController();
        const groqTimeout = setTimeout(() => groqController.abort(), 6000);

        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
            messages: [
              {
                role: 'system',
                content:
                  'You are an empathetic emotional mood analyzer for a mindful journaling app. Analyze the journal entry and identify 2 to 4 emotional moods that accurately describe the user\'s feelings. Allowed color categories are: YELLOW (happy, joyful, optimistic, proud), GREEN (calm, peaceful, relaxed, grounded), PINK (grateful, loving, blessed), ORANGE (energetic, motivated, passionate), BLUE (sad, down, lonely, hurt), PURPLE (anxious, stressed, overwhelmed, tired, reflective), RED (angry, frustrated, mad). Return ONLY valid JSON: {"suggestions": [{"label": "Overwhelmed", "color_category": "PURPLE"}]}',
              },
              {
                role: 'user',
                content: combinedText.slice(0, 2000),
              },
            ],
            temperature: 0.3,
            max_tokens: 250,
            response_format: { type: 'json_object' },
          }),
          signal: groqController.signal,
        });

        clearTimeout(groqTimeout);

        if (groqResponse.ok) {
          const groqData = await groqResponse.json();
          const rawContent = groqData.choices?.[0]?.message?.content || '{}';
          const parsed = JSON.parse(rawContent);

          const suggestions = sanitizeSuggestions(
            parsed.suggestions || parsed.moods || parsed.output || []
          );

          if (suggestions.length > 0) {
            return NextResponse.json({ suggestions });
          }
        } else {
          console.warn('Groq mood suggestion returned status:', groqResponse.status);
        }
      } catch (err: any) {
        console.warn('Groq mood suggestion error, attempting fallback:', err.message);
      }
    }

    // 2. Secondary Fallback: n8n webhook (if configured)
    const webhookUrl = process.env.N8N_MOOD_SUGGEST_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const n8nController = new AbortController();
        const n8nTimeout = setTimeout(() => n8nController.abort(), 4000);

        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: combinedText, title: title || '', content: content || '' }),
          signal: n8nController.signal,
        });

        clearTimeout(n8nTimeout);

        if (response.ok) {
          const data = await response.json().catch(() => null);
          if (data) {
            let raw: any[] = [];
            if (Array.isArray(data)) raw = data;
            else if (Array.isArray(data.suggestions)) raw = data.suggestions;
            else if (Array.isArray(data.moods)) raw = data.moods;
            else if (Array.isArray(data.output)) raw = data.output;

            const suggestions = sanitizeSuggestions(raw);
            if (suggestions.length > 0) {
              return NextResponse.json({ suggestions });
            }
          }
        }
      } catch (n8nErr: any) {
        console.warn('n8n mood suggestion fallback failed:', n8nErr.message);
      }
    }

    // 3. Tertiary Fallback: Keyword & Heuristic Detection (Zero latency, never fails)
    const lowerText = combinedText.toLowerCase();
    const matchedMoods: string[] = [];

    for (const [keyword, mood] of Object.entries(moodKeywords)) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(lowerText) && !matchedMoods.includes(mood)) {
        matchedMoods.push(mood);
        if (matchedMoods.length >= 3) break;
      }
    }

    if (matchedMoods.length === 0) {
      // Sensible default suggestions for reflective journaling
      matchedMoods.push('Reflective', 'Calm', 'Thoughtful');
    }

    const fallbackSuggestions = sanitizeSuggestions(matchedMoods);
    return NextResponse.json({ suggestions: fallbackSuggestions });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('POST /api/entries/suggest-mood error:', error);
    return NextResponse.json({
      suggestions: [
        { label: 'Reflective', color_category: 'PURPLE' },
        { label: 'Calm', color_category: 'GREEN' },
      ],
    });
  }
}
