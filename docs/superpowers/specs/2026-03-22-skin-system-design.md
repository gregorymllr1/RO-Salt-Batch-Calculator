# Skin System Design — RO Salt Batch Calculator

**Date:** 2026-03-22
**Status:** Approved

---

## Problem

The app currently has a single hard-coded teal/indigo color scheme baked into Tailwind utility classes. The user wants a skin switcher that changes colors and visual effects without changing layout or functionality. The Electric Blue dashboard layout (two-column, stat cards, donut chart, table, bar chart) should be the permanent layout, replacing the current SaaS-style layout.

---

## Goals

- Rebuild `index.html` with the dashboard layout from the Electric Blue template as the permanent structure
- Add a dropdown in the header to switch between skins at runtime
- Skins change only colors, glows, shadows, and border effects — not layout or structure
- Selected skin persists across page reloads via `localStorage`
- All existing calculator JavaScript logic is preserved and wired to the new layout

---

## Non-Goals

- No new skins beyond "Original" and "Electric Blue" at this time (though the system must support adding more later)
- No external CSS files or build tooling — stays a single self-contained HTML file
- No changes to calculator logic, formula accuracy, or data model

---

## Architecture

### Single-file, single layout

`index.html` is the only file modified. It is rebuilt to use the dashboard layout from the Electric Blue template. The HTML structure is fixed; only CSS variable values change per skin.

### CSS Custom Properties skin system

All color, shadow, and glow values are defined as CSS custom properties (variables) on the `[data-theme]` selector. The `<html>` element carries a `data-theme` attribute.

```css
[data-theme="original"] {
  --color-bg:               #0B1120;
  --color-panel:            rgba(30, 41, 59, 0.8);  /* slate-800 at 80% for frosted glass */
  --color-panel-light:      #334155;
  --color-accent:           #14b8a6;
  --color-accent-secondary: #818cf8;
  --color-border:           rgba(20, 184, 166, 0.3);
  --color-text:             #f8fafc;
  --color-text-muted:       #94a3b8;
  --shadow-glow:            0 0 15px rgba(20, 184, 166, 0.15), inset 0 0 10px rgba(20, 184, 166, 0.1);
  --color-btn-calculate-from: #14b8a6;
  --color-btn-calculate-to:   #0d9488;
  --shadow-btn-calculate:   0 0 20px rgba(20, 184, 166, 0.4);
}

[data-theme="electric-blue"] {
  --color-bg:               #0f172a;
  --color-panel:            rgba(30, 41, 59, 0.8);  /* slate-800 at 80% for frosted glass */
  --color-panel-light:      #334155;
  --color-accent:           #38bdf8;
  --color-accent-secondary: #0ea5e9;
  --color-border:           rgba(56, 189, 248, 0.4);
  --color-text:             #f8fafc;
  --color-text-muted:       #94a3b8;
  --shadow-glow:            0 0 15px rgba(14, 165, 233, 0.15), inset 0 0 10px rgba(14, 165, 233, 0.1);
  --color-btn-calculate-from: #22d3ee;
  --color-btn-calculate-to:   #3b82f6;
  --shadow-btn-calculate:   0 0 20px rgba(6, 182, 212, 0.6);
}
```

### Tailwind config — variable-backed tokens

The Tailwind CDN config maps named tokens to these CSS variables. The border color token is named `panel-border` (not `border`) to avoid shadowing Tailwind's built-in `border` color key and the awkward `border-border` class name. Utility classes like `bg-panel`, `text-accent`, `border-panel-border` resolve automatically:

```js
tailwind.config = {
  theme: {
    extend: {
      colors: {
        bg:                 'var(--color-bg)',
        panel:              'var(--color-panel)',
        'panel-light':      'var(--color-panel-light)',
        accent:             'var(--color-accent)',
        'accent-secondary': 'var(--color-accent-secondary)',
        'panel-border':     'var(--color-border)',
        text:               'var(--color-text)',
        'text-muted':       'var(--color-text-muted)',
      }
    }
  }
}
```

`--color-border` is consumed both by the Tailwind `border-panel-border` utility class and directly inside the `.neon-panel` hand-written CSS class (see below). `--shadow-glow` and `--shadow-btn-calculate` are only consumed by hand-written CSS classes; they are never expressed as Tailwind tokens because Tailwind CDN does not support dynamic `boxShadow` extension via CSS variables cleanly.

### Hand-written semantic CSS classes

Two classes carry all glow/shadow/border effects and must be defined in the `<style>` block:

```css
.neon-panel {
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background-color: var(--color-panel);
  opacity-on-panel: 0.8; /* achieved via Tailwind bg-panel/80 on the element */
  box-shadow: var(--shadow-glow);
  backdrop-filter: blur(8px);
}

.calculate-btn {
  background: linear-gradient(to bottom, var(--color-btn-calculate-from), var(--color-btn-calculate-to));
  box-shadow: var(--shadow-btn-calculate);
  border: 1px solid var(--color-accent);
}
```

