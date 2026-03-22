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
  --color-panel:            #1e293b;
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
  --color-panel:            #1e293b;
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

The Tailwind CDN config maps named tokens to these CSS variables, so utility classes like `bg-panel`, `text-accent`, `border-accent` resolve automatically:

```js
tailwind.config = {
  theme: {
    extend: {
      colors: {
        bg:               'var(--color-bg)',
        panel:            'var(--color-panel)',
        'panel-light':    'var(--color-panel-light)',
        accent:           'var(--color-accent)',
        'accent-secondary': 'var(--color-accent-secondary)',
        text:             'var(--color-text)',
        'text-muted':     'var(--color-text-muted)',
      }
    }
  }
}
```

Semantic elements that need `border-color`, `box-shadow`, or `backdrop-filter` effects (`.neon-panel`, `.calculate-btn`) use CSS classes that reference the CSS variables directly — not Tailwind utilities — since Tailwind does not support dynamic shadow/border-color tokens cleanly via CDN.

---

## Layout (permanent)

The dashboard layout is fixed, matching the Electric Blue template screenshot:

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
│  Market & Pricing Data (collapsible footer)               │
└──────────────────────────────────────────────────────────┘
```

---

## Skin Switcher Component

A `<select>` dropdown in the header right slot:

```html
<select id="skinSelect" onchange="applySkin(this.value)">
  <option value="electric-blue">Electric Blue</option>
  <option value="original">Original</option>
</select>
```

JavaScript on init:
1. Read `localStorage.getItem('skin')` (default: `'electric-blue'`)
2. Set `document.documentElement.dataset.theme` to that value
3. Set `skinSelect.value` to match

On change:
1. Set `document.documentElement.dataset.theme = value`
2. `localStorage.setItem('skin', value)`

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

Element IDs may change where the new layout requires it; the logic references will be updated to match.

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
