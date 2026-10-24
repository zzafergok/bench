import { DownloadIcon, SparklesIcon, EyeIcon, CodeIcon } from './icons';
import { Button } from '@/components/core/button';
import { MarkdownViewer } from './markdown-viewer';
import type { MarkdownResult } from '@/types';

interface MarkdownResultPanelProps {
  markdownResult: MarkdownResult;
  activeTab: number;
  setActiveTab: (tab: number) => void;
  previewMode: 'rendered' | 'raw';
  setPreviewMode: (mode: 'rendered' | 'raw') => void;
  copiedType: 'standard' | 'llm' | null;
  current: {
    text: string;
    fileName: string;
    originalName: string;
    tokenEstimate: number;
    charCount: number;
    wordCount: number;
  };
  onCopy: () => void;
  onCopyLLM: () => void;
  onDownload: () => void;
}

export function MarkdownResultPanel({
  markdownResult,
  activeTab,
  setActiveTab,
  previewMode,
  setPreviewMode,
  copiedType,
  current,
  onCopy,
  onCopyLLM,
  onDownload,
}: MarkdownResultPanelProps) {
  return (
    <div className="markdown-result-wrapper">
      {markdownResult.results.length > 1 && (
        <div className="doc-tabs-bar" role="tablist">
          {markdownResult.results.map((item, idx) => (
            <Button
              key={item.fileName}
              type="button"
              role="tab"
              aria-selected={activeTab === idx}
              className={`doc-tab ${activeTab === idx ? 'is-active' : ''}`}
              onClick={() => setActiveTab(idx)}
            >
              <span className="doc-tab-title">{item.originalName}</span>
              <small className="doc-tab-tokens">
                ~{item.tokenEstimate} tok
              </small>
            </Button>
          ))}
          <Button
            type="button"
            role="tab"
            aria-selected={activeTab === -1}
            className={`doc-tab doc-tab-combined ${activeTab === -1 ? 'is-active' : ''}`}
            onClick={() => setActiveTab(-1)}
          >
            ★ Tümünü Birleşik Gör
          </Button>
        </div>
      )}

      <div className="markdown-meta-row">
        <div className="token-stats">
          <span className="stat-pill highlight">
            <strong>~{current.tokenEstimate.toLocaleString('tr-TR')}</strong>{' '}
            token
          </span>
          <span className="stat-pill">
            <strong>{current.wordCount.toLocaleString('tr-TR')}</strong> kelime
          </span>
          <span className="stat-pill">
            <strong>{current.charCount.toLocaleString('tr-TR')}</strong>{' '}
            karakter
          </span>
        </div>

        <div
          className="view-mode-toggle"
          role="radiogroup"
          aria-label="Görünüm modu"
        >
          <Button
            type="button"
            className={`mode-btn ${previewMode === 'rendered' ? 'is-selected' : ''}`}
            onClick={() => setPreviewMode('rendered')}
            title="Biçimlendirilmiş Önizleme"
          >
            <EyeIcon />
            <span>Önizleme</span>
          </Button>
          <Button
            type="button"
            className={`mode-btn ${previewMode === 'raw' ? 'is-selected' : ''}`}
            onClick={() => setPreviewMode('raw')}
            title="Ham Markdown Kodu"
          >
            <CodeIcon />
            <span>Kaynak</span>
          </Button>
        </div>
      </div>

      <div className="markdown-actions">
        <Button type="button" className="download-button" onClick={onDownload}>
          <DownloadIcon />
          {activeTab === -1 ? 'Birleşik .md İndir' : '.md İndir'}
        </Button>
        <Button type="button" className="text-button" onClick={onCopy}>
          {copiedType === 'standard' ? 'Kopyalandı ✓' : 'Metni Kopyala'}
        </Button>
        <Button
          type="button"
          className="text-button text-button-accent"
          onClick={onCopyLLM}
          title="Yapay zeka modellerine uygun XML document etiketi ile kopyala"
        >
          <SparklesIcon />
          {copiedType === 'llm'
            ? 'Context Kopyalandı ✓'
            : 'LLM Context Kopyala'}
        </Button>
      </div>

      <div className="markdown-container">
        {previewMode === 'rendered' ? (
          <MarkdownViewer content={current.text} />
        ) : (
          <pre
            className="markdown-preview"
            aria-label="Markdown kaynak kodu"
            tabIndex={0}
          >
            {current.text || '(Boş çıktı)'}
          </pre>
        )}
      </div>
    </div>
  );
}
