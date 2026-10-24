'use client';

import { useId, useRef } from 'react';
import { Header } from '@/components/ui/layout';
import { ModeSwitch } from '@/components/ui/mode-switch';
import { Dropzone } from '@/components/ui/dropzone';
import { WorkflowRenderer } from '@/components/ui/workflow-renderer';
import { useMarkdownConversion } from '@/hooks/use-markdown-conversion';
import { useCompression } from '@/hooks/use-compression';
import { useMerge } from '@/hooks/use-merge';
import { useImages } from '@/hooks/use-images';
import { useImageOptimize } from '@/hooks/use-image-optimize';
import { useCrypto } from '@/hooks/use-crypto';
import { useDataConvert } from '@/hooks/use-data-convert';
import { useWorkflowState } from '@/hooks/use-workflow-state';
import { useWorkspaceActions } from '@/hooks/use-workspace-actions';
import { Card } from '@/components/core/card';
import {
  detectDataFormat,
  getAlternativeTargetFormat,
} from '@/utils/data-format';

export function ToolsWorkspace() {
  const inputId = useId();
  const fileInput = useRef<HTMLInputElement>(null);

  const wf = useWorkflowState();
  const md = useMarkdownConversion();
  const comp = useCompression();
  const merge = useMerge();
  const img = useImages();
  const imgOpt = useImageOptimize();
  const crypto = useCrypto();
  const data = useDataConvert();

  const { resetAllResults, workflowExecutors } = useWorkspaceActions({
    wf,
    md,
    comp,
    merge,
    img,
    imgOpt,
    crypto,
    data,
  });

  return (
    <main className="main-content">
      <div className="interactive-wrapper">
        <div className="hero-block">
          <Header mode={wf.mode} />
          <ModeSwitch
            mode={wf.mode}
            disabled={wf.jobState === 'processing'}
            onChangeMode={(m) => wf.changeMode(m, resetAllResults)}
          />
        </div>

        <Card className="workbench-card" aria-label="Belge işlem alanı">
          <Dropzone
            inputId={inputId}
            fileInput={fileInput}
            filesCount={wf.files.length}
            mode={wf.mode}
            isDragging={wf.isDragging}
            disabled={wf.jobState === 'processing'}
            onFilesSelected={(f) => {
              wf.addFiles(f, resetAllResults);
              if (wf.mode === 'data' && f.length > 0) {
                const detected = detectDataFormat(f[0]);
                if (detected) {
                  data.setSourceFormat(detected);
                  if (data.targetFormat === detected) {
                    data.setTargetFormat(getAlternativeTargetFormat(detected));
                  }
                }
              }
            }}
            setIsDragging={wf.setIsDragging}
          />

          <WorkflowRenderer
            mode={wf.mode}
            files={wf.files}
            jobState={wf.jobState}
            fileInput={fileInput}
            md={md}
            comp={comp}
            merge={merge}
            img={img}
            imgOpt={imgOpt}
            crypto={crypto}
            data={data}
            onRemoveFile={(idx) => wf.removeFile(idx, resetAllResults)}
            onClearFiles={() => wf.clearAllFiles(resetAllResults)}
            onMoveUp={(idx) => wf.moveFileUp(idx, resetAllResults)}
            onMoveDown={(idx) => wf.moveFileDown(idx, resetAllResults)}
            onResetReady={() => {
              resetAllResults();
              if (wf.files.length) wf.setJobState('ready');
            }}
            onExecute={workflowExecutors[wf.mode]}
          />

          {wf.error && (
            <div className="error-banner" role="alert">
              <span className="error-icon">!</span>
              <span>{wf.error}</span>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
