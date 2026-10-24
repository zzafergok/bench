export async function readApiError(
  response: Response,
  fallback: string,
): Promise<string> {
  const body = (await response.json().catch(() => null)) as
    | { error?: { message?: string }; message?: string }
    | null;
  return body?.error?.message ?? body?.message ?? fallback;
}
