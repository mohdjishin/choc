---
name: Linen & Bean
colors:
  surface: '#fcf9f5'
  surface-dim: '#dcdad6'
  surface-bright: '#fcf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ef'
  surface-container: '#f0ede9'
  surface-container-high: '#ebe8e4'
  surface-container-highest: '#e5e2de'
  on-surface: '#1c1c19'
  on-surface-variant: '#4f4442'
  inverse-surface: '#31302e'
  inverse-on-surface: '#f3f0ec'
  outline: '#817472'
  outline-variant: '#d2c3c0'
  surface-tint: '#6d5a56'
  primary: '#130806'
  on-primary: '#ffffff'
  primary-container: '#2c1e1b'
  on-primary-container: '#998480'
  inverse-primary: '#dac1bc'
  secondary: '#775a19'
  on-secondary: '#ffffff'
  secondary-container: '#fed488'
  on-secondary-container: '#785a1a'
  tertiary: '#0f0b06'
  on-tertiary: '#ffffff'
  tertiary-container: '#26211b'
  on-tertiary-container: '#90887f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#f7ddd8'
  primary-fixed-dim: '#dac1bc'
  on-primary-fixed: '#261815'
  on-primary-fixed-variant: '#54433f'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#ebe1d6'
  tertiary-fixed-dim: '#cfc5bb'
  on-tertiary-fixed: '#201b15'
  on-tertiary-fixed-variant: '#4c463e'
  background: '#fcf9f5'
  on-background: '#1c1c19'
  surface-variant: '#e5e2de'
typography:
  display-xl:
    fontFamily: Noto Serif
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  margin-page: 64px
  gutter: 24px
  section-gap: 120px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

This design system is built upon the concept of "Minimalist Editorial," drawing inspiration from high-end lifestyle magazines and artisanal craftsmanship. The brand personality is quiet, confident, and deeply sophisticated, targeting a discerning audience that values origin, process, and sensory experience.

The visual style leverages **Minimalism** with an emphasis on heavy white space and structural balance. Unlike traditional cocoa branding that relies on heavy, literal chocolate imagery, this system uses "Airy Premium" layouts to allow the product story to breathe. It evokes an emotional response of calm, indulgence, and exclusivity, moving away from mass-market visual clutter toward a refined, gallery-like digital environment.

## Colors

The palette abandons predictable flat ivories for a layered, tonal approach. 
- **Linen (#F4F1ED):** The primary canvas. It provides a warmer, more tactile feel than pure white, suggesting natural fibers.
- **Espresso (#2C1E1B):** Used for primary typography and high-contrast moments. It is a rich, near-black brown that feels grounded and premium.
- **Muted Gold (#C5A059):** Reserved for interactive highlights and micro-details. It is used sparingly to maintain an "editorial" rather than "glitzy" feel.
- **Stone (#D1C7BD):** A transitionary shade used for borders, secondary backgrounds, and subtle UI depth.

Color weights are applied with a focus on visual rhythm: heavy Espresso for headers, soft Stone for decorative lines, and Linen for expansive negative space.

## Typography

The typographic hierarchy centers on **Noto Serif** to anchor the artisan feel. Display styles use a light to medium weight with tight tracking to mimic high-end mastheads. To ensure the interface remains modern and functional, **Manrope** is introduced for body text and labels. This sans-serif pairing provides a clean, neutral counterpoint to the more expressive serif.

Visual rhythm is achieved by alternating between the serif's classic proportions and the sans-serif's technical clarity. All labels should utilize uppercase styling with generous letter spacing to reinforce the minimalist editorial aesthetic.

## Layout & Spacing

This design system employs a **Fixed Grid** model for desktop to maintain strict editorial control over line lengths and imagery placement. A 12-column grid is used with wide 64px page margins to create a "frame" around the content. 

The spacing philosophy is "Atmospheric." Instead of standard padding, use exaggerated vertical gaps (`section-gap`) to separate distinct narratives. Elements are often intentionally offset from the grid to create a bespoke, non-templated appearance. Horizontal rhythm is dictated by the 24px gutter, ensuring that even in dense information blocks, the "airy" quality is preserved.

## Elevation & Depth

To maintain a minimalist aesthetic, depth is communicated through **Tonal Layers** and **Low-Contrast Outlines** rather than traditional shadows. 

1.  **Surfacing:** The base layer is Linen. Secondary containers or cards use Stone or a slightly darker tint of Linen to create subtle separation.
2.  **Keylines:** Use ultra-thin (1px) borders in Stone for structural elements. These lines should feel like "pencil marks" on paper.
3.  **Soft Depth:** When a shadow is strictly necessary for interaction (e.g., a floating cart), use a "Whisper Shadow"—a very large blur (32px+) with extremely low opacity (3-5%) using the Espresso tint, creating an ambient glow rather than a hard drop.

## Shapes

The shape language is primarily **Soft (Level 1)**. Sharp 90-degree corners are used for the main structural containers and image frames to lean into the "Editorial" grid. However, interactive elements like buttons and input fields utilize a 0.25rem (4px) radius. 

This subtle rounding prevents the UI from feeling "clinical" or "hostile," adding a touch of approachability that complements the organic nature of cocoa. Avoid pill-shapes or high-radius circles; the geometry should remain disciplined and architectural.

## Components

- **Buttons:** Primary buttons are solid Espresso with Linen text. Secondary buttons use a Stone keyline with no fill. All buttons use the uppercase `label-sm` typography for a disciplined look.
- **Inputs:** Minimalist underline style or ghost-box style with 1px Stone borders. Labels sit above in `label-sm` weight.
- **Cards:** Borderless with a background color shift to Stone. Images within cards should have a slight 1:1 or 4:5 aspect ratio to feel like professional photography.
- **Chips/Tags:** Used for "Notes" (e.g., *Floral, Nutty, 70% Dark*). These should be small, Stone-colored backgrounds with Espresso text, using a subtle 2px radius.
- **Editorial Pull-Quotes:** A specialized component using `display-xl` Noto Serif text, centered with a thin Muted Gold divider above and below.
- **Product Tiles:** Focus on large imagery. Price and title should be understated, allowing the product's texture and packaging to be the focal point.