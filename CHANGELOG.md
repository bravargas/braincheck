# Changelog

All notable changes to BrainCheque are documented in this file.

The format is inspired by Keep a Changelog and uses semantic versioning principles for future releases.

## [Unreleased]

### Fixed - IIS Deployment Font Loading

- Fixed font 404 errors when the app is hosted under an IIS virtual directory (for example /RDCImageGenerator).
- Updated font preload links in index.html to use relative paths (./src/assets/fonts/...) instead of root-absolute paths.
- Updated @font-face source URLs in styles.css to use relative paths so assets resolve under subpaths.
- Added web.config staticContent MIME mappings for:
  - .ttf -> font/ttf
  - .woff -> font/woff
  - .woff2 -> font/woff2

### Changed - Product Branding

- Renamed app branding from BrainCheck to BrainCheque in the web UI and project documentation.

## [0.1.0] - 2026-03-23

### Added - Project Foundation

- Created a new local-first, browser-only application for synthetic check image generation.
- Established modular ES module architecture with separated core, rendering, UI, data, and utility layers.
- Added complete baseline project structure under src plus root entry files.

### Added - Safety Constraints Implementation

- Enforced synthetic data usage through local JSON datasets.
- Added explicit synthetic MICR-like line marked with NOT-REAL.
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

- Added src/data/banks.json with synthetic bank labels.
- Added src/data/names.json with synthetic payors, payees, and memos.
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

### Enhanced - UI/UX and Dark Mode Support (2026-03-23)

- Implemented dark theme as default with automatic system preference detection.
- Added theme toggle button (🌙/☀️) in control panel header.
- Improved input field visibility in dark mode with lighter backgrounds (#4d4d4d).
- Enhanced layout spacing for OCR photography:
  - Increased external margins around canvas elements.
  - Improved separation between control panels and preview areas.
  - Better visual hierarchy with consistent 80px top margins for content.
- Improved date formatting: Changed to mm/dd/yyyy format on checks.
- Enhanced visibility of "SAMPLE VOID" text with solid color and larger font (16px).
- Reduced watermark opacity for less visual impact on OCR:
  - Front "SAMPLE" watermark reduced to 0.08 opacity.
  - Rear "VOID" watermark reduced to 0.06 opacity.
- Added proper spacing between manual field inputs and Clear button.
- Updated project metadata in About section:
  - Added developer information.
  - Added contact email.
  - Updated last modification date.
- Split bank datasets by country:
  - src/data/banks.us.json
  - src/data/banks.ca.json
  - removed runtime dependency on src/data/banks.json
- Fixed Canadian bank field mapping regression:
  - Prevented "undefined" bank labels on generated checks.
  - Generator now maps CA bank names from shortName/longName.
  - Generator now maps province/state from state (with province fallback).

### Notes

- Phase 1 intentionally focuses on a minimal but functional MVP.
- No backend, no external dependencies, and no jQuery were introduced.
