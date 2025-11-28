import { Checkbox } from "@mantine/core";
import { Button } from "@mui/material";
import { useListState } from "@mantine/hooks";
import React, { useState } from "react";
// import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';
import Modal from "react-bootstrap/Modal";
import { CSVLink } from "react-csv";
import { Publication } from "../../Service/keyValueMap";
const initialValues = [
  { label: Publication.title+"*", checked: true, key: "title" },
  { label: Publication.branch+"*", checked: true, key: "branch" },
  { label: Publication.username+"*", checked: true, key: "username" },
  { label: Publication.cjb+"*", checked: true, key: "cjb" },
  { label: Publication.name_cjb+"*", checked: true, key: "name_cjb" },
  { label: Publication.vol, checked: true, key: "vol" },
  { label: Publication.issue, checked: true, key: "issue" },
  { label: Publication.year+"*", checked: true, key: "year" },
  { label: Publication.month+"*", checked: true, key: "month" },
  { label: Publication.doi+"*", checked: true, key: "doi" },
  { label: Publication.nationality+"*", checked: true, key: "nationality" },
  { label: Publication.organised_by, checked: true, key: "organised_by" },
  { label: Publication.is_proceeding, checked: true, key: "is_proceeding" },
  { label: Publication.is_published, checked: true, key: "is_published" },
  { label: Publication.scl+"*", checked: true, key: "scl" },
  { label: Publication.citation_scopus, checked: true, key: "citation_scopus" },
  {
    label: Publication.citation_google,
    checked: true,
    key: "citation_google",
  },
  { label: Publication.link+"*", checked: true, key: "link" },
  { label: Publication.is_affilated, checked: true, key: "is_affilated" },
  { label: Publication.author_no, checked: true, key: "author_no" },
  { label: "Starting Page", checked: true, key: "starting_page" },
  { label: "Ending Page", checked: true, key: "ending_page" },
  { label: Publication.cite+"*", checked: true, key: "cite" },
];

export const ExportCSV = ({ csvData, fileName }) => {
  const [values, handlers] = useListState(initialValues);

  const allChecked = values.every((value) => value.checked);
  const indeterminate = values.some((value) => value.checked) && !allChecked;

  
  const [show1, setShow] = useState(false);
  const [download, setDownload] = useState(false);

  const handleClose = () => setShow(false);
  const [DownloadData, setDownloadData] = useState([]);
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
  const handleDownload = async () => {
    const fields = [];
    const data = [];
    for await (let value of values) {
      if (value.checked) {
        fields.push(value.label);
      }
    }

    data.push(fields);
    for await (let dat1 of csvData) {
      const row = [];
      for await (let value of values) {
        if (value.checked) {
          row.push(dat1[value.key]);
        }
      }
      data.push(row);
    }
    setDownloadData(data);

    handleClose();
  };
  // const exportToCSV = (csvData, fileName) => {

  //     const ws = XLSX.utils.json_to_sheet(csvData);
  //     const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
  //     const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  //     const data = new Blob([excelBuffer], {type: fileType});
  //     FileSaver.saveAs(data, fileName + fileExtension);
  // }

  return (
    <>
      <Modal show={show1} onHide={handleClose} size="md" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Select Fields to Download</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-green">
          <Checkbox
            checked={allChecked}
            indeterminate={indeterminate}
            label="Select All Fields"
            onChange={() =>
              handlers.setState((current) =>
                current.map((value) => ({ ...value, checked: !allChecked }))
              )
            }
          />

          {values.map((value, index) => (
            <Checkbox
              mt="xs"
              ml={33}
              label={value.label}
              key={value.key}
              checked={value.checked}
              color="red"
              onChange={(event) =>
                handlers.setItemProp(
                  index,
                  "checked",
                  event.currentTarget.checked
                )
              }
            />
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="contained" color="primary">
            <CSVLink
              data={DownloadData}
              filename={fileName}
              onClick={handleDownload}
            >
              <div style={{ color: "white" }}>Download</div>
            </CSVLink>
          </Button>
          {/* <Button variant="contained" color="primary" onClick={handleClose}>
            Search
          </Button> */}
        </Modal.Footer>
      </Modal>
      <Button
        variant="contained"
        color="warning"
        onClick={() => {
          setShow(true);
        }}
      >
        Download
      </Button>
    </>

    // <Button variant="warning" onClick={(e) => exportToCSV(csvData,fileName)}>Export</Button>
  );
};