import { useState } from 'react';
import type { CompressionResult, Profile } from '../types';
import { readApiError } from '../utils/api';
import { useStorageBoolean, useStorageString } from './use-storage';

const isProfile = (v: string): v is Profile =>
  v === 'light' || v === 'balanced' || v === 'strong';

export function useCompression() {
  const [profile, setProfile] = useStorageString<Profile>(
    'bench_profile',
    'balanced',
    isProfile,
  );

  const [stripMetadata, setStripMetadata] = useStorageBoolean(
    'bench_strip_metadata',
    false,
  );

  const [result, setResult] = useState<CompressionResult | null>(null);

  function clearResult() {
    if (result) URL.revokeObjectURL(result.url);
    setResult(null);
  }

  async function compressFiles(files: File[]) {
    clearResult();
    const formData = new FormData();
    formData.append('profile', profile);
    formData.append('stripMetadata', String(stripMetadata));
    for (const file of files) formData.append('file', file);

    const response = await fetch('/api/compress', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        await readApiError(
          response,
          'Sıkıştırma tamamlanamadı. Lütfen tekrar deneyin.',
        ),
      );
    }

    const contentType = response.headers.get('content-type') || '';
    const disposition = response.headers.get('content-disposition') || '';
    const count = Number(response.headers.get('X-File-Count')) || files.length;
    const isSinglePdf = contentType.includes('application/pdf') || count === 1;

    let downloadName = isSinglePdf
      ? `${files[0].name.replace(/\.pdf$/i, '')}-compressed.pdf`
      : 'compressed-pdfs.zip';

    const filenameMatch = disposition.match(/filename="?([^";]+)"?/);
    if (filenameMatch?.[1]) {
      downloadName = filenameMatch[1];
    }

    const blob = await response.blob();
    const res: CompressionResult = {
      url: URL.createObjectURL(blob),
      originalSize:
        Number(response.headers.get('X-Original-Bytes')) ||
        files.reduce((total, file) => total + file.size, 0),
      compressedSize:
        Number(response.headers.get('X-Compressed-Bytes')) || blob.size,
      archiveSize: Number(response.headers.get('X-Archive-Bytes')) || blob.size,
      count,
      isSinglePdf,
      downloadName,
    };
    setResult(res);
    return res;
  }

  return {
    profile,
    setProfile,
    stripMetadata,
    setStripMetadata,
    result,
    clearResult,
    compressFiles,
  };
}
