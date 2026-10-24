import YAML from 'yaml';
import { parse } from 'csv-parse/sync';
import { ApiError } from './errors.js';

export type DataFormat = 'json' | 'csv' | 'yaml';

export interface DataConvertOptions {
  content: string;
  sourceFormat: DataFormat;
  targetFormat: DataFormat;
  prettyJson?: boolean;
}

export interface DataConvertResult {
  convertedContent: string;
  rowCount: number;
  keys: string[];
  byteSize: number;
}

function parseCsv(text: string): Record<string, string>[] {
  return parse(text, {
    bom: true,
    columns(headers: string[]) {
      if (headers.some((header) => header.length === 0)) {
        throw new Error('CSV sütun adları boş olamaz.');
      }
      if (new Set(headers).size !== headers.length) {
        throw new Error('CSV sütun adları benzersiz olmalıdır.');
      }
      return headers;
    },
    skip_empty_lines: true,
  }) as Record<string, string>[];
}

export function isDataFormat(value: unknown): value is DataFormat {
  return value === 'json' || value === 'csv' || value === 'yaml';
}

function arrayToCsv(data: Record<string, unknown>[]): string {
  if (data.length === 0) return '';
  const headers = Array.from(
    new Set(data.flatMap((item) => Object.keys(item))),
  );
  const escapeCell = (val: unknown): string => {
    const str = val === null || val === undefined ? '' : String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(escapeCell).join(',');
  const rowLines = data.map((row) =>
    headers.map((h) => escapeCell(row[h])).join(','),
  );
  return [headerLine, ...rowLines].join('\n');
}

export function convertStructuredData(
  options: DataConvertOptions,
): DataConvertResult {
  const { content, sourceFormat, targetFormat, prettyJson = true } = options;
  if (!content || !content.trim()) {
    throw new ApiError(400, 'EMPTY_DATA', 'Dönüştürülecek veri içeriği boş.');
  }
  if (!isDataFormat(sourceFormat) || !isDataFormat(targetFormat)) {
    throw new ApiError(400, 'INVALID_FORMAT', 'Veri formatı geçersiz.');
  }

  let parsed: unknown;
  try {
    if (sourceFormat === 'json') {
      parsed = JSON.parse(content);
    } else if (sourceFormat === 'yaml') {
      parsed = YAML.parse(content);
    } else if (sourceFormat === 'csv') {
      parsed = parseCsv(content);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : '';
    throw new ApiError(
      422,
      'PARSE_FAILED',
      `${sourceFormat.toUpperCase()} formatı çözümlenemedi: ${msg}`,
    );
  }

  const rows: Record<string, unknown>[] = Array.isArray(parsed)
    ? (parsed as Record<string, unknown>[])
    : typeof parsed === 'object' && parsed !== null
      ? [parsed as Record<string, unknown>]
      : [{ value: parsed }];

  const keys = Array.from(
    new Set(
      rows.flatMap((r) => (r && typeof r === 'object' ? Object.keys(r) : [])),
    ),
  );
  let converted = '';

  if (targetFormat === 'json') {
    converted = JSON.stringify(parsed, null, prettyJson ? 2 : undefined);
  } else if (targetFormat === 'yaml') {
    converted = YAML.stringify(parsed);
  } else if (targetFormat === 'csv') {
    converted = arrayToCsv(rows);
  }

  return {
    convertedContent: converted,
    rowCount: rows.length,
    keys,
    byteSize: Buffer.byteLength(converted, 'utf8'),
  };
}
