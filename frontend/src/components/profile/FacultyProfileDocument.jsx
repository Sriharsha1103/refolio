import * as React from "react";
import {
  Box,
  Button,
  Divider,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { grey } from "@mui/material/colors";

/* ================= HELPER COMPONENT ================= */

function SectionTitle({ children }) {
  return (
    <Typography
      variant="subtitle1"
      sx={{
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: 1,
        color: "primary.main",
        mt: 3,
      }}
    >
      {children}
    </Typography>
  );
}

function EmptyRow({ colSpan }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} align="center" sx={{ py: 2, fontStyle: "italic" }}>
        No records found.
      </TableCell>
    </TableRow>
  );
}

/* ================= MAIN COMPONENT ================= */

export default function FacultyProfileDocument({ profileData = {} }) {
  const p = profileData || {};

  const educationList = p.Education_Qualifications ?? [];
  const experienceList = p.Experience ?? [];

  const memberships =
    typeof p.Professional_Memberships === "string"
      ? p.Professional_Memberships.split(",").map((s) => s.trim())
      : p.Professional_Memberships ?? [];

  const onPrint = () => window.print();

  return (
    <Box
      sx={{
        mx: "auto",
        my: 4,
        p: "20mm",
        width: "210mm",
        minHeight: "297mm",
        bgcolor: "white",
        boxShadow: 3,
        "@media print": {
          boxShadow: "none",
          m: 0,
          p: "10mm",
          width: "100%",
        },
      }}
    >
      {/* PRINT BUTTON */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 2,
          "@media print": { display: "none" },
        }}
      >
        <Button variant="contained" startIcon={<PrintIcon />} onClick={onPrint}>
          Print Profile
        </Button>
      </Box>

      {/* HEADER */}
      <Box sx={{ textAlign: "center", borderBottom: "3px double black", pb: 2, mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          BVRIT HYDERABAD COLLEGE OF ENGINEERING FOR WOMEN
        </Typography>
        <Typography variant="body2">
          (UGC Autonomous | Approved by AICTE | Affiliated to JNTUH)
        </Typography>
        <Typography variant="h6" sx={{ mt: 2, fontWeight: 800, textDecoration: "underline" }}>
          FACULTY PROFILE
        </Typography>
      </Box>

      {/* PROFILE PHOTO */}
      {p.Profile_Photo && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <img
            src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${p.branch}/${p.Profile_Photo}`}
            alt="Profile"
            style={{ width: 130, height: 150, border: "1px solid black", objectFit: "cover" }}
          />
        </Box>
      )}

      {/* PERSONAL DETAILS */}
      <SectionTitle>1. Personal Details</SectionTitle>
      <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell>{p.Name}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Designation</TableCell>
              <TableCell>{p.Designation}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
              <TableCell>{p.branch}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>AICTE ID</TableCell>
              <TableCell>{p.AICTE_ID}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>JNTUH ID</TableCell>
              <TableCell>{p.JNTUH_ID}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Ratification Status</TableCell>
              <TableCell>{p.Ratification_status}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Aadhaar Number</TableCell>
              <TableCell>{p.Aadhaar_Number}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>PAN Number</TableCell>
              <TableCell>{p.PAN_Number}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* PROFESSIONAL SUMMARY */}
      <SectionTitle>2. Experience Summary</SectionTitle>
      <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Teaching Experience</TableCell>
              <TableCell>{p.Teaching_Experience} Years</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Research Experience</TableCell>
              <TableCell>{p.Research_Experience} Years</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Industry Experience</TableCell>
              <TableCell>{p.Industry_Experience} Years</TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* EDUCATION */}
      <SectionTitle>3. Educational Qualifications</SectionTitle>
      <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: grey[100] }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Degree</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Specialization</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>University</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Year</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>% / CGPA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {educationList.length > 0
              ? educationList.map((edu, i) => (
                  <TableRow key={i}>
                    <TableCell>{edu.degree}</TableCell>
                    <TableCell>{edu.specialization}</TableCell>
                    <TableCell>{edu.university}</TableCell>
                    <TableCell>{edu.yearOfPassing}</TableCell>
                    <TableCell>{edu.percentageOrCGPA}</TableCell>
                  </TableRow>
                ))
              : <EmptyRow colSpan={5} />}
          </TableBody>
        </Table>
      </TableContainer>

      {/* EXPERIENCE */}
      <SectionTitle>4. Professional Experience</SectionTitle>
      <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: grey[100] }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Organisation</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Designation</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>From</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>To</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {experienceList.length > 0
              ? experienceList.map((exp, i) => (
                  <TableRow key={i}>
                    <TableCell>{exp.type}</TableCell>
                    <TableCell>{exp.organisation}</TableCell>
                    <TableCell>{exp.designation}</TableCell>
                    <TableCell>{exp.fromDate}</TableCell>
                    <TableCell>{exp.currentlyWorking ? "Present" : exp.toDate}</TableCell>
                  </TableRow>
                ))
              : <EmptyRow colSpan={5} />}
          </TableBody>
        </Table>
      </TableContainer>

      {/* RESEARCH IDENTIFIERS */}
      <SectionTitle>5. Research Identifiers</SectionTitle>
      <Typography>Scopus ID: {p.Scopus_ID || "—"}</Typography>
      <Typography>ORCID ID: {p.ORCID_ID || "—"}</Typography>
      <Typography>Google Scholar: {p.Google_Scholar_ID || "—"}</Typography>
      <Typography>Vidwan ID: {p.Vidwan_ID || "—"}</Typography>

      {/* SPECIALIZATION */}
      <SectionTitle>6. Fields of Specialization</SectionTitle>
      <Typography>{p.Fields_of_Specialization || "—"}</Typography>

      {/* PUBLICATIONS */}
      <SectionTitle>7. Publications</SectionTitle>
      <TextList items={p.Publications ?? []} />

      {/* PATENTS */}
      <SectionTitle>8. Patents</SectionTitle>
      <TextList items={p.Patents ?? []} />

      {/* MEMBERSHIPS */}
      <SectionTitle>9. Professional Memberships</SectionTitle>
      <TextList items={memberships} />

      {/* RESPONSIBILITIES */}
      <SectionTitle>10. Academic Responsibilities</SectionTitle>
      <TextList items={p.Academic_Responsibilities ?? []} />

      {/* SIGNATURE */}
      <Box sx={{ mt: 8, display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ borderTop: "1px solid black", pt: 1, width: 200, textAlign: "center" }}>
          Signature of Faculty
        </Typography>
        <Typography sx={{ borderTop: "1px solid black", pt: 1, width: 200, textAlign: "center" }}>
          Principal Signature
        </Typography>
      </Box>
    </Box>
  );
}

/* ================= SIMPLE LIST ================= */
function TextList({ items }) {
  if (!Array.isArray(items) || items.length === 0)
    return <Typography sx={{ fontStyle: "italic" }}>No records found.</Typography>;

  return (
    <Box component="ul" sx={{ pl: 3 }}>
      {items.map((item, i) => (
        <li key={i}>
          <Typography variant="body2">
            {typeof item === "string"
              ? item
              : item?.title || item?.citation || item?.name || "—"}
          </Typography>
        </li>
      ))}
    </Box>
  );
}