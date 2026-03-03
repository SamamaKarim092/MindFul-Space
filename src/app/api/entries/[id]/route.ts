// GET    /api/entries/:id — Fetch single entry
// PATCH  /api/entries/:id — Update entry
// DELETE /api/entries/:id — Delete entry

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, AuthError } from '@/lib/auth/api';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(request);
    const { id } = await params;

    const entry = await prisma.entry.findUnique({ where: { id } });
    if (!entry) return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    if (entry.userId !== user.id) return NextResponse.json({ error: 'Access denied' }, { status: 403 });

    return NextResponse.json(entry);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('GET /api/entries/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(request);
    const { id } = await params;
    const body = await request.json();

    const entry = await prisma.entry.findUnique({ where: { id } });
    if (!entry) return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    if (entry.userId !== user.id) return NextResponse.json({ error: 'Access denied' }, { status: 403 });

    const updated = await prisma.entry.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.mood !== undefined && { mood: body.mood }),
        ...(body.tags !== undefined && { tags: body.tags }),
        ...(body.customMoodLabel !== undefined && { customMoodLabel: body.customMoodLabel }),
        ...(body.moodLabels !== undefined && { moodLabels: body.moodLabels }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('PATCH /api/entries/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(request);
    const { id } = await params;

    const entry = await prisma.entry.findUnique({ where: { id } });
    if (!entry) return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    if (entry.userId !== user.id) return NextResponse.json({ error: 'Access denied' }, { status: 403 });

    await prisma.entry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('DELETE /api/entries/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
