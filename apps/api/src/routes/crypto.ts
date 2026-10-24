import { createReadStream } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { FastifyInstance } from 'fastify';
import type { AppConfig } from '../config.js';
import {
  calculateChecksums,
  decryptFile,
  encryptFile,
} from '../cryptoVault.js';
import { handleCryptoError, parseCryptoFileInput } from './crypto-helpers.js';

export function registerCryptoRoutes(
  app: FastifyInstance,
  _config: AppConfig,
): void {
  // 1. Dosya Şifreleme
  app.post('/api/crypto/encrypt', async (request, reply) => {
    let scratchDirectory: string | undefined;
    let responseOwnsCleanup = false;

    const cleanup = async () => {
      if (scratchDirectory) {
        await rm(scratchDirectory, { recursive: true, force: true });
      }
    };

    try {
      scratchDirectory = await mkdtemp(join(tmpdir(), 'bench-enc-'));
      const { inputPath, filename, passphrase } = await parseCryptoFileInput(
        request,
        scratchDirectory,
        {
          requirePassphrase: true,
          defaultFilename: 'document',
          destinationName: 'plain.bin',
        },
      );

      const outputPath = join(scratchDirectory, `${filename}.enc`);
      const { originalBytes, encryptedBytes } = await encryptFile({
        inputPath,
        outputPath,
        passphrase: passphrase || '',
      });

      reply
        .header('Content-Type', 'application/octet-stream')
        .header('Content-Disposition', `attachment; filename="${filename}.enc"`)
        .header('X-Original-Bytes', originalBytes)
        .header('X-Encrypted-Bytes', encryptedBytes);

      responseOwnsCleanup = true;
      reply.raw.once('finish', () => void cleanup());
      reply.raw.once('close', () => void cleanup());
      return reply.send(createReadStream(outputPath));
    } catch (error) {
      return handleCryptoError(
        request,
        reply,
        error,
        'Encryption request failed',
        'Şifreleme başarısız oldu.',
      );
    } finally {
      if (!responseOwnsCleanup) await cleanup();
    }
  });

  // 2. Dosya Şifresi Çözme
  app.post('/api/crypto/decrypt', async (request, reply) => {
    let scratchDirectory: string | undefined;
    let responseOwnsCleanup = false;

    const cleanup = async () => {
      if (scratchDirectory) {
        await rm(scratchDirectory, { recursive: true, force: true });
      }
    };

    try {
      scratchDirectory = await mkdtemp(join(tmpdir(), 'bench-dec-'));
      const { inputPath, filename, passphrase } = await parseCryptoFileInput(
        request,
        scratchDirectory,
        {
          requirePassphrase: false,
          defaultFilename: 'document.enc',
          destinationName: 'enc.bin',
        },
      );

      const outputName = filename.endsWith('.enc')
        ? filename.slice(0, -4)
        : `decrypted-${filename}`;
      const outputPath = join(scratchDirectory, outputName);
      const { decryptedBytes } = await decryptFile({
        inputPath,
        outputPath,
        passphrase: passphrase || '',
      });

      reply
        .header('Content-Type', 'application/octet-stream')
        .header('Content-Disposition', `attachment; filename="${outputName}"`)
        .header('X-Decrypted-Bytes', decryptedBytes);

      responseOwnsCleanup = true;
      reply.raw.once('finish', () => void cleanup());
      reply.raw.once('close', () => void cleanup());
      return reply.send(createReadStream(outputPath));
    } catch (error) {
      return handleCryptoError(
        request,
        reply,
        error,
        'Decryption request failed',
        'Şifre çözme başarısız oldu.',
      );
    } finally {
      if (!responseOwnsCleanup) await cleanup();
    }
  });

  // 3. Checksum ve Hash Üretici
  app.post('/api/crypto/hash', async (request, reply) => {
    let scratchDirectory: string | undefined;

    try {
      scratchDirectory = await mkdtemp(join(tmpdir(), 'bench-hash-'));
      const { inputPath, filename } = await parseCryptoFileInput(
        request,
        scratchDirectory,
        {
          requirePassphrase: false,
          defaultFilename: 'file',
          destinationName: 'input.bin',
        },
      );

      const checksums = await calculateChecksums(inputPath);
      return reply.send({ filename, ...checksums });
    } catch (error) {
      return handleCryptoError(
        request,
        reply,
        error,
        'Checksum calculation failed',
        'Hash hesaplanamadı.',
      );
    } finally {
      if (scratchDirectory) {
        await rm(scratchDirectory, { recursive: true, force: true });
      }
    }
  });
}
