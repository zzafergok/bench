'use client';

import { Button } from '@/components/core/button';
import { Link } from '@/components/core/link';
import { AlertTriangleIcon, RefreshIcon } from '@/components/ui/core-icons';

export default function ErrorPage({
  error,
  reset,
}: {
  error?: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-viewport">
      <main className="error-card" role="alert">
        <div className="error-icon-wrapper">
          <AlertTriangleIcon />
        </div>

        <div className="error-card-content">
          <h1 id="page-title" className="error-card-title">
            Beklenmeyen bir hata oluştu
          </h1>
          <p className="error-card-desc">
            Sayfa yüklenirken bir sorun çıktı veya bir işlem yarıda kaldı.
            Lütfen tekrar deneyin.
          </p>
          {error?.message && (
            <div className="error-card-details">
              <code>{error.message}</code>
            </div>
          )}
        </div>

        <div className="error-card-actions">
          <Button
            type="button"
            className="primary-button error-action-btn"
            onClick={reset}
          >
            <RefreshIcon />
            <span>Tekrar dene</span>
          </Button>
          <Link href="/" className="secondary-button error-action-btn">
            Ana sayfaya dön
          </Link>
        </div>
      </main>
    </div>
  );
}
