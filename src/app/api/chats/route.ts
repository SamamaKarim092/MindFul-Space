// GET /api/chats — List user's chats with last message preview

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, AuthError } from '@/lib/auth/api';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    const chats = await prisma.chat.findMany({
      where: { userId: user.id },
      include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(chats);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('GET /api/chats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
