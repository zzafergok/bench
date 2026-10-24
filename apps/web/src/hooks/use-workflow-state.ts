import { useState } from 'react';
import type { JobState, Mode, SessionStats } from '../types';
import { useStorageJson, useStorageString } from './use-storage';

const SUPPORTED_MARKDOWN_EXTS = ['.pdf', '.docx', '.xlsx', '.pptx'];
const SUPPORTED_IMAGE_EXTS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.avif',
  '.tiff',
  '.gif',
];
const SUPPORTED_DATA_EXTS = ['.csv', '.json', '.yaml', '.yml'];
const MODES: readonly Mode[] = [
  'compress',
  'markdown',
  'merge',
  'images',
  'imageOptimize',
  'crypto',
  'data',
];
export const EMPTY_SESSION_STATS: SessionStats = {
  filesProcessed: 0,
  bytesSaved: 0,
};

const isMode = (v: string): v is Mode => MODES.includes(v as Mode);

export function isSessionStats(value: unknown): value is SessionStats {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.filesProcessed === 'number' &&
    typeof candidate.bytesSaved === 'number'
  );
}

export function useWorkflowState() {
  const [files, setFiles] = useState<File[]>([]);
  const [jobState, setJobState] = useState<JobState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [mode, setModeState] = useStorageString<Mode>(
    'bench_mode',
    'compress',
    isMode,
  );
  const [sessionStats, setSessionStats] = useStorageJson<SessionStats>(
    'bench_stats',
    EMPTY_SESSION_STATS,
    isSessionStats,
  );

  function updateStats(filesCount: number, bytesSaved: number = 0) {
    setSessionStats((prev) => ({
      filesProcessed: prev.filesProcessed + filesCount,
      bytesSaved: prev.bytesSaved + bytesSaved,
    }));
  }

  function clearAllFiles(onResetHooks?: () => void) {
    if (jobState === 'processing') return;
    onResetHooks?.();
    setError(null);
    setFiles([]);
    setJobState('idle');
  }

  function changeMode(nextMode: Mode, onResetHooks?: () => void) {
    if (jobState === 'processing' || nextMode === mode) return;
    clearAllFiles(onResetHooks);
    setModeState(nextMode);
  }

  function addFiles(selectedFiles: File[], onResetHooks?: () => void) {
    if (!selectedFiles.length || jobState === 'processing') return;
    onResetHooks?.();
    setError(null);

    if (mode === 'markdown') {
      const valid = selectedFiles.filter((f) =>
        SUPPORTED_MARKDOWN_EXTS.some((ext) =>
          f.name.toLowerCase().endsWith(ext),
        ),
      );
      if (!valid.length) {
        setJobState(files.length ? 'ready' : 'error');
        setError(
          'Yalnızca PDF, Word (.docx), Excel (.xlsx) ve PowerPoint (.pptx) dokümanları kabul edilir.',
        );
      } else {
        setFiles((cur) => [...cur, ...valid]);
        setJobState('ready');
      }
      return;
    }

    if (mode === 'imageOptimize') {
      const valid = selectedFiles.filter(
        (f) =>
          f.type.startsWith('image/') ||
          SUPPORTED_IMAGE_EXTS.some((ext) =>
            f.name.toLowerCase().endsWith(ext),
          ),
      );
      if (!valid.length) {
        setJobState(files.length ? 'ready' : 'error');
        setError(
          'Yalnızca geçerli görsel dosyaları (PNG, JPEG, WebP, AVIF) kabul edilir.',
        );
      } else {
        setFiles((cur) => [...cur, ...valid]);
        setJobState('ready');
      }
      return;
    }

    if (mode === 'crypto') {
      setFiles([selectedFiles[0]]);
      setJobState('ready');
      return;
    }

    if (mode === 'data') {
      const valid = selectedFiles.filter((f) =>
        SUPPORTED_DATA_EXTS.some((ext) => f.name.toLowerCase().endsWith(ext)),
      );
      if (!valid.length) {
        setJobState(files.length ? 'ready' : 'error');
        setError('Yalnızca CSV, JSON veya YAML dosyaları kabul edilir.');
      } else {
        setFiles([valid[0]]);
        setJobState('ready');
      }
      return;
    }

    if (mode === 'images') {
      const pdfs = selectedFiles.filter(
        (f) =>
          f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf',
      );
      if (!pdfs.length) {
        setJobState('error');
        setError('Yalnızca PDF formatındaki dosyalar kabul edilir.');
        return;
      }
      setFiles([pdfs[0]]);
      setJobState('ready');
      return;
    }

    // compress ve merge işlemleri
    const pdfs = selectedFiles.filter(
      (f) =>
        f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf',
    );
    if (!pdfs.length) {
      setJobState(files.length ? 'ready' : 'error');
      setError('Yalnızca PDF formatındaki dosyalar kabul edilir.');
    } else {
      setFiles((cur) => [...cur, ...pdfs]);
      setJobState('ready');
    }
  }

  function removeFile(index: number, onResetHooks?: () => void) {
    if (jobState === 'processing') return;
    onResetHooks?.();
    setError(null);
    setFiles((cur) => {
      const next = cur.filter((_, i) => i !== index);
      setJobState(next.length ? 'ready' : 'idle');
      return next;
    });
  }

  function moveFileUp(index: number, onResetHooks?: () => void) {
    if (index <= 0 || jobState === 'processing') return;
    onResetHooks?.();
    setError(null);
    setFiles((cur) => {
      const next = [...cur];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  }

  function moveFileDown(index: number, onResetHooks?: () => void) {
    if (index >= files.length - 1 || jobState === 'processing') return;
    onResetHooks?.();
    setError(null);
    setFiles((cur) => {
      const next = [...cur];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  }

  return {
    files,
    jobState,
    setJobState,
    error,
    setError,
    isDragging,
    setIsDragging,
    mode,
    sessionStats,
    updateStats,
    changeMode,
    addFiles,
    removeFile,
    moveFileUp,
    moveFileDown,
    clearAllFiles,
  };
}
