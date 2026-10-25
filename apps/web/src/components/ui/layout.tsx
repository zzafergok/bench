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
    <section aria-labelledby="page-title">
      <p className="mb-1 font-mono text-[0.66rem] font-semibold tracking-[0.16em] text-accent/90 uppercase">
        {mode === 'compress' && 'LOCAL & PRIVATE PDF ENGINE'}
        {mode === 'markdown' && 'DOCUMENTS TO AI-READY MARKDOWN'}
        {mode === 'merge' && 'LOCAL & FAST PDF MERGER'}
        {mode === 'images' && 'LOCAL PDF TO IMAGES'}
        {mode === 'imageOptimize' && 'LOCAL & PRIVATE IMAGE COMPRESSOR'}
        {mode === 'crypto' && 'AES-256 VAULT & FILE INTEGRITY'}
        {mode === 'data' && 'STRUCTURED DATA CONVERTER'}
      </p>
      <h1
        id="page-title"
        className="text-[clamp(1.5rem,3.2vw,2rem)] leading-[1.2] font-bold tracking-[-0.035em] text-text-primary [&_em]:font-serif [&_em]:text-accent [&_em]:font-normal"
      >
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
      <p className="mx-auto mt-1 mb-2.5 max-w-120 text-[0.8rem] leading-relaxed text-text-muted">
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
    <header className="flex items-center justify-between border-b border-white/5 pb-3">
      <Link
        className="inline-flex items-center gap-2.5 text-[1.15rem] font-bold tracking-[-0.03em] text-text-primary no-underline"
        href="/"
        aria-label="Bench ana sayfa"
      >
        <span className="grid size-7 place-items-center rounded-[7px_7px_7px_2px] bg-accent text-[0.95rem] font-extrabold text-accent-text">
          B
        </span>
        <span className="font-bold">Bench</span>
      </Link>
      <div className="flex items-center gap-2">
        {currentStats && currentStats.filesProcessed > 0 && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-white/4 px-3 py-0.75 font-mono text-[0.68rem] text-text-secondary [&_b]:text-accent"
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
          className={`inline-flex items-center gap-2 rounded-full border border-card-border bg-white/4 px-3 py-0.75 font-mono text-[0.72rem] font-medium tracking-wider text-text-secondary ${engineStatus === 'offline' ? '[&>span]:bg-[#ff6b6b] [&>span]:shadow-[0_0_8px_rgba(255,107,107,0.7)]' : engineStatus === 'checking' || engineStatus === 'degraded' ? '[&>span]:bg-[#f6c85f] [&>span]:shadow-[0_0_8px_rgba(246,200,95,0.7)]' : ''}`}
          role="status"
          aria-live="polite"
        >
          <span className="size-1.75 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
          {statusLabel}
        </span>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 pt-3.5">
      <div
        className="flex items-center justify-center gap-4 text-[0.74rem] text-text-muted [&_span]:inline-flex [&_span]:items-center [&_span]:gap-1.5 [&_b]:font-mono [&_b]:text-[0.7rem] [&_b]:text-accent"
        aria-label="Gizlilik taahhütleri"
      >
        <span>
          <b>01</b> Sıfır Bulut Transferi
        </span>
        <span className="text-white/15">•</span>
        <span>
          <b>02</b> Anlık Geçici Temizlik
        </span>
        <span className="text-white/15">•</span>
        <span>
          <b>03</b> Açık & Yerel Kaynak
        </span>
      </div>
    </footer>
  );
}
