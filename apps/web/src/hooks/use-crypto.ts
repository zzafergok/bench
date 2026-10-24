import { useState } from 'react';
import type { CryptoResult } from '../types';
import { readApiError } from '../utils/api';

export function useCrypto() {
  const [result, setResult] = useState<CryptoResult | null>(null);
  const [action, setAction] = useState<'encrypt' | 'decrypt' | 'hash'>(
    'encrypt',
  );
  const [passphrase, setPassphrase] = useState<string>('');

  const executeCrypto = async (files: File[]): Promise<CryptoResult> => {
    if (files.length === 0) throw new Error('İşlem için bir dosya seçin.');
    const file = files[0];

    const formData = new FormData();
    formData.append('file', file);

    if (action === 'hash') {
      const res = await fetch('/api/crypto/hash', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(await readApiError(res, 'Hash hesaplama başarısız oldu.'));
      }

      const data = await res.json();
      const cryptoRes: CryptoResult = { checksums: data };
      setResult(cryptoRes);
      return cryptoRes;
    }

    if (action === 'encrypt' && passphrase.length < 12) {
      throw new Error('Yeni şifrelemeler için parola en az 12 karakter olmalıdır.');
    }
    if (action === 'decrypt' && !passphrase) {
      throw new Error('Şifre çözmek için parola gereklidir.');
    }
    formData.append('passphrase', passphrase);

    const endpoint =
      action === 'encrypt' ? '/api/crypto/encrypt' : '/api/crypto/decrypt';
    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(
        await readApiError(
          res,
          action === 'encrypt'
            ? 'Şifreleme başarısız.'
            : 'Şifre çözme başarısız.',
        ),
      );
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const downloadName =
      action === 'encrypt'
        ? `${file.name}.enc`
        : file.name.endsWith('.enc')
          ? file.name.slice(0, -4)
          : `decrypted-${file.name}`;

    const originalBytes = parseInt(
      res.headers.get('X-Original-Bytes') || '0',
      10,
    );
    const resultBytes = parseInt(
      res.headers.get(
        action === 'encrypt' ? 'X-Encrypted-Bytes' : 'X-Decrypted-Bytes',
      ) || '0',
      10,
    );

    const cryptoRes: CryptoResult = {
      url,
      downloadName,
      originalBytes,
      resultBytes,
    };

    setResult(cryptoRes);
    return cryptoRes;
  };

  const clearResult = () => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
  };

  return {
    result,
    action,
    setAction,
    passphrase,
    setPassphrase,
    executeCrypto,
    clearResult,
  };
}
