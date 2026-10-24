import { createReadStream, createWriteStream } from 'node:fs';
import { mkdtemp, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import type { FastifyInstance } from 'fastify';
import type { AppConfig } from '../config.js';
import { ApiError, multipartErrorToApiError, sendApiError } from '../errors.js';
import { mergePdfFiles } from '../pdfMerge.js';
import {
  assertUploadComplete,
  hasPdfSignature,
} from '../utils/fileValidation.js';

export function registerMergeRoute(app: FastifyInstance, _config: AppConfig) {
  app.post('/api/merge', async (request, reply) => {
    let scratchDirectory: string | undefined;
    let responseOwnsCleanup = false;
    let cleanupStarted = false;

    const cleanup = async () => {
      if (!scratchDirectory || cleanupStarted) return;
      cleanupStarted = true;
      await rm(scratchDirectory, { recursive: true, force: true });
    };

    try {
      scratchDirectory = await mkdtemp(join(tmpdir(), 'bench-merge-'));
      const inputPaths: string[] = [];
      let index = 0;

      for await (const part of request.parts()) {
        if (part.type !== 'file') continue;
        if (part.fieldname !== 'file') {
          part.file.resume();
          throw new ApiError(
            400,
            'INVALID_FILE_FIELD',
            'Dosya alanı geçersiz.',
          );
        }

        if (
          part.mimetype !== 'application/pdf' &&
          !part.filename.toLowerCase().endsWith('.pdf')
        ) {
          part.file.resume();
          throw new ApiError(
            415,
            'INVALID_MEDIA_TYPE',
            'Yalnızca PDF dosyaları birleştirilebilir.',
          );
        }

        index++;
        const inputPath = join(scratchDirectory, `merge-input-${index}.pdf`);
        await pipeline(part.file, createWriteStream(inputPath));
        assertUploadComplete(part.file);

        if (!(await hasPdfSignature(inputPath))) {
          throw new ApiError(
            422,
            'INVALID_PDF',
            `“${part.filename || `Dosya ${index}`}” geçerli bir PDF değil.`,
          );
        }

        inputPaths.push(inputPath);
      }

      if (inputPaths.length < 2) {
        throw new ApiError(
          400,
          'MINIMUM_FILES_REQUIRED',
          'Birleştirmek için en az 2 PDF dosyası seçmelisiniz.',
        );
      }

      const outputPath = join(scratchDirectory, 'merged-document.pdf');
      const { pageCount } = await mergePdfFiles({ inputPaths, outputPath });

      const outputStat = await stat(outputPath);

      reply
        .header('Content-Type', 'application/pdf')
        .header(
          'Content-Disposition',
          'attachment; filename="birlesik-belge.pdf"',
        )
        .header('X-Total-Pages', pageCount)
        .header('X-File-Count', inputPaths.length)
        .header('X-File-Size', outputStat.size);

      responseOwnsCleanup = true;
      reply.raw.once('finish', () => void cleanup());
      reply.raw.once('close', () => void cleanup());
      return reply.send(createReadStream(outputPath));
    } catch (error) {
      if (error instanceof ApiError) return sendApiError(reply, error);
      const multipartError = multipartErrorToApiError(error);
      if (multipartError) return sendApiError(reply, multipartError);
      request.log.error({ error }, 'PDF merge request failed');
      return sendApiError(
        reply,
        new ApiError(500, 'INTERNAL_ERROR', 'PDF birleştirme başarısız oldu.'),
      );
    } finally {
      if (!responseOwnsCleanup) await cleanup();
    }
  });
}
