import type { FastifyReply } from 'fastify';

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export function sendApiError(reply: FastifyReply, error: ApiError) {
  return reply.status(error.statusCode).send({
    error: { code: error.code, message: error.message },
  });
}

export function multipartErrorToApiError(error: unknown): ApiError | null {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String(error.code)
      : '';

  if (code === 'FST_REQ_FILE_TOO_LARGE') {
    return new ApiError(
      413,
      'FILE_TOO_LARGE',
      'Dosya izin verilen boyut sınırını aşıyor.',
    );
  }
  if (code === 'FST_FILES_LIMIT') {
    return new ApiError(
      413,
      'TOO_MANY_FILES',
      'Tek istekte izin verilen dosya sayısı aşıldı.',
    );
  }
  if (code === 'FST_FIELDS_LIMIT' || code === 'FST_PARTS_LIMIT') {
    return new ApiError(
      413,
      'TOO_MANY_PARTS',
      'İstek izin verilen alan sayısını aşıyor.',
    );
  }
  return null;
}
