import { NextResponse } from 'next/server';
import { withApi } from '@/lib/api';
import { stripe } from '@/lib/stripe';
import { createAdmin } from '@/lib/supabase/admin';
import { getEnv } from '@/lib/env';
export const POST = withApi({
  mode: 'user',
  handler: async ({ userId }) => {
    const { data } = await createAdmin()
      .from('subscriptions')
      .select('provider_customer_id')
      .eq('user_id', userId!)
      .not('provider_customer_id', 'is', null)
      .maybeSingle();
    if (!data?.provider_customer_id) throw new Error('No billing customer');
    const session = await stripe().billingPortal.sessions.create({
      customer: data.provider_customer_id,
      return_url: `${getEnv().NEXT_PUBLIC_APP_URL}/billing`,
    });
    return NextResponse.json({ url: session.url });
  },
});
