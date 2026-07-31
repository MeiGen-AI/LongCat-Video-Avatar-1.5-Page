import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdmin } from '@/lib/supabase/admin';
import { planPrice } from '@/lib/stripe';
import { getEnv } from '@/lib/env';
export async function POST(request: NextRequest) {
  const raw = await request.text();
  const signature = request.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  let event;
  try {
    event = stripe().webhooks.constructEvent(raw, signature, getEnv().STRIPE_WEBHOOK_SECRET ?? '');
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  const db = createAdmin();
  const id = event.id;
  const { data: existing } = await db
    .from('webhook_events')
    .select('id')
    .eq('provider', 'stripe')
    .eq('external_id', id)
    .maybeSingle();
  if (existing) return NextResponse.json({ received: true });
  await db.from('webhook_events').insert({
    provider: 'stripe',
    external_id: id,
    payload: event as unknown as never,
    processed_at: new Date().toISOString(),
  });
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as import('stripe').Stripe.Checkout.Session;
    const userId = session.client_reference_id;
    if (userId) {
      const plan = session.metadata?.plan ?? 'creator';
      await db.from('subscriptions').upsert(
        {
          user_id: userId,
          plan_id: plan,
          provider: 'stripe',
          provider_customer_id: String(session.customer),
          provider_subscription_id: String(session.subscription),
          status: 'active',
        },
        { onConflict: 'provider,provider_subscription_id' },
      );
    }
  }
  if (event.type.startsWith('customer.subscription.')) {
    const subscription = event.data.object as import('stripe').Stripe.Subscription;
    await db
      .from('subscriptions')
      .update({
        status:
          subscription.status === 'active'
            ? 'active'
            : (subscription.status as 'past_due' | 'canceled'),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      })
      .eq('provider_subscription_id', subscription.id);
  }
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as import('stripe').Stripe.Invoice;
    const subId = typeof invoice.subscription === 'string' ? invoice.subscription : null;
    const { data: sub } = subId
      ? await db
          .from('subscriptions')
          .select('user_id,plan_id')
          .eq('provider_subscription_id', subId)
          .maybeSingle()
      : { data: null };
    if (sub)
      await db.from('credit_ledger').insert({
        user_id: sub.user_id,
        delta: sub.plan_id === 'studio' ? 2400 : 600,
        reason: 'subscription_grant',
        metadata: { invoiceId: invoice.id },
      });
  }
  return NextResponse.json({ received: true });
}
