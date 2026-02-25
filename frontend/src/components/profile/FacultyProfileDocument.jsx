import * as React from "react";
import { Box, Button, Divider, Typography } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";

function InfoRow({ label, value, labelWidth = 165 }) {
    const hasValue = !(value === undefined || value === null || value === "");
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: `${labelWidth}px 14px 1fr`,
                columnGap: 1,
                py: 0.35,
            }}
        >
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                :
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {hasValue ? value : "—"}
            </Typography>
        </Box>
    );
}

function DocSection({ title, children }) {
    return (
        <Box
            className="section"
            data-print-section
            sx={{
                mt: 1.5,
                pt: 0.75,
            }}
        >
            <Typography
                variant="subtitle1"
                sx={{
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                }}
            >
                {title}
            </Typography>
            <Divider sx={{ mt: 0.5, mb: 0.75, borderColor: "grey.600", borderBottomWidth: 2 }} />
            {children}
        </Box>
    );
}

function TextList({ items }) {
    if (!Array.isArray(items) || items.length === 0) {
        return (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                —
            </Typography>
        );
    }
    return (
        <Box component="ul" sx={{ m: 0, pl: 2.25 }}>
            {items.map((it, idx) => (
                <Box component="li" key={`${idx}-${typeof it === "string" ? it : it?.title || it?.name || ""}`}>
                    <Typography variant="body2">
                        {typeof it === "string"
                            ? it
                            : it?.citation || it?.title || it?.name || it?.description || "—"}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}

function OrderedList({ items }) {
    if (!Array.isArray(items) || items.length === 0) {
        return (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                —
            </Typography>
        );
    }
    return (
        <Box component="ol" sx={{ m: 0, pl: 2.25 }}>
            {items.map((it, idx) => (
                <Box component="li" key={`${idx}-${typeof it === "string" ? it : it?.title || it?.name || ""}`}>
                    <Typography variant="body2">
                        {typeof it === "string"
                            ? it
                            : it?.citation || it?.title || it?.name || it?.description || "—"}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}

export default function FacultyProfileDocument({ profileData = {} }) {
    const normalized = React.useMemo(() => {
        const p = profileData || {};

        const educationQualifications =
            p.educationQualifications ??
            p.Education_Qualifications ??
            p.education_qualifications ??
            [];

        const formatEducation = (eq) => {
            if (!eq) return "";
            if (typeof eq === "string") return eq;

            const degree = eq?.degree ?? "";
            const specialization = eq?.specialization ?? "";
            const university = eq?.university ?? "";
            const year = eq?.yearOfPassing ?? eq?.year ?? "";

            const parts = [
                [degree, specialization].filter(Boolean).join(" - "),
                university,
                year ? `(${year})` : "",
            ].filter(Boolean);

            return parts.join(", ");
        };

        const findEducation = (predicate) => {
            if (!Array.isArray(educationQualifications)) return "";
            const found = educationQualifications.find(predicate);
            return formatEducation(found);
        };

        const derivedBtech =
            findEducation(
                (e) =>
                    String(e?.level ?? "").toLowerCase() === "ug" ||
                    String(e?.degree ?? "").toLowerCase().includes("b.tech") ||
                    String(e?.degree ?? "").toLowerCase().includes("btech") ||
                    String(e?.degree ?? "").toLowerCase().includes("b.e") ||
                    String(e?.degree ?? "").toLowerCase().includes("be") ||
                    String(e?.degree ?? "").toLowerCase().includes("b. tech")
            ) || "";

        const derivedMtech =
            findEducation(
                (e) =>
                    String(e?.level ?? "").toLowerCase() === "pg" ||
                    String(e?.degree ?? "").toLowerCase().includes("m.tech") ||
                    String(e?.degree ?? "").toLowerCase().includes("mtech") ||
                    String(e?.degree ?? "").toLowerCase().includes("m.e") ||
                    String(e?.degree ?? "").toLowerCase().includes("m. tech")
            ) || "";

        const derivedPhd =
            findEducation(
                (e) =>
                    String(e?.degree ?? "").toLowerCase().includes("phd") ||
                    String(e?.degree ?? "").toLowerCase().includes("ph.d")
            ) || "";

        return {
            institutionName:
                p.institutionName ??
                p.Institution_Name ??
                p.Institution ??
                "BVRIT Hyderabad College of Engineering for Women",
            institutionAddress: p.institutionAddress ?? p.Institution_Address ?? p.Address ?? "(UGC Autonomous Institution | Approved by AICTE | Affiliated to JNTUH) (NAAC Accredited – A Grade | NBA Accredited B. Tech. (EEE, ECE, CSE and IT)) Bachupally, Hyderabad -500 090",
            name: p.name ?? p.Name ?? "",
            title: p.title ?? p.Designation ?? "",
            department: p.department ?? p.Department ?? p.branch ?? "",
            email: p.email ?? p.Email ?? "",
            aicteId: p.aicteId ?? p.AICTE_ID ?? "",
            jntuhId: p.jntuhId ?? p.JNTUH_ID ?? "",
            ratificationStatus: p.ratificationStatus ?? p.Ratification_status ?? "",
            phd: p.phd ?? p.PhD ?? p.PHD ?? derivedPhd ?? "",
            mtech: p.mtech ?? p.MTech ?? p["M.Tech"] ?? derivedMtech ?? "",
            btech: p.btech ?? p.BTech ?? p["B.Tech"] ?? derivedBtech ?? "",
            teachingExperience: p.teachingExperience ?? p.Teaching_Experience ?? "",
            researchExperience: p.researchExperience ?? p.Research_Experience ?? "",
            industryExperience: p.industryExperience ?? p.Industry_Experience ?? "",
            scopusId: p.scopusId ?? p.Scopus_ID ?? "",
            wosId: p.wosId ?? p.WoS_ID ?? "",
            googleScholarId: p.googleScholarId ?? p.Google_Scholar_ID ?? "",
            vidwanId: p.vidwanId ?? p.Vidwan_ID ?? "",
            orcidId: p.orcidId ?? p.ORCID_ID ?? "",
            specialization: p.specialization ?? p.Fields_of_Specialization ?? "",
            publications: p.publications ?? p.Publications ?? [],
            conferences: p.conferences ?? p.Conferences ?? [],
            patents: p.patents ?? p.Patents ?? [],
            researchProjects: p.researchProjects ?? p.Research_Projects ?? p.Consultancy ?? [],
            memberships:
                p.memberships ??
                p.Professional_Memberships ??
                (typeof p.Professional_Memberships === "string"
                    ? p.Professional_Memberships.split(",").map((s) => s.trim()).filter(Boolean)
                    : []),
            workshops: p.workshops ?? p.Workshops ?? p.FDP_Attended ?? [],
            academicResponsibilities: p.academicResponsibilities ?? p.Academic_Responsibilities ?? [],
        };
    }, [profileData]);

    const {
        institutionName,
        institutionAddress,
        name,
        title,
        department,
        email,
        aicteId,
        jntuhId,
        ratificationStatus,
        phd,
        mtech,
        btech,
        teachingExperience,
        researchExperience,
        industryExperience,
        scopusId,
        wosId,
        googleScholarId,
        vidwanId,
        orcidId,
        specialization,
        publications,
        conferences,
        patents,
        researchProjects,
        memberships,
        workshops,
        academicResponsibilities,
    } = normalized;

    const onPrint = React.useCallback(() => {
        if (typeof window !== "undefined" && window.print) window.print();
    }, []);

    return (
        <Box
            sx={{
                mx: "auto",
                my: 2,
                width: "210mm",
                minHeight: "297mm",
                color: "common.black",
                bgcolor: "common.white",
                border: "1px solid",
                borderColor: "grey.300",
                fontFamily: "serif",
                "@media print": {
                    m: 0,
                    width: "210mm",
                    minHeight: "auto",
                    border: "none",
                },
            }}
        >
            <Box
                className="no-print"
                sx={{
                    position: "sticky",
                    top: 8,
                    display: "flex",
                    justifyContent: "flex-end",
                    p: 1,
                    "@media print": { display: "none" },
                }}
            >
                <Button variant="outlined" size="small" startIcon={<PrintIcon />} onClick={onPrint}>
                    Print
                </Button>
            </Box>

            <Box sx={{ px: 3, pb: 3, pt: 0 }}>
                <Box
                    data-print-section
                    sx={{
                        textAlign: "center",
                        pt: 2,
                        pb: 1.25,
                        borderBottom: "2px solid",
                        borderColor: "grey.600",
                    }}
                >
                    <Box
                        sx={{
                            height: "70px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px dashed",
                            borderColor: "grey.500",
                            mb: 1,
                        }}
                    >
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            INSTITUTION LOGO / HEADER BANNER
                        </Typography>
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                        {institutionName || "Institution Name (Placeholder)"}
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.3 }}>
                        {institutionAddress || "Institution Address (Placeholder)"}
                    </Typography>

                    <Typography
                        variant="subtitle2"
                        sx={{ mt: 1, fontWeight: 800, letterSpacing: 0.6 }}
                    >
                        FACULTY PROFILE
                    </Typography>
                </Box>

                <DocSection title="Faculty Information">
                    <InfoRow label="Name" value={name} />
                    <InfoRow label="Designation" value={title} />
                    <InfoRow label="Department" value={department} />
                    <InfoRow label="Email" value={email} />
                    <InfoRow label="AICTE ID" value={aicteId} />
                    <InfoRow label="JNTUH ID" value={jntuhId} />
                    <InfoRow label="Ratified Status" value={ratificationStatus} />
                </DocSection>

                <DocSection title="Education">
                    <InfoRow label="Ph.D" value={typeof phd === "string" ? phd : phd?.title || phd?.name} />
                    <InfoRow label="M.Tech" value={typeof mtech === "string" ? mtech : mtech?.title || mtech?.name} />
                    <InfoRow label="B.Tech" value={typeof btech === "string" ? btech : btech?.title || btech?.name} />
                </DocSection>

                <DocSection title="Experience">
                    <InfoRow label="Teaching Experience" value={teachingExperience} />
                    <InfoRow label="Research Experience" value={researchExperience} />
                    <InfoRow label="Industry Experience" value={industryExperience} />
                </DocSection>

                <DocSection title="Research Identifiers">
                    <InfoRow label="Scopus ID" value={scopusId} />
                    <InfoRow label="WoS ID" value={wosId} />
                    <InfoRow label="Google Scholar" value={googleScholarId} />
                    <InfoRow label="Vidwan ID" value={vidwanId} />
                    <InfoRow label="ORCID ID" value={orcidId} />
                </DocSection>

                <DocSection title="Fields of Specialization">
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                        {specialization || "—"}
                    </Typography>
                </DocSection>

                <DocSection title="Publications">
                    <OrderedList items={publications} />
                </DocSection>

                <DocSection title="Conferences">
                    <TextList items={conferences} />
                </DocSection>

                <DocSection title="Patents">
                    <TextList items={patents} />
                </DocSection>

                <DocSection title="Research Projects / Consultancy">
                    <TextList items={researchProjects} />
                </DocSection>

                <DocSection title="Professional Memberships">
                    <TextList items={memberships} />
                </DocSection>

                <DocSection title="Workshops / FDP Attended">
                    <TextList items={workshops} />
                </DocSection>

                <DocSection title="Academic Responsibilities">
                    <TextList items={academicResponsibilities} />
                </DocSection>
            </Box>

            <Box
                sx={{
                    "@media print": {
                        "@page": { size: "A4 portrait", margin: 0 },
                        "html, body": {
                            margin: 0,
                            padding: 0,
                            background: "white",
                        },
                        body: { margin: 0 },
                        ".no-print": { display: "none !important" },
                        "*": {
                            WebkitPrintColorAdjust: "exact",
                            printColorAdjust: "exact",
                            boxShadow: "none !important",
                            textShadow: "none !important",
                        },
                        ".section": {
                            breakInside: "avoid",
                            pageBreakInside: "avoid",
                        },
                    },
                }}
            />
        </Box>
    );
}
