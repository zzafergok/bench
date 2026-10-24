import type { FastifyInstance } from 'fastify';
import type { AppConfig } from '../config.js';
import { ApiError, multipartErrorToApiError, sendApiError } from '../errors.js';
import {
  convertStructuredData,
  isDataFormat,
  type DataFormat,
} from '../dataConverter.js';
import { assertUploadComplete } from '../utils/fileValidation.js';

async function readStreamWithLimit(
  stream: NodeJS.ReadableStream,
  maxBytes: number,
): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let totalBytes = 0;

  for await (const chunk of stream) {
    const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += bufferChunk.length;
    if (totalBytes > maxBytes) {
      if (
        'resume' in stream &&
        typeof (stream as { resume?: () => void }).resume === 'function'
      ) {
        (stream as { resume: () => void }).resume();
      }
      throw new ApiError(
        413,
        'CONTENT_TOO_LARGE',
        'Dosya izin verilen 10 MB boyut sınırını aşıyor.',
      );
    }
    chunks.push(bufferChunk);
  }

  return Buffer.concat(chunks);
}

export function registerDataRoute(
  app: FastifyInstance,
  config: AppConfig,
): void {
  app.post('/api/data/convert', async (request, reply) => {
    try {
      const contentType = request.headers['content-type'] || '';

      if (contentType.includes('application/json')) {
        if (
          !request.body ||
          typeof request.body !== 'object' ||
          Array.isArray(request.body)
        ) {
          throw new ApiError(400, 'INVALID_BODY', 'Geçersiz JSON verisi.');
        }

        const body = request.body as Record<string, unknown>;

        if (typeof body.content !== 'string' || body.content.trim() === '') {
          throw new ApiError(
            400,
            'CONTENT_REQUIRED',
            'Dönüştürülecek veri içeriği belirtilmedi veya geçersiz formatta.',
          );
        }
        if (
          Buffer.byteLength(body.content, 'utf8') > config.MAX_DATA_INPUT_BYTES
        ) {
          throw new ApiError(
            413,
            'CONTENT_TOO_LARGE',
            'Metin girdisi izin verilen boyut sınırını aşıyor.',
          );
        }
        if (
          !isDataFormat(body.sourceFormat) ||
          !isDataFormat(body.targetFormat)
        ) {
          throw new ApiError(400, 'INVALID_FORMAT', 'Veri formatı geçersiz.');
        }

        const prettyJson =
          typeof body.prettyJson === 'boolean' ? body.prettyJson : true;

        const result = convertStructuredData({
          content: body.content,
          sourceFormat: body.sourceFormat,
          targetFormat: body.targetFormat,
          prettyJson,
        });

        return reply.send(result);
      }

      if (contentType.includes('multipart/form-data')) {
        const parts = request.parts();
        let content = '';
        let sourceFormat: DataFormat = 'json';
        let targetFormat: DataFormat = 'csv';
        let prettyJson = true;

        for await (const part of parts) {
          if (part.type === 'field') {
            if (
              part.fieldname === 'sourceFormat' &&
              ['json', 'csv', 'yaml'].includes(part.value as string)
            ) {
              sourceFormat = part.value as DataFormat;
            } else if (
              part.fieldname === 'targetFormat' &&
              ['json', 'csv', 'yaml'].includes(part.value as string)
            ) {
              targetFormat = part.value as DataFormat;
            } else if (part.fieldname === 'prettyJson') {
              prettyJson = part.value !== 'false';
            }
          } else if (part.type === 'file' && part.fieldname === 'file') {
            if (content) {
              part.file.resume();
              throw new ApiError(
                400,
                'TOO_MANY_FILES',
                'Yalnızca bir dosya seçin.',
              );
            }
            const buf = await readStreamWithLimit(
              part.file,
              config.MAX_DATA_INPUT_BYTES,
            );
            assertUploadComplete(part.file);
            content = buf.toString('utf8');
            // Açıkça belirtilmemişse uzantıdan otomatik algıla
            const fname = part.filename.toLowerCase();
            if (fname.endsWith('.csv')) sourceFormat = 'csv';
            else if (fname.endsWith('.json')) sourceFormat = 'json';
            else if (fname.endsWith('.yaml') || fname.endsWith('.yml'))
              sourceFormat = 'yaml';
          } else if (part.type === 'file') {
            part.file.resume();
            throw new ApiError(
              400,
              'INVALID_FILE_FIELD',
              'Dosya alanı geçersiz.',
            );
          }
        }

        if (!content) {
          throw new ApiError(
            400,
            'FILE_REQUIRED',
            'Dönüştürmek için bir dosya yükleyin veya veri girin.',
          );
        }

        const result = convertStructuredData({
          content,
          sourceFormat,
          targetFormat,
          prettyJson,
        });

        return reply.send(result);
      }

      throw new ApiError(
        415,
        'UNSUPPORTED_MEDIA_TYPE',
        'Yalnızca JSON veya Multipart veriler desteklenir.',
      );
    } catch (error) {
      if (error instanceof ApiError) return sendApiError(reply, error);
      const multipartError = multipartErrorToApiError(error);
      if (multipartError) return sendApiError(reply, multipartError);
      request.log.error({ error }, 'Data conversion failed');
      return sendApiError(
        reply,
        new ApiError(500, 'INTERNAL_ERROR', 'Veri dönüştürme başarısız oldu.'),
      );
    }
  });
}
