import * as FileSystem from 'expo-file-system';
import { api } from './api-client';

export async function uploadAsset(
  uri: string,
  kind: 'image' | 'audio',
  mime: string,
  filename: string,
  metadata: { durationMs?: number; width?: number; height?: number } = {},
) {
  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists || info.isDirectory) throw new Error('Selected file is unavailable');
  const signed = await api.signUpload({ kind, mime, bytes: info.size ?? 0, filename, ...metadata });
  const result = await FileSystem.uploadAsync(signed.uploadUrl, uri, {
    httpMethod: 'PUT',
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    headers: { 'content-type': mime },
  });
  if (result.status < 200 || result.status >= 300) throw new Error('Upload failed');
  return signed.assetId;
}
