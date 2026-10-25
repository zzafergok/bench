import {
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
  type RefObject,
} from 'react';
import { UploadIcon } from './icons';
import type { Mode } from '@/types';
import { Input } from '@/components/core/input';
import { Label } from '@/components/core/label';

interface DropzoneProps {
  inputId: string;
  fileInput: RefObject<HTMLInputElement | null>;
  filesCount: number;
  mode: Mode;
  isDragging: boolean;
  disabled: boolean;
  onFilesSelected: (files: File[]) => void;
  setIsDragging: (dragging: boolean) => void;
}

export function Dropzone({
  inputId,
  fileInput,
  filesCount,
  mode,
  isDragging,
  disabled,
  onFilesSelected,
  setIsDragging,
}: DropzoneProps) {
  function handleDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragging(false);
    onFilesSelected(Array.from(e.dataTransfer.files));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLLabelElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.current?.click();
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onFilesSelected(Array.from(e.target.files ?? []));
    e.target.value = '';
  }

  const getDropzoneText = () => {
    switch (mode) {
      case 'markdown':
        return filesCount
          ? 'Daha fazla doküman ekleyin veya sürükleyin'
          : 'PDF, Word (.docx), Excel (.xlsx) veya PowerPoint (.pptx) sürükleyin';
      case 'merge':
        return filesCount
          ? 'Daha fazla PDF ekleyin veya sürükleyin'
          : 'Birleştirmek istediğiniz PDF dosyalarını buraya sürükleyin';
      case 'images':
        return filesCount
          ? 'Farklı bir PDF seçin veya sürükleyin'
          : 'Sayfalarını PNG’ye dönüştürmek istediğiniz PDF’i buraya sürükleyin';
      case 'imageOptimize':
        return filesCount
          ? 'Daha fazla görsel ekleyin veya sürükleyin'
          : 'Sıkıştırmak istediğiniz görselleri (PNG, JPG, WebP) buraya sürükleyin';
      case 'crypto':
        return filesCount
          ? 'Farklı bir dosya seçin veya sürükleyin'
          : 'Şifrelemek, çözmek veya hash almak istediğiniz dosyayı sürükleyin';
      case 'data':
        return filesCount
          ? 'Farklı bir veri dosyası seçin'
          : 'CSV, JSON veya YAML dosyanızı buraya sürükleyin';
      default:
        return filesCount
          ? 'Daha fazla PDF ekleyin veya sürükleyin'
          : 'PDF dosyalarınızı buraya sürükleyin';
    }
  };

  const getDropzoneBadge = () => {
    switch (mode) {
      case 'markdown':
        return <span>Çoklu Belge • AI/LLM Hazır</span>;
      case 'merge':
        return <span>En az 2 PDF • Sıralanabilir</span>;
      case 'images':
        return <span>Tüm sayfalar PNG • 150/300 DPI</span>;
      case 'imageOptimize':
        return <span>PNG, JPG, WebP, AVIF • Akıllı Sıkıştırma & EXIF</span>;
      case 'crypto':
        return <span>AES-256-GCM • SHA-256 Checksum</span>;
      case 'data':
        return <span>CSV ↔ JSON ↔ YAML • Standart Uyumlu</span>;
      default:
        return <span>Dosya başına en fazla 128 MB • En fazla 20 dosya</span>;
    }
  };

  const getAcceptedFormats = () => {
    switch (mode) {
      case 'markdown':
        return '.pdf,.docx,.xlsx,.pptx';
      case 'imageOptimize':
        return 'image/*,.png,.jpg,.jpeg,.webp,.avif,.tiff,.gif';
      case 'crypto':
        return '*/*';
      case 'data':
        return '.csv,.json,.yaml,.yml,text/csv,application/json';
      default:
        return 'application/pdf,.pdf';
    }
  };

  return (
    <Label
      htmlFor={inputId}
      className={`block cursor-pointer rounded-lg border-[1.5px] border-dashed border-white/14 bg-white/1.5 p-6 outline-none transition-all hover:border-accent hover:bg-accent-glow focus-visible:border-accent focus-visible:bg-accent-glow ${filesCount ? 'border-accent/20 bg-accent/2 px-4.5 py-3.5' : 'px-6 py-9.5'} ${isDragging ? 'border-accent bg-accent-glow' : ''} ${disabled ? 'pointer-events-none opacity-65' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className={`flex flex-col items-center justify-center gap-4 text-center ${filesCount ? 'flex-row justify-between gap-3.5 text-left' : ''}`}
      >
        <span
          className={`grid shrink-0 place-items-center rounded-full bg-accent-glow text-accent transition-transform ${filesCount ? 'size-8' : 'size-12'} ${isDragging ? '-translate-y-0.5' : ''}`}
        >
          <UploadIcon />
        </span>
        <div
          className={`flex flex-col gap-1 ${filesCount ? 'items-start gap-0.5' : 'items-center'}`}
        >
          <strong className="block text-[0.92rem] leading-[1.35] font-semibold text-text-primary">
            {getDropzoneText()}
          </strong>
          <span className="block text-[0.78rem] leading-[1.4] text-text-secondary">
            veya göz atmak için tıklayın
          </span>
        </div>
        {!filesCount && (
          <div className="mt-0.5 inline-flex items-center gap-1.5 rounded-full border border-card-border bg-white/4 px-3 py-1 text-[0.7rem] text-text-muted">
            {getDropzoneBadge()}
          </div>
        )}
      </div>
      <Input
        ref={fileInput}
        id={inputId}
        type="file"
        className="dropzone-input"
        multiple={mode !== 'images' && mode !== 'crypto'}
        accept={getAcceptedFormats()}
        onChange={handleChange}
        disabled={disabled}
      />
    </Label>
  );
}
