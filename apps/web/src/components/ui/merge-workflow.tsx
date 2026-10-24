import {
  FileIcon,
  CloseIcon,
  DownloadIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MergeIcon,
} from './icons';
import { TrashIcon } from './core-icons';
import { Button } from '@/components/core/button';
import { Link } from '@/components/core/link';
import { Spinner } from '@/components/core/spinner';
import { formatBytes, type JobState, type MergeResult } from '@/types';

interface MergeWorkflowProps {
  files: File[];
  jobState: JobState;
  result: MergeResult | null;
  onAddFilesClick: () => void;
  onClearFiles: () => void;
  onRemoveFile: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onMerge: () => void;
}

export function MergeWorkflow({
  files,
  jobState,
  result,
  onAddFilesClick,
  onClearFiles,
  onRemoveFile,
  onMoveUp,
  onMoveDown,
  onMerge,
}: MergeWorkflowProps) {
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

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
            + PDF ekle
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

      <p className="markdown-note">
        Dosyalar yukarıdan aşağıya belirtilen sırada tek bir PDF halinde
        birleştirilir. Sıralamayı ok butonlarıyla değiştirebilirsiniz.
      </p>

      <div
        className="file-list merge-file-list"
        aria-label="Birleştirilecek PDF listesi"
      >
        {files.map((file, index) => (
          <div
            className="selected-file merge-file-item"
            key={`${file.name}-${file.lastModified}-${index}`}
          >
            <span className="order-badge">#{index + 1}</span>
            <span className="file-icon">
              <FileIcon />
            </span>
            <span className="file-details">
              <strong>{file.name}</strong>
              <small>{formatBytes(file.size)}</small>
            </span>
            <div className="order-actions">
              <Button
                type="button"
                className="icon-button order-button"
                onClick={() => onMoveUp(index)}
                disabled={index === 0 || jobState === 'processing'}
                aria-label={`${file.name} dosyasını yukarı taşı`}
                title="Yukarı Taşı"
              >
                <ArrowUpIcon />
              </Button>
              <Button
                type="button"
                className="icon-button order-button"
                onClick={() => onMoveDown(index)}
                disabled={
                  index === files.length - 1 || jobState === 'processing'
                }
                aria-label={`${file.name} dosyasını aşağı taşı`}
                title="Aşağı Taşı"
              >
                <ArrowDownIcon />
              </Button>
              <Button
                type="button"
                className="icon-button"
                onClick={() => onRemoveFile(index)}
                disabled={jobState === 'processing'}
                aria-label={`${file.name} dosyasını kaldır`}
                title="Kaldır"
              >
                <CloseIcon />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {jobState === 'complete' && result ? (
        <div className="success-panel" role="status">
          <div>
            <span className="check">✓</span>
            <span>
              <strong>{result.fileCount} PDF başarıyla birleştirildi</strong>
              <small>
                Toplam sayfa: {result.pageCount} · Boyut:{' '}
                {formatBytes(result.fileSize)}
              </small>
            </span>
          </div>
          <Link
            className="download-button"
            href={result.url}
            download={result.downloadName}
          >
            <DownloadIcon />
            Birleşik PDF’i İndir
          </Link>
        </div>
      ) : (
        <Button
          type="button"
          className="primary-button"
          onClick={onMerge}
          disabled={files.length < 2 || jobState === 'processing'}
        >
          {jobState === 'processing' ? (
            <>
              <Spinner className="spinner" />
              {files.length} PDF birleştiriliyor…
            </>
          ) : files.length < 2 ? (
            'Birleştirmek için en az 2 PDF seçin'
          ) : (
            <>
              <MergeIcon />
              <span>{files.length} PDF’yi Birleştir</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
}
