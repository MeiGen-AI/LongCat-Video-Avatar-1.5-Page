export function log(
  level: 'info' | 'error',
  message: string,
  fields: Record<string, unknown> = {},
) {
  console.log(JSON.stringify({ level, message, ...fields, timestamp: new Date().toISOString() }));
}
