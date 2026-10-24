import { useMemo } from 'react';
import { parseMarkdown } from '@/utils/markdown-parser';

interface MarkdownViewerProps {
  content: string;
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  const renderedHtml = useMemo(() => {
    return parseMarkdown(content);
  }, [content]);

  return (
    <div
      className="markdown-rendered-view"
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}
