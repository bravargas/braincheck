import { applyPreset } from "../core/presets.js";
import { getState, setState, updateConfig } from "./state.js";

function asNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export function wireControls(onGenerate, onRandomize) {
  const mode = document.getElementById("mode");
  const seed = document.getElementById("seed");
  const preset = document.getElementById("preset");
  const amountMin = document.getElementById("amountMin");
  const amountMax = document.getElementById("amountMax");
  const dateStart = document.getElementById("dateStart");
  const dateEnd = document.getElementById("dateEnd");
  const blur = document.getElementById("blur");
  const brightness = document.getElementById("brightness");
  const rotation = document.getElementById("rotation");

  const manualPayor = document.getElementById("manualPayor");
  const manualPayee = document.getElementById("manualPayee");
  const manualBank = document.getElementById("manualBank");
  const manualAmount = document.getElementById("manualAmount");
  const manualDate = document.getElementById("manualDate");

  const showPayee = document.getElementById("showPayee");
  const showAmount = document.getElementById("showAmount");
  const showDate = document.getElementById("showDate");
  const showSignature = document.getElementById("showSignature");
  const showMicr = document.getElementById("showMicr");

  const generateBtn = document.getElementById("generateBtn");
  const randomizeBtn = document.getElementById("randomizeBtn");

  const fields = [
    mode,
    seed,
    preset,
    amountMin,
    amountMax,
    dateStart,
    dateEnd,
    blur,
    brightness,
    rotation,
    manualPayor,
    manualPayee,
    manualBank,
    manualAmount,
    manualDate,
    showPayee,
    showAmount,
    showDate,
    showSignature,
    showMicr
  ];

  fields.forEach((el) => {
    const eventType = el.type === "checkbox" ? "change" : "input";
    el.addEventListener(eventType, () => {
      updateConfigFromDom();
    });
  });

  preset.addEventListener("change", () => {
    const current = getState().config;
    const next = applyPreset(current, getState().datasets.presets, preset.value);
    updateConfig(next);
    syncDomToConfig();
  });

  generateBtn.addEventListener("click", onGenerate);
  randomizeBtn.addEventListener("click", onRandomize);

  function updateConfigFromDom() {
    updateConfig({
      mode: mode.value,
      seed: seed.value,
      presetId: preset.value,
      amountRange: {
        min: asNumber(amountMin.value, 1),
        max: asNumber(amountMax.value, 1000)
      },
      dateRange: {
        start: dateStart.value,
        end: dateEnd.value
      },
      effects: {
        blur: asNumber(blur.value, 0),
        brightness: asNumber(brightness.value, 1),
        rotation: asNumber(rotation.value, 0)
      },
      visibility: {
        showPayee: showPayee.checked,
        showAmount: showAmount.checked,
        showDate: showDate.checked,
        showSignature: showSignature.checked,
        showMicr: showMicr.checked
      },
      manual: {
        payor: manualPayor.value.trim(),
        payee: manualPayee.value.trim(),
        bank: manualBank.value.trim(),
        amount: manualAmount.value === "" ? null : asNumber(manualAmount.value, 0),
        date: manualDate.value
      }
    });
  }

  function syncDomToConfig() {
    const cfg = getState().config;
    mode.value = cfg.mode;
    seed.value = cfg.seed;
    preset.value = cfg.presetId;
    amountMin.value = String(cfg.amountRange.min);
    amountMax.value = String(cfg.amountRange.max);
    dateStart.value = cfg.dateRange.start;
    dateEnd.value = cfg.dateRange.end;
    blur.value = String(cfg.effects.blur);
    brightness.value = String(cfg.effects.brightness);
    rotation.value = String(cfg.effects.rotation);
    showPayee.checked = cfg.visibility.showPayee;
    showAmount.checked = cfg.visibility.showAmount;
    showDate.checked = cfg.visibility.showDate;
    showSignature.checked = cfg.visibility.showSignature;
    showMicr.checked = cfg.visibility.showMicr;
    manualPayor.value = cfg.manual.payor;
    manualPayee.value = cfg.manual.payee;
    manualBank.value = cfg.manual.bank;
    manualAmount.value = cfg.manual.amount ?? "";
    manualDate.value = cfg.manual.date;
  }

  return {
    updateConfigFromDom,
    syncDomToConfig,
    fillPresets(presets) {
      preset.innerHTML = presets
        .map((entry) => `<option value="${entry.id}">${entry.name}</option>`)
        .join("");
      setState({});
      syncDomToConfig();
    }
  };
}
