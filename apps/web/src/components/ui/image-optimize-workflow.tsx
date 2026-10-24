import { ImageIcon, CloseIcon, DownloadIcon } from './icons';
import { TrashIcon } from './core-icons';
import { Button } from '@/components/core/button';
import { Link } from '@/components/core/link';
import { Spinner } from '@/components/core/spinner';
import {
  formatBytes,
  imageProfiles,
  type ImageOptimizeResult,
  type JobState,
  type Profile,
} from '@/types';
import { ImageCompressOptions } from './image-compress-options';

interface ImageOptimizeWorkflowProps {
  files: File[];
  profile: Profile;
  stripExif: boolean;
  format: 'webp' | 'avif' | 'jpeg' | 'png';
  quality: number;
  maxWidth: string;
  jobState: JobState;
  result: ImageOptimizeResult | null;
  onAddFilesClick: () => void;
  onClearFiles: () => void;
  onRemoveFile: (index: number) => void;
  onChangeProfile: (profile: Profile) => void;
  onToggleStripExif: (val: boolean) => void;
  onFormatChange: (fmt: 'webp' | 'avif' | 'jpeg' | 'png') => void;
  onQualityChange: (q: number) => void;
  onMaxWidthChange: (w: string) => void;
  onOptimize: () => void;
}

export function ImageOptimizeWorkflow({
  files,
  profile,
  stripExif,
  format,
  quality,
  maxWidth,
  jobState,
  result,
  onAddFilesClick,
  onClearFiles,
  onRemoveFile,
  onChangeProfile,
  onToggleStripExif,
  onFormatChange,
  onQualityChange,
  onMaxWidthChange,
  onOptimize,
}: ImageOptimizeWorkflowProps) {
  const totalSize = files.reduce((total, file) => total + file.size, 0);
  const currentProfile = imageProfiles[profile] || imageProfiles.balanced;
  const estimatedTotalSize = Math.round(
    totalSize * currentProfile.estimatedRetainedSize,
  );
  const estimatedSavings = Math.max(
    0,
    Math.round((1 - currentProfile.estimatedRetainedSize) * 100),
  );
  const savings = result
    ? Math.max(
        0,
        Math.round((1 - result.processedBytes / result.originalBytes) * 100),
      )
    : null;

  return (
    <div className="workflow">
      <div className="file-summary">
        <span className="file-summary-badge">
          <strong>{files.length} Görsel seçildi</strong>
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
            + Görsel ekle
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
              ? 'Sıkıştırılmış Görsel Toplamı'
              : `Tahmini · ${currentProfile.title}`}
          </small>
          <strong>
            {jobState === 'complete' && result
              ? formatBytes(result.processedBytes)
              : formatBytes(estimatedTotalSize)}
          </strong>
          <em>
            {jobState === 'complete' && result
              ? `%${savings ?? 0} daha küçük`
              : `~%${estimatedSavings} daha küçük`}
          </em>
        </span>
      </div>

      <div className="file-list" aria-label="Seçilen görseller">
        {files.map((file, index) => (
          <div
            className="selected-file"
            key={`${file.name}-${file.lastModified}-${index}`}
          >
            <span className="file-icon">
              <ImageIcon />
            </span>
            <span className="file-details">
              <strong>{file.name}</strong>
              <small>
                {formatBytes(file.size)} <b>→</b> ~
                {formatBytes(
                  Math.round(file.size * currentProfile.estimatedRetainedSize),
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

      <ImageCompressOptions
        profile={profile}
        stripExif={stripExif}
        format={format}
        quality={quality}
        maxWidth={maxWidth}
        disabled={jobState === 'processing'}
        onChangeProfile={onChangeProfile}
        onToggleStripExif={onToggleStripExif}
        onFormatChange={onFormatChange}
        onQualityChange={onQualityChange}
        onMaxWidthChange={onMaxWidthChange}
      />

      {jobState === 'complete' && result ? (
        <div className="success-panel" role="status">
          <div>
            <span className="check">✓</span>
            <span>
              <strong>
                {files.length === 1
                  ? '1 görsel sıkıştırıldı'
                  : `${files.length} görsel sıkıştırıldı`}
              </strong>
              <small>
                Orijinal: {formatBytes(result.originalBytes)} · Sıkıştırılmış:{' '}
                {formatBytes(result.processedBytes)}
                {result.originalBytes > result.processedBytes && (
                  <span className="savings-badge">-%{savings} tasarruf</span>
                )}
              </small>
            </span>
          </div>
          <Link
            className="download-button"
            href={result.url}
            download={result.downloadName}
          >
            <DownloadIcon />
            {result.isSingleImage ? 'Sıkıştırılmış Görseli İndir' : 'ZIP İndir'}
          </Link>
        </div>
      ) : (
        <Button
          type="button"
          className="primary-button"
          onClick={onOptimize}
          disabled={files.length === 0 || jobState === 'processing'}
        >
          {jobState === 'processing' ? (
            <>
              <Spinner className="spinner" />
              {files.length === 1
                ? 'Görsel sıkıştırılıyor…'
                : `${files.length} görsel sıkıştırılıyor…`}
            </>
          ) : files.length === 1 ? (
            'Görseli sıkıştır'
          ) : (
            `${files.length} görseli sıkıştır`
          )}
        </Button>
      )}
    </div>
  );
}
