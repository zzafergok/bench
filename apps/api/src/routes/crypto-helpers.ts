import { createWriteStream } from 'node:fs';
import { join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { ApiError, multipartErrorToApiError, sendApiError } from '../errors.js';
import {
  assertUploadComplete,
  sanitizeFilename,
} from '../utils/fileValidation.js';

export interface ExtractedCryptoInput {
  inputPath: string;
  filename: string;
  passphrase?: string;
}

export async function parseCryptoFileInput(
  request: FastifyRequest,
  scratchDirectory: string,
  options: {
    requirePassphrase?: boolean;
    defaultFilename: string;
    destinationName: string;
  },
): Promise<ExtractedCryptoInput> {
  const parts = request.parts();
  let inputPath: string | undefined;
  let filename = options.defaultFilename;
  let passphrase = '';

  for await (const part of parts) {
    if (part.type === 'field' && part.fieldname === 'passphrase') {
      passphrase = part.value as string;
    } else if (part.type === 'file' && part.fieldname === 'file') {
      if (inputPath) {
        part.file.resume();
        throw new ApiError(400, 'TOO_MANY_FILES', 'Yalnızca bir dosya seçin.');
      }
      filename = sanitizeFilename(
        part.filename || options.defaultFilename,
        options.defaultFilename,
      );
      inputPath = join(scratchDirectory, options.destinationName);
      await pipeline(part.file, createWriteStream(inputPath));
      assertUploadComplete(part.file);
    } else if (part.type === 'file') {
      part.file.resume();
      throw new ApiError(400, 'INVALID_FILE_FIELD', 'Dosya alanı geçersiz.');
    }
  }

  if (!inputPath) {
    throw new ApiError(
      400,
      'FILE_REQUIRED',
      'İşlem yapılacak bir dosya seçin.',
    );
  }

  if (options.requirePassphrase && (!passphrase || passphrase.length < 12)) {
    throw new ApiError(
      400,
      'INVALID_PASSPHRASE',
      'Yeni şifrelemeler için parola en az 12 karakter olmalıdır.',
    );
  }

  return { inputPath, filename, passphrase };
}

export function handleCryptoError(
  request: FastifyRequest,
  reply: FastifyReply,
  error: unknown,
  logMessage: string,
  userMessage: string,
) {
  if (error instanceof ApiError) return sendApiError(reply, error);
  const multipartError = multipartErrorToApiError(error);
  if (multipartError) return sendApiError(reply, multipartError);
  request.log.error({ error }, logMessage);
  return sendApiError(reply, new ApiError(500, 'INTERNAL_ERROR', userMessage));
}
