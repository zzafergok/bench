import { createReadStream, createWriteStream } from 'node:fs';
import { mkdtemp, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import type { FastifyInstance } from 'fastify';
import type { AppConfig } from '../config.js';
import { ApiError, multipartErrorToApiError, sendApiError } from '../errors.js';
import {
  compressPdf,
  isCompressionProfile,
  type CompressionProfile,
} from '../ghostscript.js';
import { sanitizePdf } from '../pdfSanitize.js';
import { createZip } from '../utils/archive.js';
import {
  assertUploadComplete,
  hasPdfSignature,
} from '../utils/fileValidation.js';

type StoredUpload = {
  inputPath: string;
  outputPath: string;
  downloadName: string;
};

export function registerCompressRoute(app: FastifyInstance, config: AppConfig) {
  app.post('/api/compress', async (request, reply) => {
    let scratchDirectory: string | undefined;
    let responseOwnsCleanup = false;
    let cleanupStarted = false;

    const cleanup = async () => {
      if (!scratchDirectory || cleanupStarted) return;
      cleanupStarted = true;
      await rm(scratchDirectory, { recursive: true, force: true });
    };

    try {
      scratchDirectory = await mkdtemp(join(tmpdir(), 'bench-'));
      const uploads: StoredUpload[] = [];
      let profileValue = 'balanced';
      let stripMetadata = false;

      for await (const part of request.parts()) {
        if (part.type === 'field') {
          if (part.fieldname === 'profile') profileValue = String(part.value);
          if (part.fieldname === 'stripMetadata') {
            stripMetadata = part.value === 'true' || part.value === true;
          }
          continue;
        }

        if (part.fieldname !== 'file') {
          part.file.resume();
          throw new ApiError(
            400,
            'INVALID_FILE_FIELD',
            'Dosya alanı geçersiz.',
          );
        }
        if (part.mimetype !== 'application/pdf') {
          part.file.resume();
          throw new ApiError(
            415,
            'INVALID_MEDIA_TYPE',
            'Yalnızca PDF dosyaları kabul edilir.',
          );
        }

        const fileIndex = uploads.length + 1;
        const inputPath = join(scratchDirectory, `input-${fileIndex}.pdf`);
        const outputPath = join(scratchDirectory, `output-${fileIndex}.pdf`);
        await pipeline(part.file, createWriteStream(inputPath));
        assertUploadComplete(part.file);

        if (!(await hasPdfSignature(inputPath))) {
          throw new ApiError(
            422,
            'INVALID_PDF',
            `“${part.filename || `Dosya ${fileIndex}`}” geçerli bir PDF değil.`,
          );
        }

        const safeName = basename(
          part.filename || `document-${fileIndex}.pdf`,
        ).replace(/[^a-zA-Z0-9._-]/g, '_');

        uploads.push({
          inputPath,
          outputPath,
          downloadName: `compressed-${fileIndex}-${safeName}`,
        });
      }

      if (uploads.length === 0) {
        throw new ApiError(
          400,
          'FILE_REQUIRED',
          'Sıkıştırmak için en az bir PDF seçin.',
        );
      }
      if (!isCompressionProfile(profileValue)) {
        throw new ApiError(
          400,
          'INVALID_PROFILE',
          'Sıkıştırma profili geçersiz.',
        );
      }

      for (const upload of uploads) {
        await compressPdf({
          inputPath: upload.inputPath,
          outputPath: upload.outputPath,
          profile: profileValue as CompressionProfile,
          config,
        });

        if (stripMetadata) {
          const sanitizedPath = join(
            scratchDirectory,
            `sanitized-${basename(upload.outputPath)}`,
          );
          await sanitizePdf({
            inputPath: upload.outputPath,
            outputPath: sanitizedPath,
          });
          upload.outputPath = sanitizedPath;
        }
      }

      const fileSizes = await Promise.all(
        uploads.map(async (upload) => {
          const [original, compressed] = await Promise.all([
            stat(upload.inputPath),
            stat(upload.outputPath),
          ]);
          if (compressed.size === 0) {
            throw new ApiError(
              422,
              'EMPTY_OUTPUT',
              'Sıkıştırma geçerli bir çıktı üretmedi.',
            );
          }
          return { original: original.size, compressed: compressed.size };
        }),
      );

      const totalOriginalBytes = fileSizes.reduce(
        (total, file) => total + file.original,
        0,
      );
      const totalCompressedBytes = fileSizes.reduce(
        (total, file) => total + file.compressed,
        0,
      );

      if (uploads.length === 1) {
        const upload = uploads[0];
        const singleFilename = upload.downloadName.replace(
          /^compressed-1-/,
          'compressed-',
        );
        reply
          .header('Content-Type', 'application/pdf')
          .header(
            'Content-Disposition',
            `attachment; filename="${singleFilename}"`,
          )
          .header('X-Original-Bytes', totalOriginalBytes)
          .header('X-Compressed-Bytes', totalCompressedBytes)
          .header('X-Archive-Bytes', totalCompressedBytes)
          .header('X-File-Count', 1);

        responseOwnsCleanup = true;
        reply.raw.once('finish', () => void cleanup());
        reply.raw.once('close', () => void cleanup());
        return reply.send(createReadStream(upload.outputPath));
      }

      const zipPath = join(scratchDirectory, 'compressed-pdfs.zip');
      await createZip(
        zipPath,
        uploads.map((upload) => ({
          sourcePath: upload.outputPath,
          name: upload.downloadName,
        })),
      );
      const archive = await stat(zipPath);

      reply
        .header('Content-Type', 'application/zip')
        .header(
          'Content-Disposition',
          'attachment; filename="compressed-pdfs.zip"',
        )
        .header('X-Original-Bytes', totalOriginalBytes)
        .header('X-Compressed-Bytes', totalCompressedBytes)
        .header('X-Archive-Bytes', archive.size)
        .header('X-File-Count', uploads.length);

      responseOwnsCleanup = true;
      reply.raw.once('finish', () => void cleanup());
      reply.raw.once('close', () => void cleanup());
      return reply.send(createReadStream(zipPath));
    } catch (error) {
      if (error instanceof ApiError) return sendApiError(reply, error);
      const multipartError = multipartErrorToApiError(error);
      if (multipartError) return sendApiError(reply, multipartError);
      request.log.error({ error }, 'Compression request failed');
      return sendApiError(
        reply,
        new ApiError(500, 'INTERNAL_ERROR', 'Beklenmeyen bir hata oluştu.'),
      );
    } finally {
      if (!responseOwnsCleanup) await cleanup();
    }
  });
}
