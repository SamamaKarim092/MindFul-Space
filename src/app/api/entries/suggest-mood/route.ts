// POST /api/entries/suggest-mood — AI mood suggestion via n8n

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, AuthError } from '@/lib/auth/api';

export async function POST(request: NextRequest) {
  try {
    await getAuthUser(request);

    const body = await request.json();
    const { content, title } = body;

    const combinedText = `${title || ''} ${content || ''}`.trim();

    if (!combinedText) {
      return NextResponse.json({ error: 'Content or title is required' }, { status: 400 });
    }

    const webhookUrl = process.env.N8N_MOOD_SUGGEST_WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn('N8N_MOOD_SUGGEST_WEBHOOK_URL not configured - returning empty suggestions');
      return NextResponse.json({ suggestions: [] });
    }

    try {
      const payload = { text: combinedText, title: title || '', content: content || '' };
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      const data = await response.json();
      if (process.env.NODE_ENV !== 'production') console.log('📦 Raw n8n mood response:', JSON.stringify(data, null, 2));

      // n8n can return data in many shapes — try to extract suggestions flexibly
      let raw: any[] = [];

      if (Array.isArray(data)) {
        // n8n returned a top-level array (common with Respond to Webhook node)
        raw = data;
      } else if (Array.isArray(data?.suggestions)) {
        raw = data.suggestions;
      } else if (Array.isArray(data?.moods)) {
        raw = data.moods;
      } else if (Array.isArray(data?.output)) {
        raw = data.output;
      } else if (typeof data === 'object' && data !== null) {
        // Try to find the first array property in the response
        for (const key of Object.keys(data)) {
          if (Array.isArray(data[key])) {
            raw = data[key];
            if (process.env.NODE_ENV !== 'production') console.log(`📦 Found suggestions in data.${key}`);
            break;
          }
        }
        // If no array found, check if it's a single suggestion object with label/mood
        if (raw.length === 0) {
          if (data.label || data.mood) {
            raw = [data];
          } else if (typeof data.text === 'string' || typeof data.response === 'string') {
            // n8n returned plain text — try to parse as comma-separated moods
            const text = data.text || data.response || '';
            raw = text.split(',').map((s: string) => s.trim()).filter(Boolean);
          }
        }
      }

      if (process.env.NODE_ENV !== 'production') console.log('📦 Extracted raw suggestions:', JSON.stringify(raw));

      const suggestions = Array.isArray(raw)
        ? raw
            .map((item: any) => {
              if (item && typeof item.label === 'string' && typeof item.color_category === 'string') {
                return { label: item.label, color_category: item.color_category };
              }
              if (item && typeof item.label === 'string') {
                return { label: item.label, color_category: item.color_category || item.color || 'PURPLE' };
              }
              if (item && typeof item.mood === 'string') {
                return { label: item.mood, color_category: item.color_category || item.color || 'PURPLE' };
              }
              if (item && typeof item.name === 'string') {
                return { label: item.name, color_category: item.color_category || item.color || 'PURPLE' };
              }
              if (typeof item === 'string') {
                return { label: item, color_category: 'PURPLE' };
              }
              return null;
            })
            .filter(Boolean)
        : [];

      if (process.env.NODE_ENV !== 'production') console.log('✅ Final parsed suggestions:', JSON.stringify(suggestions));
      return NextResponse.json({ suggestions });
    } catch (error) {
      console.error('Error getting mood suggestions from n8n:', error);
      return NextResponse.json({ suggestions: [] });
    }
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('POST /api/entries/suggest-mood error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
