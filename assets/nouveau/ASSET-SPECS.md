# Nouveau Skin — Image Asset Specifications

All images should be **transparent PNG** files. The CSS is already wired to reference them by the filenames below — just drop the files into this folder.

---

## Required Assets

| # | Filename | Dimensions | Description |
|---|----------|-----------|-------------|
| 1 | `border-frame.png` | 1400×2000px | Full ornate Art Nouveau border frame. Transparent interior, thick green/gold outer frame with flourishes at corners and midpoints. This replaces the CSS-drawn `body::before`/`body::after` borders. Designed to be stretched over the full page via `border-image`. |
| 2 | `peacock.png` | 300×500px | Single peacock facing **right**. Full Art Nouveau style with detailed tail feather fan, iridescent eye-spots, elegant body, crown plumes. Teal/green/gold palette. Transparent background. The left peacock will be auto-mirrored via CSS `scaleX(-1)`. |
| 3 | `corner-ornament.png` | 200×200px | Single corner flourish (top-left orientation). Curving vine/scroll with small leaves and a bud. Green strokes with gold accent lines. CSS will flip it for TR/BL/BR positions. |
| 4 | `medallion-ring.png` | 500×500px | Ornate circular frame/ring to surround the donut chart. Should have a transparent center hole (~60% of the size). Concentric decorative bands with vine/leaf motifs in gold/green. |
| 5 | `header-bird.png` | 120×80px | Small decorative bird in flight (facing right). Simple Art Nouveau linework style, green/gold tones. CSS mirrors it for the left bird. |
| 6 | `vine-connector.png` | 80×200px | Vertical vine segment with small leaves/buds. Used between panels. Green with occasional gold accents. Should tile naturally if repeated vertically. |
| 7 | `flower.png` | 120×120px | Single Art Nouveau flower rosette. Multi-petal with visible center. Warm amber/coral petals with gold center on transparent background. |
| 8 | `divider.png` | 600×60px | Horizontal ornamental divider. Symmetrical scrollwork with a center jewel/motif. Gold/green lines. Used between right-column panels. |
| 9 | `side-vine.png` | 60×800px | Tall vertical vine border decoration for page sides. Should tile vertically via CSS `repeat-y`. Green vines with leaves and small flowers. |
| 10 | `parchment-texture.png` | 800×800px | *(Optional)* Subtle parchment/aged paper texture. Very light, used as a tiling background at low opacity. If omitted, the solid `#f4ecd8` background color will be used. |
| 11 | `header-cartouche.png` | 800×120px | *(Optional)* Ornate header banner/cartouche behind the title text. Scrollwork ribbon with decorative ends. If omitted, the current CSS gradient header will be used. |
| 12 | `scroll-ribbon.png` | 400×60px | *(Optional)* Ribbon/banner shape for buttons. If omitted, the CSS clip-path ribbon will be used. |

---

## Color Palette Reference

- **Green (primary border/vine):** `#5d7465`
- **Teal (accents/jewels):** `#2f7f81` / `#5b8a7c`
- **Gold (secondary lines):** `#8c7d63` / `#c98b5f`
- **Parchment (background):** `#f4ecd8`
- **Dark text:** `#3e3223`
- **Warm coral (flowers):** `#e8a87c` / `#db8a6a`

## AI Image Generation Prompts

If generating with an AI tool (Midjourney, DALL-E, Stable Diffusion), here are suggested prompts:

### Peacock
> Art Nouveau peacock illustration, Alphonse Mucha style, detailed tail fan with iridescent eye-spots, elegant curved neck, crown plumes, teal green and gold colors on transparent background, decorative ornamental style, vector-like clean lines, facing right, PNG with alpha channel

### Border Frame
> Art Nouveau ornamental page border frame, Alphonse Mucha style, thick green vine and gold scroll borders, ornate corner flourishes with flowers, empty transparent interior, aged parchment aesthetic, 1400x2000 PNG with alpha transparency

### Corner Ornament
> Art Nouveau corner flourish decoration, single top-left corner, curved vine scroll with small leaves and flower bud, green strokes with gold accents, transparent background, clean ornamental linework, 200x200 PNG

### Medallion Ring
> Art Nouveau circular ornamental frame, concentric decorative bands with vine and leaf motifs, gold and green colors, transparent center hole, detailed scroll and floral patterns, 500x500 PNG with alpha

### Header Bird
> Small Art Nouveau decorative bird in flight, simple elegant linework, green and gold tones, transparent background, ornamental style, 120x80 PNG

---

## Post-Processing Tips

1. **Background removal**: Use remove.bg or Photoshop to ensure fully transparent backgrounds
2. **Optimization**: Run through TinyPNG or `pngquant` to reduce file size
3. **Target total size**: Aim for ~500KB–1MB combined for all assets
4. **Test**: After placing files here, refresh the site with Nouveau skin to verify
