# Workflow Automations for Antigravity IDE

This file details execution pipelines for the autonomous agent workspace. Use these paths to enforce validation and regression-free updates.

---

## Workflow 1: Production Deployment Readiness Check
*Trigger:* When prepping the codebase for deployment via Vercel CI/CD pipelines.

1. **Step 1: Code Architecture Validation**
    * Execute TypeScript validation to sweep for forbidden fallback structures:
      ```bash
      npm run build
      ```
    * Reject the commit if any compilation errors or instances of explicit `any` types are found.

2. **Step 2: Typography & Layout Audit**
    * Inspect `src/components/` and ensure all elements matching headings, navigation groups, or metrics incorporate `font-mono` and `lowercase` utility markers.
    * Check that paragraph texts utilize the readable `font-sans` family token exclusively.

3. **Step 3: Asset Optimization Sweep**
    * Scan `public/` and verification assets to verify images utilize explicit compression or native web optimizations.

---

## Workflow 2: Component Assembly & Integration Pipeline
*Trigger:* When requested to generate or modify a structural block in the application stream.

1. **Step 1: Component Initialization**
    * Place layout logic inside `src/components/`. If client states, hooks, or animation variables are required, label the leaf module with the strict `"use client"` flag at line 1.

2. **Step 2: Tailwind Matching Inspection**
    * Cross-reference colors against structural defaults (`bg-[#0a0a0a]`, `text-[#e5e5e5]`, and border accents `border-[#1a1a1a]`).

3. **Step 3: Verification**
    * Run local verification servers to check structural layouts for potential layout overflow bugs before updating `checkpoint.md`.