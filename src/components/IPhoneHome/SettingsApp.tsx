import React from "react";
import { usePhoneShellSettings } from "../../theme/PhoneShellSettingsProvider";
import { useTheme } from "../../theme/ThemeProvider";
import {
  isDarkPhoneTheme,
  PHONE_THEME_LIST,
  type PhoneThemeId,
} from "../../theme/phoneThemes";
import "./SettingsApp.css";

type SettingsAppProps = {
  onClose: () => void;
};

const SettingsApp: React.FC<SettingsAppProps> = ({ onClose }) => {
  const { theme, setTheme } = useTheme();
  const { display, updateDisplay } = usePhoneShellSettings();
  const showDarkOptions = isDarkPhoneTheme(theme);

  const pickTheme = (id: PhoneThemeId, event: React.MouseEvent<HTMLButtonElement>) => {
    const screen = event.currentTarget.closest(".iphone-device__screen");
    if (!screen) {
      setTheme(id);
      return;
    }
    const button = event.currentTarget.getBoundingClientRect();
    const bounds = screen.getBoundingClientRect();
    const xPct = ((button.left + button.width / 2 - bounds.left) / bounds.width) * 100;
    const yPct = ((button.top + button.height / 2 - bounds.top) / bounds.height) * 100;
    setTheme(id, { xPct, yPct });
  };

  return (
    <div className="iphone-settings">
      <header className="iphone-settings__chrome">
        <button
          type="button"
          className="iphone-settings__back"
          onClick={onClose}
        >
          ← Back
        </button>
        <h1 className="iphone-settings__title">Settings</h1>
      </header>

      <div className="iphone-settings__scroll">
        <section
          className="iphone-settings__group"
          aria-labelledby="appearance-heading"
        >
          <h2 id="appearance-heading" className="iphone-settings__group-title">
            Phone appearance
          </h2>
          <div className="iphone-settings__theme-grid" role="radiogroup" aria-label="Theme">
            {PHONE_THEME_LIST.map((opt) => (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={theme === opt.id}
                className={`iphone-settings__theme-chip${
                  theme === opt.id ? " iphone-settings__theme-chip--active" : ""
                }`}
                onClick={(e) => pickTheme(opt.id, e)}
              >
                <span
                  className="iphone-settings__theme-swatch"
                  style={{ background: opt.swatch }}
                  aria-hidden="true"
                />
                <span className="iphone-settings__theme-label">{opt.label}</span>
                <span className="iphone-settings__theme-detail">{opt.detail}</span>
              </button>
            ))}
          </div>
          <p className="iphone-settings__footnote">
            Phone screen only · saved on this device · tap animates from your
            choice
          </p>
        </section>

        {showDarkOptions ? (
          <section
            className="iphone-settings__group"
            aria-labelledby="dark-mode-heading"
          >
            <h2 id="dark-mode-heading" className="iphone-settings__group-title">
              Display
            </h2>
            <div className="iphone-settings__list">
              <ToggleRow
                label="True black"
                detail="Deeper blacks on home and lock"
                checked={display.trueBlack}
                onChange={(checked) => updateDisplay({ trueBlack: checked })}
              />
              <ToggleRow
                label="Reduce transparency"
                detail="Less blur on widgets and dock"
                checked={display.reduceTransparency}
                onChange={(checked) =>
                  updateDisplay({ reduceTransparency: checked })
                }
              />
              <ToggleRow
                label="Reduce motion"
                detail="Less movement on unlock and icons"
                checked={display.reduceMotion}
                onChange={(checked) => updateDisplay({ reduceMotion: checked })}
              />
            </div>
          </section>
        ) : (
          <section
            className="iphone-settings__group"
            aria-labelledby="display-heading"
          >
            <h2 id="display-heading" className="iphone-settings__group-title">
              Display
            </h2>
            <div className="iphone-settings__list">
              <ToggleRow
                label="Reduce motion"
                detail="Less movement on unlock and icons"
                checked={display.reduceMotion}
                onChange={(checked) => updateDisplay({ reduceMotion: checked })}
              />
            </div>
          </section>
        )}

        <section
          className="iphone-settings__group"
          aria-labelledby="general-heading"
        >
          <h2 id="general-heading" className="iphone-settings__group-title">
            General
          </h2>
          <div className="iphone-settings__list">
            <div className="iphone-settings__row iphone-settings__row--static">
              <span className="iphone-settings__row-label-inline">Version</span>
              <span className="iphone-settings__row-value">1.0</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

function ToggleRow({
  label,
  detail,
  checked,
  onChange,
}: {
  label: string;
  detail: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="iphone-settings__row">
      <div className="iphone-settings__row-copy">
        <span className="iphone-settings__row-label-inline">{label}</span>
        <span className="iphone-settings__row-detail">{detail}</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`iphone-settings__switch${
          checked ? " iphone-settings__switch--on" : ""
        }`}
        onClick={() => onChange(!checked)}
      >
        <span className="iphone-settings__switch-knob" aria-hidden="true" />
      </button>
    </div>
  );
}

export default SettingsApp;