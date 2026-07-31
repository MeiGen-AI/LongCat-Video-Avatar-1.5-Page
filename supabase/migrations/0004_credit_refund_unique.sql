-- Make provider failure refunds race-safe.
create unique index credit_ledger_generation_refund_unique on public.credit_ledger (generation_id)
where
  reason = 'generation_refund';
