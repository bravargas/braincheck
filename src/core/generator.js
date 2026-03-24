import { amountToWords } from "../utils/amountToWords.js";
import { randomDateInRange, toIsoDate } from "../utils/dateUtils.js";
import { createSeededRandom } from "./seededRandom.js";

function pad(value, width) {
  return String(value).padStart(width, "0");
}

function clampAmountRange(min, max) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { min: 1, max: 1000 };
  }
  return min <= max ? { min, max } : { min: max, max: min };
}

function generateAccountNumber(random) {
  return String(random.int(10000000000, 99999999999));
}

function generateCanadianAccountNumber(random) {
  return `${pad(random.int(10000, 99999), 5)}D${pad(random.int(1000, 9999), 4)}`;
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

function generateCanadianMicrLine(bankTransit, accountNumber, checkSequence) {
  const TRANSIT = "A";
  const ON_US = "C";
  const SPACE = " ";
  const checkId = pad(checkSequence, 3);
  return (
    `${ON_US}${checkId}${ON_US}${SPACE}${TRANSIT}${bankTransit}${TRANSIT}${SPACE}` +
    `${accountNumber}${ON_US}`
  );
}

function generateCheckIdentifier(random) {
  return `${random.int(10000, 99999)}`;
}

function generateSyntheticPayorAddress(random, country, city, stateLine) {
  const streetNames = [
    "Oak",
    "Maple",
    "Cedar",
    "Pine",
    "Willow",
    "River",
    "Sunset",
    "Highland",
    "Meadow",
    "Lakeview"
  ];
  const streetTypes = ["St", "Ave", "Blvd", "Rd", "Ln", "Dr", "Way", "Ct"];
  const streetNumber = random.int(100, 9999);
  const street = `${streetNumber} ${random.pick(streetNames)} ${random.pick(streetTypes)}`;

  if (country === "ca") {
    const parts = String(stateLine || "ON M5J 2J5").trim().split(/\s+/);
    const province = parts[0] || "ON";
    const postal = parts.slice(1).join(" ") || "M5J 2J5";
    return `${street}, ${city || "TORONTO"}, ${province} ${postal}`;
  }

  const state = String(stateLine || "MO").trim().slice(0, 2).toUpperCase() || "MO";
  const zip = String(random.int(10000, 99999));
  return `${street}, ${city || "OZARK"}, ${state} ${zip}`;
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
  const country = config.country === "ca" ? "ca" : "us";
  const usBanks = Array.isArray(data.banksUS) && data.banksUS.length ? data.banksUS : [];
  const caBanks = Array.isArray(data.banksCA) && data.banksCA.length
    ? data.banksCA
    : [
        {
          transit: "06710",
          institution: "003",
          shortName: "RBC TORONTO",
          longName: "ROYAL BANK OF CANADA",
          city: "TORONTO",
          state: "ON M5J 2J5"
        }
      ];
  const { min, max } = clampAmountRange(
    Number(config.amountRange.min),
    Number(config.amountRange.max)
  );

  const template = chooseTemplate(data.templates, random);
  const randomPayor = random.pick(data.names.payors);
  const randomPayee = random.pick(data.names.payees);
  const randomBank = random.pick(usBanks);
  const randomCanadianBank = random.pick(caBanks);
  const randomAmount = Number((random.next() * (max - min) + min).toFixed(2));
  const randomDate = randomDateInRange(config.dateRange.start, config.dateRange.end, random);

  const manual = config.manual;
  const payor = manual.payor ? manual.payor : randomPayor;
  const payee = manual.payee ? manual.payee : randomPayee;
  const bankName = manual.bank
    ? manual.bank
    : country === "ca"
      ? randomCanadianBank.shortName || randomCanadianBank.longName || randomCanadianBank.name || "SYNTH BANK CA"
      : randomBank.shortName || randomBank.longName || randomBank.name || "SYNTH BANK";
  const amount = Number.isFinite(Number(manual.amount)) && Number(manual.amount) > 0 ? Number(manual.amount) : randomAmount;
  const date = manual.date ? manual.date : randomDate;

  const amountWords = amountToWords(amount);
  const checkSequence = country === "ca" ? String(random.int(1, 999)) : String(random.int(10000, 99999));
  const checkNumber = country === "ca" ? pad(checkSequence, 3) : `${checkSequence}`;
  const accountNumber = country === "ca" ? generateCanadianAccountNumber(random) : generateAccountNumber(random);
  const canadianTransit = country === "ca"
    ? `${pad(randomCanadianBank.transit || random.int(1000, 9999), 5)}D${pad(randomCanadianBank.institution || random.int(1, 999), 3)}`
    : "";
  const memo = random.pick(data.names.memos);

  const bankRtn = country === "ca" ? canadianTransit : randomBank.rtn || "081505731";
  const bankCity = country === "ca" ? randomCanadianBank.city : randomBank.city || "OZARK";
  const bankState = country === "ca"
    ? randomCanadianBank.state || randomCanadianBank.province || "ON"
    : randomBank.state || "MO";
  const micrLine = country === "ca"
    ? generateCanadianMicrLine(canadianTransit, accountNumber, checkSequence)
    : generateMicrLine(randomBank, accountNumber, checkSequence);
  const payorAddress = generateSyntheticPayorAddress(random, country, bankCity, bankState);

  return {
    id: `${Date.now()}-${random.int(100, 999)}`,
    templateId: template.id,
    watermark: "*** SAMPLE VOID***",
    payor,
    payorAddress,
    payee,
    bankName,
    bankRtn,
    bankShortName: country === "ca" ? (randomCanadianBank.shortName || bankName) : (randomBank.shortName || bankName),
    bankLongName: country === "ca" ? (randomCanadianBank.longName || bankName) : (randomBank.longName || bankName),
    bankState,
    bankCity,
    bankV1: country === "ca" ? (randomCanadianBank.v1 || "Y") : (randomBank.v1 || "Y"),
    bankV2: country === "ca" ? (randomCanadianBank.v2 || "") : (randomBank.v2 || ""),
    bankV3: country === "ca" ? (randomCanadianBank.v3 || "Y20260323") : (randomBank.v3 || "Y20040220"),
    memo,
    amount,
    amountWords,
    date: toIsoDate(new Date(date)),
    checkNumber,
    accountNumber: accountNumber,
    checkIdentifier: generateCheckIdentifier(random),
    micrLine,
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
