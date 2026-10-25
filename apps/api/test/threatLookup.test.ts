import { describe, expect, it } from 'vitest';
import { createApp } from '../src/server.js';
import { validateSha256 } from '../src/threatLookup.js';

describe('Threat Lookup Service & Routes', () => {
  it('validates 64-character SHA-256 strings correctly', () => {
    const valid =
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    expect(validateSha256(valid)).toBe(valid);
    expect(validateSha256(valid.toUpperCase())).toBe(valid);

    expect(() => validateSha256('invalid-hash')).toThrow();
    expect(() => validateSha256('12345')).toThrow();
    expect(() => validateSha256('zz'.repeat(32))).toThrow();
  });

  it('handles /api/crypto/threat-lookup request validation', async () => {
    const app = createApp();

    // 1. Missing hash
    const resNoHash = await app.inject({
      method: 'GET',
      url: '/api/crypto/threat-lookup',
    });
    expect(resNoHash.statusCode).toBe(400);

    // 2. Invalid hash
    const resInvalid = await app.inject({
      method: 'GET',
      url: '/api/crypto/threat-lookup?hash=invalid',
    });
    expect(resInvalid.statusCode).toBe(400);

    // 3. Known empty-file hash lookup via CIRCL
    const emptySha256 =
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    const resValid = await app.inject({
      method: 'GET',
      url: `/api/crypto/threat-lookup?hash=${emptySha256}`,
    });

    // Should return 200 with clean/known status
    expect(resValid.statusCode).toBe(200);
    const body = resValid.json();
    expect(body.hash).toBe(emptySha256);
    expect(body.status).toBe('clean');
    expect(['circl', 'virustotal']).toContain(body.provider);
  });
});
