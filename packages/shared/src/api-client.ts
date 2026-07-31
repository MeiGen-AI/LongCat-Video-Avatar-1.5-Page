export type ApiFetch = (input: string, init?: RequestInit) => Promise<Response>;

export function createApiClient(
  fetcher: ApiFetch,
  baseUrl: string,
  getToken: () => Promise<string | undefined>,
) {
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = await getToken();
    const response = await fetcher(`${baseUrl}${path}`, {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });
    const payload = (await response.json()) as T & { error?: { message?: string } };
    if (!response.ok) throw new Error(payload.error?.message ?? 'Request failed');
    return payload;
  }
  return { request };
}
