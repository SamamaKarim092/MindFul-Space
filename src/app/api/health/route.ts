// GET /api/health — Health check & database diagnostics endpoint
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
    const hasDirectUrl = Boolean(process.env.DIRECT_URL);
    const hasSupabaseUrl = Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
    const hasServiceRoleKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const hasResendApiKey = Boolean(process.env.RESEND_API_KEY);
    const hasGroqApiKey = Boolean(process.env.GROQ_API_KEY);
    const groqKeyPrefix = process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.slice(0, 8) + '...' : 'none';

    // Test Prisma database query
    const dbTest = await prisma.$queryRawUnsafe('SELECT 1 as connected');

    // Test live Groq inference from inside Vercel
    let groqLiveTest: any = null;
    if (process.env.GROQ_API_KEY) {
      try {
        const testModel = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.GROQ_API_KEY.trim()}`,
          },
          body: JSON.stringify({
            model: testModel,
            messages: [{ role: 'user', content: 'test' }],
            max_tokens: 5,
          }),
        });

        const groqBody = await groqRes.text();
        groqLiveTest = {
          status: groqRes.status,
          ok: groqRes.ok,
          model: testModel,
          response: groqBody.slice(0, 300),
        };
      } catch (err: any) {
        groqLiveTest = { error: err.message };
      }
    }

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      dbTest,
      groqLiveTest,
      envCheck: {
        hasDatabaseUrl,
        hasDirectUrl,
        hasSupabaseUrl,
        hasServiceRoleKey,
        hasResendApiKey,
        hasGroqApiKey,
        groqKeyPrefix,
      },
      timestamp: new Date().toISOString(),
      version: '2.0.0',
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'error',
      database: 'failed',
      errorMessage: err.message,
      errorCode: err.code,
      envCheck: {
        hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
        hasDirectUrl: Boolean(process.env.DIRECT_URL),
        hasSupabaseUrl: Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL),
        hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
        hasResendApiKey: Boolean(process.env.RESEND_API_KEY),
        hasGroqApiKey: Boolean(process.env.GROQ_API_KEY),
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
