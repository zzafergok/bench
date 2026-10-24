import { afterEach, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { createApp } from '../src/server.js';
import { loadConfig } from '../src/config.js';
import { PDFDocument } from 'pdf-lib';

const apps: FastifyInstance[] = [];

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

async function createMinimalPdfBytes(pagesCount = 1): Promise<Buffer> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pagesCount; i++) {
    doc.addPage([100, 100]);
  }
  const bytes = await doc.save();
  return Buffer.from(bytes);
}

describe('PDF to Images API', () => {
  it('requires a PDF file to convert', async () => {
    const app = createApp(loadConfig());
    apps.push(app);

    const boundary = 'images-test-boundary';
    const payload = `--${boundary}--\r\n`;

    const response = await app.inject({
      method: 'POST',
      url: '/api/convert/images',
      headers: { 'content-type': `multipart/form-data; boundary=${boundary}` },
      payload,
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({ error: { code: 'FILE_REQUIRED' } });
  });

  it('reports missing Ghostscript binary if unavailable', async () => {
    const app = createApp(loadConfig({ GHOSTSCRIPT_BIN: '/missing/gs' }));
    apps.push(app);

    const boundary = 'images-test-boundary';
    const pdfBytes = await createMinimalPdfBytes(1);
    const payload = Buffer.concat([
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="sample.pdf"\r\nContent-Type: application/pdf\r\n\r\n`,
      ),
      pdfBytes,
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);

    const response = await app.inject({
      method: 'POST',
      url: '/api/convert/images',
      headers: { 'content-type': `multipart/form-data; boundary=${boundary}` },
      payload,
    });

    expect(response.statusCode).toBe(503);
    expect(response.json()).toMatchObject({
      error: { code: 'GHOSTSCRIPT_UNAVAILABLE' },
    });
  });
});
