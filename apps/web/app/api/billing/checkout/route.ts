import { NextResponse } from 'next/server';
import { checkoutSessionSchema } from '@fakhm/shared';
import { withApi } from '@/lib/api';
import { stripe, planPrice } from '@/lib/stripe';
import { getEnv } from '@/lib/env';
export const POST = withApi({
  mode: 'user',
  body: checkoutSessionSchema,
  handler: async ({ userId, body }) => {
    const price = planPrice(body.plan);
    if (!price) throw new Error('Plan price is not configured');
    const session = await stripe().checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: price, quantity: 1 }],
      success_url: `${getEnv().NEXT_PUBLIC_APP_URL}/billing?success=1`,
      cancel_url: `${getEnv().NEXT_PUBLIC_APP_URL}/billing?canceled=1`,
      client_reference_id: userId!,
      metadata: { userId: userId!, plan: body.plan },
    });
    return NextResponse.json({ url: session.url });
  },
});
