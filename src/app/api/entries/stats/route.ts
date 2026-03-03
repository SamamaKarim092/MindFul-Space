// GET /api/entries/stats — Entry statistics for authenticated user

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, AuthError } from '@/lib/auth/api';
import { Mood } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    const entries = await prisma.entry.findMany({
      where: { userId: user.id },
      select: { mood: true, sentiment: true },
    });

    const stats = {
      totalEntries: entries.length,
      positiveCount: entries.filter((e) => e.mood === Mood.POSITIVE).length,
      neutralCount: entries.filter((e) => e.mood === Mood.NEUTRAL).length,
      negativeCount: entries.filter((e) => e.mood === Mood.NEGATIVE).length,
      averageSentiment: null as number | null,
    };

    const sentiments = entries
      .filter((e) => e.sentiment !== null)
      .map((e) => e.sentiment!);

    if (sentiments.length > 0) {
      stats.averageSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
    }

    return NextResponse.json(stats);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('GET /api/entries/stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
