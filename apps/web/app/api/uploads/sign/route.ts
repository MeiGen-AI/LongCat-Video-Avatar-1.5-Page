import { NextResponse } from 'next/server';
import { FILE_CONSTRAINTS, uploadSignRequestSchema } from '@fakhm/shared';
import { withApi } from '@/lib/api';
import { createAdmin } from '@/lib/supabase/admin';
import { assetPath, signedUpload } from '@/lib/storage';
export const POST = withApi({
  mode: 'user',
  body: uploadSignRequestSchema,
  handler: async ({ userId, body }) => {
    const constraint = FILE_CONSTRAINTS[body.kind];
    if (
      !constraint.mime.includes(body.mime as never) ||
      ('maxBytes' in constraint && body.bytes > constraint.maxBytes)
    )
      throw new Error('Invalid file');
    const assetId = crypto.randomUUID();
    const ext = body.filename.split('.').pop() ?? 'bin';
    const path = assetPath(userId!, assetId, ext);
    const { error } = await createAdmin().from('assets').insert({
      id: assetId,
      user_id: userId!,
      kind: body.kind,
      bucket: 'uploads',
      path,
      mime: body.mime,
      bytes: body.bytes,
    });
    if (error) throw error;
    const signed = await signedUpload('uploads', path);
    return NextResponse.json({ assetId, path, upload: signed });
  },
});
