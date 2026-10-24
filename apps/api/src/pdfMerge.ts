import { readFile, writeFile } from 'node:fs/promises';
import { PDFDocument } from 'pdf-lib';
import { ApiError } from './errors.js';

export type MergeResult = {
  pageCount: number;
  fileCount: number;
};

export async function mergePdfFiles({
  inputPaths,
  outputPath,
}: {
  inputPaths: string[];
  outputPath: string;
}): Promise<MergeResult> {
  if (inputPaths.length < 2) {
    throw new ApiError(
      400,
      'MINIMUM_FILES_REQUIRED',
      'Birleştirmek için en az iki PDF dosyası gereklidir.',
    );
  }

  try {
    const mergedDoc = await PDFDocument.create();
    let totalPageCount = 0;

    for (let i = 0; i < inputPaths.length; i++) {
      const inputPath = inputPaths[i];
      let bytes: Uint8Array;
      try {
        bytes = await readFile(inputPath);
      } catch {
        throw new ApiError(
          422,
          'FILE_READ_ERROR',
          `Dosya okunamadı (${i + 1}. dosya).`,
        );
      }

      let sourceDoc: PDFDocument;
      try {
        sourceDoc = await PDFDocument.load(bytes, { ignoreEncryption: false });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : '';
        if (
          msg.toLowerCase().includes('encrypt') ||
          msg.toLowerCase().includes('password')
        ) {
          throw new ApiError(
            422,
            'ENCRYPTED_PDF',
            `${i + 1}. dosya parola korumalı veya şifreli.`,
          );
        }
        throw new ApiError(
          422,
          'INVALID_PDF',
          `${i + 1}. dosya geçerli bir PDF formatında değil.`,
        );
      }

      const indices = sourceDoc.getPageIndices();
      const copiedPages = await mergedDoc.copyPages(sourceDoc, indices);
      for (const page of copiedPages) {
        mergedDoc.addPage(page);
        totalPageCount++;
      }
    }

    if (totalPageCount === 0) {
      throw new ApiError(422, 'EMPTY_PDF', 'Birleştirilecek sayfa bulunamadı.');
    }

    const mergedBytes = await mergedDoc.save();
    await writeFile(outputPath, mergedBytes);

    return {
      pageCount: totalPageCount,
      fileCount: inputPaths.length,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      500,
      'MERGE_FAILED',
      'PDF birleştirme sırasında bir hata oluştu.',
    );
  }
}
