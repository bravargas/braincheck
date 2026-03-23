export function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function randomDateInRange(startIso, endIso, random) {
  const start = new Date(startIso || "2025-01-01");
  const end = new Date(endIso || "2026-12-31");
  const min = Math.min(start.getTime(), end.getTime());
  const max = Math.max(start.getTime(), end.getTime());
  const timestamp = min + random.next() * (max - min);
  return toIsoDate(new Date(timestamp));
}
