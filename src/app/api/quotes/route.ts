// GET  /api/quotes — List quotes (optionally filtered by mood/type)

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

    const quotes = await prisma.quote.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(quotes);
  } catch (error) {
    console.error('GET /api/quotes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
