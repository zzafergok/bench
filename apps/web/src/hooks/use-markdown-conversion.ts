import { useState } from 'react';
import type { MarkdownItem, MarkdownResult } from '../types';
import { useStorageString } from './use-storage';

const isPreviewMode = (v: string): v is 'rendered' | 'raw' =>
  v === 'rendered' || v === 'raw';

function toSafeDownloadName(value: string, fallback: string): string {
  const base = value.split(/[\\/]/).pop() ?? '';
  const safe = Array.from(base, (character) => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127 || character === '"' ? '_' : character;
  })
    .join('')
    .trim();
  return safe || fallback;
}

export function useMarkdownConversion() {
  const [markdownResult, setMarkdownResult] = useState<MarkdownResult | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<number>(-1); // -1 = Birleşik (çoklu ise), 0..n = bireysel dosya
  const [copiedType, setCopiedType] = useState<'standard' | 'llm' | null>(null);

  const [previewMode, setPreviewMode] = useStorageString<'rendered' | 'raw'>(
    'bench_preview_mode',
    'rendered',
    isPreviewMode,
  );

  async function convertToMarkdown(files: File[]) {
    resetMarkdown();
    const formData = new FormData();
    for (const file of files) {
      formData.append('file', file);
    }

    const response = await fetch('/api/convert/markdown', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => null)) as {
        error?: { message?: string };
      } | null;
      throw new Error(
        errorData?.error?.message ??
          'Markdown dönüşümü tamamlanamadı. Lütfen tekrar deneyin.',
      );
    }

    const body = (await response.json().catch(() => null)) as {
      results?: MarkdownItem[];
      combinedMarkdown?: string;
      count?: number;
      markdown?: string;
      fileName?: string;
      tokenEstimate?: number;
      charCount?: number;
      wordCount?: number;
    } | null;

    if (!body) {
      throw new Error(
        'Markdown dönüşümü tamamlanamadı. Lütfen tekrar deneyin.',
      );
    }

    const results: MarkdownItem[] = body.results ?? [
      {
        fileName: body.fileName ?? 'document.md',
        originalName: files[0]?.name ?? 'document.pdf',
        markdown: body.markdown ?? '',
        tokenEstimate:
          body.tokenEstimate ?? Math.ceil((body.markdown ?? '').length / 3.8),
        charCount: body.charCount ?? (body.markdown ?? '').length,
        wordCount: body.wordCount ?? 0,
      },
    ];

    const combined = body.combinedMarkdown ?? results[0].markdown;
    const res: MarkdownResult = {
      results,
      combinedMarkdown: combined,
      count: results.length,
      fileName: results[0].fileName,
      markdown: results[0].markdown,
      tokenEstimate: results[0].tokenEstimate,
      charCount: results[0].charCount,
      wordCount: results[0].wordCount,
    };

    setMarkdownResult(res);
    setActiveTab(0);
    return res;
  }

  function getActiveContent(): {
    text: string;
    fileName: string;
    originalName: string;
    tokenEstimate: number;
    charCount: number;
    wordCount: number;
  } {
    if (!markdownResult) {
      return {
        text: '',
        fileName: '',
        originalName: '',
        tokenEstimate: 0,
        charCount: 0,
        wordCount: 0,
      };
    }

    if (activeTab === -1 || markdownResult.results.length === 0) {
      const charCount = markdownResult.combinedMarkdown.length;
      return {
        text: markdownResult.combinedMarkdown,
        fileName: 'tum-dokumanlar-birlestirilmis.md',
        originalName: 'Tüm Dokümanlar (Birleşik)',
        tokenEstimate: Math.ceil(charCount / 3.8),
        charCount,
        wordCount: markdownResult.combinedMarkdown.trim().split(/\s+/).length,
      };
    }

    const item = markdownResult.results[activeTab] ?? markdownResult.results[0];
    return {
      text: item.markdown,
      fileName: item.fileName,
      originalName: item.originalName,
      tokenEstimate: item.tokenEstimate,
      charCount: item.charCount,
      wordCount: item.wordCount,
    };
  }

  async function copyMarkdown() {
    const current = getActiveContent();
    if (!current.text) return;
    try {
      await navigator.clipboard.writeText(current.text);
      setCopiedType('standard');
      window.setTimeout(() => setCopiedType(null), 1800);
    } catch {
      setCopiedType(null);
    }
  }

  async function copyAsLLMContext() {
    if (!markdownResult) return;
    const payload =
      activeTab === -1
        ? markdownResult.results
            .map(
              (item) =>
                `<document name="${item.originalName}">\n${item.markdown}\n</document>`,
            )
            .join('\n\n')
        : (() => {
            const current = getActiveContent();
            return `<document name="${current.originalName}">\n${current.text}\n</document>`;
          })();

    try {
      await navigator.clipboard.writeText(payload);
      setCopiedType('llm');
      window.setTimeout(() => setCopiedType(null), 1800);
    } catch {
      setCopiedType(null);
    }
  }

  function downloadMarkdown() {
    const current = getActiveContent();
    if (!current.text) return;
    const url = URL.createObjectURL(
      new Blob([current.text], { type: 'text/markdown;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = toSafeDownloadName(current.fileName, 'document.md');
    link.click();
    URL.revokeObjectURL(url);
  }

  function resetMarkdown() {
    setMarkdownResult(null);
    setActiveTab(0);
    setCopiedType(null);
  }

  return {
    markdownResult,
    activeTab,
    setActiveTab,
    previewMode,
    setPreviewMode,
    copiedType,
    getActiveContent,
    convertToMarkdown,
    copyMarkdown,
    copyAsLLMContext,
    downloadMarkdown,
    resetMarkdown,
  };
}
