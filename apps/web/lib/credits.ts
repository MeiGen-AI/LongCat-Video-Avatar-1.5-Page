import { createAdmin } from './supabase/admin';
export async function deductCredits(userId: string, amount: number, generationId: string) {
  const { error } = await createAdmin().rpc('deduct_credits', {
    p_user: userId,
    p_amount: amount,
    p_generation: generationId,
  });
  if (error) throw error;
}
export async function refundCredits(userId: string, amount: number, generationId: string) {
  const db = createAdmin();
  const { data: existing } = await db
    .from('credit_ledger')
    .select('id')
    .eq('generation_id', generationId)
    .eq('reason', 'generation_refund')
    .maybeSingle();
  if (existing) return;
  const { error } = await db.from('credit_ledger').insert({
    user_id: userId,
    delta: amount,
    reason: 'generation_refund',
    generation_id: generationId,
    metadata: {},
  });
  if (error && error.code !== '23505') throw error;
}
