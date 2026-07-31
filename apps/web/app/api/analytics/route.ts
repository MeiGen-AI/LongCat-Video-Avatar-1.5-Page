import { NextResponse } from 'next/server';
import { analyticsEventSchema } from '@fakhm/shared';
import { withApi } from '@/lib/api';
import { track } from '@/lib/analytics';
export const POST = withApi({
  mode: 'user',
  body: analyticsEventSchema,
  handler: async ({ userId, body }) => {
    await track(body.name, userId!, body.properties, body.sessionId);
    return NextResponse.json({ ok: true }, { status: 202 });
  },
});
