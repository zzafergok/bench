import type { Mode } from '@/types';
import type { useWorkflowState } from '@/hooks/use-workflow-state';
import type { useMarkdownConversion } from '@/hooks/use-markdown-conversion';
import type { useCompression } from '@/hooks/use-compression';
import type { useMerge } from '@/hooks/use-merge';
import type { useImages } from '@/hooks/use-images';
import type { useImageOptimize } from '@/hooks/use-image-optimize';
import type { useCrypto } from '@/hooks/use-crypto';
import type { useDataConvert } from '@/hooks/use-data-convert';

interface WorkspaceActionsParams {
  wf: ReturnType<typeof useWorkflowState>;
  md: ReturnType<typeof useMarkdownConversion>;
  comp: ReturnType<typeof useCompression>;
  merge: ReturnType<typeof useMerge>;
  img: ReturnType<typeof useImages>;
  imgOpt: ReturnType<typeof useImageOptimize>;
  crypto: ReturnType<typeof useCrypto>;
  data: ReturnType<typeof useDataConvert>;
}

export function useWorkspaceActions({
  wf,
  md,
  comp,
  merge,
  img,
  imgOpt,
  crypto,
  data,
}: WorkspaceActionsParams) {
  function resetAllResults() {
    comp.clearResult();
    md.resetMarkdown();
    merge.clearResult();
    img.clearResult();
    imgOpt.clearResult();
    crypto.clearResult();
    data.clearResult();
  }

  async function handleConvert() {
    if (!wf.files.length || wf.jobState === 'processing') return;
    resetAllResults();
    wf.setJobState('processing');
    try {
      const res = await md.convertToMarkdown(wf.files);
      wf.setJobState('complete');
      wf.updateStats(res.count);
    } catch (err) {
      wf.setJobState('error');
      wf.setError(
        err instanceof Error
          ? err.message
          : 'Dönüştürme sırasında hata oluştu.',
      );
    }
  }

  async function handleCompress() {
    if (!wf.files.length || wf.jobState === 'processing') return;
    resetAllResults();
    wf.setJobState('processing');
    try {
      const res = await comp.compressFiles(wf.files);
      wf.setJobState('complete');
      const savedBytes = Math.max(0, res.originalSize - res.compressedSize);
      wf.updateStats(res.count, savedBytes);
    } catch (err) {
      wf.setJobState('error');
      wf.setError(
        err instanceof Error
          ? err.message
          : 'Sıkıştırma sırasında hata oluştu.',
      );
    }
  }

  async function handleMerge() {
    if (wf.files.length < 2 || wf.jobState === 'processing') return;
    resetAllResults();
    wf.setJobState('processing');
    try {
      const res = await merge.mergeFiles(wf.files);
      wf.setJobState('complete');
      wf.updateStats(res.fileCount);
    } catch (err) {
      wf.setJobState('error');
      wf.setError(
        err instanceof Error
          ? err.message
          : 'Birleştirme sırasında hata oluştu.',
      );
    }
  }

  async function handleImages() {
    if (!wf.files.length || wf.jobState === 'processing') return;
    resetAllResults();
    wf.setJobState('processing');
    try {
      await img.convertPdfToImages(wf.files[0]);
      wf.setJobState('complete');
      wf.updateStats(1);
    } catch (err) {
      wf.setJobState('error');
      wf.setError(
        err instanceof Error
          ? err.message
          : 'Görsele dönüştürme sırasında hata oluştu.',
      );
    }
  }

  async function handleImageOptimize() {
    if (!wf.files.length || wf.jobState === 'processing') return;
    resetAllResults();
    wf.setJobState('processing');
    try {
      const res = await imgOpt.optimizeImages(wf.files);
      wf.setJobState('complete');
      const savedBytes = Math.max(0, res.originalBytes - res.processedBytes);
      wf.updateStats(wf.files.length, savedBytes);
    } catch (err) {
      wf.setJobState('error');
      wf.setError(
        err instanceof Error
          ? err.message
          : 'Görsel işleme sırasında hata oluştu.',
      );
    }
  }

  async function handleCrypto() {
    if (!wf.files.length || wf.jobState === 'processing') return;
    resetAllResults();
    wf.setJobState('processing');
    try {
      await crypto.executeCrypto(wf.files);
      wf.setJobState('complete');
      wf.updateStats(1);
    } catch (err) {
      wf.setJobState('error');
      wf.setError(
        err instanceof Error
          ? err.message
          : 'Kripto işlemi sırasında hata oluştu.',
      );
    }
  }

  async function handleDataConvert() {
    resetAllResults();
    wf.setJobState('processing');
    try {
      await data.convertData(wf.files);
      wf.setJobState('complete');
      wf.updateStats(1);
    } catch (err) {
      wf.setJobState('error');
      wf.setError(
        err instanceof Error
          ? err.message
          : 'Veri dönüştürme sırasında hata oluştu.',
      );
    }
  }

  const workflowExecutors: Record<Mode, () => void> = {
    markdown: handleConvert,
    compress: handleCompress,
    merge: handleMerge,
    images: handleImages,
    imageOptimize: handleImageOptimize,
    crypto: handleCrypto,
    data: handleDataConvert,
  };

  return {
    resetAllResults,
    workflowExecutors,
  };
}
