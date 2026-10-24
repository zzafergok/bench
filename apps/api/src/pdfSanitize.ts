import { readFile, writeFile } from 'node:fs/promises';
import { PDFDocument } from 'pdf-lib';
import { ApiError } from './errors.js';

export async function sanitizePdf({
  inputPath,
  outputPath,
}: {
  inputPath: string;
  outputPath: string;
}): Promise<void> {
  try {
    const bytes = await readFile(inputPath);
    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: false });

    // Hassas meta verileri temizle
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer('');
    pdfDoc.setCreator('');
    // Oluşturma ve değiştirilme tarihlerini normalize et
    pdfDoc.setCreationDate(new Date(0));
    pdfDoc.setModificationDate(new Date(0));

    const sanitizedBytes = await pdfDoc.save();
    await writeFile(outputPath, sanitizedBytes);
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    const msg = err instanceof Error ? err.message : '';
    if (
      msg.toLowerCase().includes('encrypt') ||
      msg.toLowerCase().includes('password')
    ) {
      throw new ApiError(
        422,
        'ENCRYPTED_PDF',
        'Parola korumalı veya şifreli PDF meta verileri temizlenemez.',
      );
    }
    throw new ApiError(
      422,
      'SANITIZE_FAILED',
      'PDF meta veri temizleme başarısız oldu.',
    );
  }
}
