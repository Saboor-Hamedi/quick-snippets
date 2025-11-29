## Objective
Remove all theme persistence from settings (JSON), standardize the app to a single all‑black theme, and simplify `ThemeModal` UI with neutral, readable text and no accent colors.

## Scope
- Remove settings-backed theme loading/saving.
- Use a single global black theme (background) with readable light text.
- Remove/neutralize accent colors across UI.
- Keep `ThemeModal` minimal and clean.

## Files to Update
- `src/renderer/src/components/ThemeComponent.jsx` (persistence removal, enforce dark)
- `src/renderer/src/components/ThemeModal.jsx` (simplify modal UI)
- Global CSS variables:
  - `src/renderer/src/assets/index.css`
  - `src/renderer/src/assets/base.css`
  - `src/renderer/src/assets/css/variables.css`
- Accent references in CSS:
  - `src/renderer/src/assets/css/modals.css`
  - `src/renderer/src/assets/css/header.css`
  - `src/renderer/src/assets/css/forms.css`
  - `src/renderer/src/assets/css/snippets.css`
  - `src/renderer/src/assets/toggle-theme.css`
  - `src/renderer/src/assets/button-style.css`
  - `src/renderer/src/assets/css/layout-secondary.css`

## Implementation Steps
### 1) Remove JSON Settings Theme Persistence
- In `ThemeComponent.jsx`, delete `window.api.getSetting('theme')` and `window.api.saveSetting('theme')` usages.
- Set a fixed theme on mount:
  - Force `document.documentElement.classList.add('dark')`.
  - Set `data-theme` to `dark` or `black` and stop switching.
- Optionally remove the local `themes` list if it is only used for switching.

### 2) Standardize Global Colors to All Black
- In `index.css` / `base.css` / `variables.css`:
  - Set `--color-background`, `--color-background-soft`, `--color-background-mute` to `#181d27` (consistent with your prior request).
  - Set `--color-text` (global) and text variables to readable soft light grays (e.g., `#e5e7eb`, `#cbd5e1`).
  - Set `--ev-c-accent` and `--color-accent-*` to `transparent` or remove references; where required, fallback to neutral gray borders/backgrounds.

### 3) Remove Accent Usage Across CSS
- Replace accent-based backgrounds/borders with neutral blacks/grays in:
  - `modals.css`, `header.css`, `forms.css`, `snippets.css`, `toggle-theme.css`, `button-style.css`, `layout-secondary.css`.
- Replace gradients (`linear-gradient(... accent ...)`) with solid neutral shades.
- Adjust hover states to subtle lightening/darkening of gray (no color pops).

### 4) Simplify ThemeModal
- In `ThemeModal.jsx`:
  - Remove any accent color badges, theme cards with accent swatches, and interactive theme pickers.
  - Use a clean black background (`#181d27`) with soft light text.
  - Keep minimal typography (medium weight for titles, normal weight for body) and accessible contrast.
  - Buttons: neutral gray backgrounds and borders; text as `#e5e7eb`.

### 5) Sanity Check & Adjust Readability
- Ensure headings (`h1/h2/h3`) use shades of light gray that are readable but not stark white.
- Use `font-medium` for titles; avoid overly bold white.
- Confirm Tailwind `dark:` classes still apply correctly.

## Verification
- Run the app and confirm:
  - No theme switching controls or persistence calls occur.
  - All backgrounds are `#181d27` with readable light text.
  - No accent color remains in buttons, borders, or highlights.
  - `ThemeModal` shows a minimal black UI without color accents.

## Notes
- Removing persistence means the app will always render in the black theme on start.
- If any leftover module still uses accent variables, we will migrate them to the neutral palette during implementation.

## Approval
If this plan matches your intent, I will implement these changes and verify the UI across main screens and the modal.