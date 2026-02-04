import { PublicationsKey } from "../../Service/keyValueMap";

export const columnOrder = [
  "title",
  "branch",
  "username",
  "cjb",
  "name_cjb",
  "vol",
  "issue",
  "year",
  "month",
  "doi",
  "nationality",
  "organised_by",
  "is_proceeding",
  "is_published",
  "scl",
  "citation_scopus",
  "citation_google",
  "link",
  "is_affilated",
  "author_no",
  "starting_page",
  "ending_page",
  "cite",
];

export const sampleHeaders = {
  title: PublicationsKey.title + "*",
  branch: PublicationsKey.branch + "*",
  username: PublicationsKey.username + "*",
  cjb: PublicationsKey.cjb + "*",
  name_cjb: PublicationsKey.name_cjb + "*",
  vol: PublicationsKey.vol,
  issue: PublicationsKey.issue,
  year: PublicationsKey.year + "*",
  month: PublicationsKey.month + "*",
  doi: PublicationsKey.doi + "*",
  nationality: PublicationsKey.nationality + "*",
  organised_by: PublicationsKey.organised_by,
  is_proceeding: PublicationsKey.is_proceeding,
  is_published: PublicationsKey.is_published,
  scl: PublicationsKey.scl + "*",
  citation_scopus: PublicationsKey.citation_scopus,
  citation_google: PublicationsKey.citation_google,
  link: PublicationsKey.link + "*",
  is_affilated: PublicationsKey.is_affilated,
  author_no: PublicationsKey.author_no,
  starting_page: "Starting Page",
  ending_page: "Ending Page",
  cite: PublicationsKey.cite + "*",
};

const checkYear = (year) => {
  const y = parseInt(year);
  const now = new Date().getFullYear();
  return !(y && y > 2011 && y <= now);
};

const checkMonth = (month) => {
  const m = parseInt(month);
  return !(m && m > 0 && m < 13);
};

const checkPageNo = (page) => {
  if (page !== "") {
    const p = parseInt(page);
    return !p;
  }
  return false;
};

export const duplicateCheck = (row, existingTitles) => {
  if (existingTitles.includes(row.title)) return "Duplicate Title";
  return null;
};

export const validateRow = (row, i) => {
  if (
    row.title === "" ||
    row.username === "" ||
    (row.cjb !== "C" && row.cjb !== "J" && row.cjb !== "B" && row.cjb !== "BC") ||
    (row.branch !== "CSE" && row.branch !== "IT" && row.branch !== "ECE" && row.branch !== "EEE" && row.branch !== "AI/ML" && row.branch !== "BS&H") ||
    (row.nationality !== "National" && row.nationality !== "International") ||
    row.name_cjb === "" ||
    row.doi === "" ||
    row.cite === "" ||
    row.link === "" ||
    checkYear(row.year) ||
    checkMonth(row.month) ||
    (row.is_proceeding !== "" && row.is_proceeding !== "Yes" && row.is_proceeding !== "No") ||
    (row.is_published !== "" && row.is_published !== "Yes" && row.is_published !== "No") ||
    (row.is_affilated !== "" && row.is_affilated !== "Yes" && row.is_affilated !== "No") ||
    (row.author_no !== "" && row.author_no !== "Single" && row.author_no !== "First" && row.author_no !== "Second" && row.author_no !== "Third" && row.author_no !== "Fourth" && row.author_no !== "Fifth" && row.author_no !== "Others") ||
    checkPageNo(row.starting_page) ||
    checkPageNo(row.ending_page) ||
    row.scl === ""
  ) {
    return `Incorrect data at row ${i + 2} (${row.title}).`;
  }
  return null;
};
