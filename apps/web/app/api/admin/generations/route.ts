import { NextResponse } from 'next/server';
import { withApi } from '@/lib/api';
import { createAdmin } from '@/lib/supabase/admin';
export const GET = withApi({
  mode: 'admin',
  handler: async () => {
    const { data, error } = await createAdmin()
      .from('generations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return NextResponse.json({ items: data });
  },
});
