// POST /api/auth/otp/send — Generate & send a 6-digit OTP code to authenticated user's email

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, AuthError } from '@/lib/auth/api';
import { otpStore } from '@/lib/auth/otp-store';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    // Check for active unexpired OTP code from in-memory store OR database
    let code: string;
    const existingMemory = otpStore.get(user.id);
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { otpCode: true, otpExpiresAt: true },
    });

    const now = Date.now();
    let expiresAt: number;

    if (existingMemory && existingMemory.expiresAt > now) {
      code = existingMemory.code;
      expiresAt = existingMemory.expiresAt;
    } else if (dbUser?.otpCode && dbUser.otpExpiresAt && new Date(dbUser.otpExpiresAt).getTime() > now) {
      code = dbUser.otpCode;
      expiresAt = new Date(dbUser.otpExpiresAt).getTime();
      otpStore.set(user.id, { code, expiresAt });
    } else {
      // Generate fresh 6-digit code with 10-minute expiry
      code = Math.floor(100000 + Math.random() * 900000).toString();
      expiresAt = now + 10 * 60 * 1000; // 10 minutes
      otpStore.set(user.id, { code, expiresAt });

      // Persist to PostgreSQL database so serverless container switches don't lose the code
      await prisma.user.update({
        where: { id: user.id },
        data: {
          otpCode: code,
          otpExpiresAt: new Date(expiresAt),
        },
      });
    }

    const recipientEmail = user.email!;
    const resendKey = process.env.RESEND_API_KEY;

    if (!resendKey) {
      console.warn(`[OTP Error] RESEND_API_KEY is missing. Code generated for ${recipientEmail}: ${code}`);
      return NextResponse.json({
        error: 'RESEND_API_KEY is not configured in Vercel Environment Variables. Please add your Resend API Key in Vercel Settings.',
      }, { status: 500 });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: `MindFul-Space <${fromEmail}>`,
        to: recipientEmail,
        subject: '🔐 Your 6-Digit Security Verification Code',
        html: `<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #0F0714; color: #ffffff; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
          <h2 style="color: #c084fc; margin-bottom: 8px;">Security Check</h2>
          <p style="color: #cbd5e1; font-size: 14px;">Your 6-digit login verification code is:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #38bdf8; background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; text-align: center; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #94a3b8; font-size: 12px;">This code will expire in 10 minutes. If you did not request this code, please secure your account immediately.</p>
        </div>`,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error('Resend API error sending OTP:', resendRes.status, errText);
      let userError = 'Failed to dispatch email via Resend.';
      try {
        const parsed = JSON.parse(errText);
        if (parsed.message) userError = `Resend error: ${parsed.message}`;
      } catch {
        userError = `Resend error (${resendRes.status}): ${errText}`;
      }
      return NextResponse.json({ error: userError }, { status: 502 });
    }

    console.log(`[OTP Sent] ✉️ Successfully sent 6-digit OTP (${code}) to ${recipientEmail}`);

    return NextResponse.json({
      success: true,
      message: 'OTP code sent to email',
      expiresInSeconds: Math.max(0, Math.round((expiresAt - Date.now()) / 1000)),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('POST /api/auth/otp/send error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
