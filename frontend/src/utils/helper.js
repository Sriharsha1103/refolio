const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const getMonthName = (m) => {
    if (m === null || m === undefined) return "";
    const n = Number(m);
    if (!Number.isNaN(n)) {
        if (n >= 1 && n <= 12) return MONTH_NAMES[n - 1];
        if (n >= 0 && n <= 11) return MONTH_NAMES[n];
    }
    return String(m);
};

const cjbOptions = [
  { value: "C", label: "Conference" },
  { value: "J", label: "Journal" },
  { value: "B", label: "Book" },
  { value: "BC", label: "Book Chapter" },
];

export const getCJBLabel = (value) => {
    const option = cjbOptions.find(opt => opt.value === value);
    return option ? option.label : "";
}

const branchOptions = ["CSE", "IT", "ECE", "EEE", "AI/ML", "BS&H"];
const nationalityOptions = ["National", "International"];
const binaryOptions = ["Yes", "No"];
const authorPositionOptions = [
  "Single",
  "First",
  "Second",
  "Third",
  "Fourth",
  "Fifth",
  "Others",
];

export {
    branchOptions,
    nationalityOptions,
    binaryOptions,
    authorPositionOptions,
    cjbOptions,
    MONTH_NAMES
}