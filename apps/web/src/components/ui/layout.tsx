'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/components/core/link';
import { formatBytes, type Mode, type SessionStats } from '@/types';
import { useStorageJson } from '@/hooks/use-storage';
import {
  EMPTY_SESSION_STATS,
  isSessionStats,
} from '@/hooks/use-workflow-state';

type EngineStatus = 'checking' | 'ready' | 'degraded' | 'offline';

function useEngineStatus(): EngineStatus {
  const [status, setStatus] = useState<EngineStatus>('checking');

  useEffect(() => {
    const controller = new AbortController();
    let timer: number | undefined;

    async function checkHealth() {
      try {
        const response = await fetch('/health', { signal: controller.signal });
        if (!response.ok) throw new Error('Health check failed');
        const health = (await response.json()) as {
          ghostscript?: boolean;
          markitdown?: boolean;
        };
        setStatus(
          health.ghostscript && health.markitdown ? 'ready' : 'degraded',
        );
      } catch {
        if (!controller.signal.aborted) setStatus('offline');
      }
      if (!controller.signal.aborted) {
        timer = window.setTimeout(checkHealth, 30_000);
      }
    }

    void checkHealth();
    return () => {
      controller.abort();
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return status;
}

interface HeaderProps {
  mode: Mode;
}

export function Header({ mode }: HeaderProps) {
  return (
    <section className="hero" aria-labelledby="page-title">
      <p className="eyebrow">
        {mode === 'compress' && 'LOCAL & PRIVATE PDF ENGINE'}
        {mode === 'markdown' && 'DOCUMENTS TO AI-READY MARKDOWN'}
        {mode === 'merge' && 'LOCAL & FAST PDF MERGER'}
        {mode === 'images' && 'LOCAL PDF TO IMAGES'}
        {mode === 'imageOptimize' && 'LOCAL & PRIVATE IMAGE COMPRESSOR'}
        {mode === 'crypto' && 'AES-256 VAULT & FILE INTEGRITY'}
        {mode === 'data' && 'STRUCTURED DATA CONVERTER'}
      </p>
      <h1 id="page-title">
        {mode === 'compress' && (
          <>
            PDF’lerini küçült. <em>Gizli kalsın.</em>
          </>
        )}
        {mode === 'markdown' && (
          <>
            Belgelerini Markdown yap. <em>AI-Hazır.</em>
          </>
        )}
        {mode === 'merge' && (
          <>
            PDF’lerini birleştir. <em>Sıralı & Eksiksiz.</em>
          </>
        )}
        {mode === 'images' && (
          <>
            PDF’ini Görsele Dönüştür. <em>Kristal Netlik.</em>
          </>
        )}
        {mode === 'imageOptimize' && (
          <>
            Görsellerini küçült. <em>Kristal netlikte kalsın.</em>
          </>
        )}
        {mode === 'crypto' && (
          <>
            Dosyalarını Şifrele. <em>Kimlik Doğrulamalı AES-256.</em>
          </>
        )}
        {mode === 'data' && (
          <>
            Verilerini Dönüştür. <em>CSV • JSON • YAML.</em>
          </>
        )}
      </h1>
      <p className="hero-copy">
        {mode === 'compress' &&
          'İşlemler tamamen tarayıcın ve kendi bilgisayarındaki yerel Ghostscript motoru üzerinde çalışır. Sıfır bulut transferi.'}
        {mode === 'markdown' &&
          'PDF, Word (.docx), Excel (.xlsx) ve PowerPoint (.pptx) dokümanlarını LLM context ve promptları için temiz Markdown’a dönüştürün.'}
        {mode === 'merge' &&
          'Birden fazla PDF belgesini dilediğin sırada tek tıkla bir araya getir. Tamamen yerel ve hızlı.'}
        {mode === 'images' &&
          'PDF sayfalarını 150 veya 300 DPI çözünürlükte yüksek kaliteli PNG görselleri olarak tek tıkla dışa aktarın.'}
        {mode === 'imageOptimize' &&
          'PNG, JPEG, WebP ve AVIF görsellerinizi kaliteden ödün vermeden yerel Sharp motoru ile sıkıştırın ve EXIF/GPS verilerini temizleyin.'}
        {mode === 'crypto' &&
          'Node.js yerel crypto motoruyla dosyalarınızı parola ile AES-256-GCM şifreleyin veya SHA-256 bütünlüğünü doğrulayın.'}
        {mode === 'data' &&
          'CSV, JSON ve YAML tabloları arasında standartlara uygun yerel format dönüştürme.'}
      </p>
    </section>
  );
}

interface NavbarProps {
  sessionStats?: SessionStats;
}

export function Navbar({ sessionStats }: NavbarProps) {
  const engineStatus = useEngineStatus();
  const [storedStats] = useStorageJson<SessionStats>(
    'bench_stats',
    EMPTY_SESSION_STATS,
    isSessionStats,
  );
  const currentStats = sessionStats ?? storedStats;

  const statusLabel = {
    checking: 'Motor Kontrol Ediliyor',
    ready: 'Yerel Motor Hazır',
    degraded: 'Bazı Motorlar Eksik',
    offline: 'Yerel API Bağlantısı Yok',
  }[engineStatus];

  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="Bench ana sayfa">
        <span className="brand-mark">B</span>
        <span className="brand-name">Bench</span>
      </Link>
      <div className="topbar-right">
        {currentStats && currentStats.filesProcessed > 0 && (
          <span
            className="session-badge"
            title="Mevcut oturumda işlenen toplam hacim"
          >
            <b>{currentStats.filesProcessed}</b> dosya işlendi
            {currentStats.bytesSaved > 0 && (
              <>
                {' '}
                · <b>{formatBytes(currentStats.bytesSaved)}</b> tasarruf
              </>
            )}
          </span>
        )}
        <span
          className={`local-badge is-${engineStatus}`}
          role="status"
          aria-live="polite"
        >
          <span className="pulse-dot" />
          {statusLabel}
        </span>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer-bar">
      <div className="trust-row" aria-label="Gizlilik taahhütleri">
        <span>
          <b>01</b> Sıfır Bulut Transferi
        </span>
        <span className="trust-divider">•</span>
        <span>
          <b>02</b> Anlık Geçici Temizlik
        </span>
        <span className="trust-divider">•</span>
        <span>
          <b>03</b> Açık & Yerel Kaynak
        </span>
      </div>
    </footer>
  );
}
