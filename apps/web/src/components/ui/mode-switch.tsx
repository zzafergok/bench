import type { ComponentType } from 'react';
import type { Mode } from '@/types';
import { Button } from '@/components/core/button';
import {
  FileText,
  Image as ImageIcon,
  FileCode2,
  Shield,
  ChevronRight,
} from 'lucide-react';

export type CategoryId = 'pdf' | 'media' | 'data' | 'security';

export interface ToolDef {
  id: Mode;
  label: string;
  badge?: string;
}

export interface CategoryDef {
  id: CategoryId;
  label: string;
  icon: ComponentType<{ className?: string }>;
  badge?: string;
  tools: ToolDef[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: 'pdf',
    label: 'PDF Araçları',
    icon: FileText,
    tools: [
      { id: 'compress', label: 'PDF Sıkıştır' },
      { id: 'merge', label: 'PDF Birleştir' },
      { id: 'images', label: 'PDF → Görsel' },
    ],
  },
  {
    id: 'media',
    label: 'Görsel',
    icon: ImageIcon,
    tools: [{ id: 'imageOptimize', label: 'Görsel Sıkıştır' }],
  },
  {
    id: 'data',
    label: 'Doküman & Veri',
    icon: FileCode2,
    tools: [
      { id: 'markdown', label: 'Belge → Markdown' },
      { id: 'data', label: 'CSV / JSON / YAML' },
    ],
  },
  {
    id: 'security',
    label: 'Güvenlik',
    icon: Shield,
    tools: [{ id: 'crypto', label: 'Kripto Kasa & Hash' }],
  },
];

interface ModeSwitchProps {
  mode: Mode;
  disabled: boolean;
  onChangeMode: (mode: Mode) => void;
}

export function ModeSwitch({ mode, disabled, onChangeMode }: ModeSwitchProps) {
  const activeCategory =
    CATEGORIES.find((cat) => cat.tools.some((t) => t.id === mode)) ||
    CATEGORIES[0];

  const handleCategoryClick = (cat: CategoryDef) => {
    if (disabled || cat.id === activeCategory.id) return;
    onChangeMode(cat.tools[0].id);
  };

  return (
    <div className="mt-3 flex w-full flex-col items-center gap-1.5">
      {/* 1. SEVİYE: Ana Kategoriler Sekmesi */}
      <div
        className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-card-border/80 bg-white/2.5 p-1 backdrop-blur-sm whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Ana kategoriler"
      >
        {CATEGORIES.map((cat) => {
          const isCatActive = cat.id === activeCategory.id;
          const IconComponent = cat.icon;
          const count = cat.tools.length;

          return (
            <Button
              key={cat.id}
              type="button"
              variant="ghost"
              role="tab"
              aria-selected={isCatActive}
              className={`h-auto shrink-0 gap-1.5 rounded-lg border px-2.5 py-1.25 text-[0.72rem] leading-none font-medium transition-all ${
                isCatActive
                  ? 'border-white/12 bg-white/10 text-text-primary shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:bg-white/10'
                  : 'border-transparent text-text-muted hover:border-white/6 hover:bg-white/4 hover:text-text-primary'
              }`}
              onClick={() => handleCategoryClick(cat)}
              disabled={disabled}
            >
              <IconComponent
                className={`size-3.5 shrink-0 ${isCatActive ? 'text-accent' : 'opacity-60'}`}
              />
              <span>{cat.label}</span>
              <span
                className={`ml-0.5 rounded px-1 py-0.25 font-mono text-[0.58rem] leading-none ${
                  isCatActive
                    ? 'bg-accent/15 text-accent font-semibold'
                    : 'bg-white/5 text-text-muted'
                }`}
              >
                {count}
              </span>
            </Button>
          );
        })}
      </div>

      {/* 2. SEVİYE: Seçili Kategoriye Bağlı Alt Araçlar (Hiyerarşik Alt Çubuk) */}
      <div className="flex max-w-full items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          className="inline-flex items-center gap-1 rounded-full border border-card-border bg-bg-surface/95 p-1 shadow-[0_4px_16px_rgba(0,0,0,0.3)] whitespace-nowrap"
          role="tablist"
          aria-label={`${activeCategory.label} alt araçları`}
        >
          {/* Bağlam / Kategori İpuç etiketi */}
          <div className="flex items-center gap-1 pl-2.5 pr-1 text-[0.66rem] font-medium text-text-muted select-none">
            <span>{activeCategory.label}</span>
            <ChevronRight className="size-3 opacity-40" />
          </div>

          {/* Alt araç butonları */}
          <div className="flex items-center gap-0.5">
            {activeCategory.tools.map((tool) => {
              const isToolActive = tool.id === mode;
              return (
                <Button
                  key={tool.id}
                  type="button"
                  variant="ghost"
                  role="tab"
                  aria-selected={isToolActive}
                  className={`h-auto shrink-0 gap-1.5 rounded-full border-0 px-2.75 py-1 text-[0.7rem] leading-4 font-medium transition-all ${
                    isToolActive
                      ? 'bg-accent text-accent-text font-semibold shadow-[0_2px_8px_var(--accent-glow)] hover:bg-accent-hover hover:text-accent-text'
                      : 'text-text-secondary hover:bg-white/6 hover:text-text-primary'
                  }`}
                  onClick={() => onChangeMode(tool.id)}
                  disabled={disabled}
                >
                  <span
                    className={`size-1.25 shrink-0 rounded-full ${
                      isToolActive ? 'bg-current' : 'bg-text-muted/60'
                    }`}
                  />
                  {tool.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
