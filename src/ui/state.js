import { createDefaultScenarioConfig } from "../core/model.js";

const state = {
  config: createDefaultScenarioConfig(),
  sample: null,
  activeTab: "front",
  datasets: {
    banks: [],
    names: { payors: [], payees: [], memos: [] },
    templates: [],
    presets: []
  }
};

const listeners = new Set();

export function getState() {
  return state;
}

export function setState(patch) {
  Object.assign(state, patch);
  listeners.forEach((listener) => listener(state));
}

export function updateConfig(patch) {
  state.config = {
    ...state.config,
    ...patch,
    amountRange: {
      ...state.config.amountRange,
      ...(patch.amountRange || {})
    },
    dateRange: {
      ...state.config.dateRange,
      ...(patch.dateRange || {})
    },
    effects: {
      ...state.config.effects,
      ...(patch.effects || {})
    },
    visibility: {
      ...state.config.visibility,
      ...(patch.visibility || {})
    },
    manual: {
      ...state.config.manual,
      ...(patch.manual || {})
    }
  };
  listeners.forEach((listener) => listener(state));
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
