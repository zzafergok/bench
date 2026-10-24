import { createReadStream, createWriteStream } from 'node:fs';
import { mkdtemp, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { extname, join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import type { FastifyInstance } from 'fastify';
import type { AppConfig } from '../config.js';
import { ApiError, multipartErrorToApiError, sendApiError } from '../errors.js';
import { processImage, type ImageOutputFormat } from '../imageEngine.js';
import { createZip } from '../utils/archive.js';
import {
  assertUploadComplete,
  sanitizeFilename,
} from '../utils/fileValidation.js';

interface UploadedImage {
  inputPath: string;
  outputPath: string;
  filename: string;
  baseName: string;
}

export function registerImageOptimizeRoute(
  app: FastifyInstance,
  _config: AppConfig,
): void {
  app.post('/api/images/process', async (request, reply) => {
    let scratchDirectory: string | undefined;
    let responseOwnsCleanup = false;

    const cleanup = async () => {
      if (scratchDirectory) {
        await rm(scratchDirectory, { recursive: true, force: true });
      }
    };

    try {
      scratchDirectory = await mkdtemp(join(tmpdir(), 'bench-img-'));
      const parts = request.parts();

      const uploads: UploadedImage[] = [];
      let targetFormat: ImageOutputFormat = 'webp';
      let quality = 80;
      let stripExif = true;
      let maxWidth: number | undefined;
      let maxHeight: number | undefined;

      for await (const part of parts) {
        if (part.type === 'field') {
          if (
            part.fieldname === 'format' &&
            ['webp', 'avif', 'jpeg', 'png'].includes(part.value as string)
          ) {
            targetFormat = part.value as ImageOutputFormat;
          } else if (part.fieldname === 'quality') {
            const parsed = parseInt(part.value as string, 10);
            if (!isNaN(parsed) && parsed >= 1 && parsed <= 100)
              quality = parsed;
          } else if (part.fieldname === 'stripExif') {
            stripExif = part.value !== 'false' && part.value !== false;
          } else if (part.fieldname === 'maxWidth') {
            const w = parseInt(part.value as string, 10);
            if (!isNaN(w) && w > 0) maxWidth = w;
          } else if (part.fieldname === 'maxHeight') {
            const h = parseInt(part.value as string, 10);
            if (!isNaN(h) && h > 0) maxHeight = h;
          }
          continue;
        }

        if (part.type !== 'file') continue;
        if (part.fieldname !== 'file') {
          part.file.resume();
          throw new ApiError(
            400,
            'INVALID_FILE_FIELD',
            'Dosya alanı geçersiz.',
          );
        }

        const filename = sanitizeFilename(part.filename || 'image', 'image');
        const fileExt = extname(filename);
        const baseName = filename.replace(/\.[^/.]+$/, '');
        const inputPath = join(
          scratchDirectory,
          `input-${uploads.length + 1}${fileExt}`,
        );
        const outputPath = join(
          scratchDirectory,
          `output-${uploads.length + 1}`,
        );

        await pipeline(part.file, createWriteStream(inputPath));
        assertUploadComplete(part.file);
        uploads.push({ inputPath, outputPath, filename, baseName });
      }

      if (uploads.length === 0) {
        throw new ApiError(
          400,
          'FILE_REQUIRED',
          'İşlemek için en az bir görsel seçin.',
        );
      }

      const results = [];
      for (const upload of uploads) {
        const res = await processImage({
          inputPath: upload.inputPath,
          outputPath: upload.outputPath,
          format: targetFormat,
          quality,
          stripExif,
          maxWidth,
          maxHeight,
        });
        results.push({ ...upload, ...res });
      }

      const totalOriginal = results.reduce(
        (acc, r) => acc + r.originalBytes,
        0,
      );
      const totalProcessed = results.reduce(
        (acc, r) => acc + r.processedBytes,
        0,
      );

      if (uploads.length === 1) {
        const single = results[0];
        const mimeTypes: Record<ImageOutputFormat, string> = {
          webp: 'image/webp',
          avif: 'image/avif',
          jpeg: 'image/jpeg',
          png: 'image/png',
        };

        reply
          .header('Content-Type', mimeTypes[targetFormat])
          .header(
            'Content-Disposition',
            `attachment; filename="${single.baseName}.${targetFormat}"`,
          )
          .header('X-Original-Bytes', single.originalBytes)
          .header('X-Processed-Bytes', single.processedBytes)
          .header('X-Image-Width', single.width)
          .header('X-Image-Height', single.height);

        responseOwnsCleanup = true;
        reply.raw.once('finish', () => void cleanup());
        reply.raw.once('close', () => void cleanup());
        return reply.send(createReadStream(single.outputPath));
      }

      const zipPath = join(scratchDirectory, 'optimized-images.zip');
      await createZip(
        zipPath,
        uploads.map((u) => ({
          sourcePath: u.outputPath,
          name: `${u.baseName}.${targetFormat}`,
        })),
      );
      const zipStats = await stat(zipPath);

      reply
        .header('Content-Type', 'application/zip')
        .header(
          'Content-Disposition',
          'attachment; filename="optimized-images.zip"',
        )
        .header('X-Original-Bytes', totalOriginal)
        .header('X-Processed-Bytes', totalProcessed)
        .header('X-Archive-Bytes', zipStats.size)
        .header('X-Batch-Count', uploads.length);

      responseOwnsCleanup = true;
      reply.raw.once('finish', () => void cleanup());
      reply.raw.once('close', () => void cleanup());
      return reply.send(createReadStream(zipPath));
    } catch (error) {
      if (error instanceof ApiError) return sendApiError(reply, error);
      const multipartError = multipartErrorToApiError(error);
      if (multipartError) return sendApiError(reply, multipartError);
      request.log.error({ error }, 'Image processing request failed');
      return sendApiError(
        reply,
        new ApiError(
          500,
          'INTERNAL_ERROR',
          'Görsel işleme sırasında hata oluştu.',
        ),
      );
    } finally {
      if (!responseOwnsCleanup) await cleanup();
    }
  });
}
