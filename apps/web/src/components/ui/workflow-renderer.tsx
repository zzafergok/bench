import type { ReactNode, RefObject } from 'react';
import type { Mode, JobState } from '@/types';
import { MarkdownWorkflow } from './markdown-workflow';
import { CompressWorkflow } from './compress-workflow';
import { MergeWorkflow } from './merge-workflow';
import { ImagesWorkflow } from './images-workflow';
import { ImageOptimizeWorkflow } from './image-optimize-workflow';
import { CryptoWorkflow } from './crypto-workflow';
import { DataConvertWorkflow } from './data-convert-workflow';
import type { useMarkdownConversion } from '@/hooks/use-markdown-conversion';
import type { useCompression } from '@/hooks/use-compression';
import type { useMerge } from '@/hooks/use-merge';
import type { useImages } from '@/hooks/use-images';
import type { useImageOptimize } from '@/hooks/use-image-optimize';
import type { useCrypto } from '@/hooks/use-crypto';
import type { useDataConvert } from '@/hooks/use-data-convert';

interface WorkflowRendererProps {
  mode: Mode;
  files: File[];
  jobState: JobState;
  fileInput: RefObject<HTMLInputElement | null>;
  md: ReturnType<typeof useMarkdownConversion>;
  comp: ReturnType<typeof useCompression>;
  merge: ReturnType<typeof useMerge>;
  img: ReturnType<typeof useImages>;
  imgOpt: ReturnType<typeof useImageOptimize>;
  crypto: ReturnType<typeof useCrypto>;
  data: ReturnType<typeof useDataConvert>;
  onRemoveFile: (idx: number) => void;
  onClearFiles: () => void;
  onMoveUp: (idx: number) => void;
  onMoveDown: (idx: number) => void;
  onResetReady: () => void;
  onExecute: () => void;
}

export function WorkflowRenderer({
  mode,
  files,
  jobState,
  fileInput,
  md,
  comp,
  merge,
  img,
  imgOpt,
  crypto,
  data,
  onRemoveFile,
  onClearFiles,
  onMoveUp,
  onMoveDown,
  onResetReady,
  onExecute,
}: WorkflowRendererProps) {
  const workflows: Record<Mode, () => ReactNode> = {
    markdown: () =>
      files.length > 0 ? (
        <MarkdownWorkflow
          files={files}
          jobState={jobState}
          markdownResult={md.markdownResult}
          activeTab={md.activeTab}
          setActiveTab={md.setActiveTab}
          previewMode={md.previewMode}
          setPreviewMode={md.setPreviewMode}
          copiedType={md.copiedType}
          getActiveContent={md.getActiveContent}
          onRemoveFile={onRemoveFile}
          onClearFiles={onClearFiles}
          onAddFilesClick={() => fileInput.current?.click()}
          onConvert={onExecute}
          onCopy={md.copyMarkdown}
          onCopyLLM={md.copyAsLLMContext}
          onDownload={md.downloadMarkdown}
        />
      ) : null,
    compress: () =>
      files.length > 0 ? (
        <CompressWorkflow
          files={files}
          profile={comp.profile}
          stripMetadata={comp.stripMetadata}
          jobState={jobState}
          result={comp.result}
          onAddFilesClick={() => fileInput.current?.click()}
          onClearFiles={onClearFiles}
          onRemoveFile={onRemoveFile}
          onChangeProfile={(p) => {
            comp.setProfile(p);
            onResetReady();
          }}
          onToggleStripMetadata={(val) => {
            comp.setStripMetadata(val);
            onResetReady();
          }}
          onCompress={onExecute}
        />
      ) : null,
    merge: () =>
      files.length > 0 ? (
        <MergeWorkflow
          files={files}
          jobState={jobState}
          result={merge.result}
          onAddFilesClick={() => fileInput.current?.click()}
          onClearFiles={onClearFiles}
          onRemoveFile={onRemoveFile}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onMerge={onExecute}
        />
      ) : null,
    images: () =>
      files.length > 0 ? (
        <ImagesWorkflow
          file={files[0]}
          dpi={img.dpi}
          setDpi={(d) => {
            img.setDpi(d);
            onResetReady();
          }}
          jobState={jobState}
          result={img.result}
          onRemove={onClearFiles}
          onConvert={onExecute}
        />
      ) : null,
    imageOptimize: () =>
      files.length > 0 ? (
        <ImageOptimizeWorkflow
          files={files}
          profile={imgOpt.profile}
          stripExif={imgOpt.stripExif}
          format={imgOpt.format}
          quality={imgOpt.quality}
          maxWidth={imgOpt.maxWidth}
          jobState={jobState}
          result={imgOpt.result}
          onAddFilesClick={() => fileInput.current?.click()}
          onClearFiles={onClearFiles}
          onRemoveFile={onRemoveFile}
          onChangeProfile={(p) => {
            imgOpt.setProfile(p);
            onResetReady();
          }}
          onToggleStripExif={(strip) => {
            imgOpt.setStripExif(strip);
            onResetReady();
          }}
          onFormatChange={(fmt) => {
            imgOpt.setFormat(fmt);
            onResetReady();
          }}
          onQualityChange={(q) => {
            imgOpt.setQuality(q);
            onResetReady();
          }}
          onMaxWidthChange={(w) => {
            imgOpt.setMaxWidth(w);
            onResetReady();
          }}
          onOptimize={onExecute}
        />
      ) : null,
    crypto: () =>
      files.length > 0 ? (
        <CryptoWorkflow
          files={files}
          jobState={jobState}
          result={crypto.result}
          action={crypto.action}
          passphrase={crypto.passphrase}
          onActionChange={(act) => {
            crypto.setAction(act);
            onResetReady();
          }}
          onPassphraseChange={crypto.setPassphrase}
          onExecute={onExecute}
          threatLoading={crypto.threatLoading}
          threatReport={crypto.threatReport}
          threatError={crypto.threatError}
          onCheckThreat={crypto.checkThreat}
        />
      ) : null,
    data: () => (
      <DataConvertWorkflow
        files={files}
        jobState={jobState}
        result={data.result}
        sourceFormat={data.sourceFormat}
        targetFormat={data.targetFormat}
        rawText={data.rawText}
        onSourceChange={(fmt) => {
          data.setSourceFormat(fmt);
          onResetReady();
        }}
        onTargetChange={(fmt) => {
          data.setTargetFormat(fmt);
          onResetReady();
        }}
        onRawTextChange={(text) => {
          data.setRawText(text);
          onResetReady();
        }}
        onConvert={onExecute}
        onClearFiles={onClearFiles}
        onResetReady={onResetReady}
      />
    ),
  };

  return workflows[mode]();
}
