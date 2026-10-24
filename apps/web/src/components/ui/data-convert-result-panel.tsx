import { useState } from 'react';
import { DownloadIcon } from './icons';
import { CopyIcon } from './core-icons';
import { Button } from '@/components/core/button';
import { formatBytes, type DataConvertResult } from '@/types';
import type { DataFormat } from '@/constants/data-convert';

interface DataConvertResultPanelProps {
  result: DataConvertResult;
  targetFormat: DataFormat;
  onResetReady?: () => void;
}

export function DataConvertResultPanel({
  result,
  targetFormat,
  onResetReady,
}: DataConvertResultPanelProps) {
  const [copied, setCopied] = useState(false);

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(result.convertedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const downloadResult = () => {
    const blob = new Blob([result.convertedContent], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-data.${targetFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="data-result-container">
      <div className="markdown-meta-row">
        <div className="token-stats">
          <span className="stat-pill highlight">
            <strong>{result.rowCount}</strong> kayıt / satır
          </span>
          <span className="stat-pill">
            <strong>{result.keys.length}</strong> sütun
          </span>
          <span className="stat-pill">
            <strong>{formatBytes(result.byteSize)}</strong>
          </span>
        </div>
        <div className="markdown-actions">
          <Button
            type="button"
            className="text-button-accent"
            onClick={copyResult}
          >
            <CopyIcon />
            {copied ? 'Kopyalandı ✓' : 'Kopyala'}
          </Button>
          <Button
            type="button"
            className="download-button"
            style={{
              width: 'auto',
              minHeight: '34px',
              padding: '0 14px',
              fontSize: '0.78rem',
            }}
            onClick={downloadResult}
          >
            <DownloadIcon />.{targetFormat.toUpperCase()} İndir
          </Button>
          {onResetReady && (
            <Button
              type="button"
              className="text-button text-button-muted"
              onClick={onResetReady}
              title="Sonucu temizle ve yeni dönüştürme yap"
            >
              Yeni Dönüştürme
            </Button>
          )}
        </div>
      </div>
      <pre className="markdown-preview data-preview-box">
        {result.convertedContent}
      </pre>
    </div>
  );
}
