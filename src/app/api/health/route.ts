// GET /api/health — Health check & database diagnostics endpoint
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
    const hasDirectUrl = Boolean(process.env.DIRECT_URL);
    const hasSupabaseUrl = Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
    const hasServiceRoleKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

    // Test Prisma database query
    const dbTest = await prisma.$queryRawUnsafe('SELECT 1 as connected');

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      dbTest,
      envCheck: {
        hasDatabaseUrl,
        hasDirectUrl,
        hasSupabaseUrl,
        hasServiceRoleKey,
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
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
