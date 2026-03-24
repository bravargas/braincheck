import { renderSample } from "../render/renderer.js";

export function setupTabs() {
  const allTabButtons = Array.from(document.querySelectorAll("button[data-tab]"));
  const panes = Array.from(document.querySelectorAll(".tab-body"));

  // Tab buttons in Extra Views (JSON/Base64/About)
  allTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.tab;
      allTabButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === tab));
      panes.forEach((pane) => pane.classList.toggle("active", pane.dataset.pane === tab));
    });
  });
}

export function setupFlipToggle() {
  const flipBtn = document.getElementById("flipViewBtn");
  if (!flipBtn) return;

  flipBtn.addEventListener("click", () => {
    const currentPane = document.querySelector(".tab-body.active")?.dataset.pane || "front";
    const newTab = currentPane === "front" ? "rear" : "front";
    
    // Update active pane
    const panes = Array.from(document.querySelectorAll(".tab-body"));
    panes.forEach((pane) => pane.classList.toggle("active", pane.dataset.pane === newTab));
  });
}

export function renderPreview(state) {
  if (!state.sample) {
    return;
  }

  const frontCanvas = document.getElementById("frontCanvas");
  const rearCanvas = document.getElementById("rearCanvas");
  const frontCtx = frontCanvas.getContext("2d");
  const rearCtx = rearCanvas.getContext("2d");

  renderSample(frontCtx, rearCtx, state.sample, state.config.effects);

  const jsonOutput = document.getElementById("jsonOutput");
  jsonOutput.value = JSON.stringify(state.sample, null, 2);

  const base64Output = document.getElementById("base64Output");
  base64Output.value = frontCanvas.toDataURL("image/png");
}
