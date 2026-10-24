import { useState } from 'react';
import type { MergeResult } from '../types';
import { readApiError } from '../utils/api';

export function useMerge() {
  const [result, setResult] = useState<MergeResult | null>(null);

  function clearResult() {
    if (result) URL.revokeObjectURL(result.url);
    setResult(null);
  }

  async function mergeFiles(files: File[]) {
    clearResult();
    const formData = new FormData();
    for (const file of files) {
      formData.append('file', file);
    }

    const response = await fetch('/api/merge', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        await readApiError(
          response,
          'PDF birleştirme tamamlanamadı. Lütfen tekrar deneyin.',
        ),
      );
    }

    const blob = await response.blob();
    const pageCount = Number(response.headers.get('X-Total-Pages')) || 0;
    const fileCount =
      Number(response.headers.get('X-File-Count')) || files.length;
    const fileSize = Number(response.headers.get('X-File-Size')) || blob.size;

    const res: MergeResult = {
      url: URL.createObjectURL(blob),
      pageCount,
      fileCount,
      fileSize,
      downloadName: 'birlesik-belge.pdf',
    };

    setResult(res);
    return res;
  }

  return {
    result,
    clearResult,
    mergeFiles,
  };
}
