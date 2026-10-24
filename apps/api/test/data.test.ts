import { describe, expect, it } from 'vitest';
import { convertStructuredData } from '../src/dataConverter.js';

describe('Data Converter', () => {
  it('converts CSV to JSON and YAML accurately', () => {
    const csv = 'name,role,age\nZafer,Developer,30\nAntigravity,AI,1';

    const jsonRes = convertStructuredData({
      content: csv,
      sourceFormat: 'csv',
      targetFormat: 'json',
    });

    expect(jsonRes.rowCount).toBe(2);
    expect(jsonRes.keys).toEqual(['name', 'role', 'age']);
    const parsed = JSON.parse(jsonRes.convertedContent);
    expect(parsed[0].name).toBe('Zafer');
    expect(parsed[1].name).toBe('Antigravity');

    const yamlRes = convertStructuredData({
      content: csv,
      sourceFormat: 'csv',
      targetFormat: 'yaml',
    });
    expect(yamlRes.convertedContent).toContain('Zafer');
  });

  it('converts JSON to CSV with proper escaping', () => {
    const data = [
      { id: 1, title: 'Item 1', desc: 'Simple text' },
      { id: 2, title: 'Item 2', desc: 'Text with, comma and "quotes"' },
    ];

    const res = convertStructuredData({
      content: JSON.stringify(data),
      sourceFormat: 'json',
      targetFormat: 'csv',
    });

    expect(res.rowCount).toBe(2);
    expect(res.convertedContent).toContain('"Text with, comma and ""quotes"""');
  });

  it('handles invalid content with clear ApiError', () => {
    expect(() =>
      convertStructuredData({
        content: '{ invalid json ...',
        sourceFormat: 'json',
        targetFormat: 'csv',
      }),
    ).toThrow();
  });

  it('preserves whitespace and quoted multiline CSV fields', () => {
    const result = convertStructuredData({
      content: 'name,note\nZafer," first line\nsecond line "',
      sourceFormat: 'csv',
      targetFormat: 'json',
    });
    const rows = JSON.parse(result.convertedContent);
    expect(rows[0].note).toBe(' first line\nsecond line ');
  });

  it('rejects duplicate CSV column names instead of losing data', () => {
    expect(() =>
      convertStructuredData({
        content: 'name,name\nfirst,second',
        sourceFormat: 'csv',
        targetFormat: 'json',
      }),
    ).toThrow('benzersiz');
  });

  it('rejects undeclared data formats', () => {
    expect(() =>
      convertStructuredData({
        content: '{}',
        sourceFormat: 'xml' as never,
        targetFormat: 'json',
      }),
    ).toThrow('geçersiz');
  });
});

describe('POST /api/data/convert route', () => {
  it('returns 400 when body content is a non-string type (e.g. number 5)', async () => {
    const { createApp } = await import('../src/server.js');
    const { loadConfig } = await import('../src/config.js');
    const app = createApp(loadConfig());

    const response = await app.inject({
      method: 'POST',
      url: '/api/data/convert',
      headers: { 'content-type': 'application/json' },
      payload: {
        content: 5,
        sourceFormat: 'json',
        targetFormat: 'csv',
      },
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.error.code).toBe('CONTENT_REQUIRED');
    await app.close();
  });

  it('returns 413 when multipart file exceeds MAX_DATA_INPUT_BYTES limit', async () => {
    const { createApp } = await import('../src/server.js');
    const { loadConfig } = await import('../src/config.js');
    // Set low limit for testing
    const app = createApp(loadConfig({ MAX_DATA_INPUT_BYTES: '100' }));

    const boundary = 'data-test-boundary';
    const oversizedContent = 'a'.repeat(200);
    const payload = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="file"; filename="test.csv"',
      'Content-Type: text/csv',
      '',
      oversizedContent,
      `--${boundary}--`,
      '',
    ].join('\r\n');

    const response = await app.inject({
      method: 'POST',
      url: '/api/data/convert',
      headers: { 'content-type': `multipart/form-data; boundary=${boundary}` },
      payload,
    });

    expect(response.statusCode).toBe(413);
    const body = response.json();
    expect(body.error.code).toBe('CONTENT_TOO_LARGE');
    await app.close();
  });
});
