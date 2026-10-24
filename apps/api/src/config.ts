import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const localMarkItDown = fileURLToPath(
  new URL('../../../.venv-markitdown/bin/markitdown', import.meta.url),
);
const defaultMarkItDown = existsSync(localMarkItDown)
  ? localMarkItDown
  : 'markitdown';

const environmentSchema = z.object({
  PORT: z.coerce.number().int().positive().max(65535).default(8787),
  HOST: z.string().default('127.0.0.1'),
  GHOSTSCRIPT_BIN: z.string().min(1).default('gs'),
  MARKITDOWN_BIN: z.string().min(1).default(defaultMarkItDown),
  COMPRESSION_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .positive()
    .max(10 * 60 * 1000)
    .default(120_000),
  MARKDOWN_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .positive()
    .max(10 * 60 * 1000)
    .default(120_000),
  MAX_UPLOAD_BYTES: z.coerce
    .number()
    .int()
    .positive()
    .max(2 * 1024 * 1024 * 1024)
    .default(128 * 1024 * 1024),
  MAX_UPLOAD_FILES: z.coerce.number().int().positive().max(100).default(20),
  MAX_DATA_INPUT_BYTES: z.coerce
    .number()
    .int()
    .positive()
    .max(100 * 1024 * 1024)
    .default(10 * 1024 * 1024),
  MAX_CONCURRENT_JOBS: z.coerce.number().int().positive().max(16).default(2),
  MAX_QUEUED_JOBS: z.coerce.number().int().positive().max(100).default(20),
  JOB_QUEUE_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .positive()
    .max(10 * 60 * 1000)
    .default(30_000),
});

export type AppConfig = z.infer<typeof environmentSchema>;

export function loadConfig(
  environment: Record<string, unknown> = process.env,
): AppConfig {
  return environmentSchema.parse(environment);
}
