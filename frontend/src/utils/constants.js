export const BRANCH_OPTIONS = [
  { value: "IT", label: "IT" },
  { value: "CSE", label: "CSE" },
  { value: "ECE", label: "ECE" },
  { value: "EEE", label: "EEE" },
  { value: "AI/ML", label: "AI/ML" },
  { value: "BS&H", label: "BS&H" },
  { value: "Admin", label: "Admin" },
  { value: "Others", label: "Others" },
];

export const NAV_LINKS_DEV = [
  { to: "/home", label: "Home", tab: "home", alwaysVisible: true },
  {
    to: "/publications",
    label: "Publications",
    tab: "publication",
    requiresAuth: true,
  },
  { to: "/patents", label: "Patents", tab: "patent", requiresAuth: true },
  {
    to: "/research",
    label: "Research Projects",
    tab: "research",
    requiresAuth: true,
  },
  {
    to: "/consultancy",
    label: "Consultancy Projects",
    tab: "consultancy",
    requiresAuth: true,
  },
  { to: "/profiles", label: "Profiles", tab: "profiles", requiresAuth: true },

  // Non-SuperAdmin links
  {
    to: "/insertPublications",
    label: "New Publication",
    tab: "new-publication",
    requiresAuth: true,
    hideForSuperAdmin: true,
  },
  {
    to: "/insertPatents",
    label: "New Patent",
    tab: "new-patent",
    requiresAuth: true,
    hideForSuperAdmin: true,
  },
  {
    to: "/insertResearch",
    label: "New Research Project",
    tab: "new-research",
    requiresAuth: true,
    hideForSuperAdmin: true,
  },
  {
    to: "/insertConsultancy",
    label: "New Consultancy Project",
    tab: "new-consultancy",
    requiresAuth: true,
    hideForSuperAdmin: true,
  },
  {
    to: "/insertProfile",
    label: "New Profile",
    tab: "new-profile",
    requiresAuth: true,
    hideForSuperAdmin: true,
  },

  // SuperAdmin links
  {
    to: "/users",
    label: "Users List",
    tab: "users",
    requiresAuth: true,
    requiresSuperAdmin: true,
  },
];

export const NAV_LINKS = [
  { to: "/refolio/home", label: "Home", tab: "home", alwaysVisible: true },
  {
    to: "/refolio/publications",
    label: "Publications",
    tab: "publication",
    requiresAuth: true,
  },
  {
    to: "/refolio/patents",
    label: "Patents",
    tab: "patent",
    requiresAuth: true,
  },
  {
    to: "/refolio/research",
    label: "Research Projects",
    tab: "research",
    requiresAuth: true,
  },
  {
    to: "/refolio/consultancy",
    label: "Consultancy Projects",
    tab: "consultancy",
    requiresAuth: true,
  },
  {
    to: "/refolio/profiles",
    label: "Profiles",
    tab: "profile",
    requiresAuth: true,
  },

  // Non-SuperAdmin links
  {
    to: "/refolio/insertPublications",
    label: "New Publication",
    tab: "new-publication",
    requiresAuth: true,
    hideForSuperAdmin: true,
  },
  {
    to: "/refolio/insertPatents",
    label: "New Patent",
    tab: "new-patent",
    requiresAuth: true,
    hideForSuperAdmin: true,
  },
  {
    to: "/refolio/insertResearch",
    label: "New Research Project",
    tab: "new-research",
    requiresAuth: true,
    hideForSuperAdmin: true,
  },
  {
    to: "/refolio/insertConsultancy",
    label: "New Consultancy Project",
    tab: "new-consultancy",
    requiresAuth: true,
    hideForSuperAdmin: true,
  },
  {
    to: "/refolio/insertProfile",
    label: "New Profile",
    tab: "new-profile",
    requiresAuth: true,
    hideForSuperAdmin: true,
  },

  // SuperAdmin links
  {
    to: "/refolio/users",
    label: "Users List",
    tab: "users",
    requiresAuth: true,
    requiresSuperAdmin: true,
  },
];

export const MONTH_OPTIONS = [
  { value: "", label: "None" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export const getMonthLabel = (value) => {
  const option = MONTH_OPTIONS.find((opt) => opt.value === value);
  return option ? option.label : "None";
};

export const fieldLabelMap = {
  Name: "Name",
  Designation: "Designation",

  AICTE_ID: "AICTE ID",
  JNTUH_ID: "JNTUH ID",
  College_ID: "College ID",
  branch: "Branch",
  Ratification_status: "Ratification Status",

  Aadhaar_Number: "Aadhaar Number",
  PAN_Number: "PAN Number",

  Teaching_Experience: "Teaching Experience",
  Research_Experience: "Research Experience",
  Industry_Experience: "Industry Experience",

  Scopus_ID: "Scopus ID",
  WoS_ID: "Web of Science ID",
  Google_Scholar_ID: "Google Scholar ID",
  Vidwan_ID: "Vidwan ID",
  ORCID_ID: "ORCID ID",

  Fields_of_Specialization: "Fields of Specialization",
  Professional_Memberships: "Professional Memberships",
  Invited_Talks: "Invited Talks",
  Editor_for_Journals: "Editor for Journals",
  Reviewer_for_Journals: "Reviewer for Journals",

  // Qualification sub-form
  level: "Level",
  degree: "Degree",
  specialization: "Specialization",
  university: "University",
  yearOfPassing: "Year of Passing",
  percentageOrCGPA: "Percentage / CGPA",

  // Experience sub-form
  type: "Type",
  organisation: "Organisation",
  designation: "Designation",
  fromDate: "From Date",
  toDate: "To Date",
};

export const designationOptions = [
  { value: "Professor", label: "Professor" },
  { value: "Associate Professor", label: "Associate Professor" },
  { value: "Assistant Professor", label: "Assistant Professor" },
];

export const degreeOptions = [
  { value: "10th/SSC", label: "10th/SSC" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Diploma", label: "Diploma" },
  { value: "B.Tech", label: "B.Tech" },
  { value: "M. Tech", label: "M. Tech" },
  { value: "BSc", label: "BSc" },
  { value: "MSc", label: "MSc" },
  { value: "PhD", label: "PhD" },
];

export const branchOptions = [
  { value: "CSE", label: "Computer Science & Engineering" },
  { value: "AIML", label: "Artificial Intelligence & Machine Learning" },
  { value: "EEE", label: "Electrical & Electronics Engineering" },
  { value: "ECE", label: "Electronics & Communication Engineering" },
];

export const requiredMainFields = [
      "Name",
      "Designation",
      "AICTE_ID",
      "JNTUH_ID",
      "College_ID",
      "branch",
      "Ratification_status",
      "Aadhaar_Number",
      "Aadhaar_File",
      "PAN_Number",
      "PAN_File",
      "Profile_Photo",
      "Teaching_Experience",
      "Research_Experience",
      "Industry_Experience",
      "Google_Scholar_ID",
      "Vidwan_ID",
      "ORCID_ID",
      "Fields_of_Specialization",
      "Professional_Memberships",
      "Invited_Talks",
      "Editor_for_Journals",
      "Reviewer_for_Journals",
    ];