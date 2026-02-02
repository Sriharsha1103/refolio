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
