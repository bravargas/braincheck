import { generateCheckSample } from "../core/generator.js";
import { createSeededRandom } from "../core/seededRandom.js";
import { downloadCanvasAsPng, downloadText } from "../utils/download.js";
import { wireControls } from "./controls.js";
import { renderPreview, setupTabs } from "./preview.js";
import { getState, setState, subscribe, updateConfig } from "./state.js";

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
}

function randomSeed() {
  const random = createSeededRandom(`${Date.now()}-${Math.random()}`);
  return `seed-${random.int(100000, 999999)}`;
}

function createSampleAndRender() {
  const state = getState();
  const sample = generateCheckSample(state.config, state.datasets);
  setState({ sample });
}

function wireExportButtons() {
  const exportPngBtn = document.getElementById("exportPngBtn");
  const exportJsonBtn = document.getElementById("exportJsonBtn");

  exportPngBtn.addEventListener("click", () => {
    const activeTab = document.querySelector(".tabs button.active")?.dataset.tab || "front";
    const canvas =
      activeTab === "rear" ? document.getElementById("rearCanvas") : document.getElementById("frontCanvas");
    downloadCanvasAsPng(canvas, `synthetic-check-${activeTab}.png`);
  });

  exportJsonBtn.addEventListener("click", () => {
    const sample = getState().sample;
    if (!sample) {
      return;
    }
    downloadText(JSON.stringify(sample, null, 2), "synthetic-check-metadata.json", "application/json");
  });
}

function applyDatasets(datasets) {
  setState({
    datasets
  });
}

async function init() {
  setupTabs();

  const [banks, names, templates, presets] = await Promise.all([
    loadJson("./src/data/banks.json"),
    loadJson("./src/data/names.json"),
    loadJson("./src/data/templates.json"),
    loadJson("./src/data/presets.json")
  ]);

  applyDatasets({ banks, names, templates, presets });

  const controls = wireControls(
    () => {
      controls.updateConfigFromDom();
      createSampleAndRender();
    },
    () => {
      updateConfig({ seed: randomSeed() });
      controls.syncDomToConfig();
      controls.updateConfigFromDom();
      createSampleAndRender();
    }
  );

  controls.fillPresets(getState().datasets.presets);
  controls.updateConfigFromDom();

  wireExportButtons();

  subscribe((state) => {
    renderPreview(state);
  });

  createSampleAndRender();
}

init().catch((error) => {
  console.error(error);
  alert(`Initialization error: ${error.message}`);
});
