import { open } from 'node:fs/promises';
import { basename } from 'node:path';
import { ApiError } from '../errors.js';

export const PDF_SIGNATURE = Buffer.from('%PDF-');
export const ZIP_OPENXML_SIGNATURE = Buffer.from([0x50, 0x4b, 0x03, 0x04]);

export const SUPPORTED_DOC_EXTENSIONS = new Set([
  'pdf',
  'docx',
  'xlsx',
  'pptx',
]);

function replaceUnsafeFilenameCharacters(value: string): string {
  return Array.from(value, (character) => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127 || '"\\/'.includes(character)
      ? '_'
      : character;
  }).join('');
}

export function sanitizeFilename(value: string, fallback = 'file'): string {
  const safe = replaceUnsafeFilenameCharacters(basename(value))
    .replace(/[^a-zA-Z0-9._ -]/g, '_')
    .trim();
  return safe && safe !== '.' && safe !== '..' ? safe.slice(0, 180) : fallback;
}

export function sanitizeDisplayFilename(
  value: string,
  fallback = 'file',
): string {
  const safe = replaceUnsafeFilenameCharacters(basename(value)).trim();
  return safe && safe !== '.' && safe !== '..' ? safe.slice(0, 180) : fallback;
}

export function assertUploadComplete(file: { truncated: boolean }): void {
  if (file.truncated) {
    throw new ApiError(
      413,
      'FILE_TOO_LARGE',
      'Dosya izin verilen boyut sınırını aşıyor.',
    );
  }
}

export async function hasPdfSignature(filePath: string): Promise<boolean> {
  const file = await open(filePath, 'r');
  try {
    const header = Buffer.alloc(PDF_SIGNATURE.length);
    const { bytesRead } = await file.read(header, 0, header.length, 0);
    return bytesRead === PDF_SIGNATURE.length && header.equals(PDF_SIGNATURE);
  } finally {
    await file.close();
  }
}

export async function isValidDocument(
  filePath: string,
  ext: string,
): Promise<boolean> {
  const file = await open(filePath, 'r');
  try {
    const header = Buffer.alloc(8);
    const { bytesRead } = await file.read(header, 0, 8, 0);
    if (bytesRead < 4) return false;
    if (ext === 'pdf') {
      return bytesRead >= 5 && header.subarray(0, 5).equals(PDF_SIGNATURE);
    }
    if (['docx', 'xlsx', 'pptx'].includes(ext)) {
      return header.subarray(0, 4).equals(ZIP_OPENXML_SIGNATURE);
    }
    return false;
  } finally {
    await file.close();
  }
}
