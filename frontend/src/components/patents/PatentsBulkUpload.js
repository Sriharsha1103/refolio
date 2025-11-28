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
import { Departments, PatentsKey } from "../../Service/keyValueMap";
import { CSVLink } from "react-csv";

export const PatentsBulkUpload = ({ titles }) => {
  const [show1, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [downloadData,setDownloadData] = useState([])
  const handleClose = () => setShow(false);
  const yearpre = new Date();
  const service = new Service();
  const patents = {title: PatentsKey.title+"*",
              authors: PatentsKey.authors+"*",
              pat_no: PatentsKey.pat_no+"*",
              dept: PatentsKey.dept+"*",
              design_utility: PatentsKey.design_utility+"*",
              filed: PatentsKey.filed+"*",
              year: PatentsKey.year,
              published: PatentsKey.published,
              abstract: PatentsKey.abstract,
              country: PatentsKey.country+"*"}
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
              "authors",
              "pat_no",
              "dept",
              "design_utility",
              "filed",
              "year",
              "published",
              "abstract",
              "country"
            ],
          });
          if (
            JSON.stringify(rows[0]) ==
            JSON.stringify({
              title: PatentsKey.title+"*",
              authors: PatentsKey.authors+"*",
              pat_no: PatentsKey.pat_no+"*",
              dept: PatentsKey.dept+"*",
              design_utility: PatentsKey.design_utility+"*",
              filed: PatentsKey.filed+"*",
              year: PatentsKey.year,
              published: PatentsKey.published,
              abstract: PatentsKey.abstract,
              country: PatentsKey.country+"*",
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
  function parseDateString(dateString) {
    const [day, month, year] = dateString.split('/').map(Number);
    // if(year){
    //     year = parseInt("20"+year)
    // }
    // Month is zero-based in JavaScript Date object, so subtract 1
    return new Date(year, month, day);
  }
  const convertDate = (dateString)=>{
    console.log("convert",dateString);
    let javascriptTimestamp = "";
    if(typeof dateString === "string"){
        // javascriptTimestamp = dateString;
        
  
        javascriptTimestamp = parseDateString(dateString);
    }else{
        const excelTimestamp = dateString;
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const excelEpoch = new Date(1899, 11, 30); // Excel epoch is December 30, 1899
    
    // Convert Excel timestamp to JavaScript timestamp
    javascriptTimestamp = excelEpoch.getTime() + excelTimestamp * millisecondsPerDay;
    }
console.log("java",javascriptTimestamp)
// Create a Date object
const dateObject = new Date(javascriptTimestamp);
return dateObject;
  }
  
  // Example usage
  
  const checkDateFormat = (dateString) => {
    
console.log("check",dateString);
    const currentDate = new Date();
  const lowerBound = new Date("2012-01-01");
  // Parse the input date string
  const inputDate = new Date(dateString);

  // Check if the parsed date is a valid date and falls within the specified range
  if (!isNaN(inputDate) && inputDate >= lowerBound && inputDate <= currentDate) {
    console.log("Valid date:", inputDate);
    return true; // Date is valid and within the range
  } else {
    console.log("Invalid date or out of range",dateString,inputDate);
    return false; // Date is invalid or out of range
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
        console.log(data[i].dept,data[i])
        data[i].year = data[i].year == "" ? null: convertDate(data[i].year)
        data[i].published = data[i].published == "" ?null : convertDate(data[i].published)
        data[i].filed = data[i].published == "" ?null : convertDate(data[i].filed)
        data[i].dept = (data[i].dept=="")?[]:data[i].dept.split(",").map(item => item.trim().toUpperCase());
        if (titles.includes(data[i].pat_no)) {
          valid = false;
          window.alert("Duplicate Patent Number");
          break;
        }
        if (
          data[i].title == "" ||
          data[i].authors == "" ||
          data[i].pat_no == "" || 
          data[i].dept == [] ||
          data[i].dept.some(item => !Departments.includes(item)) ||
          (data[i].design_utility != "Design" &&
            data[i].design_utility != "Utility") ||
          data[i].country == "" ||
         !checkDateFormat(data[i].filed) ||
         (data[i].year != null && !checkDateFormat(data[i].year)) ||
         (data[i].published != null && !checkDateFormat(data[i].published))
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
          window.alert("Incorrect Data in the Excel At row"+ i+2 +" "+ data[i].title + " patent.");
          break;
        }
        titles.push(data[i].pat_no)
      }
      if (valid && data.length != 0) {
        // console.log("HERRREEE")
        service
          .post("api/patents/bulk", data)
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
 

  // DownloadData.push(["PatentsKey","Branch","Authors","C/J/B/BC","Name of C/J/B/BC","Volume","Issue","Year","Month","ISSN/ISBN/DOI","Inter/National","Organisor","In Proceedings","Abstract Published","Scopus/Wos/SCI/Others","Citation in Scopus/WoS","Citation in GoogleScholar","Link","Affiliated?", "Are you author?","Starting Page","Ending Page", "Cite Article"])
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
    for (let value in patents) {
      // if (value.checked) {
        fields.push(patents[value]);
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
            download="Example-PatentsKey-document"
            target="_blank"
            rel="noopener noreferrer"
          > */}
            <Button variant="contained" color="secondary" size="small">
            <CSVLink
              data={downloadData}
              filename={"Sample_PatentsKeys_Upload_File"}
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
