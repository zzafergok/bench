import { describe, expect, it } from 'vitest';
import { readApiError } from './api';

describe('API error parsing', () => {
  it('reads the shared API error envelope', async () => {
    const response = new Response(
      JSON.stringify({ error: { message: 'Dosya çok büyük.' } }),
      { status: 413, headers: { 'Content-Type': 'application/json' } },
    );
    await expect(readApiError(response, 'fallback')).resolves.toBe(
      'Dosya çok büyük.',
    );
  });

  it('falls back when the response is not JSON', async () => {
    const response = new Response('gateway failure', { status: 502 });
    await expect(readApiError(response, 'Tekrar deneyin.')).resolves.toBe(
      'Tekrar deneyin.',
    );
  });
});
