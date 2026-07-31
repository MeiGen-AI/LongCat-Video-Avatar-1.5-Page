import { NextRequest, NextResponse } from 'next/server';
import { withApi } from '@/lib/api';
import { createAdmin } from '@/lib/supabase/admin';
export const GET = withApi({
  mode: 'cron',
  handler: async () => {
    const { error } = await createAdmin().rpc('cleanup_expired_assets');
    if (error) throw error;
    return NextResponse.json({ ok: true });
  },
});
