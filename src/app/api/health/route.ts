// GET /api/health — Health check & database diagnostics endpoint
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const checkGroq = searchParams.get('checkGroq') === 'true';

    const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
    const hasDirectUrl = Boolean(process.env.DIRECT_URL);
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasSupabaseUrl = Boolean(supabaseUrl);
    const hasServiceRoleKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const hasResendApiKey = Boolean(process.env.RESEND_API_KEY);
    const hasGroqApiKey = Boolean(process.env.GROQ_API_KEY);
    const groqKeyPrefix = process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.slice(0, 8) + '...' : 'none';

    // 1. Test Prisma PostgreSQL query (resets Supabase DB pause timer)
    const dbTest = await prisma.$queryRawUnsafe('SELECT 1 as connected');

    // 2. Test Supabase REST Gateway connectivity
    let supabaseRestTest: any = null;
    if (supabaseUrl) {
      try {
        const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const res = await fetch(`${supabaseUrl}/rest/v1/`, {
          headers: anonKey ? { apikey: anonKey, Authorization: `Bearer ${anonKey}` } : {},
        });
        supabaseRestTest = {
          status: res.status,
          ok: res.status === 200 || res.status === 404,
        };
      } catch (err: any) {
        supabaseRestTest = { error: err.message };
      }
    }

    // 3. Test live Groq inference only if requested (?checkGroq=true)
    let groqLiveTest: any = null;
    if (checkGroq && process.env.GROQ_API_KEY) {
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
      supabaseRest: supabaseRestTest,
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
