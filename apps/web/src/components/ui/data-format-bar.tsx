import { SwapIcon, LockIcon } from './core-icons';
import { Label } from '@/components/core/label';
import { DATA_FORMATS, type DataFormat } from '@/constants/data-convert';

interface DataFormatBarProps {
  sourceFormat: DataFormat;
  targetFormat: DataFormat;
  isSourceDisabled?: boolean;
  onSourceChange: (fmt: DataFormat) => void;
  onTargetChange: (fmt: DataFormat) => void;
}

interface FormatPillsProps {
  label: string;
  ariaLabel: string;
  keyPrefix: string;
  selected: DataFormat;
  disabled?: boolean;
  disabledFormat?: DataFormat;
  disabledTooltip?: string;
  isLocked?: boolean;
  onSelect: (fmt: DataFormat) => void;
}

function FormatPills({
  label,
  ariaLabel,
  keyPrefix,
  selected,
  disabled = false,
  disabledFormat,
  disabledTooltip,
  isLocked = false,
  onSelect,
}: FormatPillsProps) {
  return (
    <div className="format-select-group">
      <div className="format-label-row">
        <Label className="option-label">{label}</Label>
        {isLocked && (
          <span
            className="format-locked-badge"
            title="Kaynak format yüklenen dosyaya göre otomatik kilitlendi. Değiştirmek için dosyayı kaldırın."
          >
            <LockIcon />
            <span>Kilitli</span>
          </span>
        )}
      </div>
      <div className="format-pills" role="radiogroup" aria-label={ariaLabel}>
        {DATA_FORMATS.map((f) => {
          const isSelected = selected === f;
          const isButtonDisabled = disabled || f === disabledFormat;
          const tooltip =
            disabled && disabledTooltip
              ? disabledTooltip
              : f === disabledFormat
                ? 'Kaynak ve hedef format aynı olamaz'
                : undefined;

          return (
            <button
              key={`${keyPrefix}-${f}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isButtonDisabled}
              title={tooltip}
              className={`format-pill ${isSelected ? 'is-active' : ''}`}
              onClick={() => onSelect(f)}
            >
              {f.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DataFormatBar({
  sourceFormat,
  targetFormat,
  isSourceDisabled = false,
  onSourceChange,
  onTargetChange,
}: DataFormatBarProps) {
  const handleSwap = () => {
    if (isSourceDisabled) return;
    onSourceChange(targetFormat);
    onTargetChange(sourceFormat);
  };

  return (
    <div className="data-direction-bar">
      <FormatPills
        label="Kaynak Format"
        ariaLabel="Kaynak format"
        keyPrefix="src"
        selected={sourceFormat}
        disabled={isSourceDisabled}
        isLocked={isSourceDisabled}
        disabledTooltip="Kaynak format yüklenen dosyadan belirlendi. Değiştirmek için dosyayı kaldırın."
        onSelect={onSourceChange}
      />

      <button
        type="button"
        className="swap-format-btn"
        onClick={handleSwap}
        disabled={isSourceDisabled}
        title={
          isSourceDisabled
            ? 'Dosya yüklüyken format yönü değiştirilemez (Dosyayı kaldırın)'
            : 'Formatları Değiştir (Yönü Çevir)'
        }
        aria-label="Kaynak ve hedef formatı birbiriyle değiştir"
      >
        <SwapIcon />
      </button>

      <FormatPills
        label="Hedef Format"
        ariaLabel="Hedef format"
        keyPrefix="tgt"
        selected={targetFormat}
        disabledFormat={sourceFormat}
        onSelect={onTargetChange}
      />
    </div>
  );
}
