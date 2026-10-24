import { useState } from 'react';
import type { ImagesResult } from '../types';
import { readApiError } from '../utils/api';

export function useImages() {
  const [dpi, setDpi] = useState<number>(150);
  const [result, setResult] = useState<ImagesResult | null>(null);

  function clearResult() {
    if (result) URL.revokeObjectURL(result.url);
    setResult(null);
  }

  async function convertPdfToImages(file: File) {
    clearResult();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dpi', String(dpi));

    const response = await fetch('/api/convert/images', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        await readApiError(
          response,
          'Görsel dönüştürme tamamlanamadı. Lütfen tekrar deneyin.',
        ),
      );
    }

    const contentType = response.headers.get('content-type') || '';
    const pageCount = Number(response.headers.get('X-Page-Count')) || 1;
    const isSingleImage = contentType.includes('image/png') || pageCount === 1;

    const baseName = file.name.replace(/\.pdf$/i, '');
    let downloadName = isSingleImage
      ? `${baseName}-sayfa-1.png`
      : `${baseName}-sayfalar-png.zip`;

    const disposition = response.headers.get('content-disposition') || '';
    const filenameMatch = disposition.match(/filename="?([^";]+)"?/);
    if (filenameMatch?.[1]) {
      downloadName = filenameMatch[1];
    }

    const blob = await response.blob();
    const res: ImagesResult = {
      url: URL.createObjectURL(blob),
      pageCount,
      isSingleImage,
      downloadName,
    };

    setResult(res);
    return res;
  }

  return {
    dpi,
    setDpi,
    result,
    clearResult,
    convertPdfToImages,
  };
}
