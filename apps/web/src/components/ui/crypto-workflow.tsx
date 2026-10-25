import { useState } from 'react';
import { DownloadIcon, FileIcon } from './icons';
import { HashIcon, LockIcon, UnlockIcon } from './core-icons';
import { Button } from '@/components/core/button';
import { Label } from '@/components/core/label';
import { Link } from '@/components/core/link';
import { Spinner } from '@/components/core/spinner';
import {
  formatBytes,
  type CryptoResult,
  type JobState,
  type ThreatReport,
} from '@/types';
import { Input } from '@/components/core/input';
import { ThreatLookupCard } from './threat-lookup-card';
import { CryptoChecksumResults } from './crypto-checksum-results';

interface CryptoWorkflowProps {
  files: File[];
  jobState: JobState;
  result: CryptoResult | null;
  action: 'encrypt' | 'decrypt' | 'hash';
  passphrase: string;
  threatLoading: boolean;
  threatReport: ThreatReport | null;
  threatError: string | null;
  onActionChange: (action: 'encrypt' | 'decrypt' | 'hash') => void;
  onPassphraseChange: (p: string) => void;
  onExecute: () => void;
  onCheckThreat: (hash: string) => void;
}

export function CryptoWorkflow({
  files,
  jobState,
  result,
  action,
  passphrase,
  threatLoading,
  threatReport,
  threatError,
  onActionChange,
  onPassphraseChange,
  onExecute,
  onCheckThreat,
}: CryptoWorkflowProps) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHash(label);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch {
      setCopiedHash(null);
    }
  };

  return (
    <div className="workflow">
      <div className="workflow-header">
        <div className="workflow-title-row">
          <span className="workflow-badge">
            <LockIcon />
            Kripto Kasa & Bütünlük
          </span>
          <span className="session-badge">
            <b>{files.length > 0 ? files[0].name : 'Dosya bekleniyor'}</b>
          </span>
        </div>
        <p className="workflow-subtext">
          Dosyalarınızı kimlik doğrulamalı AES-256-GCM ile şifreleyin veya
          SHA-256 / SHA-512 hash bütünlüğünü doğrulayın.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Button
          type="button"
          className={`inline-flex items-center gap-1.5 rounded-sm border px-3.5 py-1.75 text-[0.75rem] font-semibold transition-all [&_svg]:size-3.5 ${action === 'encrypt' ? 'border-accent/40 bg-accent/12 text-accent' : 'border-card-border bg-white/3 text-text-secondary hover:bg-white/6 hover:text-text-primary'}`}
          onClick={() => onActionChange('encrypt')}
        >
          <LockIcon />
          Dosya Şifrele (AES-256)
        </Button>
        <Button
          type="button"
          className={`inline-flex items-center gap-1.5 rounded-sm border px-3.5 py-1.75 text-[0.75rem] font-semibold transition-all [&_svg]:size-3.5 ${action === 'decrypt' ? 'border-accent/40 bg-accent/12 text-accent' : 'border-card-border bg-white/3 text-text-secondary hover:bg-white/6 hover:text-text-primary'}`}
          onClick={() => onActionChange('decrypt')}
        >
          <UnlockIcon />
          Şifre Çöz (.enc)
        </Button>
        <Button
          type="button"
          className={`inline-flex items-center gap-1.5 rounded-sm border px-3.5 py-1.75 text-[0.75rem] font-semibold transition-all [&_svg]:size-3.5 ${action === 'hash' ? 'border-accent/40 bg-accent/12 text-accent' : 'border-card-border bg-white/3 text-text-secondary hover:bg-white/6 hover:text-text-primary'}`}
          onClick={() => onActionChange('hash')}
        >
          <HashIcon />
          Checksum & Hash
        </Button>
      </div>

      {action !== 'hash' && (
        <div className="options-group passphrase-box">
          <Label className="option-label">Güvenlik Parolası</Label>
          <Input
            type="password"
            placeholder={
              action === 'encrypt'
                ? 'En az 12 karakterli güçlü bir parola girin'
                : 'Şifreleme parolasını girin'
            }
            value={passphrase}
            onChange={(e) => onPassphraseChange(e.target.value)}
            className="text-input"
          />
          <small className="mt-1 block text-[0.72rem] text-text-muted">
            {action === 'encrypt'
              ? 'Şifrelenen dosya bu parola olmadan kesinlikle açılamaz. Parolanızı kaybetmeyin.'
              : 'Dosyayı şifrelerken kullandığınız parolayı girin.'}
          </small>
        </div>
      )}

      {files.length > 0 && (
        <div className="file-list" aria-label="Seçilen dosya">
          <div className="selected-file">
            <span className="file-icon">
              <FileIcon />
            </span>
            <span className="file-details">
              <strong>{files[0].name}</strong>
              <small>{formatBytes(files[0].size)}</small>
            </span>
          </div>
        </div>
      )}

      {result?.checksums && (
        <CryptoChecksumResults
          checksums={result.checksums}
          copiedHash={copiedHash}
          onCopy={copyToClipboard}
        />
      )}

      {result?.checksums && (
        <ThreatLookupCard
          sha256={result.checksums.sha256}
          threatLoading={threatLoading}
          threatReport={threatReport}
          threatError={threatError}
          onCheckThreat={onCheckThreat}
        />
      )}

      {result?.url && (
        <div className="success-panel" role="status">
          <div>
            <span className="check">✓</span>
            <span>
              <strong>
                {action === 'encrypt'
                  ? 'Dosya Başarıyla Şifrelendi'
                  : 'Şifre Başarıyla Çözüldü'}
              </strong>
              <small>
                Sonuç Boyutu: {formatBytes(result.resultBytes || 0)}
              </small>
            </span>
          </div>
          <Link
            href={result.url}
            download={result.downloadName}
            className="download-button"
          >
            <DownloadIcon />
            {result.downloadName} İndir
          </Link>
        </div>
      )}

      {!result && (
        <Button
          type="button"
          className="primary-button"
          onClick={onExecute}
          disabled={
            files.length === 0 ||
            jobState === 'processing' ||
            (action === 'encrypt' && passphrase.length < 12) ||
            (action === 'decrypt' && passphrase.length === 0)
          }
        >
          {jobState === 'processing' ? (
            <>
              <Spinner className="spinner" />
              İşlem Yürütülüyor…
            </>
          ) : action === 'encrypt' ? (
            'AES-256-GCM ile Şifrele'
          ) : action === 'decrypt' ? (
            'Dosya Şifresini Çöz'
          ) : (
            'Hash Checksum Hesapla'
          )}
        </Button>
      )}
    </div>
  );
}
