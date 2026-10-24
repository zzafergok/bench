import { spawn } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { AppConfig } from './config.js';
import { ApiError } from './errors.js';
import { hasGhostscript } from './ghostscript.js';

export async function convertPdfToImages({
  inputPath,
  outputDir,
  dpi = 150,
  config,
}: {
  inputPath: string;
  outputDir: string;
  dpi?: number;
  config: AppConfig;
}): Promise<string[]> {
  const available = await hasGhostscript(config.GHOSTSCRIPT_BIN);
  if (!available) {
    throw new ApiError(
      503,
      'GHOSTSCRIPT_UNAVAILABLE',
      'Ghostscript bulunamadı. Lütfen Ghostscript kurulumunu tamamlayın.',
    );
  }

  const outputPattern = join(outputDir, 'page-%03d.png');
  const safeDpi = Math.min(Math.max(dpi, 72), 300);

  const args = [
    '-sDEVICE=png16m',
    `-r${safeDpi}`,
    '-dNOPAUSE',
    '-dBATCH',
    '-dSAFER',
    '-dQUIET',
    `-sOutputFile=${outputPattern}`,
    inputPath,
  ];

  await new Promise<void>((resolve, reject) => {
    const child = spawn(config.GHOSTSCRIPT_BIN, args, {
      shell: false,
      stdio: ['ignore', 'ignore', 'pipe'],
    });

    let stderr = '';
    const timer = setTimeout(
      () => child.kill('SIGTERM'),
      config.COMPRESSION_TIMEOUT_MS,
    );

    child.stderr.on('data', (chunk: Buffer) => {
      stderr = `${stderr}${chunk.toString()}`.slice(-2_000);
    });

    child.on('error', () => {
      clearTimeout(timer);
      reject(
        new ApiError(
          502,
          'CONVERSION_FAILED',
          'Görsel dönüştürme motoru başlatılamadı.',
        ),
      );
    });

    child.on('close', (exitCode) => {
      clearTimeout(timer);
      if (exitCode === 0) {
        resolve();
        return;
      }
      const timedOut = exitCode === null;
      reject(
        new ApiError(
          timedOut ? 504 : 422,
          timedOut ? 'CONVERSION_TIMEOUT' : 'CONVERSION_FAILED',
          timedOut
            ? 'Dönüştürme zaman aşımına uğradı.'
            : stderr.includes('undefinedfilename')
              ? 'PDF okunamadı veya parola korumalı.'
              : 'PDF sayfa görsellerine dönüştürülemedi.',
        ),
      );
    });
  });

  const files = await readdir(outputDir);
  const pngFiles = files
    .filter((f) => f.startsWith('page-') && f.endsWith('.png'))
    .sort()
    .map((f) => join(outputDir, f));

  if (pngFiles.length === 0) {
    throw new ApiError(
      422,
      'EMPTY_OUTPUT',
      'PDF’den dönüştürülecek sayfa bulunamadı.',
    );
  }

  return pngFiles;
}
