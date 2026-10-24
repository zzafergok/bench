import { createWriteStream } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { extname, join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import type { FastifyInstance } from 'fastify';
import type { AppConfig } from '../config.js';
import { ApiError, multipartErrorToApiError, sendApiError } from '../errors.js';
import {
  calculateTextStats,
  convertDocumentToMarkdown,
} from '../markitdown.js';
import {
  assertUploadComplete,
  isValidDocument,
  sanitizeDisplayFilename,
  SUPPORTED_DOC_EXTENSIONS,
} from '../utils/fileValidation.js';

type UploadedDoc = {
  inputPath: string;
  outputPath: string;
  originalName: string;
  ext: string;
};

export function registerMarkdownRoute(app: FastifyInstance, config: AppConfig) {
  app.post('/api/convert/markdown', async (request, reply) => {
    let scratchDirectory: string | undefined;
    const cleanup = async () => {
      if (scratchDirectory)
        await rm(scratchDirectory, { recursive: true, force: true });
    };

    try {
      scratchDirectory = await mkdtemp(join(tmpdir(), 'bench-markdown-'));
      const uploads: UploadedDoc[] = [];

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

        const originalName = sanitizeDisplayFilename(
          part.filename || 'document',
          'document',
        );
        const ext =
          extname(originalName).replace(/^\./, '').toLowerCase() || 'pdf';

        if (!SUPPORTED_DOC_EXTENSIONS.has(ext)) {
          part.file.resume();
          throw new ApiError(
            415,
            'INVALID_MEDIA_TYPE',
            `Desteklenmeyen dosya türü: “${originalName}”. Yalnızca PDF, Word (.docx), Excel (.xlsx) ve PowerPoint (.pptx) kabul edilir.`,
          );
        }

        const index = uploads.length + 1;
        const inputPath = join(scratchDirectory, `input-${index}.${ext}`);
        const outputPath = join(scratchDirectory, `output-${index}.md`);

        await pipeline(part.file, createWriteStream(inputPath));
        assertUploadComplete(part.file);

        if (!(await isValidDocument(inputPath, ext))) {
          throw new ApiError(
            422,
            'INVALID_DOCUMENT',
            `“${originalName}” geçerli bir ${ext.toUpperCase()} dosyası değil veya bozuk.`,
          );
        }

        uploads.push({ inputPath, outputPath, originalName, ext });
      }

      if (uploads.length === 0) {
        throw new ApiError(
          400,
          'FILE_REQUIRED',
          'Dönüştürmek için en az bir doküman seçin.',
        );
      }

      const results = [];
      const combinedBlocks: string[] = [];

      for (const upload of uploads) {
        const markdown = await convertDocumentToMarkdown({
          inputPath: upload.inputPath,
          outputPath: upload.outputPath,
          config,
        });

        const stats = calculateTextStats(markdown);
        const baseName = upload.originalName.replace(/\.[^/.]+$/, '');
        const mdFileName = `${baseName || 'document'}.md`;

        results.push({
          fileName: mdFileName,
          originalName: upload.originalName,
          markdown,
          tokenEstimate: stats.tokenEstimate,
          charCount: stats.charCount,
          wordCount: stats.wordCount,
        });

        combinedBlocks.push(
          `<!-- Doküman: ${upload.originalName} -->\n# ${upload.originalName}\n\n${markdown}`,
        );
      }

      const combinedMarkdown = combinedBlocks.join('\n\n---\n\n');

      return reply.send({
        results,
        combinedMarkdown,
        count: results.length,
        // Geriye dönük uyumlu tek dosya çıktısı
        markdown: results[0].markdown,
        fileName: results[0].fileName,
        tokenEstimate: results[0].tokenEstimate,
        charCount: results[0].charCount,
        wordCount: results[0].wordCount,
      });
    } catch (error) {
      if (error instanceof ApiError) return sendApiError(reply, error);
      const multipartError = multipartErrorToApiError(error);
      if (multipartError) return sendApiError(reply, multipartError);
      request.log.error({ error }, 'Markdown conversion request failed');
      return sendApiError(
        reply,
        new ApiError(500, 'INTERNAL_ERROR', 'Beklenmeyen bir hata oluştu.'),
      );
    } finally {
      await cleanup();
    }
  });
}
