import { FileIcon, CloseIcon, DownloadIcon } from './icons';
import { TrashIcon } from './core-icons';
import { Button } from '@/components/core/button';
import { Link } from '@/components/core/link';
import { Spinner } from '@/components/core/spinner';
import {
  formatBytes,
  profiles,
  type CompressionResult,
  type JobState,
  type Profile,
} from '@/types';
import { CompressOptions } from './compress-options';

interface CompressWorkflowProps {
  files: File[];
  profile: Profile;
  stripMetadata: boolean;
  jobState: JobState;
  result: CompressionResult | null;
  onAddFilesClick: () => void;
  onClearFiles: () => void;
  onRemoveFile: (index: number) => void;
  onChangeProfile: (profile: Profile) => void;
  onToggleStripMetadata: (val: boolean) => void;
  onCompress: () => void;
}

export function CompressWorkflow({
  files,
  profile,
  stripMetadata,
  jobState,
  result,
  onAddFilesClick,
  onClearFiles,
  onRemoveFile,
  onChangeProfile,
  onToggleStripMetadata,
  onCompress,
}: CompressWorkflowProps) {
  const totalSize = files.reduce((total, file) => total + file.size, 0);
  const estimatedTotalSize = Math.round(
    totalSize * profiles[profile].estimatedRetainedSize,
  );
  const estimatedSavings = Math.max(
    0,
    Math.round((1 - profiles[profile].estimatedRetainedSize) * 100),
  );
  const savings = result
    ? Math.max(
        0,
        Math.round((1 - result.compressedSize / result.originalSize) * 100),
      )
    : null;

  return (
    <div className="workflow">
      <div className="file-summary">
        <span className="file-summary-badge">
          <strong>{files.length} PDF seçildi</strong>
          <small>Toplam {formatBytes(totalSize)}</small>
        </span>
        <div className="file-summary-actions">
          <Button
            type="button"
            variant="subtle"
            size="compact"
            onClick={onAddFilesClick}
            disabled={jobState === 'processing'}
          >
            + Dosya ekle
          </Button>
          <Button
            type="button"
            variant="ghost-danger"
            size="compact"
            onClick={onClearFiles}
            disabled={jobState === 'processing'}
            title="Tüm listeyi temizle"
          >
            <TrashIcon />
            <span>Listeyi temizle</span>
          </Button>
        </div>
      </div>

      <div className="size-overview" aria-live="polite">
        <span>
          <small>Mevcut toplam</small>
          <strong>{formatBytes(totalSize)}</strong>
        </span>
        <span className="size-arrow">→</span>
        <span>
          <small>
            {jobState === 'complete'
              ? 'Sıkıştırılmış PDF toplamı'
              : `Tahmini · ${profiles[profile].title}`}
          </small>
          <strong>
            {jobState === 'complete' && result
              ? formatBytes(result.compressedSize)
              : formatBytes(estimatedTotalSize)}
          </strong>
          <em>
            {jobState === 'complete' && result
              ? `%${savings ?? 0} daha küçük`
              : `~%${estimatedSavings} daha küçük`}
          </em>
        </span>
      </div>

      <div className="file-list" aria-label="Seçilen PDF dosyaları">
        {files.map((file, index) => (
          <div
            className="selected-file"
            key={`${file.name}-${file.size}-${file.lastModified}`}
          >
            <span className="file-icon">
              <FileIcon />
            </span>
            <span className="file-details">
              <strong>{file.name}</strong>
              <small>
                {formatBytes(file.size)} <b>→</b> ~
                {formatBytes(
                  Math.round(
                    file.size * profiles[profile].estimatedRetainedSize,
                  ),
                )}
              </small>
            </span>
            <Button
              type="button"
              className="icon-button"
              onClick={() => onRemoveFile(index)}
              disabled={jobState === 'processing'}
              aria-label={`${file.name} dosyasını kaldır`}
            >
              <CloseIcon />
            </Button>
          </div>
        ))}
      </div>

      <CompressOptions
        profile={profile}
        stripMetadata={stripMetadata}
        disabled={jobState === 'processing'}
        onChangeProfile={onChangeProfile}
        onToggleStripMetadata={onToggleStripMetadata}
      />

      {jobState === 'complete' && result ? (
        <div className="success-panel" role="status">
          <div>
            <span className="check">✓</span>
            <span>
              <strong>
                {result.count === 1
                  ? '1 PDF sıkıştırıldı'
                  : `${result.count} PDF sıkıştırıldı`}
              </strong>
              <small>
                {result.isSinglePdf ? (
                  <>
                    Orijinal: {formatBytes(result.originalSize)} ·
                    Sıkıştırılmış: {formatBytes(result.compressedSize)}
                  </>
                ) : (
                  <>
                    PDF toplamı: {formatBytes(result.compressedSize)} · ZIP:{' '}
                    {formatBytes(result.archiveSize)}
                  </>
                )}
              </small>
            </span>
          </div>
          <Link
            className="download-button"
            href={result.url}
            download={
              result.downloadName ||
              (result.isSinglePdf ? 'compressed.pdf' : 'compressed-pdfs.zip')
            }
          >
            <DownloadIcon />
            {result.isSinglePdf ? 'Sıkıştırılmış PDF’i İndir' : 'ZIP İndir'}
          </Link>
        </div>
      ) : (
        <Button
          type="button"
          className="primary-button"
          onClick={onCompress}
          disabled={jobState === 'processing'}
        >
          {jobState === 'processing' ? (
            <>
              <Spinner className="spinner" />
              {files.length === 1
                ? 'PDF sıkıştırılıyor…'
                : `${files.length} PDF sıkıştırılıyor…`}
            </>
          ) : files.length === 1 ? (
            'PDF’yi sıkıştır'
          ) : (
            `${files.length} PDF’yi sıkıştır`
          )}
        </Button>
      )}
    </div>
  );
}
