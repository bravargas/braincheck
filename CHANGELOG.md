# Changelog

All notable changes to Synthetic Check Image Generator are documented in this file.

The format is inspired by Keep a Changelog and uses semantic versioning principles for future releases.

## [0.1.0] - 2026-03-23

### Added - Project Foundation

- Created a new local-first, browser-only application for synthetic check image generation.
- Established modular ES module architecture with separated core, rendering, UI, data, and utility layers.
- Added complete baseline project structure under src plus root entry files.

### Added - Safety Constraints Implementation

- Enforced fictional-only data usage through local JSON datasets.
- Added explicit synthetic MICR-like demo line marked with NOT-REAL.
- Added strong visible watermarking strategy:
  - SAMPLE on front canvas
  - VOID on rear canvas
- Added rear-side non-negotiable disclaimer text.

### Added - Core Domain Modules

- Added src/core/model.js with domain model typedefs:
  - ScenarioConfig
  - GeneratedCheckSample
  - TemplateDefinition
  - EffectSettings
  - VisibilitySettings
- Added src/core/seededRandom.js for deterministic seeded random generation.
- Added src/core/presets.js for scenario preset merge behavior.
- Added src/core/generator.js for complete sample generation pipeline.

### Added - Rendering Engine

- Added src/render/renderer.js as render orchestrator.
- Added src/render/frontRenderer.js for front check composition.
- Added src/render/rearRenderer.js for rear check composition.
- Added src/render/textLayout.js with reusable text/rule drawing helpers.
- Added src/render/effects.js for blur, brightness, and slight rotation simulation.

### Added - UI and State System

- Added src/ui/state.js as centralized lightweight store with subscription model.
- Added src/ui/controls.js for full control binding and scenario updates.
- Added src/ui/preview.js for tab switching and output panel updates.
- Added src/ui/app.js for app bootstrap, data loading, generation loop, and exports.

### Added - Utility Modules

- Added src/utils/amountToWords.js for check-style amount wording.
- Added src/utils/dateUtils.js for date formatting and deterministic date randomization.
- Added src/utils/download.js for client-side PNG and JSON download helpers.

### Added - Data Packs

- Added src/data/banks.json with fictional bank labels.
- Added src/data/names.json with fictional payors, payees, and memos.
- Added src/data/templates.json with multiple visual templates.
- Added src/data/presets.json with effect and visibility presets.

### Added - User Interface and Experience

- Added index.html with complete control surface and preview panel.
- Added styles.css with modern responsive split layout (controls left, preview right).
- Added tabbed views:
  - Front
  - Rear
  - JSON
  - Base64
  - About
- Added controls for:
  - mode (manual/random)
  - seed
  - preset selector
  - amount min/max
  - date start/end
  - blur
  - brightness
  - rotation
  - visibility toggles
- Added actions for:
  - generate
  - randomize + generate
  - export PNG
  - export JSON

### Added - Output and Export

- Added front and rear live canvas rendering.
- Added JSON metadata output panel.
- Added Base64 output panel from front canvas data URL.
- Added PNG export from active front/rear view.
- Added metadata export as JSON file.

### Added - Documentation

- Added README.md with:
  - purpose
  - safety notes
  - local run instructions
  - architecture summary
  - Phase 1 feature list
  - extension ideas
- Added DOCUMENTATION.md with comprehensive technical details.

### Notes

- Phase 1 intentionally focuses on a minimal but functional MVP.
- No backend, no external dependencies, and no jQuery were introduced.
