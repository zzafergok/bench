import { describe, expect, it } from 'vitest';
import { detectDataFormat, getAlternativeTargetFormat } from './data-format';

describe('detectDataFormat', () => {
  it('detects json format from file name', () => {
    expect(detectDataFormat('meb_okul.json')).toBe('json');
    expect(detectDataFormat(new File([''], 'test.JSON'))).toBe('json');
  });

  it('detects csv format from file name', () => {
    expect(detectDataFormat('data.csv')).toBe('csv');
    expect(detectDataFormat(new File([''], 'users.CSV'))).toBe('csv');
  });

  it('detects yaml and yml format from file name', () => {
    expect(detectDataFormat('config.yaml')).toBe('yaml');
    expect(detectDataFormat('config.yml')).toBe('yaml');
    expect(detectDataFormat(new File([''], 'ci.YAML'))).toBe('yaml');
  });

  it('returns null for unsupported extensions', () => {
    expect(detectDataFormat('document.pdf')).toBeNull();
    expect(detectDataFormat('image.png')).toBeNull();
  });
});

describe('getAlternativeTargetFormat', () => {
  it('switches away from matching source format', () => {
    expect(getAlternativeTargetFormat('json')).toBe('csv');
    expect(getAlternativeTargetFormat('csv')).toBe('json');
    expect(getAlternativeTargetFormat('yaml')).toBe('json');
  });
});
