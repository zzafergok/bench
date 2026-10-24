import { useState } from 'react';
import {
  imageProfiles,
  type ImageOptimizeResult,
  type Profile,
} from '../types';
import { readApiError } from '../utils/api';
import { useStorageBoolean, useStorageString } from './use-storage';

const isProfile = (v: string): v is Profile =>
  v === 'light' || v === 'balanced' || v === 'strong';

export function useImageOptimize() {
  const [result, setResult] = useState<ImageOptimizeResult | null>(null);
  const [profile, setProfileState] = useStorageString<Profile>(
    'bench_image_profile',
    'balanced',
    isProfile,
  );
  const [format, setFormat] = useState<'webp' | 'avif' | 'jpeg' | 'png'>(
    'webp',
  );
  const [quality, setQualityState] = useState<number>(
    imageProfiles[profile]?.quality ?? 80,
  );
  const [stripExif, setStripExif] = useStorageBoolean(
    'bench_image_strip_exif',
    true,
  );
  const [maxWidth, setMaxWidth] = useState<string>('');

  const setQuality = (newQuality: number) => {
    setQualityState(newQuality);
    if (newQuality === 90) setProfileState('light');
    else if (newQuality === 80) setProfileState('balanced');
    else if (newQuality === 60) setProfileState('strong');
  };

  const setProfile = (newProfile: Profile) => {
    setProfileState(newProfile);
    setQualityState(imageProfiles[newProfile].quality);
  };

  const optimizeImages = async (
    files: File[],
  ): Promise<ImageOptimizeResult> => {
    if (files.length === 0)
      throw new Error('İşlemek için en az bir görsel seçin.');

    const formData = new FormData();
    files.forEach((file) => formData.append('file', file));
    formData.append('format', format);
    formData.append('quality', quality.toString());
    formData.append('stripExif', stripExif.toString());
    if (maxWidth && parseInt(maxWidth, 10) > 0) {
      formData.append('maxWidth', maxWidth);
    }

    const res = await fetch('/api/images/process', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(await readApiError(res, 'Görsel işleme başarısız oldu.'));
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const isSingleImage = files.length === 1;
    const baseName = files[0].name.replace(/\.[^/.]+$/, '');
    const downloadName = isSingleImage
      ? `${baseName}.${format}`
      : 'optimized-images.zip';

    const originalBytes = parseInt(
      res.headers.get('X-Original-Bytes') || '0',
      10,
    );
    const processedBytes = parseInt(
      res.headers.get('X-Processed-Bytes') || '0',
      10,
    );
    const width = parseInt(res.headers.get('X-Image-Width') || '0', 10);
    const height = parseInt(res.headers.get('X-Image-Height') || '0', 10);

    const optResult: ImageOptimizeResult = {
      url,
      originalBytes,
      processedBytes,
      isSingleImage,
      downloadName,
      width: width || undefined,
      height: height || undefined,
    };

    setResult(optResult);
    return optResult;
  };

  const clearResult = () => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
  };

  return {
    result,
    profile,
    setProfile,
    format,
    setFormat,
    quality,
    setQuality,
    stripExif,
    setStripExif,
    maxWidth,
    setMaxWidth,
    optimizeImages,
    clearResult,
  };
}
