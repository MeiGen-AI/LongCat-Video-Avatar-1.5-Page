import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const next = request.nextUrl.searchParams.get('next') ?? '/studio';
  if (code) await createClient().auth.exchangeCodeForSession(code);
  return NextResponse.redirect(new URL(next, request.url));
}
