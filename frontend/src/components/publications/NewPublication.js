import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import HomeNavbar from "../RNavbar";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Button } from '@mui/material';
import Service from '../../Service/http';
import { Publication } from '../../Service/keyValueMap';
import { useDispatch, useSelector } from 'react-redux';
import { BulkUpload } from "./BulkUpload";
import { Tab } from "../login/Actions";
function FirstData() {
  // const classes = useStyles();
  const loggedIn = useSelector((state)=>state.logged);
  const verify = useSelector((state)=>state.verify);
  const isSuperAdmin = useSelector((state)=>state.isSuperAdmin);
  const isAdmin = useSelector((state)=>state.isAdmin);
  const service = new Service();
  const yearpre = new Date();
  const dispatch=useDispatch();
  const here = new Date(
    "Sun Jan 01 2023 00:00:00 GMT+0530 (India Standard Time)"
  ).toLocaleDateString();
  // console.log("HERE", here)
  // const username = query.get('')
  const formRef = React.useRef();
  const [month, setMonth] = useState([
    "None",
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
  ]);
  const [date, setDate] = useState("");
  const [year, setYear] = useState("");
  const [yearvalue, setYearvalue] = useState("");
  const years = ["None"];
  for (let step = 2012; step < 1 + yearpre.getFullYear(); step++) {
    years.push(step);
  }
  // console.log("YEARS",years)
  const [body, setBody] = useState({
    username: "",
    cjb: "",
    branch: "",
    nationality: "",
    is_proceeding: "",
    is_affilated: "",
    is_published: "",
    author_no: "",
    title: "",
    name_cjb: "",
    vol: "",
    issue: "",
    year: "",
    month: "",
    doi: "",
    organised_by: "",
    scl: "",
    citation_scopus: "",
    citation_google: "",
    link: "",
    starting_page: 0,
    ending_page: 0,
    cite: "",
  });
  const [monthvalue, setMonthValue] = useState("");
  const [cjb, setCjb] = useState("");
  const [branch, setBranch] = useState("");
  const [nationality, setNational] = useState("");
  const [is_proceedings, setProceedings] = useState("");
  const [is_published, setPublished] = useState("");
  const [is_affilated, setAffiliated] = useState("");
  const [author_no, setAuthorNo] = useState([]);
  const [titles, setTitles] = useState([]);
  const [send, setSend] = useState(0);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  const handleChangeCjb = (event) => {
    setCjb(event.target.value);
    setBody({
      username: body.username,
      cjb: event.target.value,
      branch: body.branch,
      nationality: body.nationality,
      is_proceeding: body.is_proceeding,
      is_affilated: body.is_affilated,
      is_published: body.is_published,
      author_no: body.author_no,
      title: body.title,
      name_cjb: body.name_cjb,
      vol: body.vol,
      issue: body.issue,
      year: body.year,
      month: body.month,
      doi: body.doi,
      organised_by: body.organised_by,
      scl: body.scl,
      citation_scopus: body.citation_scopus,
      citation_google: body.citation_google,
      link: body.link,
      starting_page: body.starting_page,
      ending_page: body.ending_page,
      cite: body.cite,
    });
  };
  const handleChangeYear = (event) => {
    setYearvalue(event.target.value);
    setBody({
      username: body.username,
      cjb: body.cjb,
      branch: body.branch,
      nationality: body.nationality,
      is_proceeding: body.is_proceeding,
      is_affilated: body.is_affilated,
      is_published: body.is_published,
      author_no: body.author_no,
      title: body.title,
      name_cjb: body.name_cjb,
      vol: body.vol,
      issue: body.issue,
      year: new Date(
        event.target.value +
          "-" +
          (body.month === "" ? "01" : body.month) +
          "-01"
      ).toLocaleDateString(),
      month: body.month,
      doi: body.doi,
      organised_by: body.organised_by,
      scl: body.scl,
      citation_scopus: body.citation_scopus,
      citation_google: body.citation_google,
      link: body.link,
      starting_page: body.starting_page,
      ending_page: body.ending_page,
      cite: body.cite,
    });
  };
  const handleChangeMonth = (event) => {
    setMonthValue(event.target.value);
    setBody({
      username: body.username,
      cjb: body.cjb,
      branch: body.branch,
      nationality: body.nationality,
      is_proceeding: body.is_proceeding,
      is_affilated: body.is_affilated,
      is_published: body.is_published,
      author_no: body.author_no,
      title: body.title,
      name_cjb: body.name_cjb,
      vol: body.vol,
      issue: body.issue,
      year:
        yearvalue != ""
          ? new Date(
              yearvalue +
                "-" +
                (event.target.value.length === 1
                  ? "0" + event.target.value
                  : event.target.value.length === 0
                  ? "01"
                  : event.target.value) +
                "-01"
            ).toLocaleDateString()
          : body.year,
      month: event.target.value,
      doi: body.doi,
      organised_by: body.organised_by,
      scl: body.scl,
      citation_scopus: body.citation_scopus,
      citation_google: body.citation_google,
      link: body.link,
      starting_page: body.starting_page,
      ending_page: body.ending_page,
      cite: body.cite,
    });
  };
  const handleChangeBranch = (event) => {
    setBranch(event.target.value);
    setBody({
      username: body.username,
      cjb: body.cjb,
      branch: event.target.value,
      nationality: body.nationality,
      is_proceeding: body.is_proceeding,
      is_affilated: body.is_affilated,
      is_published: body.is_published,
      author_no: body.author_no,
      title: body.title,
      name_cjb: body.name_cjb,
      vol: body.vol,
      issue: body.issue,
      year: body.year,
      month: body.month,
      doi: body.doi,
      organised_by: body.organised_by,
      scl: body.scl,
      citation_scopus: body.citation_scopus,
      citation_google: body.citation_google,
      link: body.link,
      starting_page: body.starting_page,
      ending_page: body.ending_page,
      cite: body.cite,
    });
  };
  const handleChangeNationality = (event) => {
    setNational(event.target.value);
    // body.nationality = event.target.value;
    setBody({
      username: body.username,
      cjb: body.cjb,
      branch: body.branch,
      nationality: event.target.value,
      is_proceeding: body.is_proceeding,
      is_affilated: body.is_affilated,
      is_published: body.is_published,
      author_no: body.author_no,
      title: body.title,
      name_cjb: body.name_cjb,
      vol: body.vol,
      issue: body.issue,
      year: body.year,
      month: body.month,
      doi: body.doi,
      organised_by: body.organised_by,
      scl: body.scl,
      citation_scopus: body.citation_scopus,
      citation_google: body.citation_google,
      link: body.link,
      starting_page: body.starting_page,
      ending_page: body.ending_page,
      cite: body.cite,
    });
  };
  const handleChangeProceedings = (event) => {
    setProceedings(event.target.value);
    // body.is_proceeding= event.target.value;
    setBody({
      username: body.username,
      cjb: body.cjb,
      branch: body.branch,
      nationality: body.nationality,
      is_proceeding: event.target.value,
      is_affilated: body.is_affilated,
      is_published: body.is_published,
      author_no: body.author_no,
      title: body.title,
      name_cjb: body.name_cjb,
      vol: body.vol,
      issue: body.issue,
      year: body.year,
      month: body.month,
      doi: body.doi,
      organised_by: body.organised_by,
      scl: body.scl,
      citation_scopus: body.citation_scopus,
      citation_google: body.citation_google,
      link: body.link,
      starting_page: body.starting_page,
      ending_page: body.ending_page,
      cite: body.cite,
    });
  };
  const handleChangePublished = (event) => {
    setPublished(event.target.value);
    // body.is_published= event.target.value
    setBody({
      username: body.username,
      cjb: body.cjb,
      branch: body.branch,
      nationality: body.nationality,
      is_proceeding: body.is_proceeding,
      is_affilated: body.is_affilated,
      is_published: event.target.value,
      author_no: body.author_no,
      title: body.title,
      name_cjb: body.name_cjb,
      vol: body.vol,
      issue: body.issue,
      year: body.year,
      month: body.month,
      doi: body.doi,
      organised_by: body.organised_by,
      scl: body.scl,
      citation_scopus: body.citation_scopus,
      citation_google: body.citation_google,
      link: body.link,
      starting_page: body.starting_page,
      ending_page: body.ending_page,
      cite: body.cite,
    });
  };
  const handleChangeAffiliated = (event) => {
    setAffiliated(event.target.value);
    // body.is_affilated = event.target.value
    setBody({
      username: body.username,
      cjb: body.cjb,
      branch: body.branch,
      nationality: body.nationality,
      is_proceeding: body.is_proceeding,
      is_affilated: event.target.value,
      is_published: body.is_published,
      author_no: body.author_no,
      title: body.title,
      name_cjb: body.name_cjb,
      vol: body.vol,
      issue: body.issue,
      year: body.year,
      month: body.month,
      doi: body.doi,
      organised_by: body.organised_by,
      scl: body.scl,
      citation_scopus: body.citation_scopus,
      citation_google: body.citation_google,
      link: body.link,
      starting_page: body.starting_page,
      ending_page: body.ending_page,
      cite: body.cite,
    });
  };
  const handleChangeAuthorNo = (event) => {
    setAuthorNo(event.target.value);
    // body.author_no = event.target.value
    setBody({
      username: body.username,
      cjb: body.cjb,
      branch: body.branch,
      nationality: body.nationality,
      is_proceeding: body.is_proceeding,
      is_affilated: body.is_affilated,
      is_published: body.is_published,
      author_no: event.target.value,
      title: body.title,
      name_cjb: body.name_cjb,
      vol: body.vol,
      issue: body.issue,
      year: body.year,
      month: body.month,
      doi: body.doi,
      organised_by: body.organised_by,
      scl: body.scl,
      citation_scopus: body.citation_scopus,
      citation_google: body.citation_google,
      link: body.link,
      starting_page: body.starting_page,
      ending_page: body.ending_page,
      cite: body.cite,
    });
  };
  const onSubmit = (event) => {
    event.preventDefault();
    //console.log("ONSUBMIT-------", body);
    // // debug();
    // setInterval(() => {
    // console.log('Logs every minute');
    //   },10000)
    if(titles.includes(body.title)){
      window.alert('Duplicate Title')
    }
    else{
      let confirm = window.confirm("This action will add the data into the Database")
      if(confirm){
    service
      .post("api/publications/data", body)
      .then((json) => {
        window.alert("Succesfully Added "+body.title)
        navigate("/publications");
      })
      .catch((error) => {
        console.log(error);
      });
    }else{
      window.alert("Cancelled the insert action."); 
    }
    }
    // console.log("EVENT",body)
  };
  const handleChange = (e) => {
    // console.log("EEEE", e)
    if (!e.target) {
      setDate(e);
      // body.year = e.target.value
      setBody({
        username: body.username,
        cjb: body.cjb,
        branch: body.branch,
        nationality: body.nationality,
        is_proceeding: body.is_proceeding,
        is_affilated: body.is_affilated,
        is_published: body.is_published,
        author_no: body.author_no,
        title: body.title,
        name_cjb: body.name_cjb,
        vol: body.vol,
        issue: body.issue,
        year: new Date(e).toLocaleDateString(),
        month: body.month,
        doi: body.doi,
        organised_by: body.organised_by,
        scl: body.scl,
        citation_scopus: body.citation_scopus,
        citation_google: body.citation_google,
        link: body.link,
        starting_page: body.starting_page,
        ending_page: body.ending_page,
        cite: body.cite,
      });
    } else if (e.target.id === "publication") {
      // body.title = e.target.value
      setBody({
        username: body.username,
        cjb: body.cjb,
        branch: body.branch,
        nationality: body.nationality,
        is_proceeding: body.is_proceeding,
        is_affilated: body.is_affilated,
        is_published: body.is_published,
        author_no: body.author_no,
        title: e.target.value,
        name_cjb: body.name_cjb,
        vol: body.vol,
        issue: body.issue,
        year: body.year,
        month: body.month,
        doi: body.doi,
        organised_by: body.organised_by,
        scl: body.scl,
        citation_scopus: body.citation_scopus,
        citation_google: body.citation_google,
        link: body.link,
        starting_page: body.starting_page,
        ending_page: body.ending_page,
        cite: body.cite,
      });
    } else if (e.target.id === "authors") {
      // body.username = e.target.value
      setBody({
        username: e.target.value,
        cjb: body.cjb,
        branch: body.branch,
        nationality: body.nationality,
        is_proceeding: body.is_proceeding,
        is_affilated: body.is_affilated,
        is_published: body.is_published,
        author_no: body.author_no,
        title: body.title,
        name_cjb: body.name_cjb,
        vol: body.vol,
        issue: body.issue,
        year: body.year,
        month: body.month,
        doi: body.doi,
        organised_by: body.organised_by,
        scl: body.scl,
        citation_scopus: body.citation_scopus,
        citation_google: body.citation_google,
        link: body.link,
        starting_page: body.starting_page,
        ending_page: body.ending_page,
        cite: body.cite,
      });
    } else if (e.target.id === "name_c-j-b") {
      // body.name_cjb = e.target.value
      setBody({
        username: body.username,
        cjb: body.cjb,
        branch: body.branch,
        nationality: body.nationality,
        is_proceeding: body.is_proceeding,
        is_affilated: body.is_affilated,
        is_published: body.is_published,
        author_no: body.author_no,
        title: body.title,
        name_cjb: e.target.value,
        vol: body.vol,
        issue: body.issue,
        year: body.year,
        month: body.month,
        doi: body.doi,
        organised_by: body.organised_by,
        scl: body.scl,
        citation_scopus: body.citation_scopus,
        citation_google: body.citation_google,
        link: body.link,
        starting_page: body.starting_page,
        ending_page: body.ending_page,
        cite: body.cite,
      });
    } else if (e.target.id === "vol") {
      // body.vol = e.target.value
      setBody({
        username: body.username,
        cjb: body.cjb,
        branch: body.branch,
        nationality: body.nationality,
        is_proceeding: body.is_proceeding,
        is_affilated: body.is_affilated,
        is_published: body.is_published,
        author_no: body.author_no,
        title: body.title,
        name_cjb: body.name_cjb,
        vol: e.target.value,
        issue: body.issue,
        year: body.year,
        month: body.month,
        doi: body.doi,
        organised_by: body.organised_by,
        scl: body.scl,
        citation_scopus: body.citation_scopus,
        citation_google: body.citation_google,
        link: body.link,
        starting_page: body.starting_page,
        ending_page: body.ending_page,
        cite: body.cite,
      });
    } else if (e.target.id === "issue") {
      // body.issue = e.target.value
      setBody({
        username: body.username,
        cjb: body.cjb,
        branch: body.branch,
        nationality: body.nationality,
        is_proceeding: body.is_proceeding,
        is_affilated: body.is_affilated,
        is_published: body.is_published,
        author_no: body.author_no,
        title: body.title,
        name_cjb: body.name_cjb,
        vol: body.vol,
        issue: e.target.value,
        year: body.year,
        month: body.month,
        doi: body.doi,
        organised_by: body.organised_by,
        scl: body.scl,
        citation_scopus: body.citation_scopus,
        citation_google: body.citation_google,
        link: body.link,
        starting_page: body.starting_page,
        ending_page: body.ending_page,
        cite: body.cite,
      });
    } else if (e.target.id === "month") {
      // body.month = e.target.value
      // console.log("MONTH",(body.month.length===1?"0"+e.target.value:e.target.value))
      setBody({
        username: body.username,
        cjb: body.cjb,
        branch: body.branch,
        nationality: body.nationality,
        is_proceeding: body.is_proceeding,
        is_affilated: body.is_affilated,
        is_published: body.is_published,
        author_no: body.author_no,
        title: body.title,
        name_cjb: body.name_cjb,
        vol: body.vol,
        issue: body.issue,
        year:
          1 <= e.target.value && e.target.value <= 12
            ? year != ""
              ? new Date(
                  year +
                    "-" +
                    (e.target.value.length === 1
                      ? "0" + e.target.value
                      : e.target.value.length === 0
                      ? "01"
                      : e.target.value) +
                    "-01"
                ).toLocaleDateString()
              : body.year
            : body.year,
        month:
          1 <= e.target.value && e.target.value <= 12 ? e.target.value : "",
        doi: body.doi,
        organised_by: body.organised_by,
        scl: body.scl,
        citation_scopus: body.citation_scopus,
        citation_google: body.citation_google,
        link: body.link,
        starting_page: body.starting_page,
        ending_page: body.ending_page,
        cite: body.cite,
      });
    } else if (e.target.id === "issn") {
      // body.doi = e.target.value
      setBody({
        username: body.username,
        cjb: body.cjb,
        branch: body.branch,
        nationality: body.nationality,
        is_proceeding: body.is_proceeding,
        is_affilated: body.is_affilated,
        is_published: body.is_published,
        author_no: body.author_no,
        title: body.title,
        name_cjb: body.name_cjb,
        vol: body.vol,
        issue: body.issue,
        year: body.year,
        month: body.month,
        doi: e.target.value,
        organised_by: body.organised_by,
        scl: body.scl,
        citation_scopus: body.citation_scopus,
        citation_google: body.citation_google,
        link: body.link,
        starting_page: body.starting_page,
        ending_page: body.ending_page,
        cite: body.cite,
      });
    } else if (e.target.id === "organizor") {
      // body.organised_by = e.target.value
      setBody({
        username: body.username,
        cjb: body.cjb,
        branch: body.branch,
        nationality: body.nationality,
        is_proceeding: body.is_proceeding,
        is_affilated: body.is_affilated,
        is_published: body.is_published,
        author_no: body.author_no,
        title: body.title,
        name_cjb: body.name_cjb,
        vol: body.vol,
        issue: body.issue,
        year: body.year,
        month: body.month,
        doi: body.doi,
        organised_by: e.target.value,
        scl: body.scl,
        citation_scopus: body.citation_scopus,
        citation_google: body.citation_google,
        link: body.link,
        starting_page: body.starting_page,
        ending_page: body.ending_page,
        cite: body.cite,
      });
    } else if (e.target.id === "scopus") {
      // body.scl = e.target.value
      setBody({
        username: body.username,
        cjb: body.cjb,
        branch: body.branch,
        nationality: body.nationality,
        is_proceeding: body.is_proceeding,
        is_affilated: body.is_affilated,
        is_published: body.is_published,
        author_no: body.author_no,
        title: body.title,
        name_cjb: body.name_cjb,
        vol: body.vol,
        issue: body.issue,
        year: body.year,
        month: body.month,
        doi: body.doi,
        organised_by: body.organised_by,
        scl: e.target.value,
        citation_scopus: body.citation_scopus,
        citation_google: body.citation_google,
        link: body.link,
        starting_page: body.starting_page,
        ending_page: body.ending_page,
        cite: body.cite,
      });
    } else if (e.target.id === "citationscopus") {
      // body.citation_scopus = e.target.value
      setBody({
        username: body.username,
        cjb: body.cjb,
        branch: body.branch,
        nationality: body.nationality,
        is_proceeding: body.is_proceeding,
        is_affilated: body.is_affilated,
        is_published: body.is_published,
        author_no: body.author_no,
        title: body.title,
        name_cjb: body.name_cjb,
        vol: body.vol,
        issue: body.issue,
        year: body.year,
        month: body.month,
        doi: body.doi,
        organised_by: body.organised_by,
        scl: body.scl,
        citation_scopus: e.target.value,
        citation_google: body.citation_google,
        link: body.link,
        starting_page: body.starting_page,
        ending_page: body.ending_page,
        cite: body.cite,
      });
    } else if (e.target.id === "citationgoogle") {
      // body.citation_google = e.target.value
      setBody({
        username: body.username,
        cjb: body.cjb,
        branch: body.branch,
        nationality: body.nationality,
        is_proceeding: body.is_proceeding,
        is_affilated: body.is_affilated,
        is_published: body.is_published,
        author_no: body.author_no,
        title: body.title,
        name_cjb: body.name_cjb,
        vol: body.vol,
        issue: body.issue,
        year: body.year,
        month: body.month,
        doi: body.doi,
        organised_by: body.organised_by,
        scl: body.scl,
        citation_scopus: body.citation_scopus,
        citation_google: e.target.value,
        link: body.link,
        starting_page: body.starting_page,
        ending_page: body.ending_page,
        cite: body.cite,
      });
    } else if (e.target.id === "link") {
      // body.link = e.target.value
      setBody({
        username: body.username,
        cjb: body.cjb,
        branch: body.branch,
        nationality: body.nationality,
        is_proceeding: body.is_proceeding,
        is_affilated: body.is_affilated,
        is_published: body.is_published,
        author_no: body.author_no,
        title: body.title,
        name_cjb: body.name_cjb,
        vol: body.vol,
        issue: body.issue,
        year: body.year,
        month: body.month,
        doi: body.doi,
        organised_by: body.organised_by,
        scl: body.scl,
        citation_scopus: body.citation_scopus,
        citation_google: body.citation_google,
        link: e.target.value,
        starting_page: body.starting_page,
        ending_page: body.ending_page,
        cite: body.cite,
      });
    } else if (e.target.id === "startingPage") {
      // body.starting_page = e.target.value
      setBody({
        username: body.username,
        cjb: body.cjb,
        branch: body.branch,
        nationality: body.nationality,
        is_proceeding: body.is_proceeding,
        is_affilated: body.is_affilated,
        is_published: body.is_published,
        author_no: body.author_no,
        title: body.title,
        name_cjb: body.name_cjb,
        vol: body.vol,
        issue: body.issue,
        year: body.year,
        month: body.month,
        doi: body.doi,
        organised_by: body.organised_by,
        scl: body.scl,
        citation_scopus: body.citation_scopus,
        citation_google: body.citation_google,
        link: body.link,
        starting_page: e.target.value,
        ending_page: body.ending_page,
        cite: body.cite,
      });
    } else if (e.target.id === "endingPage") {
      // body.ending_page = e.target.value
      setBody({
        username: body.username,
        cjb: body.cjb,
        branch: body.branch,
        nationality: body.nationality,
        is_proceeding: body.is_proceeding,
        is_affilated: body.is_affilated,
        is_published: body.is_published,
        author_no: body.author_no,
        title: body.title,
        name_cjb: body.name_cjb,
        vol: body.vol,
        issue: body.issue,
        year: body.year,
        month: body.month,
        doi: body.doi,
        organised_by: body.organised_by,
        scl: body.scl,
        citation_scopus: body.citation_scopus,
        citation_google: body.citation_google,
        link: body.link,
        starting_page: body.starting_page,
        ending_page: e.target.value,
        cite: body.cite,
      });
    } else if (e.target.id === "article-cite") {
      // body.cite = e.target.value
      setBody({
        username: body.username,
        cjb: body.cjb,
        branch: body.branch,
        nationality: body.nationality,
        is_proceeding: body.is_proceeding,
        is_affilated: body.is_affilated,
        is_published: body.is_published,
        author_no: body.author_no,
        title: body.title,
        name_cjb: body.name_cjb,
        vol: body.vol,
        issue: body.issue,
        year: body.year,
        month: body.month,
        doi: body.doi,
        organised_by: body.organised_by,
        scl: body.scl,
        citation_scopus: body.citation_scopus,
        citation_google: body.citation_google,
        link: body.link,
        starting_page: body.starting_page,
        ending_page: body.ending_page,
        cite: e.target.value,
      });
    } else {
      // body.year = e.target.value
      // console.log("IN ELSE 1",e.target.value+"-"+(body.month===''?"01":body.month))
      // console.log("IN ELSE", ""+e.target.value+"-"+body.month===''?"01":body.month+"-01")
      setDate(e);
      setYear(e.target.value);
      setBody({
        username: body.username,
        cjb: body.cjb,
        branch: body.branch,
        nationality: body.nationality,
        is_proceeding: body.is_proceeding,
        is_affilated: body.is_affilated,
        is_published: body.is_published,
        author_no: body.author_no,
        title: body.title,
        name_cjb: body.name_cjb,
        vol: body.vol,
        issue: body.issue,
        year:
          2000 < e.target.value && e.target.value < 2100
            ? new Date(
                e.target.value +
                  "-" +
                  (body.month === "" ? "01" : body.month) +
                  "-01"
              ).toLocaleDateString()
            : "",
        month: body.month,
        doi: body.doi,
        organised_by: body.organised_by,
        scl: body.scl,
        citation_scopus: body.citation_scopus,
        citation_google: body.citation_google,
        link: body.link,
        starting_page: body.starting_page,
        ending_page: body.ending_page,
        cite: body.cite,
      });
    }
    // console.log("IN HANDLE CHANGE", body)
  };
  // const navigate = useNavigate();
    useEffect(()=>{
      dispatch(Tab('new-publication'));
      if(!loggedIn){
          navigate("../")}
      else if(!verify){
        navigate("../verify")
      }else if(isSuperAdmin){
        navigate("../publications")
      }
      if(titles.length==0){
      service.get('api/publications/titles').then((res)=>{
        // console.log('titles',res)
        setTitles(res);
        // console.log("inside",titles)
      }).catch((error)=>{
        console.log("ERROR",error)
      })
    }
    },[])
  return (
    <>
      {/* <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Sample Publication Data</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            overflowY: "scroll",
            paddingBottom: "20px",
            backgroundColor: "#c5d299",
          }}
        >
          <HelpModal />
          <br />
          <br />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="contained" color="error" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}
      <HomeNavbar />
      <div
        style={{
          height: "fill",
          width: "100wh",
          backgroundColor: "#c5d299",
          paddingBottom: "150px",
        }}
      >
        {/* <br/> */}
        <MDBContainer fluid className="h-custom">
          <MDBRow className="d-flex justify-content-center align-items-center h-100">
            <MDBCol col="12" className="m-4">
       {isAdmin?<MDBRow end>
                    {/* <MDBCol md="4">
                        <ExportCSV csvData={data} fileName={"Publications"} />
                    </MDBCol>
                    <MDBCol md="4" >
                        <Button  variant="contained" color='secondary' onClick={handleShow}>Advance Search</Button>
                    </MDBCol> */}
                    <MDBCol md="4">
                        <BulkUpload titles={titles}/>
                    </MDBCol>
                </MDBRow>:"" }
                <br/>
              <MDBCard
                className="card-registration card-registration-2"
                style={{ borderRadius: "15px" }}
              >
                <MDBCardBody className="p-0">
                  <form id="insert-data" ref={formRef} onSubmit={onSubmit}>
                    <MDBRow>
                      <MDBCol md="6" className="p-5 bg-white">
                        <h3
                          className="fw-normal mb-5"
                          style={{ color: "#6C9449" }}
                        >
                          Publication Information
                        </h3>
                        <TextField
                          required
                          id="publication"
                          name="publication"
                          label={Publication.title}
                          fullWidth
                          variant="standard"
                          onChange={handleChange}
                        />
                        <br />
                        <br />
                        <TextField
                          required
                          id="authors"
                          name="authors"
                          label={Publication.username+' (Add multiple authors seperated by ",")'}
                          fullWidth
                          variant="standard"
                          onChange={handleChange}
                        />
                        <br />
                        <br />
                        <MDBRow>
                          <MDBCol md="4">
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120 }}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                {Publication.cjb+"*"}
                              </InputLabel>
                              <Select
                                labelId="c/j/b/bc"
                                id="c/j/b/bc"
                                value={cjb}
                                onChange={handleChangeCjb}
                                label={Publication.cjb}
                                required
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                <MenuItem value={"C"}>C</MenuItem>
                                <MenuItem value={"J"}>J</MenuItem>
                                <MenuItem value={"B"}>B</MenuItem>
                                <MenuItem value={"BC"}>BC</MenuItem>
                              </Select>
                            </FormControl>
                          </MDBCol>

                          <MDBCol md="4">
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120 }}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                {Publication.branch+"*"}
                              </InputLabel>
                              <Select
                                labelId="branch"
                                id="branch"
                                value={branch}
                                onChange={handleChangeBranch}
                                label={Publication.branch}
                                required
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                <MenuItem value={"CSE"}>CSE</MenuItem>
                                <MenuItem value={"IT"}>IT</MenuItem>
                                <MenuItem value={"ECE"}>ECE</MenuItem>
                                <MenuItem value={"EEE"}>EEE</MenuItem>
                                <MenuItem value={"AI/ML"}>AI/ML</MenuItem>
                                <MenuItem value={"BS&H"}>BS&H</MenuItem>
                              </Select>
                            </FormControl>
                          </MDBCol>
                          <MDBCol md="4">
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120 }}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                               {Publication.nationality+"*"}
                              </InputLabel>
                              <Select
                                labelId="nationality"
                                id="nationality"
                                value={nationality}
                                onChange={handleChangeNationality}
                                label={Publication.nationality}
                                required
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                <MenuItem value={"National"}>National</MenuItem>
                                <MenuItem value={"International"}>
                                  International
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </MDBCol>
                        </MDBRow>
                        <br />

                        <TextField
                          required
                          id="name_c-j-b"
                          name="name_c-j-b"
                          label={Publication.name_cjb}
                          fullWidth
                          variant="standard"
                          onChange={handleChange}
                        />
                        <br />
                        <br />
                        <TextField
                          required
                          id="issn"
                          name="issn"
                          label={Publication.doi}
                          fullWidth
                          variant="standard"
                          onChange={handleChange}
                        />
                        <br />
                        <br />
                        <TextField
                          required
                          id="article-cite"
                          name="article-cite"
                          label={Publication.cite}
                          fullWidth
                          variant="standard"
                          onChange={handleChange}
                        />
                      </MDBCol>

                      <MDBCol md="6" className="bg-indigo p-5">
                        <TextField
                          //required
                          id="organizer"
                          name="organizer"
                          label={Publication.organised_by}
                          fullWidth
                          variant="standard"
                          color="secondary"
                          onChange={handleChange}
                        />
                        <br />
                        <br />
                        <TextField
                          required
                          id="link"
                          name="link"
                          label={Publication.link}
                          fullWidth
                          variant="standard"
                          color="secondary"
                          onChange={handleChange}
                        />
                        <br />
                        <br />
                        <MDBRow>
                          <MDBCol md="3">
                            <TextField
                              //required
                              id="vol"
                              name="vol"
                              label={Publication.vol}
                              fullWidth
                              variant="standard"
                              color="secondary"
                              type="number"
                              onChange={handleChange}
                            />
                          </MDBCol>

                          <MDBCol md="3">
                            <TextField
                              //required
                              id="issue"
                              name="issue"
                              label={Publication.issue}
                              fullWidth
                              variant="standard"
                              color="secondary"
                              type="number"
                              onChange={handleChange}
                            />
                          </MDBCol>
                          <MDBCol md="3">
                            {/* <DatePicker
                                                            selected={date}
                                                            onChange={handleChange}
                                                            dateFormat="MM/yyyy"
                                                            showMonthYearPicker
                                                            required
                                                            label="Month-Year"
                                                        /> */}
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120 }}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                {Publication.year+"*"}
                              </InputLabel>
                              <Select
                                labelId="year"
                                id="year"
                                value={yearvalue}
                                onChange={handleChangeYear}
                                label={Publication.year}
                                required
                              >
                                {years.map((item) => (
                                  <MenuItem value={item === "None" ? "" : item}>
                                    {item}
                                  </MenuItem>
                                ))}
                                {/* <MenuItem value="">
                                                                    <em>None</em>
                                                                </MenuItem>
                                                                <MenuItem value={"C"}>C</MenuItem>
                                                                <MenuItem value={"J"}>J</MenuItem>
                                                                <MenuItem value={"B"}>B</MenuItem>
                                                                <MenuItem value={"BC"}>BC</MenuItem> */}
                              </Select>
                            </FormControl>
                            {/* <TextField
                                                required
                                                id="year"
                                                name="year"
                                                label="Year"
                                                fullWidth
                                                variant="standard"
                                                color='secondary'
                                                type="number"
                                                onChange={handleChange}
                                            /> */}
                          </MDBCol>
                          <MDBCol md="3">
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120 }}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                {Publication.month+"*"}
                              </InputLabel>
                              <Select
                                labelId="month"
                                id="month"
                                value={monthvalue}
                                onChange={handleChangeMonth}
                                label="month"
                                required
                              >
                                {month.map((item) => (
                                  <MenuItem value={item === "None" ? "" : item}>
                                    {item}
                                  </MenuItem>
                                ))}
                                {/* <MenuItem value="">
                                                                    <em>None</em>
                                                                </MenuItem>
                                                                <MenuItem value={"C"}>C</MenuItem>
                                                                <MenuItem value={"J"}>J</MenuItem>
                                                                <MenuItem value={"B"}>B</MenuItem>
                                                                <MenuItem value={"BC"}>BC</MenuItem> */}
                              </Select>
                            </FormControl>
                            {/* <TextField
                                                id="month"
                                                name="month"
                                                label="Month"
                                                fullWidth
                                                variant="standard"
                                                color='secondary'
                                                type="number"
                                                onChange={handleChange}
                                            />  */}
                          </MDBCol>
                        </MDBRow>
                        <br />

                        <MDBRow>
                          <MDBCol md="4">
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120 }}
                            >
                              <InputLabel
                                id="demo-simple-select-standard-label"
                                color="secondary"
                              >
                                {Publication.is_proceeding}
                              </InputLabel>
                              <Select
                                labelId="proceedings"
                                id="proceedings"
                                value={is_proceedings}
                                onChange={handleChangeProceedings}
                                label="In Proceedings?"
                                color="secondary"
                                //required
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                <MenuItem value={"Yes"}>Yes</MenuItem>
                                <MenuItem value={"No"}>No</MenuItem>
                              </Select>
                            </FormControl>
                          </MDBCol>

                          <MDBCol md="4">
                            {/* <MDBInput wrapperClass='mb-4' labelClass='text-white' label='Phone Number' size='lg' id='form10' type='text' /> */}
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120 }}
                            >
                              <InputLabel
                                id="demo-simple-select-standard-label"
                                color="secondary"
                              >
                                {Publication.is_published}
                              </InputLabel>
                              <Select
                                labelId="published"
                                id="published"
                                value={is_published}
                                onChange={handleChangePublished}
                                label="Abstract Published?"
                                color="secondary"
                                //required
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                <MenuItem value={"Yes"}>Yes</MenuItem>
                                <MenuItem value={"No"}>No</MenuItem>
                              </Select>
                            </FormControl>
                          </MDBCol>
                          <MDBCol md="4">
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120 }}
                            >
                              <InputLabel color="secondary">
                                {Publication.is_affilated}
                              </InputLabel>
                              <Select
                                labelId="affiliated"
                                id="affiliated"
                                value={is_affilated}
                                onChange={handleChangeAffiliated}
                                label="Affiliated?"
                                color="secondary"
                                //required
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                <MenuItem value={"Yes"}>Yes</MenuItem>
                                <MenuItem value={"No"}>No</MenuItem>
                              </Select>
                            </FormControl>
                          </MDBCol>
                        </MDBRow>
                        <br />

                        <MDBRow>
                          <MDBCol md="4">
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120 }}
                            >
                              <InputLabel
                                id="demo-simple-select-standard-label"
                                color="secondary"
                              >
                                {Publication.author_no}
                              </InputLabel>
                              <Select
                                labelId="author_no"
                                id="author_no"
                                value={author_no}
                                onChange={handleChangeAuthorNo}
                                label="Author Order"
                                color="secondary"
                                multiple
                                // required
                              >
                                <MenuItem value={""}>
                                  <em>None</em>
                                </MenuItem>
                                <MenuItem value={"Single"}>Single</MenuItem>
                                <MenuItem value={"First"}>First</MenuItem>
                                <MenuItem value={"Second"}>Second</MenuItem>
                                <MenuItem value={"Third"}>Third</MenuItem>
                                <MenuItem value={"Fourth"}>Fourth</MenuItem>
                                <MenuItem value={"Fifth"}>Fifth</MenuItem>
                                <MenuItem value={"Others"}>Others</MenuItem>
                              </Select>
                            </FormControl>
                          </MDBCol>

                          <MDBCol md="4">
                            <TextField
                              //required
                              id="startingPage"
                              name="startingPage"
                              label="Starting Page"
                              fullWidth
                              variant="standard"
                              color="secondary"
                              type="number"
                              onChange={handleChange}
                            />
                          </MDBCol>
                          <MDBCol md="4">
                            <TextField
                              // required
                              id="endingPage"
                              name="endingPage"
                              label="Ending Page"
                              fullWidth
                              variant="standard"
                              color="secondary"
                              type="number"
                              onChange={handleChange}
                            />
                          </MDBCol>
                        </MDBRow>
                        <br />
                        <MDBRow>
                          <MDBCol md="4">
                            <TextField
                              required
                              id="scopus"
                              name="scopus"
                              label={Publication.scl}
                              fullWidth
                              variant="standard"
                              color="secondary"
                              onChange={handleChange}
                            />
                          </MDBCol>

                          <MDBCol md="4">
                            <TextField
                              // required
                              id="citationscopus"
                              name="citationscopus"
                              label={Publication.citation_scopus}
                              fullWidth
                              variant="standard"
                              color="secondary"
                              onChange={handleChange}
                            />
                          </MDBCol>
                          <MDBCol md="4">
                            <TextField
                              // required
                              id="citationgoogle"
                              name="citationgoogle"
                              label={Publication.citation_google}
                              fullWidth
                              variant="standard"
                              color="secondary"
                              onChange={handleChange}
                            />
                          </MDBCol>
                        </MDBRow>
                        <br />
                        {/* <MDBCheckbox name='flexCheck' id='flexCheckDefault' labelClass='text-white mb-4' label='' /> */}
                        {/* <MDBBtn color='light' size='lg'>Publish insert</MDBBtn> */}
                        {/* <MDBRow> */}

                        {/* <MDBCol md='6'>
                                            <Button variant='contained' color='warning' onClick={handleShow}>Help</Button>
                                            </MDBCol> */}
                        {/* <MDBCol md='6'> */}
                        <Button
                          variant="contained"
                          color="secondary"
                          type="submit"
                          form="insert-data"
                          onClick={() => {
                            formRef.current.reportValidity();
                            setSend(send + 1);
                          }}
                        >
                          Submit
                        </Button>
                        {/* </MDBCol> */}
                        {/* </MDBRow> */}
                      </MDBCol>
                    </MDBRow>
                  </form>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    </>
  );
}

export default FirstData;