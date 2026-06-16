# BrainCheque - Full Technical Documentation

## 1. Project Overview

BrainCheque is a local-first, client-side web application designed to generate check-like images for:

- UI/UX testing
- OCR stress testing
- Synthetic dataset generation

The application supports QA/OCR validation workflows while applying explicit visual safety markers to prevent misuse.

## 2. Safety-First Product Boundaries

This project is constrained by strict safety rules:

- Uses synthetic names and generated test identifiers
- Uses controlled local bank data for QA/OCR validation scenarios
- Uses bank RTNs as 9-digit MICR transit values so ABA checksum validation can be tested
- Does not generate real account numbers
- Applies strong visible SAMPLE watermarking on generated checks (front and rear)
- Output is explicitly non-negotiable and unsuitable for real-world financial use

## 3. Technical Scope and Runtime

- Runtime: browser only
- Architecture: local-first, no backend
- Technologies: HTML, CSS, JavaScript ES modules
- Rendering: HTML5 Canvas for front and rear images
- Dependencies: none (vanilla implementation)

### 3.1 IIS Hosting Notes

When hosting under IIS, especially in a virtual directory such as /RDCImageGenerator, static asset paths must be subpath-safe:

- Use relative font URLs in HTML and CSS (./src/assets/fonts/...) instead of root-absolute URLs (/src/assets/fonts/...).
- Ensure IIS serves font files with valid MIME types via web.config staticContent mappings:
  - .ttf -> font/ttf
  - .woff -> font/woff
  - .woff2 -> font/woff2

If fonts return 404 in browser Network tools, confirm the request URL includes the application subpath (for example /RDCImageGenerator/src/assets/fonts/Signerica_Medium.ttf).

## 4. Phase 1 Deliverables (What Was Built)

Phase 1 delivered a working MVP with the following capabilities:

- Front preview rendered on canvas
- Rear preview rendered on canvas
- Manual mode and random mode
- Seed-based deterministic generation
- Synthetic data loaded from local JSON files
- Strong watermarking on every generated check
- PNG export
- Visual effects controls:
  - blur
  - brightness
  - slight rotation simulation
- Field omission toggles for:
  - payee
  - amount
  - date
  - signature
  - MICR line
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
    banks.us.json
    banks.ca.json
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
- MICR string generation with ABA-valid 9-digit transit values from the bank dataset
- scenario snapshot embedding for traceability

## 6.2 Rendering Layer

#### src/render/renderer.js
Top-level orchestrator for rendering both front and rear canvases.

#### src/render/frontRenderer.js
Draws front check composition:

- template-driven visual background
- SAMPLE watermark
- payor name with synthetic payor address line
- bank title, check number, date, payee, amount, words, memo, signature
- conditional field display based on visibility toggles
- optional MICR line rendering

#### src/render/rearRenderer.js
Draws rear check composition:

- rear panel styling and endorsement area
- SAMPLE watermark (same color and orientation style as front)
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
- visibility checkboxes (including watermark toggle)
- preset application
- generate and randomize button bindings

#### src/ui/preview.js
Handles:

- tab switching behavior for primary controls near Generate (Front/Rear/Both) and About panel
- canvas rendering refresh

#### src/ui/app.js
Application bootstrap:

- asynchronous loading of local JSON datasets
- control initialization
- generation and re-render flow
- export button actions (PNG)
- internal configuration for title-area legacy-version link (legacyVersionConfig)
- post-font-load canvas refresh to ensure custom font rendering on first open

Legacy link configuration:

- Update legacyVersionConfig.url to your internal v1.0.3 route.
- Set legacyVersionConfig.enabled to false to hide the link.
- Update legacyVersionConfig.label for custom display text.

## 6.4 Utility Layer

#### src/utils/amountToWords.js
Converts numeric currency amount to check-style words.

#### src/utils/dateUtils.js
Date formatting and deterministic range randomization.

#### src/utils/download.js
Client-side file downloads for PNG and text-based metadata.

## 7. Data Files and Their Role

### src/data/banks.us.json
Controlled US bank records used for US check generation and ABA/MICR validation testing.

Expected fields per entry:

- rtn (9-digit routing transit number)
- shortName
- longName
- city
- state
- v1, v2, v3 (optional metadata)

Generator mapping notes:

- Bank display name uses shortName, then longName as fallback.
- The US MICR transit field uses the 9-digit rtn value and preserves leading zeroes.

### src/data/banks.ca.json
Synthetic Canadian institutions used for Canadian check generation.

Expected fields per entry:

- transit (5 digits)
- institution (3 digits)
- shortName
- longName
- city
- state (province + postal format, example: ON M5J 2J5)
- v1, v2, v3 (optional metadata)

Generator mapping notes:

- Bank display name uses shortName, then longName as fallback.
- Province line uses state, with province fallback for backward compatibility.

### src/data/names.json
Synthetic payors, payees, and memo values.

### src/data/templates.json
Template visual metadata (name, dimensions, colors).

### src/data/presets.json
Preset effect and visibility combinations for quick scenario switching.

## 8. UI Contract and User Flows

### 8.1 Main Layout

- Left side: controls panel
- Right side: live preview panel

### 8.2 View Toggle and Tabs

**View Toggle (Actions Section)**

- Segmented 3-option control with explicit modes: **Both**, **Front**, and **Rear**
- **Both** is first in the control and is the default on initial load
- **Both** view shows front and rear previews stacked vertically for clearer comparison

**Primary Tabs**

- Both (default)
- Front
- Rear

**Secondary Panel**

- About opens as a floating modal dialog with backdrop
- About can be closed with the close button, outside click, or Escape
- Generate clears/closes secondary panels to return focus to check preview

### 8.3 Primary Flow

1. User sets seed/country/ranges/effects/visibility/preset.
2. User clicks Generate or Randomize Seed + Generate.
3. App computes GeneratedCheckSample.
4. Renderer updates front/rear canvas.
5. User exports PNG when needed.

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

## 13. Dark Mode and UI Enhancements

### 13.1 Dark Theme Implementation

- Dark theme is set as the default presentation mode
- User can toggle between light and dark mode using the theme button (🌙/☀️) in the control panel header
- Theme preference is persisted in localStorage for consistency across sessions
- CSS custom properties enable rapid theme switching without code changes

### 13.2 OCR Photography Optimization

The application has been optimized for camera-based OCR workflows:

- **Increased external spacing**: Wider margins between control panels, tabs, and canvas elements prevent UI elements from interfering with check photography
- **Consistent vertical alignment**: 80px top margins on all preview content for reliable framing
- **Watermark opacity reduction**:
  - Front SAMPLE watermark: 0.08 opacity (subtle visual indicator without OCR interference)
  - Rear SAMPLE watermark: 0.08 opacity (same visual treatment as front)
- **Enhanced visibility contrast**:
  - SAMPLE VOID text: Solid dark color at 16px for clear document identifier
  - Check borders: Consistent 2px strokes for reliable edge detection in OCR

### 13.3 Input Field Improvements

Dark mode input backgrounds use #4d4d4d for better text contrast and legibility compared to system defaults.

### 13.4 Date Format

Check dates are rendered in mm/dd/yyyy format to match standard US banking conventions and improve OCR parsing accuracy.

### 13.5 Project Metadata

About tab now includes developer information and project timeline:

- Costa Rica PS Team
- Developer: Brainer Vargas
- Contact: brainer.vargasrojas@fiserv.com
- Created: 2016
- Last modification: 2026-06-16
