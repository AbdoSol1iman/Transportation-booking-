---
name: RoadBooking Design System
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fc'
  on-secondary-container: '#57657a'
  tertiary: '#0051b1'
  on-tertiary: '#ffffff'
  tertiary-container: '#0f69dc'
  on-tertiary-container: '#edf0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d5e3fc'
  secondary-fixed-dim: '#b9c7df'
  on-secondary-fixed: '#0d1c2e'
  on-secondary-fixed-variant: '#3a485b'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
  bg-global: '#f6f8fb'
  surface-white: '#ffffff'
  border-subtle: '#e5e9f0'
  ink-light: '#94a3b8'
  success-green: '#16a34a'
  success-bg: '#ecfdf3'
  danger-red: '#dc2626'
  danger-bg: '#fef2f2'
  warning-amber: '#d97706'
typography:
  display-lg:
    fontFamily: Cairo
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Cairo
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Cairo
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Cairo
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Cairo
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Cairo
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
  data-price-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  data-num-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: '1.0'
  headline-lg-mobile:
    fontFamily: Cairo
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.3'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
The design system for this intercity bus booking platform is anchored in **Professionalism, Technical Precision, and Trust**. It adopts a **Modern Flight-Booking Aesthetic**, characterized by clean interfaces, high-contrast readability, and a spacious layout that mirrors the efficiency of modern air travel logistics.

The brand personality is authoritative yet accessible, positioning itself as a reliable utility for travelers. The visual language utilizes a **Modern Corporate** style with "Flat-Plus" characteristics: avoiding heavy shadows in favor of crisp 1px borders and distinct tonal layering. This approach ensures high performance and clarity across all devices, particularly in data-heavy views like search results and admin dashboards.

**Key Principles:**
- **RTL-First Logic:** All layouts are designed from the right, ensuring logical flow for Arabic readers.
- **Data Clarity:** High emphasis on legibility for schedules, prices, and availability.
- **High Trust:** Subtle use of semantic colors and professional slate tones to evoke a sense of security during the booking process.

## Colors
The palette is built on an "Ink and Blue" foundation. The **Primary Blue (#2563eb)** is reserved for main actions, active states, and brand-defining elements. **Ink Slates** provide the structural hierarchy, with the darkest shade used for primary text to ensure maximum legibility.

**Functional Application:**
- **Primary:** Core CTAs and interactive brand moments.
- **Secondary:** Navigation icons, labels, and secondary metadata.
- **Neutral:** Deepest slate for headings and body copy to provide a solid, grounded feel.
- **Semantic Colors:** Green, Red, and Amber are used strictly for status signaling (Confirmed, Cancelled, Pending). These must always be accompanied by icons or text labels to meet accessibility standards.

## Typography
This system uses a **Hybrid Typography Strategy**. 
- **Cairo** is the primary typeface for all Arabic text, providing a modern and highly legible script that scales well from headlines to small labels. 
- **Inter** is used exclusively for numerals, prices, dates, and IDs. This distinction ensures that critical booking data is clear and easily scannable, as Inter's glyphs are optimized for numeric alignment and legibility.

**RTL Considerations:**
Ensure that when Inter is used for numbers within an Arabic sentence, the directionality remains coherent. Numbers are read left-to-right, but their placement within the layout must follow the RTL flow.

## Layout & Spacing
The layout follows a **Fluid Grid System** with a 4px geometric progression. The primary layout model utilizes a sidebar + main content structure for internal views and a 12-column grid for the consumer-facing search results.

**Breakpoints:**
- **Mobile (<768px):** Single column. Margins are fixed at 16px. Sidebar collapses into a bottom sheet or hamburger menu.
- **Tablet (768px - 1024px):** Reflows to 2 columns for search results (Filter sidebar + list).
- **Desktop (>1024px):** Max-width container of 1280px. 12-column grid with 16px gutters.

**RTL Mirroring:**
All layout properties must use logical properties (e.g., `margin-inline-start` instead of `margin-right`) to ensure seamless RTL/LTR switching if needed, though the primary focus is RTL.

## Elevation & Depth
This design system prioritizes **Tonal Layers** and **Low-Contrast Outlines** over heavy shadows to maintain a clean, professional aesthetic.

- **Background:** The global application background is a soft blue-grey (`#f6f8fb`).
- **Surface:** All primary content containers (cards, inputs, modals) use a pure white background.
- **Hierarchy:** Depth is created by a subtle `1px` border (`#e5e9f0`). 
- **Active Elevation:** Only use shadows for "floating" elements like Modals, Toasts, or Dropdowns. These should be "Ambient Shadows"—highly diffused (20-30px blur), low opacity (10%), and slightly tinted with the Primary Blue to maintain color harmony.

## Shapes
The shape language is consistently **Rounded**, which balances the technical "Ink" palette with a friendlier, approachable feel. 

- **Small elements (Buttons, Inputs):** 8px radius.
- **Standard Cards:** 10px radius.
- **Hero/Modal Containers:** 14px radius.

All buttons and interactive elements should maintain these radii to ensure a cohesive "modern flight-booking" feel. Form fields should never be sharp-edged.

## Components
### Buttons
- **Primary:** Solid `#2563eb` with white text. 8px radius.
- **Secondary:** Outlined with `#e5e9f0` or ghost style with `#475569` text.
- **States:** Hover state for primary is a darker `#1d4ed8`. Disabled states use `#94a3b8` and must include a reason for disability (e.g., via tooltip).

### Form Fields
- **Inputs:** 1px border (`#e5e9f0`), Cairo for labels, Inter for numeric input.
- **Validation:** Inline error messages in `#dc2626` with a small error icon.
- **Search Card:** The hero search component should use the `14px` radius to stand out as the primary site action.

### Trip Cards
- **Structure:** Operator logo/name on the right (RTL), price and CTA on the left.
- **Data:** Times and prices must use the **Inter** font. 
- **Status Pills:** Use success/danger/warning background tints with matching high-contrast text for "Seats Available" or "Cancelled" statuses.

### Seat/Passenger Selector
- Since the API does not support a seat map, the component must be a **Quantity Counter** rather than a grid. Use clear "+" and "-" buttons with the current count displayed in the center using the Inter font.

### Progress Indicators
- Use **Skeleton Screens** for Trip Cards and Admin Tables to eliminate layout shift during data fetching.