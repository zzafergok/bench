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
    <div className="flex min-h-dvh w-full items-center justify-center bg-bg-deep p-6">
      <main
        className="flex w-full max-w-120 flex-col items-center gap-5 rounded-lg border border-card-border bg-card-bg px-7.5 py-9 text-center shadow-[0_24px_48px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-lg"
        role="alert"
      >
        <div className="grid size-15 place-items-center rounded-full border border-red-500/28 bg-red-500/12 text-red-500 shadow-[0_0_24px_rgba(239,68,68,0.18)] [&_svg]:size-7">
          <AlertTriangleIcon />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1
            id="page-title"
            className="m-0 text-[1.35rem] font-bold tracking-[-0.02em] text-text-primary"
          >
            Beklenmeyen bir hata oluştu
          </h1>
          <p className="m-0 max-w-95 text-[0.88rem] leading-normal text-text-secondary">
            Sayfa yüklenirken bir sorun çıktı veya bir işlem yarıda kaldı.
            Lütfen tekrar deneyin.
          </p>
          {error?.message && (
            <div className="mt-1.5 max-w-full overflow-x-auto rounded-sm border border-card-border bg-black/35 px-3 py-2 [&_code]:break-all [&_code]:font-mono [&_code]:text-[0.75rem] [&_code]:text-danger-text">
              <code>{error.message}</code>
            </div>
          )}
        </div>

        <div className="mt-1.5 flex w-full flex-wrap items-center justify-center gap-3">
          <Button
            type="button"
            className="inline-flex min-h-11 w-auto items-center justify-center gap-2 rounded-md bg-accent px-4 text-[0.88rem] font-bold text-accent-text transition hover:bg-accent-hover"
            onClick={reset}
          >
            <RefreshIcon />
            <span>Tekrar dene</span>
          </Button>
          <Link
            href="/"
            className="inline-flex min-h-11 w-auto items-center justify-center gap-2 rounded-md border border-card-border bg-transparent px-4 text-[0.88rem] font-bold text-text-primary transition hover:border-card-border-hover hover:bg-white/5"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </main>
    </div>
  );
}
