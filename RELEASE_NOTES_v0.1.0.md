# Release v0.1.0 - Initial MVP

Initial public MVP of Synthetic Check Image Generator.

## Highlights

- Local-first, browser-only implementation (no backend)
- Modular ES modules architecture
- Front and rear canvas rendering
- Manual and random generation modes
- Seed-based deterministic generation
- Synthetic-only local datasets (banks, names, templates, presets)
- Strong safety watermarking:
  - SAMPLE on front
  - VOID on rear
- Synthetic MICR-like line explicitly marked NOT-REAL
- PNG export
- JSON metadata export
- Base64 output panel
- Visual effects controls:
  - blur
  - brightness
  - slight rotation simulation
- Field visibility toggles for payee, amount, date, signature, MICR-like line

## Added

### Foundation

- New project scaffold for a local-first web app
- Complete source tree under src with separation by domain

### Core

- Scenario and output model definitions
- Seeded pseudo-random engine
- Preset merge behavior
- Generation pipeline for synthetic check samples

### Rendering

- Front renderer
- Rear renderer
- Shared text layout helpers
- Effect wrappers for blur/brightness/rotation

### UI

- Centralized lightweight state store
- Controls binding and config updates
- Tabbed preview and output panes
- App bootstrap with local JSON loading

### Data

- Synthetic banks dataset
- Synthetic names dataset
- Template definitions dataset
- Presets dataset

### Utilities

- Amount-to-words conversion
- Date helpers
- Client-side download helpers

### Documentation

- README updated with purpose, safety, run instructions, architecture, extension ideas
- Full technical documentation added
- Full changelog added

## Safety Statement

This tool is intentionally unusable for real financial operations:

- No real routing/account numbers
- No real-world valid MICR
- Explicit synthetic identifiers and warnings
- Strong visible watermarking in all generated outputs

## Tag

- v0.1.0
