import { useState } from 'react';
import { ShieldCheckIcon, SlidersIcon, ChevronDownIcon } from './icons';
import { imageProfiles, type Profile } from '@/types';
import { Input } from '@/components/core/input';
import { Label } from '@/components/core/label';

interface ImageCompressOptionsProps {
  profile: Profile;
  stripExif: boolean;
  format: 'webp' | 'avif' | 'jpeg' | 'png';
  quality: number;
  maxWidth: string;
  disabled: boolean;
  onChangeProfile: (profile: Profile) => void;
  onToggleStripExif: (val: boolean) => void;
  onFormatChange: (fmt: 'webp' | 'avif' | 'jpeg' | 'png') => void;
  onQualityChange: (q: number) => void;
  onMaxWidthChange: (w: string) => void;
}

export function ImageCompressOptions({
  profile,
  stripExif,
  format,
  quality,
  maxWidth,
  disabled,
  onChangeProfile,
  onToggleStripExif,
  onFormatChange,
  onQualityChange,
  onMaxWidthChange,
}: ImageCompressOptionsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const formats: Array<'webp' | 'avif' | 'jpeg' | 'png'> = [
    'webp',
    'avif',
    'jpeg',
    'png',
  ];

  return (
    <>
      <fieldset className="profile-group" disabled={disabled}>
        <legend>Sıkıştırma düzeyi</legend>
        <div className="profile-options">
          {(Object.keys(imageProfiles) as Profile[]).map((profileKey) => (
            <Label
              key={profileKey}
              className={`profile-option ${profile === profileKey ? 'is-selected' : ''}`}
            >
              <Input
                type="radio"
                name="image_profile"
                value={profileKey}
                checked={profile === profileKey}
                onChange={() => onChangeProfile(profileKey)}
              />
              <span>
                <strong>{imageProfiles[profileKey].title}</strong>
                <small>{imageProfiles[profileKey].description}</small>
              </span>
            </Label>
          ))}
        </div>
      </fieldset>

      <div className="privacy-option-wrapper">
        <Label
          className={`privacy-toggle-label ${stripExif ? 'is-active' : ''}`}
        >
          <Input
            type="checkbox"
            checked={stripExif}
            onChange={(e) => onToggleStripExif(e.target.checked)}
            disabled={disabled}
          />
          <span className="privacy-toggle-icon">
            <ShieldCheckIcon />
          </span>
          <span className="privacy-toggle-text">
            <strong>
              EXIF & GPS Konum Verilerini Temizle (Gizlilik Koruması)
            </strong>
            <small>
              Fotoğrafın çekildiği konum, cihaz modeli ve çekim tarihlerini
              sıfırlar
            </small>
          </span>
        </Label>
      </div>

      <div
        className={`advanced-settings-wrapper ${showAdvanced ? 'is-open' : ''}`}
      >
        <button
          type="button"
          className="advanced-trigger"
          onClick={() => setShowAdvanced((prev) => !prev)}
          disabled={disabled}
          aria-expanded={showAdvanced}
        >
          <div className="advanced-trigger-left">
            <span className="advanced-icon">
              <SlidersIcon />
            </span>
            <div className="advanced-trigger-text">
              <strong>Gelişmiş Ayarlar</strong>
              <small>Hedef format, özel kalite ve azami piksel genişliği</small>
            </div>
          </div>
          <div className="advanced-trigger-right">
            <span
              className={`chevron-indicator ${showAdvanced ? 'is-open' : ''}`}
            >
              <ChevronDownIcon />
            </span>
          </div>
        </button>

        {showAdvanced && (
          <div className="advanced-content-panel">
            <div className="options-group">
              <Label className="option-label">Hedef Format</Label>
              <div className="format-pills">
                {formats.map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    className={`format-pill ${format === fmt ? 'is-active' : ''}`}
                    onClick={() => onFormatChange(fmt)}
                    disabled={disabled}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="options-group">
              <div className="slider-label-row">
                <Label className="option-label">Özel Kalite Düzeyi</Label>
                <span className="slider-val">%{quality}</span>
              </div>
              <div className="quality-pill-group">
                {[
                  { value: 60, label: '%60', tag: 'Kompakt' },
                  { value: 80, label: '%80', tag: 'Önerilen' },
                  { value: 90, label: '%90', tag: 'Yüksek' },
                ].map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    className={`quality-pill-btn ${quality === preset.value ? 'is-active' : ''}`}
                    onClick={() => onQualityChange(preset.value)}
                    disabled={disabled}
                  >
                    <span className="quality-pill-val">{preset.label}</span>
                    <span className="quality-pill-tag">{preset.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="options-group">
              <Label className="option-label">
                Azami Genişlik (px - Opsiyonel)
              </Label>
              <Input
                type="number"
                placeholder="Örn: 1920 (boş bırakılırsa orijinal kalır)"
                value={maxWidth}
                onChange={(e) => onMaxWidthChange(e.target.value)}
                disabled={disabled}
                className="text-input"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
