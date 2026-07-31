import { NextResponse } from 'next/server';
import { withApi } from '@/lib/api';
import { createAdmin } from '@/lib/supabase/admin';
export const GET = withApi({
  mode: 'admin',
  handler: async () => {
    const db = createAdmin();
    const [{ count: users }, { count: generations }, { count: failed }] = await Promise.all([
      db.from('profiles').select('*', { count: 'exact', head: true }),
      db.from('generations').select('*', { count: 'exact', head: true }),
      db.from('generations').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
    ]);
    return NextResponse.json({
      users: users ?? 0,
      generations: generations ?? 0,
      failed: failed ?? 0,
    });
  },
});
