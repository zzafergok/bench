import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  scrypt,
} from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { open, rm, stat } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { ApiError } from './errors.js';

const MAGIC_HEADER = Buffer.from('CMPR_ENC_V1_0000'); // 16 bayt
const SALT_LEN = 16;
const IV_LEN = 12; // GCM için önerilen IV uzunluğu
const TAG_LEN = 16;
const TAG_OFFSET = MAGIC_HEADER.length + SALT_LEN + IV_LEN;
const PAYLOAD_OFFSET = TAG_OFFSET + TAG_LEN;
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1, maxmem: 32 * 1024 * 1024 };

function deriveKey(passphrase: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(passphrase, salt, 32, SCRYPT_OPTIONS, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function encryptFile({
  inputPath,
  outputPath,
  passphrase,
}: {
  inputPath: string;
  outputPath: string;
  passphrase: string;
}): Promise<{ originalBytes: number; encryptedBytes: number }> {
  if (!passphrase || passphrase.length < 12) {
    throw new ApiError(
      400,
      'INVALID_PASSPHRASE',
      'Yeni şifrelemeler için parola en az 12 karakter olmalıdır.',
    );
  }

  const inputStats = await stat(inputPath);
  const salt = randomBytes(SALT_LEN);
  const iv = randomBytes(IV_LEN);
  const key = await deriveKey(passphrase, salt);
  const cipher = createCipheriv('aes-256-gcm', key, iv);

  // Başlıkta kimlik doğrulama etiketi için yer ayır, şifreli metni stream et,
  // ardından tüm dosyayı belleğe almadan nihai GCM etiketini başlığa yaz.
  const header = Buffer.concat([MAGIC_HEADER, salt, iv, Buffer.alloc(TAG_LEN)]);
  const output = await open(outputPath, 'w+');
  try {
    await output.write(header, 0, header.length, 0);
  } finally {
    await output.close();
  }

  await pipeline(
    createReadStream(inputPath),
    cipher,
    createWriteStream(outputPath, { flags: 'r+', start: PAYLOAD_OFFSET }),
  );

  const tag = cipher.getAuthTag();
  const encryptedFile = await open(outputPath, 'r+');
  try {
    await encryptedFile.write(tag, 0, tag.length, TAG_OFFSET);
  } finally {
    await encryptedFile.close();
  }
  const outputStats = await stat(outputPath);

  return {
    originalBytes: inputStats.size,
    encryptedBytes: outputStats.size,
  };
}

export async function decryptFile({
  inputPath,
  outputPath,
  passphrase,
}: {
  inputPath: string;
  outputPath: string;
  passphrase: string;
}): Promise<{ decryptedBytes: number }> {
  if (!passphrase) {
    throw new ApiError(
      400,
      'INVALID_PASSPHRASE',
      'Şifre çözmek için parola gereklidir.',
    );
  }

  const inputStats = await stat(inputPath);
  if (inputStats.size < PAYLOAD_OFFSET) {
    throw new ApiError(
      422,
      'INVALID_ENC_FILE',
      'Dosya geçerli bir şifreli arşiv formatında değil.',
    );
  }

  const header = Buffer.alloc(PAYLOAD_OFFSET);
  const input = await open(inputPath, 'r');
  try {
    await input.read(header, 0, header.length, 0);
  } finally {
    await input.close();
  }

  const magic = header.subarray(0, MAGIC_HEADER.length);
  if (!magic.equals(MAGIC_HEADER)) {
    throw new ApiError(
      422,
      'INVALID_ENC_FILE',
      'Şifreli dosya imzası uyuşmuyor.',
    );
  }

  let offset = MAGIC_HEADER.length;
  const salt = header.subarray(offset, offset + SALT_LEN);
  offset += SALT_LEN;
  const iv = header.subarray(offset, offset + IV_LEN);
  offset += IV_LEN;
  const tag = header.subarray(offset, offset + TAG_LEN);

  try {
    const key = await deriveKey(passphrase, salt);
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    await pipeline(
      createReadStream(inputPath, { start: PAYLOAD_OFFSET }),
      decipher,
      createWriteStream(outputPath),
    );
    const outputStats = await stat(outputPath);
    return { decryptedBytes: outputStats.size };
  } catch {
    await rm(outputPath, { force: true });
    throw new ApiError(
      422,
      'DECRYPTION_FAILED',
      'Parola hatalı veya şifrelenmiş dosya içeriği bozulmuş/değiştirilmiş.',
    );
  }
}

export interface ChecksumResult {
  sha256: string;
  sha512: string;
  md5: string;
  bytes: number;
}

export async function calculateChecksums(
  inputPath: string,
): Promise<ChecksumResult> {
  const sha256 = createHash('sha256');
  const sha512 = createHash('sha512');
  const md5 = createHash('md5');
  let bytes = 0;

  for await (const chunk of createReadStream(inputPath)) {
    const data = chunk as Buffer;
    bytes += data.length;
    sha256.update(data);
    sha512.update(data);
    md5.update(data);
  }

  return {
    sha256: sha256.digest('hex'),
    sha512: sha512.digest('hex'),
    md5: md5.digest('hex'),
    bytes,
  };
}
