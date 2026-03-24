import { applyPreset } from "../core/presets.js";
import { getState, setState, updateConfig } from "./state.js";

function asNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function parseManualDateToIso(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }

  const mdy = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!mdy) return "";

  const month = Number(mdy[1]);
  const day = Number(mdy[2]);
  const year = Number(mdy[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return "";
  }

  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatIsoToMdy(value) {
  const raw = String(value || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }

  const [year, month, day] = raw.split("-");
  return `${month}/${day}/${year}`;
}

export function wireControls(onGenerate) {
  const checkCountry = document.getElementById("checkCountry");
  const preset = document.getElementById("preset");
  const amountMin = document.getElementById("amountMin");
  const amountMax = document.getElementById("amountMax");
  const blur = document.getElementById("blur");
  const brightness = document.getElementById("brightness");
  const rotation = document.getElementById("rotation");

  const manualPayor = document.getElementById("manualPayor");
  const manualPayee = document.getElementById("manualPayee");
  const manualBank = document.getElementById("manualBank");
  const manualAmount = document.getElementById("manualAmount");
  const manualDate = document.getElementById("manualDate");
  const clearManualBtn = document.getElementById("clearManualBtn");

  const showPayee = document.getElementById("showPayee");
  const showAmount = document.getElementById("showAmount");
  const showDate = document.getElementById("showDate");
  const showSignature = document.getElementById("showSignature");
  const showMicr = document.getElementById("showMicr");
  const showWatermark = document.getElementById("showWatermark");

  const generateBtn = document.getElementById("generateBtn");

  const fields = [
    checkCountry,
    preset,
    amountMin,
    amountMax,
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
    showMicr,
    showWatermark
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
  clearManualBtn.addEventListener("click", () => {
    manualPayor.value = "";
    manualPayee.value = "";
    manualBank.value = "";
    manualAmount.value = "";
    manualDate.value = "";
    updateConfigFromDom();
  });

  function updateConfigFromDom() {
    updateConfig({
      country: checkCountry.value,
      presetId: preset.value,
      amountRange: {
        min: asNumber(amountMin.value, 1),
        max: asNumber(amountMax.value, 1000)
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
        showMicr: showMicr.checked,
        showWatermark: showWatermark.checked
      },
      manual: {
        payor: manualPayor.value.trim(),
        payee: manualPayee.value.trim(),
        bank: manualBank.value.trim(),
        amount: manualAmount.value === "" ? null : asNumber(manualAmount.value, 0),
        date: parseManualDateToIso(manualDate.value)
      }
    });
  }

  function syncDomToConfig() {
    const cfg = getState().config;
    checkCountry.value = cfg.country || "us";
    preset.value = cfg.presetId;
    amountMin.value = String(cfg.amountRange.min);
    amountMax.value = String(cfg.amountRange.max);
    blur.value = String(cfg.effects.blur);
    brightness.value = String(cfg.effects.brightness);
    rotation.value = String(cfg.effects.rotation);
    showPayee.checked = cfg.visibility.showPayee;
    showAmount.checked = cfg.visibility.showAmount;
    showDate.checked = cfg.visibility.showDate;
    showSignature.checked = cfg.visibility.showSignature;
    showMicr.checked = cfg.visibility.showMicr;
    showWatermark.checked = cfg.visibility.showWatermark ?? true;
    manualPayor.value = cfg.manual.payor;
    manualPayee.value = cfg.manual.payee;
    manualBank.value = cfg.manual.bank;
    manualAmount.value = cfg.manual.amount ?? "";
    manualDate.value = formatIsoToMdy(cfg.manual.date);
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
