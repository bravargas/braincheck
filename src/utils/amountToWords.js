const ONES = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen"
];

const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function integerToWords(num) {
  if (num < 20) {
    return ONES[num];
  }

  if (num < 100) {
    const ten = Math.floor(num / 10);
    const rest = num % 10;
    return rest ? `${TENS[ten]}-${ONES[rest]}` : TENS[ten];
  }

  if (num < 1000) {
    const hundred = Math.floor(num / 100);
    const rest = num % 100;
    return rest ? `${ONES[hundred]} Hundred ${integerToWords(rest)}` : `${ONES[hundred]} Hundred`;
  }

  if (num < 1000000) {
    const thousand = Math.floor(num / 1000);
    const rest = num % 1000;
    return rest ? `${integerToWords(thousand)} Thousand ${integerToWords(rest)}` : `${integerToWords(thousand)} Thousand`;
  }

  return "Amount Too Large";
}

export function amountToWords(amount) {
  const safe = Number.isFinite(amount) && amount >= 0 ? amount : 0;
  const dollars = Math.floor(safe);
  const cents = Math.round((safe - dollars) * 100);
  return `${integerToWords(dollars)} and ${String(cents).padStart(2, "0")}/100 Dollars`;
}
