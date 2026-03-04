// GET    /api/chats/:id — Fetch chat with all messages
// PATCH  /api/chats/:id — Update chat title
// DELETE /api/chats/:id — Delete chat and messages

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, AuthError } from '@/lib/auth/api';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(request);
    const { id } = await params;

    const chat = await prisma.chat.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    if (chat.userId !== user.id) return NextResponse.json({ error: 'Access denied' }, { status: 403 });

    return NextResponse.json(chat);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('GET /api/chats/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(request);
    const { id } = await params;
    const body = await request.json();

    const chat = await prisma.chat.findUnique({ where: { id } });
    if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    if (chat.userId !== user.id) return NextResponse.json({ error: 'Access denied' }, { status: 403 });

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title) {
      return NextResponse.json({ error: 'Title must be a non-empty string' }, { status: 400 });
    }

    const updated = await prisma.chat.update({
      where: { id },
      data: { title },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('PATCH /api/chats/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(request);
    const { id } = await params;

    const chat = await prisma.chat.findUnique({ where: { id } });
    if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    if (chat.userId !== user.id) return NextResponse.json({ error: 'Access denied' }, { status: 403 });

    await prisma.chat.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('DELETE /api/chats/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
