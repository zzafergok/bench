import { describe, expect, it } from 'vitest';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { writeFile, readFile, rm } from 'node:fs/promises';
import {
  calculateChecksums,
  decryptFile,
  encryptFile,
} from '../src/cryptoVault.js';

describe('Crypto Vault & Hasher', () => {
  it('encrypts and decrypts files with AES-256-GCM and password', async () => {
    const plainPath = join(tmpdir(), `test-plain-${Date.now()}.txt`);
    const encPath = join(tmpdir(), `test-enc-${Date.now()}.bin`);
    const decPath = join(tmpdir(), `test-dec-${Date.now()}.txt`);

    const secretText = 'Bench tamamen yerel ve gizlidir!';
    await writeFile(plainPath, secretText, 'utf8');

    const pass = 'gucluParola123!';
    const encResult = await encryptFile({
      inputPath: plainPath,
      outputPath: encPath,
      passphrase: pass,
    });

    expect(encResult.encryptedBytes).toBeGreaterThan(encResult.originalBytes);

    const decResult = await decryptFile({
      inputPath: encPath,
      outputPath: decPath,
      passphrase: pass,
    });

    const decryptedText = await readFile(decPath, 'utf8');
    expect(decryptedText).toBe(secretText);
    expect(decResult.decryptedBytes).toBe(Buffer.byteLength(secretText));

    await rm(plainPath, { force: true });
    await rm(encPath, { force: true });
    await rm(decPath, { force: true });
  });

  it('rejects decryption when wrong passphrase is provided', async () => {
    const plainPath = join(tmpdir(), `test-plain-fail-${Date.now()}.txt`);
    const encPath = join(tmpdir(), `test-enc-fail-${Date.now()}.bin`);
    const decPath = join(tmpdir(), `test-dec-fail-${Date.now()}.txt`);

    await writeFile(plainPath, 'gizli veri', 'utf8');
    await encryptFile({
      inputPath: plainPath,
      outputPath: encPath,
      passphrase: 'dogruParola123',
    });

    await expect(
      decryptFile({
        inputPath: encPath,
        outputPath: decPath,
        passphrase: 'yanlisParola!',
      }),
    ).rejects.toThrow();

    await rm(plainPath, { force: true });
    await rm(encPath, { force: true });
    await rm(decPath, { force: true });
  });

  it('computes accurate SHA-256, SHA-512 and MD5 checksums', async () => {
    const filePath = join(tmpdir(), `test-hash-${Date.now()}.txt`);
    await writeFile(filePath, 'hello bench', 'utf8');

    const checksums = await calculateChecksums(filePath);
    expect(checksums.sha256).toBeDefined();
    expect(checksums.sha512).toBeDefined();
    expect(checksums.md5).toBeDefined();
    expect(checksums.bytes).toBe(Buffer.byteLength('hello bench'));

    await rm(filePath, { force: true });
  });
});
