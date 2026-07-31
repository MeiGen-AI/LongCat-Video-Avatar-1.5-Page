import { NextResponse } from 'next/server';
import { withApi } from '@/lib/api';
export const GET = withApi({
  mode: 'public',
  handler: async () =>
    NextResponse.json({ ok: true, service: 'fakhm-web', timestamp: new Date().toISOString() }),
});
