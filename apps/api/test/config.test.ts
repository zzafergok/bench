import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';
import { isCompressionProfile } from '../src/ghostscript.js';

describe('configuration', () => {
  it('uses safe local defaults', () => {
    const config = loadConfig({});
    expect(config.HOST).toBe('127.0.0.1');
    expect(config.PORT).toBe(8787);
    expect(config.COMPRESSION_TIMEOUT_MS).toBe(120_000);
    expect(config.MARKDOWN_TIMEOUT_MS).toBe(120_000);
    expect(config.MAX_UPLOAD_BYTES).toBe(128 * 1024 * 1024);
    expect(config.MAX_UPLOAD_FILES).toBe(20);
    expect(config.MAX_DATA_INPUT_BYTES).toBe(10 * 1024 * 1024);
    expect(config.MAX_CONCURRENT_JOBS).toBe(2);
    expect(config.MAX_QUEUED_JOBS).toBe(20);
    expect(config.JOB_QUEUE_TIMEOUT_MS).toBe(30_000);
  });

  it('rejects unsafe compression timeouts', () => {
    expect(() => loadConfig({ COMPRESSION_TIMEOUT_MS: '0' })).toThrow();
    expect(() => loadConfig({ MARKDOWN_TIMEOUT_MS: '0' })).toThrow();
    expect(() => loadConfig({ MAX_UPLOAD_FILES: '0' })).toThrow();
    expect(() => loadConfig({ MAX_CONCURRENT_JOBS: '0' })).toThrow();
    expect(() => loadConfig({ MAX_QUEUED_JOBS: '0' })).toThrow();
    expect(() => loadConfig({ JOB_QUEUE_TIMEOUT_MS: '0' })).toThrow();
  });
});

describe('compression profiles', () => {
  it('accepts only the declared profiles', () => {
    expect(isCompressionProfile('balanced')).toBe(true);
    expect(isCompressionProfile('lossless')).toBe(false);
  });
});
