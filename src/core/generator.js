import { amountToWords } from "../utils/amountToWords.js";
import { randomDateInRange, toIsoDate } from "../utils/dateUtils.js";
import { createSeededRandom } from "./seededRandom.js";

function clampAmountRange(min, max) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { min: 1, max: 1000 };
  }
  return min <= max ? { min, max } : { min: max, max: min };
}

function generateFictionalMicrLine(random) {
  const prefix = `X${random.int(10, 99)}`;
  const middle = `SIM${random.int(1000, 9999)}`;
  const suffix = `DEMO${random.int(10000, 99999)}`;
  return `${prefix} | ${middle} | ${suffix} | NOT-REAL`;
}

function generateFictionalIdentifier(random) {
  return `FICTION-${random.int(100000, 999999)}-${random.int(100, 999)}`;
}

function chooseTemplate(templates, random) {
  if (!Array.isArray(templates) || templates.length === 0) {
    return {
      id: "fallback-template",
      name: "Fallback Template",
      width: 960,
      height: 420,
      background: "#f9f9f9",
      accent: "#224255"
    };
  }
  return random.pick(templates);
}

export function generateCheckSample(config, data) {
  const random = createSeededRandom(config.seed);
  const { min, max } = clampAmountRange(
    Number(config.amountRange.min),
    Number(config.amountRange.max)
  );

  const template = chooseTemplate(data.templates, random);
  const randomPayor = random.pick(data.names.payors);
  const randomPayee = random.pick(data.names.payees);
  const randomBank = random.pick(data.banks);
  const randomAmount = Number((random.next() * (max - min) + min).toFixed(2));
  const randomDate = randomDateInRange(config.dateRange.start, config.dateRange.end, random);

  const manual = config.manual;
  const payor = config.mode === "manual" && manual.payor ? manual.payor : randomPayor;
  const payee = config.mode === "manual" && manual.payee ? manual.payee : randomPayee;
  const bankName = config.mode === "manual" && manual.bank ? manual.bank : randomBank.name;
  const amount =
    config.mode === "manual" && Number.isFinite(Number(manual.amount)) && Number(manual.amount) > 0
      ? Number(manual.amount)
      : randomAmount;
  const date = config.mode === "manual" && manual.date ? manual.date : randomDate;

  const amountWords = amountToWords(amount);
  const checkNumber = `CHK-${random.int(1000, 9999)}`;
  const memo = random.pick(data.names.memos);

  return {
    id: `sample-${Date.now()}-${random.int(100, 999)}`,
    templateId: template.id,
    watermark: "SAMPLE",
    payor,
    payee,
    bankName,
    memo,
    amount,
    amountWords,
    date: toIsoDate(new Date(date)),
    checkNumber,
    fictionalIdentifier: generateFictionalIdentifier(random),
    micrDemoLine: generateFictionalMicrLine(random),
    signature: "Synthetic Signature",
    scenario: {
      ...config,
      amountRange: { ...config.amountRange },
      dateRange: { ...config.dateRange },
      effects: { ...config.effects },
      visibility: { ...config.visibility },
      manual: { ...config.manual }
    },
    template
  };
}
