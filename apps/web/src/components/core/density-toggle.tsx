'use client';

import { AlignJustify, Rows3 } from 'lucide-react';
import { Button } from '@/components/core/button';
import { useCurrentLocale } from '@/components/providers/client-locale-provider';

export type DensityMode = 'compact' | 'detailed';

interface DensityToggleProps {
  value: DensityMode;
  onValueChange: (value: DensityMode) => void;
  label?: string;
}

const defaultLabels = {
  tr: {
    label: 'Görünüm Yoğunluğu',
    compact: 'Kompakt',
    detailed: 'Detaylı',
  },
  en: {
    label: 'View Density',
    compact: 'Compact',
    detailed: 'Detailed',
  },
};

export function DensityToggle({
  value,
  onValueChange,
  label,
}: DensityToggleProps) {
  const locale = useCurrentLocale();
  const copy = defaultLabels[locale === 'tr' ? 'tr' : 'en'];
  const toggleLabel = label ?? copy.label;

  return (
    <div
      role="group"
      aria-label={toggleLabel}
      className="inline-flex border border-gunmetal bg-void-black"
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onValueChange('compact')}
        aria-pressed={value === 'compact'}
        className={`h-9 gap-2 rounded-none border-r border-gunmetal px-3 font-mono text-2xs font-bold uppercase ${
          value === 'compact'
            ? 'bg-tulpar-blue text-white hover:bg-tulpar-blue/90'
            : 'text-titanium hover:bg-gunmetal/30'
        }`}
      >
        <Rows3 className="h-3.5 w-3.5" aria-hidden="true" />
        {copy.compact}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onValueChange('detailed')}
        aria-pressed={value === 'detailed'}
        className={`h-9 gap-2 rounded-none px-3 font-mono text-2xs font-bold uppercase ${
          value === 'detailed'
            ? 'bg-tulpar-blue text-white hover:bg-tulpar-blue/90'
            : 'text-titanium hover:bg-gunmetal/30'
        }`}
      >
        <AlignJustify className="h-3.5 w-3.5" aria-hidden="true" />
        {copy.detailed}
      </Button>
    </div>
  );
}
