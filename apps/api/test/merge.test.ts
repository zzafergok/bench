import { afterEach, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { createApp } from '../src/server.js';
import { loadConfig } from '../src/config.js';
import { PDFDocument } from 'pdf-lib';

const apps: FastifyInstance[] = [];

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

async function createMinimalPdfBytes(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  doc.addPage([100, 100]);
  const bytes = await doc.save();
  return Buffer.from(bytes);
}

describe('PDF merge API', () => {
  it('requires at least two files to merge', async () => {
    const app = createApp(loadConfig());
    apps.push(app);

    const boundary = 'merge-test-boundary';
    const pdfBytes = await createMinimalPdfBytes();
    const payload = Buffer.concat([
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="single.pdf"\r\nContent-Type: application/pdf\r\n\r\n`,
      ),
      pdfBytes,
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);

    const response = await app.inject({
      method: 'POST',
      url: '/api/merge',
      headers: { 'content-type': `multipart/form-data; boundary=${boundary}` },
      payload,
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      error: { code: 'MINIMUM_FILES_REQUIRED' },
    });
  });

  it('successfully merges multiple valid PDF files', async () => {
    const app = createApp(loadConfig());
    apps.push(app);

    const boundary = 'merge-test-boundary';
    const pdfBytes1 = await createMinimalPdfBytes();
    const pdfBytes2 = await createMinimalPdfBytes();

    const payload = Buffer.concat([
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="doc1.pdf"\r\nContent-Type: application/pdf\r\n\r\n`,
      ),
      pdfBytes1,
      Buffer.from(
        `\r\n--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="doc2.pdf"\r\nContent-Type: application/pdf\r\n\r\n`,
      ),
      pdfBytes2,
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);

    const response = await app.inject({
      method: 'POST',
      url: '/api/merge',
      headers: { 'content-type': `multipart/form-data; boundary=${boundary}` },
      payload,
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('application/pdf');
    expect(response.headers['x-total-pages']).toBe('2');
    expect(response.headers['x-file-count']).toBe('2');

    const mergedBytes = response.rawPayload;
    expect(mergedBytes.subarray(0, 5).toString()).toBe('%PDF-');
  });
});
