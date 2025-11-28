import { Checkbox } from "@mantine/core";
import { Button } from "@mui/material";
import { useListState } from "@mantine/hooks";
import React, { useState } from "react";
// import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';
import Modal from "react-bootstrap/Modal";
import { CSVLink } from "react-csv";
import { ResearchKey } from "../../Service/keyValueMap";
const initialValues = [
  { label: ResearchKey.title+"*", checked: true, key: "title" },
  { label: ResearchKey.pi+"*", checked: true, key: "pi" },
  { label: ResearchKey.co_pi+"*", checked: true, key: "co_pi" },
  { label: ResearchKey.dept+"*", checked: true, key: "dept" },
  { label: ResearchKey.amount+"*", checked: true, key: "amount" },
  { label: ResearchKey.scheme+"*", checked: true, key: "scheme" },
//   { label: Publication.issue, checked: false, key: "issue" },
  { label: ResearchKey.year+"*", checked: true, key: "year" },
  { label: ResearchKey.duration+"*", checked: true, key: "duration" },

];

export const ResearchExportCSV = ({ csvData, fileName }) => {
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