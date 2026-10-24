import { useState } from 'react';
import type { DataConvertResult } from '../types';
import { readApiError } from '../utils/api';

export function useDataConvert() {
  const [result, setResult] = useState<DataConvertResult | null>(null);
  const [sourceFormat, setSourceFormat] = useState<'json' | 'csv' | 'yaml'>(
    'json',
  );
  const [targetFormat, setTargetFormat] = useState<'json' | 'csv' | 'yaml'>(
    'csv',
  );
  const [rawText, setRawText] = useState<string>('');

  const convertData = async (files: File[]): Promise<DataConvertResult> => {
    let res: Response;

    if (files.length > 0) {
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('sourceFormat', sourceFormat);
      formData.append('targetFormat', targetFormat);
      formData.append('prettyJson', 'true');

      res = await fetch('/api/data/convert', {
        method: 'POST',
        body: formData,
      });
    } else {
      if (!rawText.trim())
        throw new Error('Dönüştürmek için metin girin veya dosya seçin.');

      res = await fetch('/api/data/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: rawText,
          sourceFormat,
          targetFormat,
          prettyJson: true,
        }),
      });
    }

    if (!res.ok) {
      throw new Error(
        await readApiError(res, 'Veri dönüştürme başarısız oldu.'),
      );
    }

    const data: DataConvertResult = await res.json();
    setResult(data);
    return data;
  };

  const clearResult = () => {
    setResult(null);
  };

  return {
    result,
    sourceFormat,
    setSourceFormat,
    targetFormat,
    setTargetFormat,
    rawText,
    setRawText,
    convertData,
    clearResult,
  };
}
