import { generateCheckSample } from "../core/generator.js";
import { createSeededRandom } from "../core/seededRandom.js";
import { downloadCanvasAsPng } from "../utils/download.js";
import { wireControls } from "./controls.js";
import { clearExtraViews, renderPreview, setupTabs, setupFlipToggle, setupHoverFocus } from "./preview.js";
import { getState, setState, subscribe, updateConfig } from "./state.js";

// Internal deployment config for the legacy tool shortcut shown below the app title.
const legacyVersionConfig = {
  enabled: true,
  label: "Open Previous Version v1.0.3",
  url: "../v.1.0.3/"
};

// Theme initialization
function initTheme() {
  const html = document.documentElement;
  const storedTheme = localStorage.getItem("theme");
  
  // Determine theme: stored preference > default dark
  let theme = storedTheme || "dark";
  
  html.setAttribute("data-theme", theme);
  updateThemeButton(theme);
}

function updateThemeButton(theme) {
  const button = document.getElementById("themeToggle");
  if (button) {
    button.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeButton(newTheme);
}

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
}

function getDateRange90Days() {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 90);
  return {
    start: toIsoDate(start),
    end: toIsoDate(today)
  };
}

function toIsoDate(date) {
  const y = String(date.getFullYear()).padStart(4, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
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

async function refreshAfterFontsLoad(timeoutMs = 2500) {
  if (!document.fonts || !document.fonts.load) {
    return;
  }

  const waitForFonts = Promise.allSettled([
    document.fonts.load('16px "Signerica Medium"'),
    document.fonts.load('16px "Micr"'),
    document.fonts.ready
  ]);
  const timeout = new Promise((resolve) => setTimeout(resolve, timeoutMs));

  await Promise.race([waitForFonts, timeout]);
  createSampleAndRender();
}

function wireExportButtons() {
  const exportPngBtn = document.getElementById("exportPngBtn");

  exportPngBtn.addEventListener("click", () => {
    const activePane = document.querySelector(".tab-body.active")?.dataset.pane || "front";
    const activeTab = activePane === "rear" ? "rear" : "front";
    const canvas = activeTab === "rear" ? document.getElementById("rearCanvas") : document.getElementById("frontCanvas");
    downloadCanvasAsPng(canvas, `synthetic-check-${activeTab}.png`);
  });
}

function wireThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
}

function wireLegacyVersionLink() {
  const link = document.getElementById("legacyVersionLink");
  if (!link) {
    return;
  }

  if (!legacyVersionConfig.enabled || !legacyVersionConfig.url) {
    link.hidden = true;
    return;
  }

  link.textContent = legacyVersionConfig.label;
  link.href = legacyVersionConfig.url;
  link.hidden = false;
}

function applyDatasets(datasets) {
  setState({
    datasets
  });
}

async function init() {
  initTheme();

  const [banksUS, banksCA, names, templates, presets] = await Promise.all([
    loadJson("./src/data/banks.us.json"),
    loadJson("./src/data/banks.ca.json"),
    loadJson("./src/data/names.json"),
    loadJson("./src/data/templates.json"),
    loadJson("./src/data/presets.json")
  ]);

  applyDatasets({
    banksUS,
    banksCA,
    names,
    templates,
    presets
  });

  const controls = wireControls(
    () => {
      clearExtraViews();
      updateConfig({ seed: randomSeed(), dateRange: getDateRange90Days() });
      controls.syncDomToConfig();
      controls.updateConfigFromDom();
      createSampleAndRender();
    }
  );

  controls.fillPresets(getState().datasets.presets);
  controls.updateConfigFromDom();

  wireExportButtons();
  wireThemeToggle();
  wireLegacyVersionLink();
  setupTabs();
  setupFlipToggle();
  setupHoverFocus();

  subscribe((state) => {
    renderPreview(state);
  });

  createSampleAndRender();
  refreshAfterFontsLoad();
}

init().catch((error) => {
  console.error(error);
  alert(`Initialization error: ${error.message}`);
});
