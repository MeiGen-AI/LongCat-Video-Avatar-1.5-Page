-- Ensure provider subscription webhook upserts have a conflict target.
alter table public.subscriptions
add constraint subscriptions_provider_subscription_unique unique (provider, provider_subscription_id);
