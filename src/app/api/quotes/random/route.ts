// GET /api/quotes/random — Get a random quote

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Mood, QuoteType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moodParam = searchParams.get('mood');
    const typeParam = searchParams.get('type');

    const where: { mood?: Mood; type?: QuoteType } = {};
    if (moodParam && Object.values(Mood).includes(moodParam as Mood)) where.mood = moodParam as Mood;
    if (typeParam && Object.values(QuoteType).includes(typeParam as QuoteType)) where.type = typeParam as QuoteType;

    const count = await prisma.quote.count({ where });
    if (count === 0) {
      return NextResponse.json(null);
    }

    const skip = Math.floor(Math.random() * count);
    const quotes = await prisma.quote.findMany({ where, skip, take: 1 });

    return NextResponse.json(quotes[0] || null);
  } catch (error) {
    console.error('GET /api/quotes/random error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
