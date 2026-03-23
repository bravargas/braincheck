# Synthetic Check Image Generator - Full Technical Documentation

## 1. Project Overview

Synthetic Check Image Generator is a local-first, client-side web application designed to generate fictional check-like images for:

- UI/UX testing
- OCR stress testing
- Synthetic dataset generation

The application intentionally avoids any real banking-valid artifacts and applies explicit visual safety markers to prevent misuse.

## 2. Safety-First Product Boundaries

This project is constrained by strict safety rules:

- Uses fictional names, fictional institutions, and fictional identifiers only
- Does not generate real routing numbers or real account numbers
- Uses a clearly synthetic MICR-like line with explicit NOT-REAL labeling
- Applies strong visible watermarking on generated checks (SAMPLE on front, VOID on rear)
- Output is explicitly non-negotiable and unsuitable for real-world financial use

## 3. Technical Scope and Runtime

- Runtime: browser only
- Architecture: local-first, no backend
- Technologies: HTML, CSS, JavaScript ES modules
- Rendering: HTML5 Canvas for front and rear images
- Dependencies: none (vanilla implementation)

## 4. Phase 1 Deliverables (What Was Built)

Phase 1 delivered a working MVP with the following capabilities:

- Front preview rendered on canvas
- Rear preview rendered on canvas
- Manual mode and random mode
- Seed-based deterministic generation
- Fictional data loaded from local JSON files
- Strong watermarking on every generated check
- PNG export
- JSON metadata export
- Base64 output display
- Visual effects controls:
  - blur
  - brightness
  - slight rotation simulation
- Field omission toggles for:
  - payee
  - amount
  - date
  - signature
  - MICR-like demo line
- Scenario-based configuration model
- Modular architecture separating generation, rendering, state, and UI wiring

## 5. Project Structure

```text
/src
  /core
    model.js
    generator.js
    seededRandom.js
    presets.js
  /render
    renderer.js
    frontRenderer.js
    rearRenderer.js
    textLayout.js
    effects.js
  /data
    banks.json
    names.json
    templates.json
    presets.json
  /ui
    app.js
    state.js
    controls.js
    preview.js
  /utils
    amountToWords.js
    dateUtils.js
    download.js
index.html
styles.css
README.md
DOCUMENTATION.md
CHANGELOG.md
```

## 6. Module-by-Module Design

### 6.1 Core Domain Layer

#### src/core/model.js
Defines the primary data contracts through JSDoc typedefs:

- EffectSettings
- VisibilitySettings
- TemplateDefinition
- ScenarioConfig
- GeneratedCheckSample

Also provides createDefaultScenarioConfig() to initialize app state with safe defaults.

#### src/core/seededRandom.js
Implements deterministic pseudo-random generation based on a text seed.

- createSeededRandom(seedText)
- next() for float output
- int(min, max) for integer ranges
- pick(list) for deterministic selection from arrays

#### src/core/presets.js
Contains applyPreset(config, presets, presetId) to merge selected preset values into scenario configuration.

#### src/core/generator.js
Generates a complete check sample from ScenarioConfig plus loaded datasets.

Responsibilities:

- deterministic random generation using seed
- support for manual overrides when mode is manual
- amount/date generation within configured range
- synthetic identifier generation
- safe fictional MICR-like string generation
- scenario snapshot embedding for traceability

## 6.2 Rendering Layer

#### src/render/renderer.js
Top-level orchestrator for rendering both front and rear canvases.

#### src/render/frontRenderer.js
Draws front check composition:

- template-driven visual background
- SAMPLE watermark
- bank title, check number, date, payee, amount, words, memo, signature
- conditional field display based on visibility toggles
- optional MICR-like line rendering

#### src/render/rearRenderer.js
Draws rear check composition:

- rear panel styling and endorsement area
- VOID watermark
- synthetic identifier and non-negotiable notice

#### src/render/textLayout.js
Reusable primitives for label-value drawing and horizontal rules.

#### src/render/effects.js
Canvas effect wrappers:

- blur and brightness via canvas filter
- slight global rotation simulation

## 6.3 UI and State Layer

#### src/ui/state.js
Simple centralized store for:

- config
- sample
- active tab
- loaded datasets

Includes setState, updateConfig, subscribe.

#### src/ui/controls.js
Wires DOM controls to state updates and actions:

- mode, seed, amount range, date range
- manual fields
- effects sliders
- visibility checkboxes
- preset application
- generate and randomize button bindings

#### src/ui/preview.js
Handles:

- tab switching behavior (Front, Rear, JSON, Base64, About)
- canvas rendering refresh
- JSON text output
- base64 image output generation

#### src/ui/app.js
Application bootstrap:

- asynchronous loading of local JSON datasets
- control initialization
- generation and re-render flow
- export button actions (PNG and JSON)

## 6.4 Utility Layer

#### src/utils/amountToWords.js
Converts numeric currency amount to check-style words.

#### src/utils/dateUtils.js
Date formatting and deterministic range randomization.

#### src/utils/download.js
Client-side file downloads for PNG and text-based metadata.

## 7. Data Files and Their Role

### src/data/banks.json
Fictional institutions used for bank labels.

### src/data/names.json
Fictional payors, payees, and memo values.

### src/data/templates.json
Template visual metadata (name, dimensions, colors).

### src/data/presets.json
Preset effect and visibility combinations for quick scenario switching.

## 8. UI Contract and User Flows

### 8.1 Main Layout

- Left side: controls panel
- Right side: live preview panel

### 8.2 Tabs

- Front
- Rear
- JSON
- Base64
- About

### 8.3 Primary Flow

1. User sets seed/mode/ranges/effects/visibility/preset.
2. User clicks Generate or Randomize Seed + Generate.
3. App computes GeneratedCheckSample.
4. Renderer updates front/rear canvas.
5. JSON and Base64 outputs refresh.
6. User exports PNG and JSON when needed.

## 9. Determinism and Reproducibility

Generation is deterministic for a given seed plus identical configuration and datasets.

- Same seed + same config + same data => same pseudo-random selections
- This supports repeatable QA and reproducible OCR tests

## 10. Known Phase 1 Limits

- No batch generation UI yet
- No template coordinate map editor yet
- No local scenario persistence yet
- No dedicated automated test suite yet

## 11. Local Run Instructions

1. Open project root in VS Code.
2. Start any static server from root.
3. Example:

```powershell
python -m http.server 8080
```

4. Open http://localhost:8080 in a browser.

## 12. Recommended Phase 2 Roadmap

- Batch generation and ZIP export workflow
- Dataset profile manager and scenario persistence
- Template coordinate system for multiple real-looking layouts
- Noise pipeline (grain, compression artifacts, scan lines)
- Light testing strategy (unit + render regression baselines)
