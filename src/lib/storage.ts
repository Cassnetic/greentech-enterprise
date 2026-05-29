import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}

export async function uploadPaymentProof(
  bookingId: string,
  filename: string,
  body: ArrayBuffer | Buffer,
  contentType: string,
): Promise<string> {
  const client = getClient();
  const bucket = process.env.SUPABASE_PROOF_BUCKET || 'payment-proofs';
  const path = `${bookingId}/${Date.now()}-${filename}`;

  if (!client) {
    // Dev fallback — log and return a pseudo-URL so the flow works end-to-end without Supabase configured.
    console.warn('[storage] Supabase not configured — skipping upload, returning pseudo URL.');
    return `local://${path}`;
  }

  const { error } = await client.storage.from(bucket).upload(path, body, {
    contentType,
    upsert: false,
  });
  if (error) throw new Error(`Supabase upload failed: ${error.message}`);

  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
