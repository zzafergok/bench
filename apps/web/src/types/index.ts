export type Profile = 'light' | 'balanced' | 'strong';
export type JobState = 'idle' | 'ready' | 'processing' | 'complete' | 'error';
export type Mode =
  | 'compress'
  | 'markdown'
  | 'merge'
  | 'images'
  | 'imageOptimize'
  | 'crypto'
  | 'data';

export type MarkdownItem = {
  fileName: string;
  originalName: string;
  markdown: string;
  tokenEstimate: number;
  charCount: number;
  wordCount: number;
};

export type MarkdownResult = {
  results: MarkdownItem[];
  combinedMarkdown: string;
  count: number;
  fileName: string;
  markdown: string;
  tokenEstimate: number;
  charCount: number;
  wordCount: number;
};

export type CompressionResult = {
  url: string;
  originalSize: number;
  compressedSize: number;
  archiveSize: number;
  count: number;
  isSinglePdf: boolean;
  downloadName: string;
};

export type MergeResult = {
  url: string;
  pageCount: number;
  fileCount: number;
  fileSize: number;
  downloadName: string;
};

export type ImagesResult = {
  url: string;
  pageCount: number;
  isSingleImage: boolean;
  downloadName: string;
};

export type ImageOptimizeResult = {
  url: string;
  originalBytes: number;
  processedBytes: number;
  isSingleImage: boolean;
  downloadName: string;
  width?: number;
  height?: number;
};

export type ThreatStats = {
  malicious: number;
  suspicious: number;
  harmless: number;
  undetected: number;
};

export type ThreatQuota = {
  dailyUsed: number;
  dailyAllowed: number;
  monthlyUsed: number;
  monthlyAllowed: number;
};

export type ThreatReport = {
  hash: string;
  status: 'clean' | 'suspicious' | 'malicious' | 'unknown';
  reputation: string;
  provider: 'circl' | 'virustotal';
  trustScore?: number;
  fileName?: string;
  fileSize?: string;
  database?: string;
  stats?: ThreatStats;
  quota?: ThreatQuota;
  queriedAt: string;
};

export type CryptoResult = {
  url?: string;
  downloadName?: string;
  originalBytes?: number;
  resultBytes?: number;
  checksums?: {
    sha256: string;
    sha512: string;
    md5: string;
    bytes: number;
    filename: string;
  };
  threatReport?: ThreatReport;
};

export type DataConvertResult = {
  convertedContent: string;
  rowCount: number;
  keys: string[];
  byteSize: number;
};

export type SessionStats = {
  filesProcessed: number;
  bytesSaved: number;
};

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

export interface Toast {
  id: string;
  type?: ToastType;
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const profiles: Record<
  Profile,
  { title: string; description: string; estimatedRetainedSize: number }
> = {
  light: {
    title: 'Hafif',
    description: 'Görüntü kalitesini önceliklendirir',
    estimatedRetainedSize: 0.82,
  },
  balanced: {
    title: 'Dengeli',
    description: 'Boyut ve kalite için ideal denge',
    estimatedRetainedSize: 0.62,
  },
  strong: {
    title: 'Güçlü',
    description: 'Daha küçük boyut için agresif sıkıştırma',
    estimatedRetainedSize: 0.42,
  },
};

export const imageProfiles: Record<
  Profile,
  {
    title: string;
    description: string;
    quality: number;
    format: 'webp' | 'avif' | 'jpeg' | 'png';
    estimatedRetainedSize: number;
  }
> = {
  light: {
    title: 'Hafif',
    description: 'En yüksek kalite, minimum kayıp',
    quality: 90,
    format: 'webp',
    estimatedRetainedSize: 0.72,
  },
  balanced: {
    title: 'Dengeli',
    description: 'Web ve paylaşım için ideal denge',
    quality: 80,
    format: 'webp',
    estimatedRetainedSize: 0.45,
  },
  strong: {
    title: 'Güçlü',
    description: 'Maksimum alan tasarrufu',
    quality: 60,
    format: 'webp',
    estimatedRetainedSize: 0.25,
  },
};

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1024;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[index]}`;
}
