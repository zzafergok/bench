import type { Mode } from '@/types';
import { Button } from '@/components/core/button';

export type CategoryId = 'pdf' | 'media' | 'data' | 'security';

export interface ToolDef {
  id: Mode;
  label: string;
  badge?: string;
}

export interface CategoryDef {
  id: CategoryId;
  label: string;
  badge?: string;
  tools: ToolDef[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: 'pdf',
    label: 'PDF Araçları',
    tools: [
      { id: 'compress', label: 'PDF Sıkıştır' },
      { id: 'merge', label: 'PDF Birleştir' },
      { id: 'images', label: 'PDF → Görsel' },
    ],
  },
  {
    id: 'media',
    label: 'Görsel',
    tools: [{ id: 'imageOptimize', label: 'Görsel Sıkıştır' }],
  },
  {
    id: 'data',
    label: 'Doküman & Veri',
    tools: [
      { id: 'markdown', label: 'Belge → Markdown' },
      { id: 'data', label: 'CSV / JSON / YAML' },
    ],
  },
  {
    id: 'security',
    label: 'Güvenlik',
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
    <div className="grouped-nav-container">
      {/* Kategori Düzeyinde Sekmeler */}
      <div
        className="category-tabs"
        role="tablist"
        aria-label="Araç kategorileri"
      >
        {CATEGORIES.map((cat) => {
          const isCatActive = cat.id === activeCategory.id;
          const badgeText = cat.badge ?? `${cat.tools.length} Araç`;

          return (
            <Button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isCatActive}
              className={`category-tab-btn ${isCatActive ? 'is-active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
              disabled={disabled}
            >
              <span className="cat-label">{cat.label}</span>
              <span className="cat-badge">{badgeText}</span>
            </Button>
          );
        })}
      </div>

      {/* Aktif Kategorinin Alt Araçları */}
      <div className="submode-switch-wrapper">
        <div
          className="mode-switch"
          role="tablist"
          aria-label="Kategori alt araçları"
        >
          {activeCategory.tools.map((tool) => {
            const isToolActive = tool.id === mode;
            return (
              <Button
                key={tool.id}
                type="button"
                role="tab"
                aria-selected={isToolActive}
                className={isToolActive ? 'is-active' : ''}
                onClick={() => onChangeMode(tool.id)}
                disabled={disabled}
              >
                <span className="tab-indicator" />
                {tool.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
