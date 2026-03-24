# BrainCheque

## Purpose

BrainCheque is a local-first browser app that creates check-like images for:

- UI/UX testing
- OCR testing
- Synthetic dataset generation

## Additional Documentation

- Full technical documentation: [DOCUMENTATION.md](DOCUMENTATION.md)
- Detailed project history: [CHANGELOG.md](CHANGELOG.md)

## Safety Note

This project is intentionally designed to be unusable for real financial activity:

- Uses synthetic-only bank names and identifiers
- Does not generate real routing/account numbers
- Uses a clearly synthetic MICR-like line marked as NOT-REAL
- Applies strong visible SAMPLE watermarking on every output side

## How to Run Locally

1. Open this project in VS Code.
2. Start a local static file server from the project root.

```powershell
python -m http.server 8080
```

3. Open a browser to http://localhost:8080.

## Optional MICR-like Font Setup

For specialized synthetic OCR testing, you can add an optional MICR-like font:

1. Place a local font file at `src/assets/fonts/micr.woff2`.
2. Reload the app.

If no font file is present, the app automatically uses a monospace fallback.

## Architecture Summary

- src/core: Data model, preset merge, seeded random, generation logic
- src/render: Canvas front/rear rendering, text helpers, visual effects
- src/ui: App bootstrap, state management, controls wiring, live preview
- src/data: Synthetic local JSON datasets for names, banks, templates, presets
- src/utils: Amount-to-words, date helpers, download/export helpers

Key design choices:

- Generation logic is separate from rendering logic
- State is isolated in a small store module
- Scenario-based config model drives generation and rendering
- ES modules with focused, composable functions

## Phase 1 MVP Features

- Front and rear canvas previews
- Manual and random generation modes
- Seed-based reproducible random generation
- Synthetic data sourced from local JSON files
- Strong watermark on all generated checks
- PNG export
- JSON metadata export
- Base64 output panel
- Effects: blur, brightness, slight rotation
- Field visibility toggles for payee, amount, date, signature, MICR-like line

## Extension Ideas

- Multiple templates with positioned field maps
- Batch generation and zip export
- Noise overlays for stronger OCR stress testing
- Saved scenarios in localStorage
- Optional Web Worker for high-volume generation
