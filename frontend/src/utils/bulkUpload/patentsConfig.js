import { Departments, PatentsKey } from "../../Service/keyValueMap";

export const columnOrder = [
  "title",
  "authors",
  "pat_no",
  "dept",
  "design_utility",
  "filed",
  "year",
  "published",
  "abstract",
  "country",
];

export const sampleHeaders = {
  title: PatentsKey.title + "*",
  authors: PatentsKey.authors + "*",
  pat_no: PatentsKey.pat_no + "*",
  dept: PatentsKey.dept + "*",
  design_utility: PatentsKey.design_utility + "*",
  filed: PatentsKey.filed + "*",
  year: PatentsKey.year,
  published: PatentsKey.published,
  abstract: PatentsKey.abstract,
  country: PatentsKey.country + "*",
};

const parseDateString = (dateString) => {
  const [day, month, year] = String(dateString).split("/").map(Number);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
};

const convertDate = (val) => {
  if (val === null || val === undefined || val === "") return null;
  if (typeof val === "string") {
    return parseDateString(val);
  }
  const excelTimestamp = Number(val);
  if (isNaN(excelTimestamp)) return null;
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const excelEpoch = new Date(1899, 11, 30);
  const jsTime = excelEpoch.getTime() + excelTimestamp * millisecondsPerDay;
  return new Date(jsTime);
};

const inDateRange = (d) => {
  if (!(d instanceof Date) || isNaN(d)) return false;
  const currentDate = new Date();
  const lowerBound = new Date("2012-01-01");
  return d >= lowerBound && d <= currentDate;
};

export const preprocessRow = (row) => ({
  ...row,
  year: row.year === "" ? null : convertDate(row.year),
  published: row.published === "" ? null : convertDate(row.published),
  filed: row.filed === "" ? null : convertDate(row.filed),
  dept: row.dept === "" ? [] : String(row.dept).split(",").map((item) => item.trim().toUpperCase()),
});

export const duplicateCheck = (row, existingPatNos) => {
  if (existingPatNos.includes(row.pat_no)) return "Duplicate Patent Number";
  return null;
};

export const validateRow = (row, i) => {
  if (
    row.title === "" ||
    row.authors === "" ||
    row.pat_no === "" ||
    (Array.isArray(row.dept) && row.dept.length === 0) ||
    (Array.isArray(row.dept) && row.dept.some((item) => !Departments.includes(item))) ||
    (row.design_utility !== "Design" && row.design_utility !== "Utility") ||
    row.country === "" ||
    !inDateRange(row.filed) ||
    (row.year !== null && !inDateRange(row.year)) ||
    (row.published !== null && !inDateRange(row.published))
  ) {
    return `Incorrect Data in the Excel at row ${i + 2} ${row.title} patent.`;
  }
  return null;
};
