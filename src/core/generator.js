import { amountToWords } from "../utils/amountToWords.js";
import { randomDateInRange, toIsoDate } from "../utils/dateUtils.js";
import { createSeededRandom } from "./seededRandom.js";

function clampAmountRange(min, max) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { min: 1, max: 1000 };
  }
  return min <= max ? { min, max } : { min: max, max: min };
}

function generateAccountNumber(random) {
  return String(random.int(10000000000, 99999999999));
}

function buildSyntheticTransitFromRtn(sourceRtn) {
  const digits = String(sourceRtn || "").replace(/\D/g, "").padStart(9, "0").slice(0, 9);

  // Keep linkage to source data while making this value intentionally non-usable.
  return `${digits.slice(1, 8)}`;
}

function generateMicrLine(bank, accountNumber, checkSequence) {
  // Placeholder letters are interpreted by many MICR fonts as symbols.
  const TRANSIT = "A";
  const ON_US = "C";
  const DASH = "D";
  const SPACE = " ";

  const RTN = buildSyntheticTransitFromRtn(bank?.rtn);
  return (
    `${TRANSIT}${RTN}${TRANSIT}${SPACE}` +
    `${accountNumber}${ON_US}${SPACE}` +
    `${checkSequence}`
  );
}

function generateCheckIdentifier(random) {
  return `${random.int(10000, 99999)}`;
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
  const payor = manual.payor ? manual.payor : randomPayor;
  const payee = manual.payee ? manual.payee : randomPayee;
  const bankName = manual.bank ? manual.bank : randomBank.shortName || randomBank.longName || randomBank.name || "SYNTH BANK";
  const amount = Number.isFinite(Number(manual.amount)) && Number(manual.amount) > 0 ? Number(manual.amount) : randomAmount;
  const date = manual.date ? manual.date : randomDate;

  const amountWords = amountToWords(amount);
  const checkSequence = String(random.int(10000, 99999));
  const checkNumber = `${checkSequence}`;
  const accountNumber = generateAccountNumber(random);
  const memo = random.pick(data.names.memos);

  return {
    id: `${Date.now()}-${random.int(100, 999)}`,
    templateId: template.id,
    watermark: "SAMPLE",
    payor,
    payee,
    bankName,
    bankRtn: randomBank.rtn || "081505731",
    bankShortName: randomBank.shortName || bankName,
    bankLongName: randomBank.longName || bankName,
    bankState: randomBank.state || "MO",
    bankCity: randomBank.city || "OZARK",
    bankV1: randomBank.v1 || "Y",
    bankV2: randomBank.v2 || "",
    bankV3: randomBank.v3 || "Y20040220",
    memo,
    amount,
    amountWords,
    date: toIsoDate(new Date(date)),
    checkNumber,
    accountNumber: accountNumber,
    checkIdentifier: generateCheckIdentifier(random),
    micrLine: generateMicrLine(randomBank, accountNumber, checkSequence),
    signature: payor,
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
