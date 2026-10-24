import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import type { AppConfig } from './config.js';
import { ApiError } from './errors.js';

function runMarkItDown(args: string[], config: AppConfig) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(config.MARKITDOWN_BIN, args, {
      stdio: ['ignore', 'ignore', 'pipe'],
    });
    let stderr = '';
    const timeout = setTimeout(
      () => child.kill('SIGTERM'),
      config.MARKDOWN_TIMEOUT_MS,
    );

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (chunk: string) => {
      stderr = `${stderr}${chunk}`.slice(-4_000);
    });
    child.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.once('close', (code, signal) => {
      clearTimeout(timeout);
      if (signal === 'SIGTERM') {
        reject(
          new ApiError(
            504,
            'MARKITDOWN_TIMEOUT',
            'Dönüştürme zaman aşımına uğradı.',
          ),
        );
      } else if (code !== 0) {
        reject(
          new ApiError(
            422,
            'MARKITDOWN_FAILED',
            stderr.trim() || 'Dosya Markdown’a dönüştürülemedi.',
          ),
        );
      } else {
        resolve();
      }
    });
  });
}

export async function hasMarkItDown(binary: string) {
  return new Promise<boolean>((resolve) => {
    const child = spawn(binary, ['--help'], { stdio: 'ignore' });
    child.once('error', () => resolve(false));
    child.once('close', (code) => resolve(code === 0));
  });
}

export function calculateTextStats(text: string) {
  const charCount = text.length;
  const wordCount =
    text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
  const tokenEstimate = Math.ceil(charCount / 3.8);
  return { charCount, wordCount, tokenEstimate };
}

export async function convertDocumentToMarkdown({
  inputPath,
  outputPath,
  config,
}: {
  inputPath: string;
  outputPath: string;
  config: AppConfig;
}): Promise<string> {
  try {
    await runMarkItDown([inputPath, '-o', outputPath], config);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      503,
      'MARKITDOWN_UNAVAILABLE',
      "MarkItDown bulunamadı. Python ile `pip install 'markitdown[pdf]'` veya `pip install markitdown` komutunu çalıştırın.",
    );
  }

  try {
    return await readFile(outputPath, 'utf8');
  } catch {
    throw new ApiError(
      422,
      'EMPTY_MARKDOWN',
      'Dönüştürme geçerli bir Markdown çıktısı üretmedi.',
    );
  }
}

// Geriye dönük uyumlu takma ad (alias)
export const convertPdfToMarkdown = convertDocumentToMarkdown;
