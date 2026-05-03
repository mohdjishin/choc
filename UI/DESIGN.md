# 🍫 Jabal Al Ayham: Design System & Philosophy

This document outlines the **"GOD-Level" Silk & Ganache** design system used for the Jabal Al Ayham confectionery boutique. The design is engineered to evoke luxury, heritage, and pure artisanal indulgence.

---

## 🎨 Color Palette: "Silk & Ganache"
A curated, high-end palette designed to maximize appetite appeal and premium perception.

| Name | Hex | Usage | Feel |
| :--- | :--- | :--- | :--- |
| **Silk Base** | `#FDFBF7` | Main backgrounds, surfaces | Creamy, soft, pure |
| **Ganache Rich** | `#2D1B14` | Primary text, deep accents | Dark chocolate, authoritative |
| **Copper Accent**| `#C19A6B` | CTAs, lines, highlights | Warm gold, heritage, artisanal |
| **Porcelain** | `#FFFFFF` | Overlays, cards, contrast | Crisp, clean |
| **Vanille** | `#F9F5F0` | Secondary surfaces | Subtle warmth |

---

## 🖋️ Typography: The Editorial Voice
We use a high-contrast pairing that balances classical heritage with modern clarity.

### **Display: Noto Serif**
*   **Usage**: Headlines, Brand titles, Large emotive statements.
*   **Style**: Tracking-tighter, often italicized for the "soulful" touch.
*   **Feel**: Poetic, artisanal, timeless.

### **Body & Labels: Manrope**
*   **Usage**: Product descriptions, navigation, labels, technical info.
*   **Style**: Wide tracking (`0.3em` to `0.5em`) for labels to create a boutique editorial feel.
*   **Feel**: Precise, modern, Swiss-grade.

---

## ✨ Design Principles

### 1. **Minimalist Luxury**
*   **Space is Premium**: We prioritize generous padding and margins. Every element must have "breathing room" to maintain a high-end feel.
*   **No Clutter**: Remove any background text or icons that don't serve a direct emotional or functional purpose.

### 2. **Glassmorphism & Texture**
*   **Backdrop Blurs**: Used on navbars and overlays to create depth and a "liquid" feel.
*   **Gastronomic Overlays**: Subtle gradients and video backgrounds (pouring milk/chocolate) to create a sensory atmosphere.

### 3. **The "Silky" Motion System**
*   **Cinematic Pace**: Transitions are deliberate and smooth (`500ms` to `1000ms`).
*   **Parallax Depth**: Floating product collages use `translate3d` with varying speeds to create an immersive 3D experience on scroll.
*   **Micro-animations**: Subtle `slow-zoom` on images and `slide-up` on text to breathe life into the page.

---

## 📱 Mobile Experience (Native Feel)
*   **Speed First**: Reduced animation durations to `500ms` for iPhone users.
*   **Solid Surfaces**: Mobile menus use solid `Silk Base` backgrounds to ensure 100% clarity and zero "messy" text overlap.
*   **Touch Optimization**: `touch-manipulation` for instant response and large, bold tap targets.

---

## 🛠️ Implementation Specs (Tailwind CSS v4)
*   **Custom Tokens**: Defined in `tailwind.config.js` under the `extend` object.
*   **Responsive Breakpoints**:
    *   `Mobile`: Single-column, centered text, focus on CTA.
    *   `Desktop (1024px+)`: Cinematic parallax, grid-based editorial layouts.

---

*“True luxury isn’t just tasted; it’s felt in the soul.”*
