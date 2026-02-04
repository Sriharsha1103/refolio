import { Button } from "@mui/material";
import React, { useReducer } from "react";
import { read, utils } from "xlsx";
import Service from "../../Service/http";
import { PublicationsKey } from "../../Service/keyValueMap";
import CustomSnackbar from "../CustomComponents/CustomSnackbar";
import CustomConfirmDialog from "../CustomComponents/CustomConfirmDialog";
import CustomBulkUploadModal from "../CustomComponents/CustomBulkUploadModal";

const yearpre = new Date();
const service = new Service();

const initialState = {
  showModal: false,
  rows: [],
  downloadData: [],
  snackbar: { open: false, status: 0, message: "" },
  confirmOpen: false,
  uploading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "OPEN_MODAL":
      return { ...state, showModal: true };
    case "CLOSE_MODAL":
      return { ...state, showModal: false };
    case "SET_ROWS":
      return { ...state, rows: action.rows };
    case "SET_DOWNLOAD_DATA":
      return { ...state, downloadData: action.data };
    case "SHOW_SNACKBAR":
      return { ...state, snackbar: { open: true, status: action.status, message: action.message } };
    case "HIDE_SNACKBAR":
      return { ...state, snackbar: { ...state.snackbar, open: false } };
    case "OPEN_CONFIRM":
      return { ...state, confirmOpen: true };
    case "CLOSE_CONFIRM":
      return { ...state, confirmOpen: false };
    case "START_UPLOAD":
      return { ...state, uploading: true };
    case "END_UPLOAD":
      return { ...state, uploading: false };
    default:
      return state;
  }
}

