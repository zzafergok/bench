import { FileIcon, CloseIcon, DownloadIcon, ImageIcon } from './icons';
import { Button } from '@/components/core/button';
import { Label } from '@/components/core/label';
import { Input } from '@/components/core/input';
import { Link } from '@/components/core/link';
import { Spinner } from '@/components/core/spinner';
import { formatBytes, type ImagesResult, type JobState } from '@/types';

interface ImagesWorkflowProps {
  file: File;
  dpi: number;
  setDpi: (dpi: number) => void;
  jobState: JobState;
  result: ImagesResult | null;
  onRemove: () => void;
  onConvert: () => void;
}

export function ImagesWorkflow({
  file,
  dpi,
  setDpi,
  jobState,
  result,
  onRemove,
  onConvert,
}: ImagesWorkflowProps) {
  return (
    <div className="workflow">
      <div className="file-list" aria-label="Seçilen PDF dosyası">
        <div className="selected-file">
          <span className="file-icon">
            <FileIcon />
          </span>
          <span className="file-details">
            <strong>{file.name}</strong>
            <small>{formatBytes(file.size)}</small>
          </span>
          <Button
            type="button"
            className="icon-button"
            onClick={onRemove}
            disabled={jobState === 'processing'}
            aria-label={`${file.name} dosyasını kaldır`}
          >
            <CloseIcon />
          </Button>
        </div>
      </div>

      <fieldset className="profile-group" disabled={jobState === 'processing'}>
        <legend>Görsel Çözünürlüğü</legend>
        <div className="profile-options">
          <Label
            className={`profile-option ${dpi === 150 ? 'is-selected' : ''}`}
          >
            <Input
              type="radio"
              name="dpi"
              value={150}
              checked={dpi === 150}
              onChange={() => setDpi(150)}
            />
            <span className="success-copy">
              <strong>150 DPI (Standart)</strong>
              <small>Web, sunum ve ekran kullanımı için ideal denge</small>
            </span>
          </Label>
          <Label
            className={`profile-option ${dpi === 300 ? 'is-selected' : ''}`}
          >
            <Input
              type="radio"
              name="dpi"
              value={300}
              checked={dpi === 300}
              onChange={() => setDpi(300)}
            />
            <span>
              <strong>300 DPI (Yüksek Kalite)</strong>
              <small>Baskı ve kristal netliğinde arşivleme için</small>
            </span>
          </Label>
        </div>
      </fieldset>

      {jobState === 'complete' && result ? (
        <div className="success-panel" role="status">
          <div>
            <span className="check">✓</span>
            <span>
              <strong>
                {result.isSingleImage
                  ? 'Sayfa PNG olarak hazırlandı'
                  : `${result.pageCount} sayfa PNG olarak dönüştürüldü`}
              </strong>
              <small>
                {result.isSingleImage
                  ? 'Tek görsel (PNG)'
                  : 'ZIP arşivi içinde PNG görselleri'}
              </small>
            </span>
          </div>
          <Link
            className="download-button"
            href={result.url}
            download={result.downloadName}
          >
            <DownloadIcon />
            {result.isSingleImage
              ? 'PNG Görselini İndir'
              : 'Görselleri İndir (ZIP)'}
          </Link>
        </div>
      ) : (
        <Button
          type="button"
          className="primary-button"
          onClick={onConvert}
          disabled={jobState === 'processing'}
        >
          {jobState === 'processing' ? (
            <>
              <Spinner className="spinner" />
              Sayfalar PNG’ye Dönüştürülüyor…
            </>
          ) : (
            <>
              <ImageIcon />
              <span>Sayfaları PNG’ye Dönüştür</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
}
