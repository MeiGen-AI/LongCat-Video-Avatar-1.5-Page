import { NextResponse } from 'next/server';
import { withApi } from '@/lib/api';
import { createAdmin } from '@/lib/supabase/admin';
export const DELETE = withApi({
  mode: 'user',
  handler: async ({ userId }) => {
    const db = createAdmin();
    for (const bucket of ['avatars', 'uploads', 'outputs']) {
      const { data } = await db.storage.from(bucket).list(userId!);
      if (data?.length)
        await db.storage.from(bucket).remove(data.map((file) => `${userId}/${file.name}`));
    }
    const { error } = await db.auth.admin.deleteUser(userId!);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  },
});
