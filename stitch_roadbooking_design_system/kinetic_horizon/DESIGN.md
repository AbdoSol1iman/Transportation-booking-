---
name: Kinetic Horizon
colors:
  surface: '#101415'
  surface-dim: '#101415'
  surface-bright: '#363a3b'
  surface-container-lowest: '#0b0f10'
  surface-container-low: '#191c1e'
  surface-container: '#1d2022'
  surface-container-high: '#272a2c'
  surface-container-highest: '#323537'
  on-surface: '#e0e3e5'
  on-surface-variant: '#c7c4d8'
  inverse-surface: '#e0e3e5'
  inverse-on-surface: '#2d3133'
  outline: '#918fa1'
  outline-variant: '#464555'
  surface-tint: '#c3c0ff'
  primary: '#c3c0ff'
  on-primary: '#1d00a5'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#4d44e3'
  secondary: '#ffffff'
  on-secondary: '#283500'
  secondary-container: '#c3f400'
  on-secondary-container: '#556d00'
  tertiary: '#c8c6c5'
  on-tertiary: '#313030'
  tertiary-container: '#616060'
  on-tertiary-container: '#dedbda'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#c3f400'
  secondary-fixed-dim: '#abd600'
  on-secondary-fixed: '#161e00'
  on-secondary-fixed-variant: '#3c4d00'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474646'
  background: '#101415'
  on-background: '#e0e3e5'
  surface-variant: '#323537'
typography:
  headline-2xl:
    fontFamily: Anybody
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-xl:
    fontFamily: Anybody
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Anybody
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Anybody
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  vibe-tag:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 4px
  container-margin: 20px
  gutter: 16px
  overlap-offset: -24px
---

## Brand & Style

This design system is engineered for a Gen Z audience that prioritizes speed, social validation, and high-impact aesthetics. The brand personality is "Cyber-Social"—fusing the high-energy aesthetics of digital subcultures with a premium, tactile feel. It avoids the sterile "corporate travel" look in favor of a "vibe-centric" interface that feels like a social media platform rather than a utility tool.

The visual style is a hybrid of **Glassmorphism** and **High-Contrast Modern**. It utilizes deep, saturated backgrounds to make vibrant accent colors "pop," while layered translucent surfaces create a sense of physical depth and technological sophistication. The goal is to evoke an emotional response of excitement and FOMO, positioning RoadBooking as a lifestyle choice rather than a logistics provider.

## Colors

The palette is anchored by **Electric Indigo** (#4F46E5), a high-vibrancy primary that signifies energy and digital connectivity. **Cyber Lime** (#CCFF00) serves as the high-impact accent, used sparingly for critical calls-to-action, badges, and "vibe" indicators to ensure maximum contrast against the **Deep Charcoal** (#121212) foundations.

Unlike traditional travel apps that use white for cleanliness, this design system uses dark surfaces to minimize eye strain and maximize the "glow" of the glassmorphic elements. Gradients should be used on primary buttons and active states, transitioning from Electric Indigo to a slightly more violet hue to maintain a sense of motion.

## Typography

Typography is a critical differentiator in this design system. We use **Anybody** for headlines—a variable font that feels mechanical yet expressive, set in heavy weights with tight tracking to create an "editorial" impact. 

**Hanken Grotesk** handles the body copy, providing a sharp, contemporary sans-serif feel that remains highly legible on dark backgrounds. **Space Grotesk** is reserved for technical data, labels, and the "Vibe" tagging system, reinforcing the futuristic, tech-forward nature of the platform. All headlines should prioritize optical kerning to ensure a high-end, bespoke feel.

## Layout & Spacing

The layout philosophy rejects "safe" whitespace in favor of a **Dynamic Grid** that feels alive. Elements should frequently overlap—for example, image cards might bleed off the edge of the screen, or floating glass panels might partially obscure background photography.

We utilize a 12-column grid for desktop and a 4-column grid for mobile. However, the "rhythm" is intentionally disrupted by using "overlap-offsets" where elements are pulled out of their containers to create visual tension. Spacing is tight (using a 4px base unit) to maintain a high-density, social-feed aesthetic. Large-scale imagery should always be the focal point, with UI elements acting as a sophisticated overlay.

## Elevation & Depth

Hierarchy is established through **Glassmorphism** rather than traditional shadows. Surfaces are categorized into three tiers:

1.  **Floor:** The Deep Charcoal base layer.
2.  **Plate:** Semi-transparent containers with a `backdrop-filter: blur(20px)` and a thin, 1px stroke (white at 10% opacity) on the top and left edges to simulate a light source.
3.  **Float:** High-z-index elements like CTA buttons or "Vibe" badges that use subtle, colored ambient glows (using the Primary color) instead of black shadows.

This layering allows the background imagery to remain visible but obscured, creating a sense of "looking through" the interface into the destination.

## Shapes

The shape language is dominated by exaggerated, organic curves. We use a **Pill-shaped (3)** logic for almost all interactive elements. Large containers, such as property cards or search panels, must use `rounded-xl` (1.5rem / 24px) to feel soft and approachable. This extreme roundness balances the "aggressive" color palette and bold typography, making the high-contrast UI feel friendly and "bouncy" rather than harsh.

## Components

### Buttons
Buttons are pill-shaped and high-impact. The **Primary CTA** uses a gradient (Electric Indigo to Violet) with a subtle outer glow. The **Secondary CTA** is a "Ghost Glass" button—transparent with a 1px Cyber Lime border.

### Vibe Badges
Small, pill-shaped chips used for social tags (e.g., "🔥 Party Vibe", "🌿 Eco-Certified"). These should use a solid Cyber Lime background with black text to stand out immediately against any imagery.

### Cards
Cards are the core of the design. They must feature edge-to-edge imagery with a glassmorphic footer containing the price and "vibe" tags. The top-right corner of cards is reserved for a floating "Save" icon (heart).

### Floating Search Bar
The primary search interface should not be docked. It should be a floating glass panel with high blur and a subtle Cyber Lime shadow to suggest it is the most important element on the screen.

### Input Fields
Inputs are dark-themed with no fill, defined only by a bottom border that glows Electric Indigo when focused. Labels should use the `label-caps` typography style.