export const BRANCH_OPTIONS = [
    { value: "IT", label: "IT" },
    { value: "CSE", label: "CSE" },
    { value: "ECE", label: "ECE" },
    { value: "EEE", label: "EEE" },
    { value: "AI/ML", label: "AI/ML" },
    { value: "BS&H", label: "BS&H" }
];

export const NAV_LINKS_DEV = [
    { to: "/home", label: "Home", tab: "home", alwaysVisible: true },
    { to: "/publications", label: "Publications", tab: "publication", requiresAuth: true },
    { to: "/patents", label: "Patents", tab: "patent", requiresAuth: true },
    { to: "/research", label: "Research Projects", tab: "research", requiresAuth: true },
    { to: "/consultancy", label: "Consultancy Projects", tab: "consultancy", requiresAuth: true },
    
    // Non-SuperAdmin links
    { to: "/insertPublications", label: "New Publication", tab: "new-publication", requiresAuth: true, hideForSuperAdmin: true },
    { to: "/insertPatents", label: "New Patent", tab: "new-patent", requiresAuth: true, hideForSuperAdmin: true },
    { to: "/insertResearch", label: "New Research Project", tab: "new-research", requiresAuth: true, hideForSuperAdmin: true },
    { to: "/insertConsultancy", label: "New Consultancy Project", tab: "new-consultancy", requiresAuth: true, hideForSuperAdmin: true },

    // SuperAdmin links
    { to: "/users", label: "Users List", tab: "users", requiresAuth: true, requiresSuperAdmin: true },
];

export const NAV_LINKS = [
    { to: "/refolio/home", label: "Home", tab: "home", alwaysVisible: true },
    { to: "/refolio/publications", label: "Publications", tab: "publication", requiresAuth: true },
    { to: "/refolio/patents", label: "Patents", tab: "patent", requiresAuth: true },
    { to: "/refolio/research", label: "Research Projects", tab: "research", requiresAuth: true },
    { to: "/refolio/consultancy", label: "Consultancy Projects", tab: "consultancy", requiresAuth: true },
    
    // Non-SuperAdmin links
    { to: "/refolio/insertPublications", label: "New Publication", tab: "new-publication", requiresAuth: true, hideForSuperAdmin: true },
    { to: "/refolio/insertPatents", label: "New Patent", tab: "new-patent", requiresAuth: true, hideForSuperAdmin: true },
    { to: "/refolio/insertResearch", label: "New Research Project", tab: "new-research", requiresAuth: true, hideForSuperAdmin: true },
    { to: "/refolio/insertConsultancy", label: "New Consultancy Project", tab: "new-consultancy", requiresAuth: true, hideForSuperAdmin: true },

    // SuperAdmin links
    { to: "/refolio/users", label: "Users List", tab: "users", requiresAuth: true, requiresSuperAdmin: true },
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
    { value: "12", label: "December" }
];

export const getMonthLabel = (value) => {
    const option = MONTH_OPTIONS.find(opt => opt.value === value);
    return option ? option.label : "None";
}