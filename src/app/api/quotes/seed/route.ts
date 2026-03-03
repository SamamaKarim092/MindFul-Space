// POST /api/quotes/seed — Seed default quotes (dev utility)

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Mood, QuoteType } from '@prisma/client';

export async function POST() {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Seed endpoint is disabled in production' }, { status: 403 });
    }

    const existingCount = await prisma.quote.count();
    if (existingCount > 0) {
      return NextResponse.json({ message: 'Quotes already seeded', count: existingCount });
    }

    const quotes = [
      { text: 'The only way out is through.', author: 'Robert Frost', type: QuoteType.QUOTE, mood: Mood.POSITIVE },
      { text: 'You are stronger than you think.', author: 'Unknown', type: QuoteType.QUOTE, mood: Mood.POSITIVE },
      { text: "It's okay to not be okay.", author: 'Unknown', type: QuoteType.QUOTE, mood: Mood.NEUTRAL },
      { text: "Take a deep breath. You've got this.", author: 'Unknown', type: QuoteType.TIP, mood: Mood.POSITIVE },
      { text: 'Progress, not perfection.', author: 'Unknown', type: QuoteType.QUOTE, mood: Mood.POSITIVE },
      { text: "Try writing down three things you're grateful for today.", author: 'Mental Health Tip', type: QuoteType.TIP, mood: Mood.POSITIVE },
      { text: 'Remember to drink water and take breaks.', author: 'Self-Care Reminder', type: QuoteType.TIP, mood: Mood.NEUTRAL },
      { text: 'Your feelings are valid.', author: 'Unknown', type: QuoteType.QUOTE, mood: Mood.NEUTRAL },
      { text: 'Small steps still move you forward.', author: 'Unknown', type: QuoteType.QUOTE, mood: Mood.POSITIVE },
      { text: 'Be gentle with yourself today.', author: 'Unknown', type: QuoteType.TIP, mood: Mood.POSITIVE },
    ];

    await prisma.quote.createMany({ data: quotes });
    return NextResponse.json({ message: 'Quotes seeded successfully', count: quotes.length }, { status: 201 });
  } catch (error) {
    console.error('POST /api/quotes/seed error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