`.neon-panel` uses `var(--color-panel)` rather than a hard-coded rgba so that future skins with different panel colors work automatically. **Implementation note:** Tailwind CDN's opacity modifier (`bg-panel/80`) cannot decompose a CSS variable into channels, so the modifier will silently have no effect. To achieve the intended 80% translucency (required for `backdrop-filter: blur` to be visible), define `--color-panel` as an `rgba()` value in each skin block (e.g., `rgba(30, 41, 59, 0.8)`) and use `background-color: var(--color-panel)` in `.neon-panel` directly — no Tailwind modifier needed. **Future skin authors:** set `--color-panel` to an `rgba()` value at the desired opacity.

All other visual effects (hover states, text colors, background fills) use Tailwind utilities against the variable-backed tokens above.

---

## Layout (permanent)

The dashboard layout is fixed, matching the Electric Blue template screenshot. It is a two-column grid for the main content area, with a full-width header above and a full-width collapsible footer below the grid (not inside either column):

```
┌──────────────────────────────────────────────────────────┐
│  Header: Title | Icon                     [Skin Dropdown] │
├─────────────────────────┬────────────────────────────────┤
│  Batch Summary          │  Salt Mass Contribution Chart  │
│  (4 stat cards)         │  (donut chart)                 │
├─────────────────────────┤────────────────────────────────┤
│  2. Composition Presets │  Detailed Composition Table    │
├─────────────────────────┤────────────────────────────────┤
│  3. Salt Matrix         │  Price Breakdown Chart         │
│  (checkboxes + inputs)  │  (bar chart)                   │
├─────────────────────────┤                                │
│  Actions                │                                │
│  (Calculate/Reset/CSV)  │                                │
└─────────────────────────┴────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│  Market & Pricing Data (full-width collapsible footer)    │
└──────────────────────────────────────────────────────────┘
```

The Market & Pricing Data section spans the full width below the two-column grid.

---

## Skin Switcher Component

A `<select>` dropdown in the header right slot. `electric-blue` is listed first and is the default because the dashboard layout was designed for that skin; `original` is an alternate.

```html
<select id="skinSelect">
  <option value="electric-blue">Electric Blue</option>
  <option value="original">Original</option>
</select>
```

The `onchange` handler is wired via `addEventListener` in the init block (see below) — no inline `onchange` attribute on the element.

### Flash-of-unstyled-content prevention

To prevent a visible flash for returning users who have a non-default skin stored, a small inline `<script>` runs in `<head>` before any CSS is parsed:

```html
<head>
  ...
  <script>
    (function() {
      var VALID = ['electric-blue', 'original'];
      var stored = localStorage.getItem('skin');
      var skin = VALID.indexOf(stored) !== -1 ? stored : 'electric-blue';
      document.documentElement.setAttribute('data-theme', skin);
    })();
  </script>
  ...
</head>
```

This replaces the hard-coded `data-theme="electric-blue"` attribute approach. The attribute on `<html>` is still set at markup parse time — just dynamically via the inline script rather than statically — so the first paint always uses the correct skin.

### Init logic (`DOMContentLoaded`)

```
VALID_SKINS = ['electric-blue', 'original']
stored = localStorage.getItem('skin')
skin = stored is in VALID_SKINS ? stored : 'electric-blue'
if stored is null OR stored is not in VALID_SKINS:
    localStorage.setItem('skin', 'electric-blue')
document.documentElement.dataset.theme = skin
skinSelect.value = skin
skinSelect.addEventListener('change', function() { applySkin(this.value) })
```

`applySkin` is defined as a named global function so it can be referenced cleanly:

```js
function applySkin(value) {
  document.documentElement.dataset.theme = value;
  localStorage.setItem('skin', value);
}
```

---

## Preserved Calculator Logic

All logic from the current `index.html` is kept intact, including:
- Global parameters (volume, temperature)
- Salt matrix (checkboxes, PPM inputs, per-salt prices)
- `calculateBatch()` — mass, osmotic pressure (van't Hoff), cost per salt
- `generateRecipeAI()` — AI prompt via Groq proxy
- Preset save/apply
- CSV export
- Market & pricing data collapsible section

### Element ID contract

The following IDs are the stable contract between the JS logic and the HTML. They must not change during the rebuild:

| ID | Element | Used by |
|----|---------|---------|
| `volumeInput` | Batch volume input | `calculateBatch()` |
| `tempInput` | Temperature input | `calculateBatch()` |
| `aiPromptInput` | AI generator text input | `generateRecipeAI()` |
| `btnGenerateAI` | AI generate button | `generateRecipeAI()` (loading state) |
| `statusBanner` | Status message banner | all actions |
| `statusIcon` | Status icon span | all actions |
| `statusText` | Status message text | all actions |
| `skinSelect` | Skin dropdown | `applySkin()` |

All other element references (stat card output spans, table rows, chart containers, salt matrix rows) are generated dynamically by the JS render functions and are not addressed by static ID. The rebuild must preserve the dynamic render targets or update the render functions to match the new layout's container elements.

A full ID audit is part of the implementation task: after rebuilding the HTML, verify each stable ID above is present and each dynamic render target is correctly wired.

---

## Adding Future Skins

To add a third skin later:
1. Add a `[data-theme="new-skin"] { ... }` block to the `<style>` section with the same variable names
2. Add an `<option>` to the `#skinSelect` dropdown

No other changes needed.

---

## Files Changed

| File | Change |
|------|--------|
| `index.html` | Full rebuild — new layout + skin system + all existing logic |

No files added. No files deleted (old files like `old_index.html` are untouched).
