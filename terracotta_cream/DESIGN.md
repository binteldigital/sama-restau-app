# Design System Document

## 1. Overview & Creative North Star: "The Modern Maître D’"
This design system is built to bridge the gap between digital efficiency and the sensory warmth of high-end hospitality. Our North Star is **"The Modern Maître D’"**—an interface that feels as intuitive and welcoming as a seasoned host at a fine-dining establishment. 

To achieve this, we move away from "app-like" rigidity. Instead of a grid of boxes, we embrace **Editorial Flow**. We utilize intentional asymmetry, allowing images of cuisine to break the container bounds, and we use high-contrast typography scales to guide the eye through a narrative of flavor. The interface should feel like a premium, well-designed menu: tactile, spacious, and deeply intentional.

## 2. Colors & Surface Architecture
The palette is a sophisticated blend of earth and opulence. Terracotta provides the pulse, Cream provides the canvas, and Gold provides the accent of quality.

### Color Tokens (Material Design Convention)
*   **Primary (#9F402D):** Used for the "Heart" of the interaction.
*   **Primary Container (#E2725B - Terracotta):** The signature brand color, used for hero moments and key brand expressions.
*   **Secondary (#735C00 - Gold):** Reserved for "Golden Path" moments—confirmations, rewards, and premium status.
*   **Surface / Background (#FBFBE2 - Cream):** The foundational texture of the app.

### The "No-Line" Rule
Explicitly prohibited: 1px solid borders for sectioning. We define space through **Tonal Transitions**. To separate the "Appetizers" section from "Entrees," shift the background from `surface` to `surface-container-low`. Boundaries are felt, not seen.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers.
*   **Level 0 (Base):** `surface`
*   **Level 1 (Sections):** `surface-container-low`
*   **Level 2 (Active Cards):** `surface-container-lowest` (pure white) to provide a "pop" of clean contrast.

### The "Glass & Gradient" Rule
To elevate the "Presto" experience, floating navigation bars and modal overlays must use **Glassmorphism**. Apply `surface` at 80% opacity with a 16px backdrop-blur. For main CTAs, use a subtle linear gradient from `primary` (#9F402D) to `primary-container` (#E2725B) to give the button a "light-baked" terracotta feel.

## 3. Typography: Editorial Authority
We pair the timeless authority of a Serif with the clinical precision of a Sans-Serif.

*   **Display & Headlines (Noto Serif):** These are our "Voice." Used for restaurant names, dish titles, and welcoming headers. Use `display-lg` for hero welcome screens to establish immediate luxury.
*   **Interface & Body (Manrope):** This is our "Engine." Used for pricing, descriptions, and functional labels. Manrope’s geometric clarity ensures legibility even in low-light dining environments.
*   **The Contrast Principle:** Always pair a `headline-md` (Serif) with a `label-md` (Sans-Serif, All-Caps, 0.05em tracking) to create an editorial hierarchy that feels like a boutique magazine.

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often too "heavy" for a warm, cream-based palette. We use **Tonal Layering**.

*   **The Layering Principle:** A "Card" is not a box with a shadow; it is a `surface-container-lowest` shape resting on a `surface-container-low` background. 
*   **Ambient Shadows:** If a floating action button (FAB) or a high-priority modal requires a shadow, use the `on-surface` color at 6% opacity with a 32px blur. It should look like a soft glow of light, not a drop shadow.
*   **Ghost Borders:** For input fields where high accessibility is required, use the `outline-variant` token at **20% opacity**. This creates a "breath" of a boundary that guides the user without cluttering the visual field.

## 5. Components

### Buttons (The "Touch of Gold")
*   **Primary:** Gradient of `primary` to `primary-container`. `xl` roundedness (1.5rem). No border.
*   **Secondary:** `surface-container-highest` background with `on-surface` text.
*   **Tertiary:** Transparent background, `primary` text, with a `secondary` (Gold) underline of 2px for emphasized elegance.

### Chips (The "Palate Cleansers")
Used for dietary filters (Vegan, GF). Style with `surface-container-high` and `md` roundedness. When selected, transition to `secondary` (Gold) with `on-secondary` text.

### Inputs (The "Clean Slate")
Text inputs should never have 4-sided boxes. Use a "Soft Underline" approach or a `surface-container-low` flooded background with `sm` roundedness. Labels must use `label-md` in `on-surface-variant`.

### Cards & Lists (The "Menu Flow")
*   **Forbid Dividers:** Use `spacing-6` (2rem) of vertical white space to separate menu items. 
*   **The Featured Dish Card:** Use a `surface-container-lowest` card with an asymmetrical image placement that "breaks" the top-left corner, creating a sense of movement.

### Signature Component: The "Pre-Order Pulse"
A custom progress tracker for the restaurant dashboard using a soft pulsing `secondary_fixed_dim` (Gold) ring around the order timer, indicating urgency through color warmth rather than alarming red.

## 6. Do’s and Don’ts

### Do:
*   **Do** use `spacing-8` and `spacing-10` generously. Luxury is defined by the space you *don't* fill.
*   **Do** use `notoSerif` for any text that is meant to be "savored" (e.g., chef's notes, dish descriptions).
*   **Do** use `surface-bright` for mobile customer views to keep the energy high and welcoming.

### Don’t:
*   **Don’t** use pure black (#000000). Use `on-surface` (#1B1D0E) for a softer, organic ink feel.
*   **Don’t** use `none` or `sm` roundedness for customer-facing elements. This app should feel "soft" to the touch; stay within `lg` to `xl` roundedness.
*   **Don’t** use standard "Success" green. Use `secondary` (Gold) to indicate completion—it feels like a reward, not just a system status.