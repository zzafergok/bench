import sharp from 'sharp';
import { stat } from 'node:fs/promises';
import { ApiError } from './errors.js';

export type ImageOutputFormat = 'webp' | 'avif' | 'jpeg' | 'png';

export interface ImageProcessOptions {
  inputPath: string;
  outputPath: string;
  format?: ImageOutputFormat;
  quality?: number;
  stripExif?: boolean;
  maxWidth?: number;
  maxHeight?: number;
}

export interface ImageProcessResult {
  originalBytes: number;
  processedBytes: number;
  width: number;
  height: number;
  format: string;
}

export async function processImage(
  options: ImageProcessOptions,
): Promise<ImageProcessResult> {
  const {
    inputPath,
    outputPath,
    format = 'webp',
    quality = 80,
    stripExif = true,
    maxWidth,
    maxHeight,
  } = options;

  try {
    const inputStats = await stat(inputPath);
    let pipeline = sharp(inputPath);

    // Kısıtlamalar belirtilmişse yeniden boyutlandır
    if (maxWidth || maxHeight) {
      pipeline = pipeline.resize({
        width: maxWidth || undefined,
        height: maxHeight || undefined,
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Formatı ve kaliteyi yapılandır
    const q = Math.min(Math.max(quality, 1), 100);
    switch (format) {
      case 'webp':
        pipeline = pipeline.webp({ quality: q, effort: 4 });
        break;
      case 'avif':
        pipeline = pipeline.avif({ quality: q, effort: 4 });
        break;
      case 'jpeg':
        pipeline = pipeline.jpeg({ quality: q, mozjpeg: true });
        break;
      case 'png':
        pipeline = pipeline.png({
          compressionLevel: 8,
          quality: q < 100 ? q : undefined,
        });
        break;
      default:
        pipeline = pipeline.webp({ quality: q });
    }

    // Meta veri ve EXIF işleme
    if (!stripExif) {
      pipeline = pipeline.withMetadata();
    }

    const info = await pipeline.toFile(outputPath);

    return {
      originalBytes: inputStats.size,
      processedBytes: info.size,
      width: info.width,
      height: info.height,
      format: info.format,
    };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const msg = err instanceof Error ? err.message : 'Bilinmeyen görsel hatası';
    throw new ApiError(
      422,
      'IMAGE_PROCESSING_FAILED',
      `Görsel işlenemedi veya desteklenmeyen format: ${msg}`,
    );
  }
}
