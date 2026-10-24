import { pathToFileURL } from 'node:url';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import Fastify from 'fastify';
import { loadConfig, type AppConfig } from './config.js';
import { ApiError, multipartErrorToApiError, sendApiError } from './errors.js';
import { hasGhostscript } from './ghostscript.js';
import { hasMarkItDown } from './markitdown.js';
import { JobLimiter } from './jobLimiter.js';
import { registerCompressRoute } from './routes/compress.js';
import { registerCryptoRoutes } from './routes/crypto.js';
import { registerDataRoute } from './routes/data.js';
import { registerImageOptimizeRoute } from './routes/imageOptimize.js';
import { registerImagesRoute } from './routes/images.js';
import { registerMarkdownRoute } from './routes/markdown.js';
import { registerMergeRoute } from './routes/merge.js';

export function createApp(config: AppConfig = loadConfig()) {
  const app = Fastify({ logger: { transport: { target: 'pino-pretty' } } });
  const jobLimiter = new JobLimiter(
    config.MAX_CONCURRENT_JOBS,
    config.MAX_QUEUED_JOBS,
    config.JOB_QUEUE_TIMEOUT_MS,
  );
  const releases = new WeakMap<object, () => void>();

  const releaseJob = (request: object) => {
    const release = releases.get(request);
    if (!release) return;
    releases.delete(request);
    release();
  };

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ApiError) return sendApiError(reply, error);
    const multipartError = multipartErrorToApiError(error);
    if (multipartError) return sendApiError(reply, multipartError);
    request.log.error({ error }, 'Unhandled API request error');
    return sendApiError(
      reply,
      new ApiError(500, 'INTERNAL_ERROR', 'Beklenmeyen bir hata oluştu.'),
    );
  });

  app.addHook('preHandler', async (request) => {
    if (request.method === 'POST' && request.url.startsWith('/api/')) {
      releases.set(request, await jobLimiter.acquire());
    }
  });
  app.addHook('onSend', async (request, _reply, payload) => {
    releaseJob(request);
    return payload;
  });
  app.addHook('onError', async (request) => {
    releaseJob(request);
  });

  app.register(cors, {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  });

  app.register(multipart, {
    limits: {
      fileSize: config.MAX_UPLOAD_BYTES,
      files: config.MAX_UPLOAD_FILES,
      fields: 20,
      parts: config.MAX_UPLOAD_FILES + 20,
    },
  });

  app.get('/health', async () => ({
    status: 'ok',
    ghostscript: await hasGhostscript(config.GHOSTSCRIPT_BIN),
    markitdown: await hasMarkItDown(config.MARKITDOWN_BIN),
    features: [
      'compress',
      'markdown',
      'merge',
      'images',
      'sanitize',
      'imageOptimize',
      'crypto',
      'data',
    ],
    supportedMarkdownFormats: ['pdf', 'docx', 'xlsx', 'pptx'],
    uploadLimits: {
      fileSize: config.MAX_UPLOAD_BYTES,
      fileCount: config.MAX_UPLOAD_FILES,
    },
    jobLimits: {
      concurrent: jobLimiter.maxConcurrent,
      queued: jobLimiter.maxQueued,
      active: jobLimiter.activeCount,
      waiting: jobLimiter.queuedCount,
    },
  }));

  // Modüler Route Kayıtları
  registerCompressRoute(app, config);
  registerMarkdownRoute(app, config);
  registerMergeRoute(app, config);
  registerImagesRoute(app, config);
  registerImageOptimizeRoute(app, config);
  registerCryptoRoutes(app, config);
  registerDataRoute(app, config);

  return app;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const config = loadConfig();
  const app = createApp(config);
  app.listen({ port: config.PORT, host: config.HOST }).catch((error) => {
    app.log.error(error);
    process.exit(1);
  });
}
