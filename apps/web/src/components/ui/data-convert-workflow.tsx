import { useEffect } from 'react';
import { FileIcon, CloseIcon, SparklesIcon } from './icons';
import { TableIcon, TrashIcon } from './core-icons';
import { Button } from '@/components/core/button';
import { Label } from '@/components/core/label';
import { Spinner } from '@/components/core/spinner';
import { DataFormatBar } from './data-format-bar';
import { DataConvertResultPanel } from './data-convert-result-panel';
import { formatBytes, type DataConvertResult, type JobState } from '@/types';
import { Textarea } from '@/components/core/textarea';
import { SAMPLE_DATA, type DataFormat } from '@/constants/data-convert';
import {
  detectDataFormat,
  getAlternativeTargetFormat,
} from '@/utils/data-format';

interface DataConvertWorkflowProps {
  files: File[];
  jobState: JobState;
  result: DataConvertResult | null;
  sourceFormat: DataFormat;
  targetFormat: DataFormat;
  rawText: string;
  onSourceChange: (fmt: DataFormat) => void;
  onTargetChange: (fmt: DataFormat) => void;
  onRawTextChange: (text: string) => void;
  onConvert: () => void;
  onClearFiles?: () => void;
  onResetReady?: () => void;
}

export function DataConvertWorkflow({
  files,
  jobState,
  result,
  sourceFormat,
  targetFormat,
  rawText,
  onSourceChange,
  onTargetChange,
  onRawTextChange,
  onConvert,
  onClearFiles,
  onResetReady,
}: DataConvertWorkflowProps) {
  const handleLoadSample = () => {
    onRawTextChange(SAMPLE_DATA[sourceFormat]);
  };

  const handleClearText = () => {
    onRawTextChange('');
  };

  const hasFiles = files.length > 0;
  const hasText = rawText.trim().length > 0;
  const isConvertDisabled =
    (!hasFiles && !hasText) || jobState === 'processing';

  useEffect(() => {
    if (hasFiles) {
      const detected = detectDataFormat(files[0]);
      if (detected) {
        if (sourceFormat !== detected) {
          onSourceChange(detected);
        }
        if (targetFormat === detected) {
          onTargetChange(getAlternativeTargetFormat(detected));
        }
      }
    }
  }, [
    hasFiles,
    files,
    sourceFormat,
    targetFormat,
    onSourceChange,
    onTargetChange,
  ]);

  // Metin alanı için istatistikler
  const lineCount = hasText ? rawText.split('\n').length : 0;
  const charCount = hasText ? rawText.length : 0;

  return (
    <div className="workflow">
      {/* Yüklenen dosya özeti */}
      {hasFiles && (
        <div className="file-summary">
          <span className="file-summary-badge">
            <strong>{files[0].name}</strong>
            <small>{formatBytes(files[0].size)}</small>
          </span>
          <div className="file-summary-actions">
            {onClearFiles && (
              <Button
                type="button"
                variant="ghost-danger"
                size="compact"
                onClick={onClearFiles}
                disabled={jobState === 'processing'}
                title="Yüklenen dosyayı kaldır"
              >
                <TrashIcon />
                <span>Dosyayı Kaldır</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Yüklenen dosya için seçili dosya kartı */}
      {hasFiles && (
        <div className="file-list" aria-label="Seçilen veri dosyası">
          <div className="selected-file">
            <span className="file-icon">
              <FileIcon />
            </span>
            <span className="file-details">
              <strong>{files[0].name}</strong>
              <small>{formatBytes(files[0].size)}</small>
            </span>
            {onClearFiles && (
              <Button
                type="button"
                className="icon-button"
                onClick={onClearFiles}
                disabled={jobState === 'processing'}
                aria-label="Dosyayı kaldır"
                title="Dosyayı kaldır"
              >
                <CloseIcon />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Yön ve Format Seçim Kartı */}
      <DataFormatBar
        sourceFormat={sourceFormat}
        targetFormat={targetFormat}
        isSourceDisabled={hasFiles}
        onSourceChange={onSourceChange}
        onTargetChange={onTargetChange}
      />

      {/* Dosya yüklenmediğinde doğrudan veri girişi */}
      {!hasFiles && (
        <div className="data-input-panel">
          <div className="data-input-header">
            <Label className="option-label">
              Veya Veriyi Doğrudan Buraya Yapıştırın:
            </Label>
            <div className="data-input-actions">
              <Button
                type="button"
                className="data-helper-btn"
                onClick={handleLoadSample}
                title="Hızlı deneme için örnek veri yerleştirir"
              >
                <SparklesIcon />
                <span>Örnek {sourceFormat.toUpperCase()} Yükle</span>
              </Button>
              {hasText && (
                <Button
                  type="button"
                  className="data-helper-btn data-helper-btn-muted"
                  onClick={handleClearText}
                  title="Metin alanını temizle"
                >
                  <span>Temizle</span>
                </Button>
              )}
            </div>
          </div>

          <div className="data-textarea-wrapper">
            <Textarea
              className="data-textarea"
              rows={6}
              placeholder={`Örn: ${
                sourceFormat === 'csv'
                  ? 'id,isim,rol\n1,Zafer,Geliştirici'
                  : sourceFormat === 'json'
                    ? '[\n  { "id": 1, "isim": "Zafer" }\n]'
                    : '- id: 1\n  isim: Zafer'
              }`}
              value={rawText}
              onChange={(e) => onRawTextChange(e.target.value)}
              spellCheck={false}
            />
          </div>

          {hasText && (
            <div className="data-stats-bar">
              <span>{lineCount.toLocaleString('tr-TR')} satır</span>
              <span>•</span>
              <span>{charCount.toLocaleString('tr-TR')} karakter</span>
            </div>
          )}
        </div>
      )}

      {/* Sonuç Paneli veya İşlem Butonu */}
      {result ? (
        <DataConvertResultPanel
          result={result}
          targetFormat={targetFormat}
          onResetReady={onResetReady}
        />
      ) : (
        <Button
          type="button"
          className="primary-button"
          onClick={onConvert}
          disabled={isConvertDisabled}
        >
          {jobState === 'processing' ? (
            <>
              <Spinner className="spinner" />
              <span>Dönüştürülüyor…</span>
            </>
          ) : (
            <>
              <TableIcon />
              <span>
                {sourceFormat.toUpperCase()} → {targetFormat.toUpperCase()}{' '}
                Dönüştür
              </span>
            </>
          )}
        </Button>
      )}
    </div>
  );
}
