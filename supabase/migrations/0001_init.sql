-- Extensions and domain enums
create extension if not exists "pgcrypto";

create type public.app_role as enum('user', 'admin');

create type public.asset_kind as enum('image', 'audio', 'video');

create type public.generation_status as enum(
  'queued',
  'uploading',
  'validating',
  'processing',
  'rendering',
  'succeeded',
  'failed',
  'canceled'
);

create type public.subscription_status as enum(
  'trialing',
  'active',
  'past_due',
  'canceled',
  'incomplete',
  'paused'
);

create type public.ledger_reason as enum(
  'signup_bonus',
  'subscription_grant',
  'purchase',
  'generation_hold',
  'generation_refund',
  'admin_adjust'
);

-- Plans and profiles
create table public.plans (
  id text primary key,
  key text unique not null,
  name text not null,
  monthly_credits int not null,
  price_cents int not null,
  price_env_key text
);

insert into
  public.plans
values
  ('free', 'free', 'Free', 60, 0, null),
  (
    'creator',
    'creator',
    'Creator',
    600,
    999,
    'STRIPE_PRICE_CREATOR'
  ),
  (
    'studio',
    'studio',
    'Studio',
    2400,
    2999,
    'STRIPE_PRICE_STUDIO'
  );

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  locale text not null default 'en-US',
  theme text not null default 'dark' check (theme in ('dark', 'light', 'system')),
  marketing_opt_in boolean not null default false,
  credits int not null default 0 check (credits >= 0),
  role public.app_role not null default 'user',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Billing and credit accounting
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  plan_id text not null references public.plans (id),
  provider text not null check (provider in ('stripe', 'revenuecat')),
  provider_customer_id text,
  provider_subscription_id text,
  status public.subscription_status not null,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  delta int not null,
  reason public.ledger_reason not null,
  generation_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Assets and generation lifecycle
create table public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind public.asset_kind not null,
  bucket text not null,
  path text not null,
  mime text not null,
  bytes bigint not null,
  duration_ms int,
  width int,
  height int,
  checksum text,
  created_at timestamptz not null default now()
);

create table public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  image_asset_id uuid not null references public.assets (id),
  audio_asset_id uuid not null references public.assets (id),
  output_asset_id uuid references public.assets (id),
  status public.generation_status not null default 'queued',
  progress int not null default 0 check (progress between 0 and 100),
  provider_job_id text,
  provider text,
  params jsonb not null default '{}',
  credits_charged int not null default 0,
  error_code text,
  error_message text,
  attempts int not null default 0,
  queued_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  expires_at timestamptz,
  title text,
  visibility text not null default 'private' check (visibility in ('private', 'unlisted')),
  share_slug text unique
);

create table public.generation_events (
  id uuid primary key default gen_random_uuid(),
  generation_id uuid not null references public.generations (id) on delete cascade,
  status public.generation_status not null,
  progress int not null,
  message text,
  created_at timestamptz not null default now()
);

-- Notifications, analytics, and webhooks
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  generation_id uuid references public.generations (id),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  name text not null,
  properties jsonb not null default '{}',
  session_id text,
  created_at timestamptz not null default now()
);

create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  external_id text not null,
  payload jsonb not null,
  processed_at timestamptz,
  unique (provider, external_id)
);

create table public.rate_limit_hits (
  key text not null,
  window_start timestamptz not null,
  count int not null default 0,
  primary key (key, window_start)
);

-- Indexes and triggers
create index generations_user_created on public.generations (user_id, created_at desc);

create index generations_status on public.generations (status);

create index generations_provider_job on public.generations (provider_job_id);

create index generation_events_generation on public.generation_events (generation_id, created_at);

create index analytics_created on public.analytics_events (created_at);

create or replace function public.handle_new_user () returns trigger language plpgsql security definer
set
  search_path = public as $$ begin insert into profiles(id,email) values(new.id,new.email);
 insert into credit_ledger(user_id,delta,reason) values(new.id,60,'signup_bonus');
 return new;
 end;
 $$;

create trigger on_auth_user_created
after insert on auth.users for each row
execute function public.handle_new_user ();

create or replace function public.sync_credits () returns trigger language plpgsql security definer
set
  search_path = public as $$ begin update profiles set credits=credits+new.delta,updated_at=now() where id=new.user_id;
 return new;
 end;
 $$;

create trigger credit_ledger_sync
after insert on credit_ledger for each row
execute function public.sync_credits ();

create or replace function public.deduct_credits (p_user uuid, p_amount int, p_generation uuid) returns void language plpgsql security definer
set
  search_path = public as $$ begin update profiles set credits=credits-p_amount where id=p_user and credits>=p_amount;
 if not found then raise exception 'INSUFFICIENT_CREDITS';
 end if;
 insert into credit_ledger(user_id,delta,reason,generation_id) values(p_user,-p_amount,'generation_hold',p_generation);
 end;
 $$;

create or replace function public.bump_rate_limit (p_key text, p_window int, p_limit int) returns table (allowed boolean, remaining int) language plpgsql security definer as $$ declare c int;
 begin insert into rate_limit_hits values(p_key,date_trunc('second',now()) - (extract(epoch from now())::int % p_window) * interval '1 second',1) on conflict(key,window_start) do update set count=rate_limit_hits.count+1 returning count into c;
 return query select c<=p_limit,greatest(0,p_limit-c);
 end;
 $$;

-- Row-level security
alter table profiles enable row level security;

alter table subscriptions enable row level security;

alter table credit_ledger enable row level security;

alter table assets enable row level security;

alter table generations enable row level security;

alter table generation_events enable row level security;

alter table notifications enable row level security;

alter table analytics_events enable row level security;

alter table webhook_events enable row level security;

alter table rate_limit_hits enable row level security;

create policy profiles_owner on profiles for all using (id = auth.uid ())
with
  check (id = auth.uid ());

create policy assets_owner on assets for all using (user_id = auth.uid ())
with
  check (user_id = auth.uid ());

create policy generations_owner on generations for all using (user_id = auth.uid ())
with
  check (user_id = auth.uid ());

create policy ledger_owner_read on credit_ledger for
select
  using (user_id = auth.uid ());

create policy events_owner_read on generation_events for
select
  using (
    exists (
      select
        1
      from
        generations g
      where
        g.id = generation_id
        and g.user_id = auth.uid ()
    )
  );

create policy subscriptions_owner on subscriptions for
select
  using (user_id = auth.uid ());

create policy notifications_owner on notifications for all using (user_id = auth.uid ())
with
  check (user_id = auth.uid ());

create policy analytics_owner on analytics_events for insert
with
  check (
    user_id = auth.uid ()
    or user_id is null
  );