export const BulkUpload = ({ titles }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const publication = {title: PublicationsKey.title+"*",
  branch: PublicationsKey.branch+"*",
  username: PublicationsKey.username+"*",
  cjb: PublicationsKey.cjb+"*",
  name_cjb: PublicationsKey.name_cjb+"*",
  vol: PublicationsKey.vol,
  issue: PublicationsKey.issue,
  year: PublicationsKey.year+"*",
  month: PublicationsKey.month+"*",
  doi: PublicationsKey.doi+"*",
  nationality: PublicationsKey.nationality+"*",
  organised_by: PublicationsKey.organised_by,
  is_proceeding: PublicationsKey.is_proceeding,
  is_published: PublicationsKey.is_published,
  scl: PublicationsKey.scl+"*",
  citation_scopus: PublicationsKey.citation_scopus,
  citation_google: PublicationsKey.citation_google,
  link: PublicationsKey.link+"*",
  is_affilated: PublicationsKey.is_affilated,
  author_no: PublicationsKey.author_no,
  starting_page: "Starting Page",
  ending_page: "Ending Page",
  cite: PublicationsKey.cite+"*"}
  const handleImport = ($event) => {
    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;
        if (sheets.length) {
          let rows = utils.sheet_to_json(wb.Sheets[sheets[0]], {
            defval: "",
            header: [
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
            ],
          });
          if (
            JSON.stringify(rows[0]) ==
            JSON.stringify({
              title: PublicationsKey.title+"*",
              branch: PublicationsKey.branch+"*",
              username: PublicationsKey.username+"*",
              cjb: PublicationsKey.cjb+"*",
              name_cjb: PublicationsKey.name_cjb+"*",
              vol: PublicationsKey.vol,
              issue: PublicationsKey.issue,
              year: PublicationsKey.year+"*",
              month: PublicationsKey.month+"*",
              doi: PublicationsKey.doi+"*",
              nationality: PublicationsKey.nationality+"*",
              organised_by: PublicationsKey.organised_by,
              is_proceeding: PublicationsKey.is_proceeding,
              is_published: PublicationsKey.is_published,
              scl: PublicationsKey.scl+"*",
              citation_scopus: PublicationsKey.citation_scopus,
              citation_google: PublicationsKey.citation_google,
              link: PublicationsKey.link+"*",
              is_affilated: PublicationsKey.is_affilated,
              author_no: PublicationsKey.author_no,
              starting_page: "Starting Page",
              ending_page: "Ending Page",
              cite: PublicationsKey.cite+"*",
            })
          ) {
            // console.log('iffff')
            rows = rows.slice(1, rows.length);
            dispatch({ type: "SET_ROWS", rows });
          } else {
            dispatch({ type: "SHOW_SNACKBAR", status: 400, message: "INVALID Excel Format. Check the Sample Excel." });
          }
        //   console.log("Import", rows);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };
  const checkYear = (year) => {
    year = parseInt(year);
    if (year && year > 2011 && year <= yearpre.getFullYear()) {
      return false;
    } else {
    //   console.log("CheckYEar");
      return true;
    }
  };
  const checkMonth = (month) => {
    month = parseInt(month);
    if (month && month > 0 && month < 13) {
      return false;
    } else {
    //   console.log("CheckMonth");
      return true;
    }
  };
  const checkPageNo = (page) => {
    if (page != "") {
      page = parseInt(page);
      if (page) {
        return false;
      } else {
        // console.log("checkpage", page);
        return true;
      }
    } else {
      return false;
    }
  };
  const uploadData = () => {
    dispatch({ type: "OPEN_CONFIRM" });
  };

  const handleConfirmUpload = () => {
    dispatch({ type: "CLOSE_CONFIRM" });
    let valid = true;
    for (let i = 0; i < state.rows.length; i++) {
      const row = state.rows[i];
      if (titles.includes(row.title)) {
        valid = false;
        dispatch({ type: "SHOW_SNACKBAR", status: 409, message: "Duplicate Title" });
        break;
      }
        if (
          row.title == "" ||
          row.username == "" ||
          (row.cjb != "C" && row.cjb != "J" && row.cjb != "B" && row.cjb != "BC") ||
          (row.branch != "CSE" && row.branch != "IT" && row.branch != "ECE" && row.branch != "EEE" && row.branch != "AI/ML" && row.branch != "BS&H") ||
          (row.nationality != "National" && row.nationality != "International") ||
          row.name_cjb == "" ||
          row.doi == "" ||
          row.cite == "" ||
          row.link == "" ||
          checkYear(row.year) ||
          checkMonth(row.month) ||
          (row.is_proceeding != "" && row.is_proceeding != "Yes" && row.is_proceeding != "No") ||
          (row.is_published != "" && row.is_published != "Yes" && row.is_published != "No") ||
          (row.is_affilated != "" && row.is_affilated != "Yes" && row.is_affilated != "No") ||
          (row.author_no != "" && row.author_no != "Single" && row.author_no != "First" && row.author_no != "Second" && row.author_no != "Third" && row.author_no != "Fourth" && row.author_no != "Fifth" && row.author_no != "Others") ||
          checkPageNo(row.starting_page) ||
          checkPageNo(row.ending_page) ||
          row.scl == ""
        ) {
          valid = false;
          dispatch({ type: "SHOW_SNACKBAR", status: 400, message: `Incorrect data at row ${i + 2} (${row.title}).` });
          break;
        }
    }
    if (valid && state.rows.length !== 0) {
      dispatch({ type: "START_UPLOAD" });
      service
        .post("api/publications/bulk", state.rows)
        .then(() => {
          dispatch({ type: "SHOW_SNACKBAR", status: 200, message: "Successfully uploaded the data." });
          dispatch({ type: "CLOSE_MODAL" });
        })
        .catch((err) => {
          console.log("ERROR", err);
          dispatch({ type: "SHOW_SNACKBAR", status: 500, message: "Error while uploading data. Please try again later." });
        })
        .finally(() => dispatch({ type: "END_UPLOAD" }));
    }
  };
 

  // DownloadData.push(["PublicationsKey","Branch","Authors","C/J/B/BC","Name of C/J/B/BC","Volume","Issue","Year","Month","ISSN/ISBN/DOI","Inter/National","Organisor","In Proceedings","Abstract Published","Scopus/Wos/SCI/Others","Citation in Scopus/WoS","Citation in GoogleScholar","Link","Affiliated?", "Are you author?","Starting Page","Ending Page", "Cite Article"])
  //   for (let ele of csvData) {
  //     DownloadData.push([
  //       ele.title,
  //       ele.branch,
  //       ele.username,
  //       ele.cjb,
  //       ele.name_cjb,
  //       ele.vol,
  //       ele.issue,
  //       ele.year,
  //       ele.month,
  //       ele.doi,
  //       ele.nationality,
  //       ele.organised_by,
  //       ele.is_proceeding,
  //       ele.is_published,
  //       ele.scl,
  //       ele.citation_scopus,
  //       ele.citation_google,
  //       ele.link,
  //       ele.is_affilated,
  //       ele.author_no,
  //       ele.starting_page,
  //       ele.ending_page,
  //       ele.cite,
  //     ]);
  //   }

  // const exportToCSV = (csvData, fileName) => {

  //     const ws = XLSX.utils.json_to_sheet(csvData);
  //     const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
  //     const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  //     const data = new Blob([excelBuffer], {type: fileType});
  //     FileSaver.saveAs(data, fileName + fileExtension);
  // }
  const handleDownload = async () => {
    const header = [];
    for (let value in publication) {
      header.push(publication[value]);
    }
    const csvRows = [header];
    const csvContent = csvRows
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Sample_Publications_Upload_File.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <CustomBulkUploadModal
        show={state.showModal}
        onClose={() => dispatch({ type: "CLOSE_MODAL" })}
        onImportFile={handleImport}
        onImportClick={uploadData}
        downloadData={state.downloadData}
        onDownloadSample={handleDownload}
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={() => dispatch({ type: "OPEN_MODAL" })}
      >
        Bulk Upload
      </Button>
      <CustomSnackbar
        open={state.snackbar.open}
        handleClose={() => dispatch({ type: "HIDE_SNACKBAR" })}
        status={state.snackbar.status}
        message={state.snackbar.message}
      />
      <CustomConfirmDialog
        open={state.confirmOpen}
        handleClose={() => {
          dispatch({ type: "CLOSE_CONFIRM" });
          dispatch({ type: "SHOW_SNACKBAR", status: 400, message: "Cancelled the bulk upload action." });
        }}
        handleConfirm={handleConfirmUpload}
        title={"Confirm Bulk Upload"}
        content={"This will upload the data into the Database."}
      />
    </>

    // <Button variant="warning" onClick={(e) => exportToCSV(csvData,fileName)}>Export</Button>
  );
};
