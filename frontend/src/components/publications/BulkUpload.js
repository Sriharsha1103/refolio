import { Center, Checkbox } from "@mantine/core";
import { Button } from "@mui/material";
import { useListState } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
// import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';
import Modal from "react-bootstrap/Modal";
import { read, utils, writeFile } from "xlsx";
import Service from "../../Service/http";
import { MDBRow } from "mdb-react-ui-kit";
import { Publication } from "../../Service/keyValueMap";
import { CSVLink } from "react-csv";

export const BulkUpload = ({ titles }) => {
  const [show1, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [downloadData,setDownloadData] = useState([])
  const handleClose = () => setShow(false);
  const yearpre = new Date();
  const service = new Service();
  const publication = {title: Publication.title+"*",
  branch: Publication.branch+"*",
  username: Publication.username+"*",
  cjb: Publication.cjb+"*",
  name_cjb: Publication.name_cjb+"*",
  vol: Publication.vol,
  issue: Publication.issue,
  year: Publication.year+"*",
  month: Publication.month+"*",
  doi: Publication.doi+"*",
  nationality: Publication.nationality+"*",
  organised_by: Publication.organised_by,
  is_proceeding: Publication.is_proceeding,
  is_published: Publication.is_published,
  scl: Publication.scl+"*",
  citation_scopus: Publication.citation_scopus,
  citation_google: Publication.citation_google,
  link: Publication.link+"*",
  is_affilated: Publication.is_affilated,
  author_no: Publication.author_no,
  starting_page: "Starting Page",
  ending_page: "Ending Page",
  cite: Publication.cite+"*"}
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
              title: Publication.title+"*",
              branch: Publication.branch+"*",
              username: Publication.username+"*",
              cjb: Publication.cjb+"*",
              name_cjb: Publication.name_cjb+"*",
              vol: Publication.vol,
              issue: Publication.issue,
              year: Publication.year+"*",
              month: Publication.month+"*",
              doi: Publication.doi+"*",
              nationality: Publication.nationality+"*",
              organised_by: Publication.organised_by,
              is_proceeding: Publication.is_proceeding,
              is_published: Publication.is_published,
              scl: Publication.scl+"*",
              citation_scopus: Publication.citation_scopus,
              citation_google: Publication.citation_google,
              link: Publication.link+"*",
              is_affilated: Publication.is_affilated,
              author_no: Publication.author_no,
              starting_page: "Starting Page",
              ending_page: "Ending Page",
              cite: Publication.cite+"*",
            })
          ) {
            // console.log('iffff')
            rows = rows.slice(1, rows.length);
            setData(rows);
          } else {
            // console.log("else");
            window.alert("INVALID Excel Format. Check the Sample Excel.");
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
  const uploadData = ()=>{
    let confirm = window.confirm("This will upload the data into the Database.");
    if(confirm){
      var valid = true;
      for (let i = 0; i < data.length; i++) {
        if (titles.includes(data[i].title)) {
          valid = false;
          window.alert("Duplicate Title");
          break;
        }
        if (
          data[i].title == "" ||
          data[i].username == "" ||
          (data[i].cjb != "C" &&
            data[i].cjb != "J" &&
            data[i].cjb != "B" &&
            data[i].cjb != "BC") ||
          (data[i].branch != "CSE" &&
            data[i].branch != "IT" &&
            data[i].branch != "ECE" &&
            data[i].branch != "EEE" &&
            data[i].branch != "AI/ML" &&
            data[i].branch != "BS&H") ||
          (data[i].nationality != "National" &&
            data[i].nationality != "International") ||
          data[i].name_cjb == "" ||
          data[i].doi == "" ||
          data[i].cite == "" ||
          data[i].link == "" ||
          checkYear(data[i].year) ||
          checkMonth(data[i].month) ||
          (data[i].is_proceeding != "" &&
            data[i].is_proceeding != "Yes" &&
            data[i].is_proceeding != "No") ||
          (data[i].is_published != "" &&
            data[i].is_published != "Yes" &&
            data[i].is_published != "No") ||
          (data[i].is_affilated != "" &&
            data[i].is_affilated != "Yes" &&
            data[i].is_affilated != "No") ||
          (data[i].author_no != "" &&
            data[i].author_no != "Single" &&
            data[i].author_no != "First" &&
            data[i].author_no != "Second" &&
            data[i].author_no != "Third" &&
            data[i].author_no != "Fourth" &&
            data[i].author_no != "Fifth" &&
            data[i].author_no != "Others") ||
          checkPageNo(data[i].starting_page) ||
          checkPageNo(data[i].ending_page) ||
          data[i].scl == ""
        ) {
          valid = false;
          // console.log(data[i].title == '' )
          // console.log(data[i].username == '' )
          // console.log((data[i].cjb != 'C' && data[i].cjb != 'J' && data[i].cjb != 'B' && data[i].cjb !='BC'))
          // console.log((data[i].branch != 'CSE' && data[i].branch != 'IT' && data[i].branch != 'ECE' && data[i].branch != 'EEE' && data[i].branch != 'AI/ML' && data[i].branch != 'BS&H'))
          // console.log((data[i].nationality != 'National' && data[i].nationality != 'International'))
          // console.log(data[i].name_cjb == '')
          // console.log(data[i].doi == '')
          // console.log(data[i].cite == '')
          // console.log(data[i].link == '')
          // console.log(checkYear(data[i].year))
          // console.log(checkMonth(data[i].month))
          // console.log((data[i].is_proceeding!='' && data[i].is_proceeding != 'Yes' && data[i].is_proceeding!='No'))
          // console.log((data[i].is_published!='' && data[i].is_published != 'Yes' && data[i].is_published!='No'))
          // console.log((data[i].is_affilated !='' && data[i].is_affilated != 'Yes' && data[i].is_affilated!='No'))
          // console.log((data[i].author_no!='' && data[i].author_no != 'Single' && data[i].author_no!='First' && data[i].author_no != 'Second' && data[i].author_no!='Third' && data[i].author_no != 'Fourth' && data[i].author_no!='Fifth' && data[i].author_no != 'Others'))
          // console.log(checkPageNo(data[i].starting_page))
          // console.log(checkPageNo(data[i].ending_page))
          // console.log(data[i].scl == '')
          window.alert("Incorrect Data in the Excel "+ i+2 +" "+ data[i].title + " publication.");
          break;
        }
      }
      if (valid && data.length != 0) {
        // console.log("HERRREEE")
        service
          .post("api/publications/bulk", data)
          .then((res) => {
            // console.log("RESULT", res);
            window.alert("Successfully Uploaded the data.");
            window.location.reload();
          })
          .catch((err) => {
            console.log("ERROR", err);
            window.alert("Error while uploading data try again later.");
          });
      }
    }else{
      window.alert("Cancelled the bulk upload action."); 
    }
  }
 

  // DownloadData.push(["Publication","Branch","Authors","C/J/B/BC","Name of C/J/B/BC","Volume","Issue","Year","Month","ISSN/ISBN/DOI","Inter/National","Organisor","In Proceedings","Abstract Published","Scopus/Wos/SCI/Others","Citation in Scopus/WoS","Citation in GoogleScholar","Link","Affiliated?", "Are you author?","Starting Page","Ending Page", "Cite Article"])
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
    const fields = [];
    const data = [];
    for (let value in publication) {
      // if (value.checked) {
        fields.push(publication[value]);
      // }
    }

    data.push(fields);
    // for await (let dat1 of csvData) {
    //   const row = [];
    //   for await (let value of values) {
    //     if (value.checked) {
    //       row.push(dat1[value.key]);
    //     }
    //   }
    //   data.push(row);
    // }
    setDownloadData(data);

    // handleClose();
  };

  return (
    <>
      <Modal show={show1} onHide={handleClose} size="md" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Select File To Bulk Insert.</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="bg-green"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <label
            className="custom-file-label"
            htmlFor="inputGroupFile"
            style={{ fontSize: "20px" }}
          >
            <b>Choose file</b>
          </label>
          {/* <br/> */}
          <input
            type="file"
            name="file"
            className="custom-file-input"
            id="inputGroupFile"
            required
            onChange={handleImport}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
          <br />
          <label style={{ fontSize: "20px" }}>
            <b>Are you a first timer?</b>
          </label>
          {/* <a
            href={SampleUploadfile}
            download="Example-Publication-document"
            target="_blank"
            rel="noopener noreferrer"
          > */}
            <Button variant="contained" color="secondary" size="small">
            <CSVLink
              data={downloadData}
              filename={"Sample_Publications_Upload_File"}
              onClick={()=>{handleDownload()}}
            >
              <div style={{ color: "white" }}>View & Download Sample File</div>
            </CSVLink>
              
            </Button>
          {/* </a> */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="contained" color="error" size="small" onClick={()=>{uploadData()}}>
            Import
          </Button>
        </Modal.Footer>
      </Modal>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          setShow(true);
        }}
      >
        Bulk Upload
      </Button>
    </>

    // <Button variant="warning" onClick={(e) => exportToCSV(csvData,fileName)}>Export</Button>
  );
};
