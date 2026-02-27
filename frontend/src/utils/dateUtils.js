export const toDateInputValue = (value) => {
  if (!value) return "";

  if (value instanceof Date) {
    const t = value.getTime();
    if (Number.isNaN(t)) return "";
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    if (trimmed.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
      return trimmed.slice(0, 10);
    }

    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
    return "";
  }

  return "";
};

export const getFullYearFromISO = (iso) => {
  const dateStr = toDateInputValue(iso);
  if (!dateStr) return "";
  const [year] = dateStr.split("-");
  return year;
};

export const getTodayISO = () => new Date().toISOString().slice(0, 10);

export const monthsBetweenISO = (fromISO, toISO) => {
  const from = toDateInputValue(fromISO);
  const to = toDateInputValue(toISO);
  if (!from || !to) return 0;
  if (from > to) return 0;

  const [fy, fm] = from.split("-").map(Number);
  const [ty, tm] = to.split("-").map(Number);
  if (!fy || !fm || !ty || !tm) return 0;

  return (ty - fy) * 12 + (tm - fm); // whole-month diff
};

export const formatYearsFromMonths = (months) => {
  const years = months / 12;
  // keep short, stable representation
  return Number.isFinite(years) ? years.toFixed(1) : "0.0";
};
