import { describe, expect, it } from 'vitest';
import sharp from 'sharp';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { rm } from 'node:fs/promises';
import { processImage } from '../src/imageEngine.js';

describe('Image Engine (Sharp)', () => {
  it('converts raw image to WebP and AVIF with resize and EXIF strip', async () => {
    const inputPath = join(tmpdir(), `test-img-${Date.now()}.png`);
    const outputPathWebp = join(tmpdir(), `test-out-${Date.now()}.webp`);
    const outputPathAvif = join(tmpdir(), `test-out-${Date.now()}.avif`);

    // 200x200 kırmızı dikdörtgen PNG oluştur
    await sharp({
      create: {
        width: 200,
        height: 200,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 1 },
      },
    })
      .png()
      .toFile(inputPath);

    const webpRes = await processImage({
      inputPath,
      outputPath: outputPathWebp,
      format: 'webp',
      quality: 80,
      maxWidth: 100,
      stripExif: true,
    });

    expect(webpRes.format).toBe('webp');
    expect(webpRes.width).toBe(100);
    expect(webpRes.height).toBe(100);
    expect(webpRes.processedBytes).toBeGreaterThan(0);

    const avifRes = await processImage({
      inputPath,
      outputPath: outputPathAvif,
      format: 'avif',
      quality: 75,
      stripExif: true,
    });

    expect(avifRes.format).toBe('heif'); // libvips, AVIF formatını heif container olarak sınıflandırır
    expect(avifRes.processedBytes).toBeGreaterThan(0);

    await rm(inputPath, { force: true });
    await rm(outputPathWebp, { force: true });
    await rm(outputPathAvif, { force: true });
  });
});
