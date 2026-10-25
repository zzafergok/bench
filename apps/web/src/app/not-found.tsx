import { Link } from '@/components/core/link';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-bg-deep p-6">
      <main
        className="flex w-full max-w-120 flex-col items-center gap-5 rounded-lg border border-card-border bg-card-bg px-7.5 py-9 text-center shadow-[0_24px_48px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-lg"
        role="region"
        aria-label="Sayfa bulunamadı"
      >
        <div className="grid size-16 place-items-center rounded-full border border-accent/25 bg-accent/8 text-accent">
          <span className="font-mono text-[1.3rem] font-extrabold tracking-[-0.04em]">
            404
          </span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1
            id="page-title"
            className="m-0 text-[1.35rem] font-bold tracking-[-0.02em] text-text-primary"
          >
            Sayfa bulunamadı
          </h1>
          <p className="m-0 max-w-95 text-[0.88rem] leading-normal text-text-secondary">
            Aradığınız sayfa silinmiş, taşınmış veya hiç var olmamış olabilir.
          </p>
        </div>

        <div className="mt-1.5 flex w-full flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 w-auto items-center justify-center gap-2 rounded-md bg-accent px-4 text-[0.88rem] font-bold text-accent-text transition hover:bg-accent-hover"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </main>
    </div>
  );
}
