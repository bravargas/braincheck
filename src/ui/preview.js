import { renderSample } from "../render/renderer.js";

function getSecondaryPanes(allTabButtons) {
  const allowedPanes = new Set(
    allTabButtons
      .map((button) => button.dataset.tab)
      .filter(Boolean)
  );

  return Array.from(document.querySelectorAll(".tab-body[data-pane]")).filter((pane) =>
    allowedPanes.has(pane.dataset.pane)
  );
}

export function clearExtraViews() {
  const allTabButtons = Array.from(document.querySelectorAll("button[data-tab]"));
  const secondaryPanes = getSecondaryPanes(allTabButtons);
  const aboutBackdrop = document.getElementById("aboutBackdrop");

  allTabButtons.forEach((button) => button.classList.remove("active"));
  secondaryPanes.forEach((pane) => pane.classList.remove("active"));
  if (aboutBackdrop) {
    aboutBackdrop.classList.remove("active");
  }
}

export function setupTabs() {
  const allTabButtons = Array.from(document.querySelectorAll("button[data-tab]"));
  const secondaryPanes = getSecondaryPanes(allTabButtons);
  const aboutPane = document.querySelector('.tab-body[data-pane="about"]');
  const aboutBackdrop = document.getElementById("aboutBackdrop");
  const closeAboutBtn = document.getElementById("closeAboutBtn");

  const setAboutOpen = (isOpen) => {
    allTabButtons.forEach((btn) => btn.classList.toggle("active", isOpen && btn.dataset.tab === "about"));

    if (aboutPane) {
      aboutPane.classList.toggle("active", isOpen);
    }

    secondaryPanes
      .filter((pane) => pane.dataset.pane !== "about")
      .forEach((pane) => pane.classList.remove("active"));

    if (aboutBackdrop) {
      aboutBackdrop.classList.toggle("active", isOpen);
    }
  };

  // Tab buttons in secondary views
  allTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.tab;
      if (tab === "about") {
        const isOpen = aboutPane?.classList.contains("active");
        setAboutOpen(!isOpen);
        return;
      }

      allTabButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === tab));
      secondaryPanes.forEach((pane) => pane.classList.toggle("active", pane.dataset.pane === tab));
    });
  });

  if (closeAboutBtn) {
    closeAboutBtn.addEventListener("click", () => setAboutOpen(false));
  }

  if (aboutBackdrop) {
    aboutBackdrop.addEventListener("click", () => setAboutOpen(false));
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && aboutPane?.classList.contains("active")) {
      setAboutOpen(false);
    }
  });
}

export function setupFlipToggle() {
  const modeButtons = Array.from(document.querySelectorAll(".view-mode-btn[data-view-mode]"));
  const flipBtn = document.getElementById("flipViewBtn");
  const flipLabel = document.getElementById("flipLabel");
  if (!modeButtons.length && (!flipBtn || !flipLabel)) return;

  let viewMode = "both"; // front, rear, both

  const updateViewMode = (mode) => {
    viewMode = mode;
    const frontPane = document.querySelector('[data-pane="front"]');
    const rearPane = document.querySelector('[data-pane="rear"]');
    const bothContainer = document.getElementById("bothViewsContainer");

    modeButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.viewMode === mode);
      button.setAttribute("aria-pressed", String(button.dataset.viewMode === mode));
    });

    // Hide all
    if (frontPane) frontPane.classList.remove("active");
    if (rearPane) rearPane.classList.remove("active");
    if (bothContainer) bothContainer.classList.remove("active");

    // Show selected mode
    if (mode === "front") {
      if (frontPane) frontPane.classList.add("active");
      if (flipLabel) flipLabel.textContent = "Front";
    } else if (mode === "rear") {
      if (rearPane) rearPane.classList.add("active");
      if (flipLabel) flipLabel.textContent = "Rear";
    } else if (mode === "both") {
      if (bothContainer) bothContainer.classList.add("active");
      if (flipLabel) flipLabel.textContent = "Both";
    }
  };

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => updateViewMode(button.dataset.viewMode));
  });

  if (flipBtn) {
    flipBtn.addEventListener("click", () => {
      const nextMode =
        viewMode === "front" ? "rear" : viewMode === "rear" ? "both" : "front";
      updateViewMode(nextMode);
    });
  }

  // Initialize with both view by default
  updateViewMode("both");
}

export function renderPreview(state) {
  if (!state.sample) {
    return;
  }

  const sampleForRender = {
    ...state.sample,
    scenario: {
      ...state.sample.scenario,
      effects: { ...state.config.effects },
      visibility: { ...state.config.visibility }
    }
  };

  const frontCanvas = document.getElementById("frontCanvas");
  const rearCanvas = document.getElementById("rearCanvas");
  const frontCanvasBoth = document.getElementById("frontCanvasBoth");
  const rearCanvasBoth = document.getElementById("rearCanvasBoth");

  const frontCtx = frontCanvas.getContext("2d");
  const rearCtx = rearCanvas.getContext("2d");

  renderSample(frontCtx, rearCtx, sampleForRender, state.config.effects);

  // Also render to both-views canvases if they exist
  if (frontCanvasBoth && rearCanvasBoth) {
    const frontCtxBoth = frontCanvasBoth.getContext("2d");
    const rearCtxBoth = rearCanvasBoth.getContext("2d");
    renderSample(frontCtxBoth, rearCtxBoth, sampleForRender, state.config.effects);
  }

  const jsonOutput = document.getElementById("jsonOutput");
  if (jsonOutput) {
    jsonOutput.value = JSON.stringify(state.sample, null, 2);
  }

  const base64Output = document.getElementById("base64Output");
  if (base64Output) {
    base64Output.value = frontCanvas.toDataURL("image/png");
  }
}
