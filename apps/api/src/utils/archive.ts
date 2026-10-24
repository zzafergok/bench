import { createWriteStream } from 'node:fs';
import archiver from 'archiver';

export type ZipEntry = {
  sourcePath: string;
  name: string;
};

export async function createZip(
  outputPath: string,
  entries: ZipEntry[],
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const output = createWriteStream(outputPath);

    archive.on('error', reject);
    output.on('error', reject);
    output.on('close', resolve);
    archive.pipe(output);
    for (const entry of entries) {
      archive.file(entry.sourcePath, { name: entry.name });
    }
    void archive.finalize();
  });
}
