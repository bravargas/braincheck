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
 * @property {string} mode - random | manual
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
 * @property {string} payee
 * @property {string} bankName
 * @property {string} memo
 * @property {number} amount
 * @property {string} amountWords
 * @property {string} date
 * @property {string} checkNumber
 * @property {string} fictionalIdentifier
 * @property {string} micrDemoLine
 * @property {string} signature
 * @property {ScenarioConfig} scenario
 */

export function createDefaultScenarioConfig() {
  return {
    mode: "random",
    seed: "demo-seed-001",
    presetId: "default-balanced",
    amountRange: { min: 25, max: 1500 },
    dateRange: { start: "2025-01-01", end: "2026-12-31" },
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
      showMicr: true
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
