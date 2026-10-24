import { ShieldCheckIcon } from './icons';
import { profiles, type Profile } from '@/types';
import { Input } from '@/components/core/input';
import { Label } from '@/components/core/label';

interface CompressOptionsProps {
  profile: Profile;
  stripMetadata: boolean;
  disabled: boolean;
  onChangeProfile: (profile: Profile) => void;
  onToggleStripMetadata: (val: boolean) => void;
}

export function CompressOptions({
  profile,
  stripMetadata,
  disabled,
  onChangeProfile,
  onToggleStripMetadata,
}: CompressOptionsProps) {
  return (
    <>
      <fieldset className="profile-group" disabled={disabled}>
        <legend>Sıkıştırma düzeyi</legend>
        <div className="profile-options">
          {(Object.keys(profiles) as Profile[]).map((profileKey) => (
            <Label
              key={profileKey}
              className={`profile-option ${profile === profileKey ? 'is-selected' : ''}`}
            >
              <Input
                type="radio"
                name="profile"
                value={profileKey}
                checked={profile === profileKey}
                onChange={() => onChangeProfile(profileKey)}
              />
              <span>
                <strong>{profiles[profileKey].title}</strong>
                <small>{profiles[profileKey].description}</small>
              </span>
            </Label>
          ))}
        </div>
      </fieldset>

      <div className="privacy-option-wrapper">
        <Label
          className={`privacy-toggle-label ${stripMetadata ? 'is-active' : ''}`}
        >
          <Input
            type="checkbox"
            checked={stripMetadata}
            onChange={(e) => onToggleStripMetadata(e.target.checked)}
            disabled={disabled}
          />
          <span className="privacy-toggle-icon">
            <ShieldCheckIcon />
          </span>
          <span className="privacy-toggle-text">
            <strong>Hassas Meta Verileri Temizle (Gizlilik Koruması)</strong>
            <small>
              Yazar adı, düzenleme tarihi ve PDF oluşturan yazılım izlerini
              sıfırlar
            </small>
          </span>
        </Label>
      </div>
    </>
  );
}
