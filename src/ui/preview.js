import { renderSample } from "../render/renderer.js";

export function setupTabs() {
  const tabButtons = Array.from(document.querySelectorAll(".tabs button"));
  const panes = Array.from(document.querySelectorAll(".tab-body"));

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.tab;
      tabButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
      panes.forEach((pane) => pane.classList.toggle("active", pane.dataset.pane === tab));
    });
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
