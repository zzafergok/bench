import { afterEach, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { createApp } from '../src/server.js';
import { loadConfig } from '../src/config.js';

const apps: FastifyInstance[] = [];

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

function body(files: string[]) {
  const boundary = 'markdown-test-boundary';
  return {
    boundary,
    payload: [
      ...files.flatMap((name) => [
        `--${boundary}`,
        `Content-Disposition: form-data; name="file"; filename="${name}"`,
        'Content-Type: application/pdf',
        '',
        '%PDF-1.4',
      ]),
      `--${boundary}--`,
      '',
    ].join('\r\n'),
  };
}

describe('Markdown conversion', () => {
  it('reports a missing local MarkItDown installation clearly', async () => {
    const app = createApp(
      loadConfig({ MARKITDOWN_BIN: '/missing/markitdown' }),
    );
    apps.push(app);
    const request = body(['document.pdf']);
    const response = await app.inject({
      method: 'POST',
      url: '/api/convert/markdown',
      headers: {
        'content-type': `multipart/form-data; boundary=${request.boundary}`,
      },
      payload: request.payload,
    });

    expect(response.statusCode).toBe(503);
    expect(response.json()).toMatchObject({
      error: { code: 'MARKITDOWN_UNAVAILABLE' },
    });
  });

  it('rejects unsupported file formats', async () => {
    const app = createApp(
      loadConfig({ MARKITDOWN_BIN: '/missing/markitdown' }),
    );
    apps.push(app);
    const boundary = 'markdown-invalid-boundary';
    const payload = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="file"; filename="script.exe"',
      'Content-Type: application/octet-stream',
      '',
      'binarydata',
      `--${boundary}--`,
      '',
    ].join('\r\n');

    const response = await app.inject({
      method: 'POST',
      url: '/api/convert/markdown',
      headers: { 'content-type': `multipart/form-data; boundary=${boundary}` },
      payload,
    });

    expect(response.statusCode).toBe(415);
    expect(response.json()).toMatchObject({
      error: { code: 'INVALID_MEDIA_TYPE' },
    });
  });

  it('accepts multiple files for batch conversion', async () => {
    const app = createApp(
      loadConfig({ MARKITDOWN_BIN: '/missing/markitdown' }),
    );
    apps.push(app);
    const request = body(['first.pdf', 'second.pdf']);
    const response = await app.inject({
      method: 'POST',
      url: '/api/convert/markdown',
      headers: {
        'content-type': `multipart/form-data; boundary=${request.boundary}`,
      },
      payload: request.payload,
    });

    // /missing/markitdown mock'landığı için dönüştürmeye geçer ve 400 yerine 503 ile sonuçlanır
    expect(response.statusCode).toBe(503);
    expect(response.json()).toMatchObject({
      error: { code: 'MARKITDOWN_UNAVAILABLE' },
    });
  });

  it('returns a clear 413 response when a file exceeds the configured limit', async () => {
    const app = createApp(
      loadConfig({
        MARKITDOWN_BIN: '/missing/markitdown',
        MAX_UPLOAD_BYTES: '4',
      }),
    );
    apps.push(app);
    const request = body(['document.pdf']);
    const response = await app.inject({
      method: 'POST',
      url: '/api/convert/markdown',
      headers: {
        'content-type': `multipart/form-data; boundary=${request.boundary}`,
      },
      payload: request.payload,
    });

    expect(response.statusCode).toBe(413);
    expect(response.json()).toMatchObject({
      error: { code: 'FILE_TOO_LARGE' },
    });
  });
});
