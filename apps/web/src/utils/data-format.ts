import type { DataFormat } from '@/constants/data-convert';

export function detectDataFormat(
  fileNameOrFile: string | File,
): DataFormat | null {
  const name = (
    typeof fileNameOrFile === 'string' ? fileNameOrFile : fileNameOrFile.name
  ).toLowerCase();
  if (name.endsWith('.json')) return 'json';
  if (name.endsWith('.csv')) return 'csv';
  if (name.endsWith('.yaml') || name.endsWith('.yml')) return 'yaml';
  return null;
}

export function getAlternativeTargetFormat(
  sourceFormat: DataFormat,
): DataFormat {
  return sourceFormat === 'json' ? 'csv' : 'json';
}
