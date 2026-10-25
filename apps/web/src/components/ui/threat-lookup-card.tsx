import { Button } from '@/components/core/button';
import { Spinner } from '@/components/core/spinner';
import type { ThreatReport } from '@/types';

interface ThreatLookupCardProps {
  sha256: string;
  threatLoading: boolean;
  threatReport: ThreatReport | null;
  threatError: string | null;
  onCheckThreat: (hash: string) => void;
}

export function ThreatLookupCard({
  sha256,
  threatLoading,
  threatReport,
  threatError,
  onCheckThreat,
}: ThreatLookupCardProps) {
  return (
    <div className="threat-lookup-wrapper">
      {!threatReport && !threatLoading && (
        <div className="threat-action-box">
          <div className="threat-intro">
            <span className="threat-title">
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Tehdit ve İtibar Doğrulama
            </span>
            <p className="threat-subtext">
              Dosyanız dışarıya yüklenmez; yalnızca SHA-256 hash dizesi genel
              tehdit ve açık kaynak veritabanlarıyla (CIRCL / VirusTotal)
              karşılaştırılır.
            </p>
          </div>
          <Button
            type="button"
            className="threat-check-btn"
            onClick={() => onCheckThreat(sha256)}
            disabled={threatLoading}
          >
            🛡️ Tehdit Kontrolü Yap
          </Button>
        </div>
      )}

      {threatLoading && (
        <div className="threat-loading-box">
          <Spinner className="spinner" />
          <span>
            Açık tehdit istihbaratı veritabanları taranıyor (CIRCL / VT)…
          </span>
        </div>
      )}

      {threatError && (
        <div className="threat-error-banner" role="alert">
          <span>⚠️ {threatError}</span>
          <Button
            type="button"
            className="threat-retry-btn"
            onClick={() => onCheckThreat(sha256)}
          >
            Tekrar Dene
          </Button>
        </div>
      )}

      {threatReport && (
        <div className={`threat-result-card is-${threatReport.status}`}>
          <div className="threat-header-row">
            <div className="threat-badge-group">
              <span className={`threat-badge is-${threatReport.status}`}>
                {threatReport.status === 'clean' &&
                  '✓ Doğrulanmış Güvenli Kayıt'}
                {threatReport.status === 'unknown' &&
                  'ℹ️ Bilinmeyen / Özel Dosya'}
                {threatReport.status === 'suspicious' &&
                  '⚠️ Şüpheli / Riskli Kayıt'}
                {threatReport.status === 'malicious' &&
                  '⛔ ZARARLI TEHDİT TESPİT EDİLDİ'}
              </span>
              <span className="threat-provider-badge">
                Kaynak: {threatReport.provider.toUpperCase()}
              </span>
              {threatReport.quota && (
                <span
                  className="threat-quota-badge"
                  title="Günlük kullanılan / izin verilen VirusTotal kotası"
                >
                  📊 Kota: {threatReport.quota.dailyUsed} /{' '}
                  {threatReport.quota.dailyAllowed}
                </span>
              )}
            </div>
            <Button
              type="button"
              className="threat-refresh-btn"
              onClick={() => onCheckThreat(sha256)}
              title="Yeniden sorgula"
            >
              Yenile
            </Button>
          </div>

          <p className="threat-verdict">{threatReport.reputation}</p>

          <div className="threat-details-grid">
            {threatReport.fileName && (
              <div className="threat-detail-item">
                <span className="threat-detail-label">Eşleşen Yazılım:</span>
                <span className="threat-detail-val">
                  {threatReport.fileName}
                </span>
              </div>
            )}
            {threatReport.database && (
              <div className="threat-detail-item">
                <span className="threat-detail-label">Veritabanı:</span>
                <span className="threat-detail-val">
                  {threatReport.database}
                </span>
              </div>
            )}
            {typeof threatReport.trustScore === 'number' && (
              <div className="threat-detail-item">
                <span className="threat-detail-label">Güvenilirlik Skoru:</span>
                <span className="threat-detail-val">
                  %{threatReport.trustScore}
                </span>
              </div>
            )}
            {threatReport.stats && (
              <div className="threat-detail-item">
                <span className="threat-detail-label">Antivirüs Taraması:</span>
                <span className="threat-detail-val">
                  {threatReport.stats.malicious} zararlı /{' '}
                  {threatReport.stats.harmless + threatReport.stats.undetected}{' '}
                  temiz
                </span>
              </div>
            )}
            {threatReport.quota && (
              <div className="threat-detail-item">
                <span className="threat-detail-label">Kalan Günlük Kota:</span>
                <span className="threat-detail-val">
                  {Math.max(
                    0,
                    threatReport.quota.dailyAllowed -
                      threatReport.quota.dailyUsed,
                  )}{' '}
                  / {threatReport.quota.dailyAllowed} hak
                </span>
              </div>
            )}
            <div className="threat-detail-item">
              <span className="threat-detail-label">Sorgulanan Hash:</span>
              <code className="threat-hash-code">
                {threatReport.hash.slice(0, 16)}...
              </code>
            </div>
          </div>

          <div className="threat-privacy-notice">
            🔒 <strong>Tam Gizlilik Koruması:</strong> Dosyanız cihazınızdan
            asla çıkmadı. Sadece yerel özet SHA-256 imzası sorgulandı.
          </div>
        </div>
      )}
    </div>
  );
}
