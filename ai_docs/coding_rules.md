# Coding Rules & Engineering Standards

## 1. Architectural Principles
* **Predictable Directory Design:** Rely strictly on the Next.js App Router convention (`src/app/*` for routing modules, `src/components/*` for structural components, `src/lib/*` for utility singletons).
* **Server-First Architecture:** Treat React Server Components (RSC) as the default baseline. Shift interactivity downwards by moving `use client` strictly to atomic UI leaf components.
* **Robust Type Safety:** Enforce comprehensive TypeScript compiling rules. Explicitly ban the use of `any`. Define structural interfaces for every data block and component property configuration.

## 2. Design System & Layout Implementation
* **Strict Layout Framework:** Maintain a two-column setup matching the reference blueprints. Left-hand sidebar uses a fixed width (`w-80`), permanent screen locking, independent content behavior rules, and light boundary outlines. Right-hand container manages natural data streaming.
* **Typography Matrix Rules:**
    * Apply `font-mono` along with forced lowercase transformations (`lowercase`) to headings (`h1`, `h2`, `h3`), tags, labels, navigation links, and numbers.
    * Apply `font-sans` exclusively to body copy, project paragraphs, and content descriptions to guarantee smooth readability.
* **Color Values (Monochrome Dark Focus):**
    * Background: `#0a0a0a` (Pure deep charcoal grey/black).
    * Text Selection Primary: `#e5e5e5` (Clean neutral grey).
    * Text Selection Muted: `#888888` (Muted mid-tone charcoal accent).
    * Structural Borders: `#1a1a1a` or light subtle alpha values (`rgba(255,255,255,0.05)`).

## 3. Motion & Animation Standards
* **Performance Benchmarks:** Do not animate expensive geometric layout parameters (Avoid modifying `top`, `left`, `width`, `height`, or `margin` properties during runtime). Rely strictly on `transform` (`translate3d`, `scale`) and `opacity` properties to keep processing tasks lightweight.
* **Interaction Triggers:** Add subtle depth changes to the stacked layout project cards when hovered. Ensure transitions are snappy and use a clean cubic-bezier easing profile (`cubic-bezier(0.16, 1, 0.3, 1)`).

## 4. Documentation & Maintenance Standards
* **Inline Context Comments:** Every custom component handling offline mock updates or intricate absolute placement configurations must contain clear, functional explanations describing its operational behavior.
* **No Half-Baked Mock Content:** Prevent broken UI states. Avoid using placeholder data strings like "Lorem Ipsum" or mock text like "test project summary details here". Ensure all content matches the defined portfolio details exactly.