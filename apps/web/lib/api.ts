import { AppError, HTTP_STATUS } from '@fakhm/shared';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUser, requireAdmin, requireUser } from './auth';
import { checkRateLimit } from './rate-limit';
import { log } from './logger';
type Mode = 'public' | 'user' | 'admin' | 'cron' | 'webhook';
type Ctx<TBody = unknown, TQuery = Record<string, string>, TParams = Record<string, string>> = {
  request: NextRequest;
  body: TBody;
  query: TQuery;
  params: TParams;
  userId?: string;
  requestId: string;
};
type Options<TBody, TQuery, TParams> = {
  mode?: Mode;
  body?: z.ZodType<TBody>;
  query?: z.ZodType<TQuery>;
  params?: z.ZodType<TParams>;
  handler: (ctx: Ctx<TBody, TQuery, TParams>) => Promise<Response>;
};
function headers(request: NextRequest, requestId: string) {
  const origin = request.headers.get('origin');
  const allowed = process.env.MOBILE_ORIGIN;
  const h = new Headers({ 'x-request-id': requestId });
  if (origin && allowed && origin === allowed) {
    h.set('access-control-allow-origin', origin);
    h.set('access-control-allow-credentials', 'true');
  }
  h.set('access-control-allow-methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  h.set('access-control-allow-headers', 'content-type,authorization');
  return h;
}
export function safeJson(value: unknown): unknown {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return null;
  }
}
export function withApi<
  TBody = unknown,
  TQuery = Record<string, string>,
  TParams = Record<string, string>,
>(options: Options<TBody, TQuery, TParams>) {
  return async (
    request: NextRequest,
    route: { params: Promise<TParams> | TParams } = { params: {} as TParams },
  ) => {
    const requestId = crypto.randomUUID();
    const h = headers(request, requestId);
    if (request.method === 'OPTIONS') return new NextResponse(null, { status: 204, headers: h });
    try {
      let userId: string | undefined;
      const mode = options.mode ?? 'user';
      if (mode === 'user') userId = (await requireUser()).id;
      else if (mode === 'admin') userId = (await requireAdmin()).id;
      else if (
        mode === 'cron' &&
        request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`
      )
        throw new AppError('UNAUTHORIZED', 'Invalid cron secret');
      if (mode === 'user' || mode === 'admin' || mode === 'public') {
        const allowed = await checkRateLimit(
          userId,
          request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown',
        );
        if (!allowed.allowed) throw new AppError('RATE_LIMITED', 'Too many requests');
      }
      const body = options.body ? options.body.parse(await request.json()) : undefined;
      const query = options.query
        ? options.query.parse(Object.fromEntries(request.nextUrl.searchParams))
        : ({} as TQuery);
      const params = options.params ? options.params.parse(await route.params) : await route.params;
      const response = await options.handler({
        request,
        body: body as TBody,
        query,
        params,
        userId,
        requestId,
      });
      response.headers.set('x-request-id', requestId);
      h.forEach((value, key) => response.headers.set(key, value));
      return response;
    } catch (error) {
      const appError =
        error instanceof AppError
          ? error
          : error instanceof Error
            ? new AppError('INTERNAL_ERROR', error.message)
            : new AppError('INTERNAL_ERROR', 'Unexpected error');
      log('error', appError.message, { requestId, code: appError.code });
      return NextResponse.json(
        { error: { code: appError.code, message: appError.message } },
        { status: HTTP_STATUS[appError.code], headers: h },
      );
    }
  };
}
