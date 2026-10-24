export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeLinkTarget(value: string): string {
  const trimmed = value.trim();
  let decoded: string;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    return '#';
  }

  const normalized = Array.from(decoded)
    .filter((character) => {
      const code = character.charCodeAt(0);
      return code > 32 && code !== 127;
    })
    .join('');
  const isSafeAbsolute = /^(https?:|mailto:)/i.test(normalized);
  const isSafeRelative =
    normalized.startsWith('#') ||
    (normalized.startsWith('/') && !normalized.startsWith('//')) ||
    normalized.startsWith('./') ||
    normalized.startsWith('../');

  return isSafeAbsolute || isSafeRelative ? trimmed : '#';
}

export function formatInline(text: string): string {
  let escaped = escapeHtml(text);

  // Satır içi kod: `kod`
  escaped = escaped.replace(
    /`([^`]+)`/g,
    '<code class="inline-code">$1</code>',
  );

  // Kalın ve İtalik: ***metin***
  escaped = escaped.replace(
    /\*\*\*([^*]+)\*\*\*/g,
    '<strong><em>$1</em></strong>',
  );

  // Kalın: **metin**
  escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // İtalik: *metin*
  escaped = escaped.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Bağlantılar: [metin](url)
  escaped = escaped.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_match, label: string, href: string) =>
      `<a href="${sanitizeLinkTarget(href)}" target="_blank" rel="noopener noreferrer">${label}</a>`,
  );

  return escaped;
}

export function parseMarkdown(md: string): string {
  if (!md || !md.trim()) return '<p class="empty-text">(Boş çıktı)</p>';

  const lines = md.split('\n');
  const output: string[] = [];
  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBlockLines: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' = 'ul';
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Kod blokları
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        output.push(
          `<pre class="code-block"><code data-lang="${escapeHtml(codeBlockLang)}">${escapeHtml(codeBlockLines.join('\n'))}</code></pre>`,
        );
        inCodeBlock = false;
        codeBlockLines = [];
        codeBlockLang = '';
      } else {
        if (inList) {
          output.push(listType === 'ul' ? '</ul>' : '</ol>');
          inList = false;
        }
        if (inTable) {
          output.push('</tbody></table></div>');
          inTable = false;
        }
        inCodeBlock = true;
        codeBlockLang = trimmed.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(rawLine);
      continue;
    }

    // Tablolar: | sütun 1 | sütun 2 |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());

      const isSeparator = cells.every((c) => /^:?-+:?$/.test(c));

      if (isSeparator) {
        continue;
      }

      if (!inTable) {
        if (inList) {
          output.push(listType === 'ul' ? '</ul>' : '</ol>');
          inList = false;
        }
        inTable = true;
        output.push('<div class="table-container"><table class="md-table">');
        output.push('<thead><tr>');
        for (const cell of cells) {
          output.push(`<th>${formatInline(cell)}</th>`);
        }
        output.push('</tr></thead><tbody>');
        continue;
      } else {
        output.push('<tr>');
        for (const cell of cells) {
          output.push(`<td>${formatInline(cell)}</td>`);
        }
        output.push('</tr>');
        continue;
      }
    } else if (inTable) {
      output.push('</tbody></table></div>');
      inTable = false;
    }

    // Boş satır
    if (!trimmed) {
      if (inList) {
        output.push(listType === 'ul' ? '</ul>' : '</ol>');
        inList = false;
      }
      continue;
    }

    // Yatay Çizgi: ---
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
      if (inList) {
        output.push(listType === 'ul' ? '</ul>' : '</ol>');
        inList = false;
      }
      output.push('<hr class="md-divider" />');
      continue;
    }

    // Başlıklar: #, ##, ###
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      if (inList) {
        output.push(listType === 'ul' ? '</ul>' : '</ol>');
        inList = false;
      }
      const level = headingMatch[1].length;
      output.push(
        `<h${level} class="md-h${level}">${formatInline(headingMatch[2])}</h${level}>`,
      );
      continue;
    }

    // Alıntı: > metin
    if (trimmed.startsWith('>')) {
      if (inList) {
        output.push(listType === 'ul' ? '</ul>' : '</ol>');
        inList = false;
      }
      const quoteText = trimmed.replace(/^>\s?/, '');
      output.push(
        `<blockquote class="md-blockquote">${formatInline(quoteText)}</blockquote>`,
      );
      continue;
    }

    // Sırasız Liste: - madde veya * madde
    const ulMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        if (inList) output.push(listType === 'ul' ? '</ul>' : '</ol>');
        output.push('<ul class="md-list">');
        inList = true;
        listType = 'ul';
      }
      output.push(`<li>${formatInline(ulMatch[1])}</li>`);
      continue;
    }

    // Sıralı Liste: 1. madde
    const olMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      if (!inList || listType !== 'ol') {
        if (inList) output.push(listType === 'ul' ? '</ul>' : '</ol>');
        output.push('<ol class="md-ordered-list">');
        inList = true;
        listType = 'ol';
      }
      output.push(`<li>${formatInline(olMatch[1])}</li>`);
      continue;
    }

    if (inList) {
      output.push(listType === 'ul' ? '</ul>' : '</ol>');
      inList = false;
    }

    // Paragraf
    output.push(`<p class="md-paragraph">${formatInline(trimmed)}</p>`);
  }

  if (inCodeBlock) {
    output.push(
      `<pre class="code-block"><code>${escapeHtml(codeBlockLines.join('\n'))}</code></pre>`,
    );
  }
  if (inList) {
    output.push(listType === 'ul' ? '</ul>' : '</ol>');
  }
  if (inTable) {
    output.push('</tbody></table></div>');
  }

  return output.join('\n');
}
