/**
 * @typedef {Object} EffectSettings
 * @property {number} blur - Canvas blur radius in px.
 * @property {number} brightness - Brightness multiplier.
 * @property {number} rotation - Rotation in degrees.
 */

/**
 * @typedef {Object} VisibilitySettings
 * @property {boolean} showPayee
 * @property {boolean} showAmount
 * @property {boolean} showDate
 * @property {boolean} showSignature
 * @property {boolean} showMicr
 * @property {boolean} showWatermark
 */

/**
 * @typedef {Object} TemplateDefinition
 * @property {string} id
 * @property {string} name
 * @property {number} width
 * @property {number} height
 * @property {string} background
 * @property {string} accent
 */

/**
 * @typedef {Object} ScenarioConfig
 * @property {"us"|"ca"} country
 * @property {string} seed
 * @property {string} presetId
 * @property {{min:number, max:number}} amountRange
 * @property {{start:string, end:string}} dateRange
 * @property {EffectSettings} effects
 * @property {VisibilitySettings} visibility
 * @property {{payor:string, payee:string, bank:string, amount:number|null, date:string}} manual
 */

/**
 * @typedef {Object} GeneratedCheckSample
 * @property {string} id
 * @property {string} templateId
 * @property {string} watermark
 * @property {string} payor
 * @property {string} payorAddress
 * @property {string} payee
 * @property {string} bankName
 * @property {string} bankRtn
 * @property {string} bankShortName
 * @property {string} bankLongName
 * @property {string} bankState
 * @property {string} bankCity
 * @property {string} bankV1
 * @property {string} bankV2
 * @property {string} bankV3
 * @property {string} memo
 * @property {number} amount
 * @property {string} amountWords
 * @property {string} date
 * @property {string} checkNumber
 * @property {string} accountNumber
 * @property {string} checkIdentifier
 * @property {string} micrLine
 * @property {string} signature
 * @property {ScenarioConfig} scenario
 */

function getDateRange90Days() {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 90);
  const y = String(start.getFullYear()).padStart(4, "0");
  const m = String(start.getMonth() + 1).padStart(2, "0");
  const d = String(start.getDate()).padStart(2, "0");
  const startStr = `${y}-${m}-${d}`;

  const y2 = String(today.getFullYear()).padStart(4, "0");
  const m2 = String(today.getMonth() + 1).padStart(2, "0");
  const d2 = String(today.getDate()).padStart(2, "0");
  const endStr = `${y2}-${m2}-${d2}`;

  return { start: startStr, end: endStr };
}

export function createDefaultScenarioConfig() {
  return {
    country: "us",
    seed: `seed-${Math.random().toString(36).substr(2, 9)}`,
    presetId: "default-balanced",
    amountRange: { min: 1, max: 100 },
    dateRange: { start: getDateRange90Days().start, end: getDateRange90Days().end },
    effects: {
      blur: 0.4,
      brightness: 1,
      rotation: 0.3
    },
    visibility: {
      showPayee: true,
      showAmount: true,
      showDate: true,
      showSignature: true,
      showMicr: true,
      showWatermark: true
    },
    manual: {
      payor: "",
      payee: "",
      bank: "",
      amount: null,
      date: ""
    }
  };
}
