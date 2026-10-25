import { Button } from '@/components/core/button';
import { Spinner } from '@/components/core/spinner';
import type { ThreatReport } from '@/types';
import { cn } from '@/lib/utils/classnames';

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
  const statusStyles = threatReport && {
    clean: {
      card: 'border-green-500/35 bg-linear-to-b from-green-500/5 to-black/40',
      badge: 'border border-green-500/40 bg-green-500/15 text-green-400',
    },
    unknown: {
      card: 'border-blue-500/30 bg-linear-to-b from-blue-500/4 to-black/40',
      badge: 'border border-slate-400/30 bg-slate-400/15 text-slate-400',
    },
    suspicious: {
      card: 'border-yellow-500/40 bg-linear-to-b from-yellow-500/8 to-black/40',
      badge: 'border border-yellow-500/40 bg-yellow-500/15 text-yellow-300',
    },
    malicious: {
      card: 'border-red-500/50 bg-linear-to-b from-red-500/10 to-black/40',
      badge: 'border border-red-500/50 bg-red-500/20 text-red-400',
    },
  };

  return (
    <div className="my-3">
      {!threatReport && !threatLoading && (
        <div className="flex items-center justify-between gap-4 rounded-sm border border-dashed border-card-border bg-white/2 px-3 py-3">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 text-[0.8rem] font-bold text-text-primary">
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
            <p className="mt-0.75 text-[0.7rem] leading-[1.4] text-text-muted">
              Dosyanız dışarıya yüklenmez; yalnızca SHA-256 hash dizesi genel
              tehdit ve açık kaynak veritabanlarıyla (CIRCL / VirusTotal)
              karşılaştırılır.
            </p>
          </div>
          <Button
            type="button"
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm border border-green-500/35 bg-green-500/12 px-3.5 py-2 text-[0.75rem] font-semibold text-green-400 transition-all hover:border-green-400 hover:bg-green-500/20"
            onClick={() => onCheckThreat(sha256)}
            disabled={threatLoading}
          >
            🛡️ Tehdit Kontrolü Yap
          </Button>
        </div>
      )}

      {threatLoading && (
        <div className="flex items-center gap-2.5 rounded-sm border border-card-border bg-white/3 p-3 text-[0.75rem] text-text-secondary">
          <Spinner className="size-3.75 border-2 border-accent-text/25 border-t-accent-text" />
          <span>
            Açık tehdit istihbaratı veritabanları taranıyor (CIRCL / VT)…
          </span>
        </div>
      )}

      {threatError && (
        <div
          className="flex items-center justify-between rounded-sm border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-[0.75rem] text-red-400"
          role="alert"
        >
          <span>⚠️ {threatError}</span>
          <Button
            type="button"
            className="cursor-pointer rounded border border-red-500/40 bg-transparent px-2 py-0.75 text-[0.7rem] text-red-400"
            onClick={() => onCheckThreat(sha256)}
          >
            Tekrar Dene
          </Button>
        </div>
      )}

      {threatReport && (
        <div
          className={cn(
            'rounded-sm border border-card-border bg-black/35 p-3.5',
            statusStyles?.[threatReport.status].card,
          )}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  'rounded-full px-2 py-0.75 text-[0.72rem] font-bold',
                  statusStyles?.[threatReport.status].badge,
                )}
              >
                {threatReport.status === 'clean' &&
                  '✓ Doğrulanmış Güvenli Kayıt'}
                {threatReport.status === 'unknown' &&
                  'ℹ️ Bilinmeyen / Özel Dosya'}
                {threatReport.status === 'suspicious' &&
                  '⚠️ Şüpheli / Riskli Kayıt'}
                {threatReport.status === 'malicious' &&
                  '⛔ ZARARLI TEHDİT TESPİT EDİLDİ'}
              </span>
              <span className="font-mono text-[0.65rem] text-text-muted">
                Kaynak: {threatReport.provider.toUpperCase()}
              </span>
              {threatReport.quota && (
                <span
                  className="rounded-full border border-accent/30 bg-accent/12 px-1.75 py-0.5 font-mono text-[0.65rem] font-bold text-accent"
                  title="Günlük kullanılan / izin verilen VirusTotal kotası"
                >
                  📊 Kota: {threatReport.quota.dailyUsed} /{' '}
                  {threatReport.quota.dailyAllowed}
                </span>
              )}
            </div>
            <Button
              type="button"
              className="cursor-pointer rounded border border-card-border bg-white/5 px-2 py-0.75 text-[0.68rem] text-text-secondary"
              onClick={() => onCheckThreat(sha256)}
              title="Yeniden sorgula"
            >
              Yenile
            </Button>
          </div>

          <p className="mb-2.5 text-[0.8rem] font-semibold text-text-primary">
            {threatReport.reputation}
          </p>

          <div className="mb-2 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2 rounded bg-black/30 px-2.5 py-2 text-[0.72rem]">
            {threatReport.fileName && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.65rem] uppercase text-text-muted">
                  Eşleşen Yazılım:
                </span>
                <span className="break-all font-semibold text-text-primary">
                  {threatReport.fileName}
                </span>
              </div>
            )}
            {threatReport.database && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.65rem] uppercase text-text-muted">
                  Veritabanı:
                </span>
                <span className="break-all font-semibold text-text-primary">
                  {threatReport.database}
                </span>
              </div>
            )}
            {typeof threatReport.trustScore === 'number' && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.65rem] uppercase text-text-muted">
                  Güvenilirlik Skoru:
                </span>
                <span className="break-all font-semibold text-text-primary">
                  %{threatReport.trustScore}
                </span>
              </div>
            )}
            {threatReport.stats && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.65rem] uppercase text-text-muted">
                  Antivirüs Taraması:
                </span>
                <span className="break-all font-semibold text-text-primary">
                  {threatReport.stats.malicious} zararlı /{' '}
                  {threatReport.stats.harmless + threatReport.stats.undetected}{' '}
                  temiz
                </span>
              </div>
            )}
            {threatReport.quota && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.65rem] uppercase text-text-muted">
                  Kalan Günlük Kota:
                </span>
                <span className="break-all font-semibold text-text-primary">
                  {Math.max(
                    0,
                    threatReport.quota.dailyAllowed -
                      threatReport.quota.dailyUsed,
                  )}{' '}
                  / {threatReport.quota.dailyAllowed} hak
                </span>
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              <span className="text-[0.65rem] uppercase text-text-muted">
                Sorgulanan Hash:
              </span>
              <code className="font-mono font-semibold text-accent">
                {threatReport.hash.slice(0, 16)}...
              </code>
            </div>
          </div>

          <div className="mt-1.5 border-t border-white/5 pt-2 text-[0.68rem] text-text-muted">
            🔒 <strong>Tam Gizlilik Koruması:</strong> Dosyanız cihazınızdan
            asla çıkmadı. Sadece yerel özet SHA-256 imzası sorgulandı.
          </div>
        </div>
      )}
    </div>
  );
}
