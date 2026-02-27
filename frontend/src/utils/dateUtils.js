const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const pad2 = (n) => String(n).padStart(2, "0");

export const formatDDMMMYYYY = (date) => {
  if (!(date instanceof Date)) return "";
  const t = date.getTime();
  if (Number.isNaN(t)) return "";
  const dd = pad2(date.getUTCDate());
  const mmm = MONTHS_SHORT[date.getUTCMonth()];
  const yyyy = date.getUTCFullYear();
  return `${dd}-${mmm}-${yyyy}`;
};

export const parseDDMMMYYYY = (s) => {
  const m = /^(\d{2})-([A-Za-z]{3})-(\d{4})$/.exec(String(s).trim());
  if (!m) return null;

  const day = Number(m[1]);
  const mon = m[2].toLowerCase();
  const year = Number(m[3]);
  const monthIndex = MONTHS_SHORT.map((x) => x.toLowerCase()).indexOf(mon);
  if (monthIndex < 0) return null;

  const d = new Date(Date.UTC(year, monthIndex, day));
  // validate (e.g. 31-Feb should be rejected)
  if (
    d.getUTCFullYear() !== year ||
    d.getUTCMonth() !== monthIndex ||
    d.getUTCDate() !== day
  ) {
    return null;
  }
  return d;
};

export const toDateInputValue = (value) => {
  if (!value) return "";

  if (value instanceof Date) {
    return formatDDMMMYYYY(value);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";

    // already dd-mmm-yyyy
    if (/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(trimmed)) {
      const parsed = parseDDMMMYYYY(trimmed);
      return parsed ? formatDDMMMYYYY(parsed) : "";
    }

    // accept ISO yyyy-mm-dd (and longer ISO strings)
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const parsed = new Date(`${trimmed}T00:00:00.000Z`);
      return formatDDMMMYYYY(parsed);
    }
    if (trimmed.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
      const iso = trimmed.slice(0, 10);
      const parsed = new Date(`${iso}T00:00:00.000Z`);
      return formatDDMMMYYYY(parsed);
    }

    // last resort: let Date parse, but format safely
    const parsed = new Date(trimmed);
    return formatDDMMMYYYY(parsed);
  }

  return "";
};

export const toDateInput = (value) => {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

  const str = String(value).trim();
  if (!str) return null;

  const ddMmm = parseDDMMMYYYY(str);
  if (ddMmm) return ddMmm;

  const iso = /^\d{4}-\d{2}-\d{2}/.test(str) ? str.slice(0, 10) : null;
  if (iso) {
    const d = new Date(`${iso}T00:00:00.000Z`);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const fallback = new Date(str);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
};

export const getFullYearFromISO = (iso) => {
  const d = toDateInput(iso);
  return d ? String(d.getUTCFullYear()) : "";
};

export const getTodayISO = () => formatDDMMMYYYY(new Date());

export const monthsBetweenISO = (fromISO, toISO) => {
  const fromDate = toDateInput(fromISO);
  const toDate = toDateInput(toISO);
  if (!fromDate || !toDate) return 0;
  if (fromDate.getTime() > toDate.getTime()) return 0;

  const fy = fromDate.getUTCFullYear();
  const fm = fromDate.getUTCMonth() + 1;
  const ty = toDate.getUTCFullYear();
  const tm = toDate.getUTCMonth() + 1;
  if (!fy || !fm || !ty || !tm) return 0;

  return (ty - fy) * 12 + (tm - fm); // whole-month diff
};

export const formatYearsFromMonths = (months) => {
  const years = months / 12;
  // keep short, stable representation
  return Number.isFinite(years) ? years.toFixed(1) : "0.0";
};
