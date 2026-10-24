import { spawn } from 'node:child_process';
import { access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { isAbsolute, join } from 'node:path';
import type { AppConfig } from './config.js';
import { ApiError } from './errors.js';

export const compressionProfiles = {
  light: { label: 'Hafif', ghostscriptSetting: '/printer' },
  balanced: { label: 'Dengeli', ghostscriptSetting: '/ebook' },
  strong: { label: 'Güçlü', ghostscriptSetting: '/screen' },
} as const;

export type CompressionProfile = keyof typeof compressionProfiles;

export function isCompressionProfile(
  value: string,
): value is CompressionProfile {
  return value in compressionProfiles;
}

export async function hasGhostscript(binary: string): Promise<boolean> {
  if (isAbsolute(binary)) {
    try {
      await access(binary, constants.X_OK);
      return true;
    } catch {
      return false;
    }
  }

  const paths = (process.env.PATH ?? '').split(':');
  for (const path of paths) {
    try {
      await access(join(path, binary), constants.X_OK);
      return true;
    } catch {
      // Sonraki PATH girdisini kontrol et.
    }
  }
  return false;
}

export async function compressPdf(options: {
  inputPath: string;
  outputPath: string;
  profile: CompressionProfile;
  config: AppConfig;
}): Promise<void> {
  const { inputPath, outputPath, profile, config } = options;
  const available = await hasGhostscript(config.GHOSTSCRIPT_BIN);
  if (!available) {
    throw new ApiError(
      503,
      'GHOSTSCRIPT_UNAVAILABLE',
      "Ghostscript bulunamadı. macOS için `brew install ghostscript` komutunu çalıştırıp API'yi yeniden başlatın.",
    );
  }

  const args = [
    '-sDEVICE=pdfwrite',
    '-dCompatibilityLevel=1.4',
    '-dNOPAUSE',
    '-dBATCH',
    '-dSAFER',
    '-dQUIET',
    `-dPDFSETTINGS=${compressionProfiles[profile].ghostscriptSetting}`,
    `-sOutputFile=${outputPath}`,
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
          'COMPRESSION_FAILED',
          'PDF sıkıştırma motoru başlatılamadı.',
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
          timedOut ? 'COMPRESSION_TIMEOUT' : 'COMPRESSION_FAILED',
          timedOut
            ? 'Sıkıştırma güvenli süre sınırını aştı. Daha küçük bir dosya deneyin.'
            : stderr.includes('undefinedfilename')
              ? 'PDF okunamadı veya parola korumalı olabilir.'
              : 'PDF sıkıştırılamadı. Dosyanın geçerli ve parola korumasız olduğundan emin olun.',
        ),
      );
    });
  });
}
