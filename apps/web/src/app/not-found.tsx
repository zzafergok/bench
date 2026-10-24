import { Link } from '@/components/core/link';

export default function NotFound() {
  return (
    <div className="error-viewport">
      <main className="error-card" role="region" aria-label="Sayfa bulunamadı">
        <div className="not-found-icon-wrapper">
          <span className="not-found-code">404</span>
        </div>

        <div className="error-card-content">
          <h1 id="page-title" className="error-card-title">
            Sayfa bulunamadı
          </h1>
          <p className="error-card-desc">
            Aradığınız sayfa silinmiş, taşınmış veya hiç var olmamış olabilir.
          </p>
        </div>

        <div className="error-card-actions">
          <Link href="/" className="primary-button error-action-btn">
            Ana sayfaya dön
          </Link>
        </div>
      </main>
    </div>
  );
}
