import { NextResponse } from 'next/server';
import { withApi } from '@/lib/api';
export const POST = withApi({
  mode: 'user',
  handler: async () => {
    const { createClient } = await import('@/lib/supabase/server');
    const { error } = await createClient().auth.signOut();
    if (error) throw error;
    return NextResponse.json({ ok: true });
  },
});
