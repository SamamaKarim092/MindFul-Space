// GET  /api/auth/otp/verify — Check if current user needs 7-day OTP verification
// POST /api/auth/otp/verify — Validate 6-digit code and update lastOtpAt in database

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, AuthError } from '@/lib/auth/api';
import { otpStore } from '@/lib/auth/otp-store';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { lastOtpAt: true, email: true },
    });

    if (!dbUser || !dbUser.lastOtpAt) {
      // First time login — needs OTP
      return NextResponse.json({
        needsOtp: true,
        reason: 'FIRST_LOGIN',
        email: user.email,
      });
    }

    const timeSinceLastOtp = Date.now() - new Date(dbUser.lastOtpAt).getTime();
    const needsOtp = timeSinceLastOtp > SEVEN_DAYS_MS;

    return NextResponse.json({
      needsOtp,
      reason: needsOtp ? 'EXPIRED_7_DAYS' : 'VERIFIED',
      lastOtpAt: dbUser.lastOtpAt,
      email: user.email,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('GET /api/auth/otp/verify error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: '6-digit verification code is required' }, { status: 400 });
    }

    const cleanCode = code.trim();
    const now = Date.now();

    // Check in-memory store OR database record for active OTP
    const memoryStored = otpStore.get(user.id);
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { otpCode: true, otpExpiresAt: true },
    });

    const activeCode = memoryStored?.code || dbUser?.otpCode;
    const expiresAt = memoryStored?.expiresAt || (dbUser?.otpExpiresAt ? new Date(dbUser.otpExpiresAt).getTime() : 0);

    console.log(`[OTP Verification Attempt] User: ${user.id}, Entered: "${cleanCode}", Expected: "${activeCode}", ExpiresIn: ${Math.round((expiresAt - now) / 1000)}s`);

    if (!activeCode || expiresAt < now) {
      return NextResponse.json({ error: 'Verification code has expired. Please request a new code.' }, { status: 400 });
    }

    if (activeCode !== cleanCode) {
      return NextResponse.json({ error: 'Incorrect verification code. Please check your email and try again.' }, { status: 400 });
    }

    // Code matches! Clear stored OTP from memory and database
    otpStore.delete(user.id);

    // Update lastOtpAt timestamp and clear active OTP in user database record
    const nowDate = new Date();
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        lastOtpAt: nowDate,
        otpCode: null,
        otpExpiresAt: null,
      },
      create: {
        id: user.id,
        email: user.email!,
        name: user.name || null,
        lastOtpAt: nowDate,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Email OTP verified successfully. Account secured for 7 days.',
      verifiedAt: nowDate,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('POST /api/auth/otp/verify error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
