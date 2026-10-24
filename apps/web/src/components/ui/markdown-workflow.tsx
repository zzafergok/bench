import { FileIcon, CloseIcon } from './icons';
import { TrashIcon } from './core-icons';
import { Button } from '@/components/core/button';
import { Spinner } from '@/components/core/spinner';
import { formatBytes, type JobState, type MarkdownResult } from '@/types';
import { MarkdownResultPanel } from './markdown-result-panel';

interface MarkdownWorkflowProps {
  files: File[];
  jobState: JobState;
  markdownResult: MarkdownResult | null;
  activeTab: number;
  setActiveTab: (tab: number) => void;
  previewMode: 'rendered' | 'raw';
  setPreviewMode: (mode: 'rendered' | 'raw') => void;
  copiedType: 'standard' | 'llm' | null;
  getActiveContent: () => {
    text: string;
    fileName: string;
    originalName: string;
    tokenEstimate: number;
    charCount: number;
    wordCount: number;
  };
  onRemoveFile: (index: number) => void;
  onClearFiles: () => void;
  onAddFilesClick: () => void;
  onConvert: () => void;
  onCopy: () => void;
  onCopyLLM: () => void;
  onDownload: () => void;
}

export function MarkdownWorkflow({
  files,
  jobState,
  markdownResult,
  activeTab,
  setActiveTab,
  previewMode,
  setPreviewMode,
  copiedType,
  getActiveContent,
  onRemoveFile,
  onClearFiles,
  onAddFilesClick,
  onConvert,
  onCopy,
  onCopyLLM,
  onDownload,
}: MarkdownWorkflowProps) {
  const current = getActiveContent();
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="workflow">
      <div className="file-summary">
        <span className="file-summary-badge">
          <strong>{files.length} Belge seçildi</strong>
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
            + Belge ekle
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

      <div className="file-list" aria-label="Seçilen dokümanlar">
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
              <small>{formatBytes(file.size)}</small>
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

      <p className="markdown-note">
        PDF, Word (.docx), Excel (.xlsx) ve PowerPoint (.pptx) belgeleri yapay
        zekaya (LLM) hazır temiz Markdown formatına dönüştürülür.
      </p>

      {markdownResult ? (
        <MarkdownResultPanel
          markdownResult={markdownResult}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          previewMode={previewMode}
          setPreviewMode={setPreviewMode}
          copiedType={copiedType}
          current={current}
          onCopy={onCopy}
          onCopyLLM={onCopyLLM}
          onDownload={onDownload}
        />
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
              {files.length > 1
                ? `${files.length} Belge Dönüştürülüyor…`
                : 'Markdown’a Dönüştürülüyor…'}
            </>
          ) : files.length > 1 ? (
            `${files.length} Belgeyi Markdown’a Dönüştür`
          ) : (
            'Markdown’a Dönüştür'
          )}
        </Button>
      )}
    </div>
  );
}
