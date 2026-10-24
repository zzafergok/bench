import { afterEach, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { createApp } from '../src/server.js';
import { loadConfig } from '../src/config.js';

const apps: FastifyInstance[] = [];

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

function multipartBody() {
  const boundary = 'bench-test-boundary';
  const file = (name: string) =>
    [
      `--${boundary}`,
      `Content-Disposition: form-data; name="file"; filename="${name}"`,
      'Content-Type: application/pdf',
      '',
      '%PDF-1.4',
      '% test PDF',
    ].join('\r\n');

  return {
    boundary,
    body: [
      `--${boundary}`,
      'Content-Disposition: form-data; name="profile"',
      '',
      'balanced',
      file('first.pdf'),
      file('second.pdf'),
      `--${boundary}--`,
      '',
    ].join('\r\n'),
  };
}

describe('batch compression', () => {
  it('accepts more than one PDF before invoking the compression engine', async () => {
    const app = createApp(
      loadConfig({ GHOSTSCRIPT_BIN: '/missing/ghostscript' }),
    );
    apps.push(app);
    const { boundary, body } = multipartBody();

    const response = await app.inject({
      method: 'POST',
      url: '/api/compress',
      headers: { 'content-type': `multipart/form-data; boundary=${boundary}` },
      payload: body,
    });

    expect(response.statusCode).toBe(503);
    expect(response.json()).toMatchObject({
      error: { code: 'GHOSTSCRIPT_UNAVAILABLE' },
    });
  });
});
