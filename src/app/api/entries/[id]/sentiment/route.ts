// PATCH /api/entries/:id/sentiment — n8n callback to update sentiment score
// Secured via webhook secret header

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateWebhookSecret } from '@/lib/auth/webhook';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    if (!validateWebhookSecret(request)) {
      return NextResponse.json({ error: 'Invalid webhook secret' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { sentiment } = body;

    if (typeof sentiment !== 'number') {
      return NextResponse.json({ error: 'Sentiment must be a number' }, { status: 400 });
    }

    const entry = await prisma.entry.update({
      where: { id },
      data: { sentiment },
    });

    return NextResponse.json(entry);
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }
    console.error('PATCH /api/entries/[id]/sentiment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
