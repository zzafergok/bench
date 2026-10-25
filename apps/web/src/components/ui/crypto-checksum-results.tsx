import { Button } from '@/components/core/button';

type Checksums = { sha256: string; sha512: string; md5: string };

interface CryptoChecksumResultsProps {
  checksums: Checksums;
  copiedHash: string | null;
  onCopy: (value: string, label: string) => void;
}

const rows: Array<{ key: keyof Checksums; label: string }> = [
  { key: 'sha256', label: 'SHA-256:' },
  { key: 'sha512', label: 'SHA-512:' },
  { key: 'md5', label: 'MD5:' },
];

export function CryptoChecksumResults({
  checksums,
  copiedHash,
  onCopy,
}: CryptoChecksumResultsProps) {
  return (
    <div className="my-3 flex flex-col gap-2 rounded-sm border border-card-border bg-black/40 p-3">
      {rows.map(({ key, label }) => (
        <div
          key={key}
          className="flex items-center gap-2 font-mono text-[0.72rem]"
        >
          <span className="w-16.25 shrink-0 font-bold text-accent">
            {label}
          </span>
          <code className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded bg-white/4 px-1.5 py-0.75 text-[#cbd5e1]">
            {checksums[key]}
          </code>
          <Button
            type="button"
            className="cursor-pointer rounded border border-card-border bg-white/6 px-2 py-0.5 text-[0.68rem] text-text-secondary transition-all hover:border-accent hover:text-text-primary"
            onClick={() => onCopy(checksums[key], key)}
          >
            {copiedHash === key ? 'Kopyalandı' : 'Kopyala'}
          </Button>
        </div>
      ))}
    </div>
  );
}
