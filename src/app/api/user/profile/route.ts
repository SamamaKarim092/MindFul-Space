// GET  /api/user/profile — Return current authenticated user profile from database
// POST /api/user/profile — Update user profile details (e.g. display name, avatar) in database

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, AuthError } from '@/lib/auth/api';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        reminderEnabled: true,
        reminderTime: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      dbUser || {
        id: user.id,
        email: user.email,
        name: user.name || null,
        avatarUrl: null,
      }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('GET /api/user/profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();

    const { name, avatarUrl } = body;

    const updateData: { name?: string; avatarUrl?: string } = {};
    if (typeof name === 'string') updateData.name = name.trim();
    if (typeof avatarUrl === 'string') updateData.avatarUrl = avatarUrl.trim();

    const updated = await prisma.user.upsert({
      where: { id: user.id },
      update: updateData,
      create: {
        id: user.id,
        email: user.email!,
        name: typeof name === 'string' ? name.trim() : user.name || null,
        avatarUrl: typeof avatarUrl === 'string' ? avatarUrl.trim() : null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('POST /api/user/profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
