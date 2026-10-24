import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import type { FastifyInstance } from 'fastify';
import type { AppConfig } from '../config.js';
import { ApiError, multipartErrorToApiError, sendApiError } from '../errors.js';
import { convertPdfToImages } from '../pdfImage.js';
import { createZip } from '../utils/archive.js';
import {
  assertUploadComplete,
  hasPdfSignature,
  sanitizeFilename,
} from '../utils/fileValidation.js';

export function registerImagesRoute(app: FastifyInstance, config: AppConfig) {
  app.post('/api/convert/images', async (request, reply) => {
    let scratchDirectory: string | undefined;
    let responseOwnsCleanup = false;
    let cleanupStarted = false;

    const cleanup = async () => {
      if (!scratchDirectory || cleanupStarted) return;
      cleanupStarted = true;
      await rm(scratchDirectory, { recursive: true, force: true });
    };

    try {
      scratchDirectory = await mkdtemp(join(tmpdir(), 'bench-images-'));
      const outputDir = join(scratchDirectory, 'pages');
      await mkdir(outputDir, { recursive: true });

      let inputPath: string | undefined;
      let filename = 'document.pdf';
      let dpi = 150;

      for await (const part of request.parts()) {
        if (part.type === 'field' && part.fieldname === 'dpi') {
          dpi = Number(part.value) || 150;
          continue;
        }

        if (part.type === 'file' && part.fieldname === 'file') {
          if (inputPath) {
            part.file.resume();
            continue;
          }
          filename = sanitizeFilename(
            part.filename || 'document.pdf',
            'document.pdf',
          );
          inputPath = join(scratchDirectory, 'input.pdf');
          await pipeline(part.file, createWriteStream(inputPath));
          assertUploadComplete(part.file);
        }
      }

      if (!inputPath) {
        throw new ApiError(
          400,
          'FILE_REQUIRED',
          'Görsele dönüştürmek için bir PDF seçin.',
        );
      }

      if (!(await hasPdfSignature(inputPath))) {
        throw new ApiError(
          422,
          'INVALID_PDF',
          'Seçilen dosya geçerli bir PDF formatında değil.',
        );
      }

      const generatedImages = await convertPdfToImages({
        inputPath,
        outputDir,
        dpi,
        config,
      });

      const baseName = filename.replace(/\.pdf$/i, '');

      if (generatedImages.length === 1) {
        const singleImage = generatedImages[0];
        reply
          .header('Content-Type', 'image/png')
          .header(
            'Content-Disposition',
            `attachment; filename="${baseName}-sayfa-1.png"`,
          )
          .header('X-Page-Count', 1);

        responseOwnsCleanup = true;
        reply.raw.once('finish', () => void cleanup());
        reply.raw.once('close', () => void cleanup());
        return reply.send(createReadStream(singleImage));
      }

      const zipPath = join(scratchDirectory, 'pages.zip');
      await createZip(
        zipPath,
        generatedImages.map((imgPath, i) => ({
          sourcePath: imgPath,
          name: `${baseName}-sayfa-${String(i + 1).padStart(2, '0')}.png`,
        })),
      );

      reply
        .header('Content-Type', 'application/zip')
        .header(
          'Content-Disposition',
          `attachment; filename="${baseName}-sayfalar-png.zip"`,
        )
        .header('X-Page-Count', generatedImages.length);

      responseOwnsCleanup = true;
      reply.raw.once('finish', () => void cleanup());
      reply.raw.once('close', () => void cleanup());
      return reply.send(createReadStream(zipPath));
    } catch (error) {
      if (error instanceof ApiError) return sendApiError(reply, error);
      const multipartError = multipartErrorToApiError(error);
      if (multipartError) return sendApiError(reply, multipartError);
      request.log.error({ error }, 'PDF to images request failed');
      return sendApiError(
        reply,
        new ApiError(
          500,
          'INTERNAL_ERROR',
          'Görsele dönüştürme başarısız oldu.',
        ),
      );
    } finally {
      if (!responseOwnsCleanup) await cleanup();
    }
  });
}
