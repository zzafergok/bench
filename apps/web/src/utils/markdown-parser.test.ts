import { describe, expect, it } from 'vitest';
import { formatInline, parseMarkdown } from './markdown-parser';

describe('Markdown rendering safety', () => {
  it('escapes raw HTML from converted documents', () => {
    const html = parseMarkdown('<img src=x onerror=alert(1)>');
    expect(html).toContain('&lt;img');
    expect(html).not.toContain('<img');
  });

  it('blocks executable and encoded executable link schemes', () => {
    expect(formatInline('[bad](javascript:alert%281%29)')).toContain(
      'href="#"',
    );
    expect(formatInline('[bad](data:text/html,test)')).toContain('href="#"');
  });

  it('keeps safe web and relative links', () => {
    expect(formatInline('[web](https://example.com)')).toContain(
      'href="https://example.com"',
    );
    expect(formatInline('[local](./document.pdf)')).toContain(
      'href="./document.pdf"',
    );
    expect(formatInline('[query](https://example.com?a=1&b=2)')).toContain(
      'href="https://example.com?a=1&amp;b=2"',
    );
  });
});
