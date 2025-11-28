import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import _ from 'lodash';
import {notifications, showNotification ,useNotifications} from '@mantine/notifications';
// import { Form//  helperText } from "material-ui/Form";

// import Modal from 'react-bootstrap/Modal';
import MenuItem from "@mui/material/MenuItem";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";

// import HomeNavbar from "../RNavbar";
import Modal from "react-bootstrap/Modal";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { ActionIcon, Center } from "@mantine/core";
import { Button, Tooltip, Zoom  } from "@mui/material";
import Service from "../../Service/http";
import {Publication} from "../../Service/keyValueMap";
import { useNavigate } from "react-router-dom";
import { IconEdit } from "@tabler/icons-react";

function HelpModal({ edit }) {
  const service = new Service();
  const yearpre = new Date();
  // const depenNotifications = useNotifications();
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
  let presentYear = new Date(edit.year).getFullYear();
  const [yearvalue, setYearvalue] = useState(presentYear);
  // console.log("YEAR", yearvalue, new Date(edit.year).getFullYear(), new Date(edit.year));
  const years = ["None"];
  for (let step = 2012; step < 1 + yearpre.getFullYear(); step++) {
    years.push(step);
  }
  //   console.log("YEARS",year)
  
//   const [body, setBody] = useState({
//     _id: edit._id,
//     __v: edit.__v,
//     username: edit.username,
//     cjb: edit.cjb,
//     branch: edit.branch,
//     nationality: edit.nationality,
//     is_proceeding: edit.is_proceeding,
//     is_affilated: edit.is_affilated,
//     is_published: edit.is_published,
//     author_no: edit.author_no,
//     title: edit.title,
//     name_cjb: edit.name_cjb,
//     vol: edit.vol,
//     issue: edit.issue,
//     year: edit.year,
//     month: edit.month,
//     doi: edit.doi,
//     organised_by: edit.organised_by,
//     scl: edit.scl,
//     citation_scopus: edit.citation_scopus,
//     citation_google: edit.citation_google,
//     link: edit.link,
//     starting_page: edit.starting_page,
//     ending_page: edit.ending_page,
//     cite: edit.cite,
//   });
  const [monthvalue, setMonthValue] = useState(edit.month);
  const [cjb, setCjb] = useState(edit.cjb);
  const [branch, setBranch] = useState(edit.branch);
  const [nationality, setNational] = useState(edit.nationality);
  const [is_proceedings, setProceedings] = useState(edit.is_proceedings);
  const [is_published, setPublished] = useState(edit.is_published);
  const [is_affilated, setAffiliated] = useState(edit.is_affilated);
  const [author_no, setAuthorNo] = useState(edit.author_no);
  const [send, setSend] = useState(0);
 
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleUpdate = () => {
    // depenNotifications.show({
    //   title: 'Notification Title',
    //   message: 'This is a notification message.',
    // });
    // setTimeout(
    //   () =>{
    // showNotification({
    //   title:"CLICKED",
    //   message:"UPDATINGGGGGG",
    //   color:"yellow",
    // })
  // }
    // ,1)
    if (!_.isEqual(body,edit)) {
      // console.log("UPDATE,", body, edit);
      let confirm = window.confirm('This will update the publication.')
      if(confirm){
      service.post('api/publications/update',body).then((res)=>{
      //   notifications.show({
      //     title: "Updated",
      //     message: res.message,
      //     color: "green",
      // });
      window.alert('Updated '+edit.title+" Publication.")
      // setShow(false)
        // console.log("RES",res)
        window.location.reload()
        handleClose();

      }).catch((err)=>{
        window.alert('Error While Updating '+edit.title+".\nPlease Try Again Later.")
        console.log("ERR",err)

      })
    }else{
      window.alert("Cancelled the update action."); 
    }
    } else {
      window.alert('Make changes to Update.')
        // console.log("DONT UPDATE,", body, edit);
      // console.log("DONT UPDATE", edit.cjb,);
    }
  };
  const handleShow = () => {setShow(true);};
  // const navigate = useNavigate();

  const handleChangeCjb = (event) => {
    // console.log('handleChangecjb')
    setCjb(event?.target?.value);
    setBody({
      _id: edit._id,
      __v: edit.__v,
      username: body.username,
      cjb: event?.target?.value,
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
    setYearvalue(event?.target?.value);
    setBody({
      _id: edit._id,
      __v: edit.__v,
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
        event?.target?.value +
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
    setMonthValue(event?.target?.value);
    setBody({
      _id: edit._id,
      __v: edit.__v,
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
                (event?.target?.value.length === 1
                  ? "0" + event?.target?.value
                  : event?.target?.value.length === 0
                  ? "01"
                  : event?.target?.value) +
                "-01"
            ).toLocaleDateString()
          : body.year,
      month: event?.target?.value,
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
    setBranch(event?.target?.value);
    setBody({
      _id: edit._id,
      __v: edit.__v,
      username: body.username,
      cjb: body.cjb,
      branch: event?.target?.value,
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
    setNational(event?.target?.value);
    // body.nationality = event?.target?.value;
    setBody({
      _id: edit._id,
      __v: edit.__v,
      username: body.username,
      cjb: body.cjb,
      branch: body.branch,
      nationality: event?.target?.value,
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
    setProceedings(event?.target?.value);
    // body.is_proceeding= event?.target?.value;
    setBody({
      _id: edit._id,
      __v: edit.__v,
      username: body.username,
      cjb: body.cjb,
      branch: body.branch,
      nationality: body.nationality,
      is_proceeding: event?.target?.value,
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
    setPublished(event?.target?.value);
    // body.is_published= event?.target?.value
    setBody({
      _id: edit._id,
      __v: edit.__v,
      username: body.username,
      cjb: body.cjb,
      branch: body.branch,
      nationality: body.nationality,
      is_proceeding: body.is_proceeding,
      is_affilated: body.is_affilated,
      is_published: event?.target?.value,
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
    setAffiliated(event?.target?.value);
    // body.is_affilated = event?.target?.value
    setBody({
      _id: edit._id,
      __v: edit.__v,
      username: body.username,
      cjb: body.cjb,
      branch: body.branch,
      nationality: body.nationality,
      is_proceeding: body.is_proceeding,
      is_affilated: event?.target?.value,
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
    setAuthorNo(event?.target?.value);
    // body.author_no = event?.target?.value
    setBody({
      _id: edit._id,
      __v: edit.__v,
      username: body.username,
      cjb: body.cjb,
      branch: body.branch,
      nationality: body.nationality,
      is_proceeding: body.is_proceeding,
      is_affilated: body.is_affilated,
      is_published: body.is_published,
      author_no: event?.target?.value,
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
  const [body,setBody] = useState(edit)
  const onSubmit = (event) => {
    // console.log("ONSUBMIT-------", body)
    // // // debug();
    // // setInterval(() => {
    //     // console.log('Logs every minute');
    // //   },10000)
    // service.post('api/data', body).then((json) => {
    //     console.log("JSON", json)
    //     navigate(-1)
    // }).catch((error) => {
    //     console.log(error);
    // });
    // console.log("EVENT",body)
  };
  useEffect(()=>{
    // const [body,setBody] = useState(edit)
    setBody(edit);
    setMonthValue(edit.month);
    presentYear = new Date(edit.year).getFullYear();
    setYearvalue(presentYear);
  setCjb(edit.cjb);
 setBranch(edit.branch);
  setNational(edit.nationality);
  setProceedings(edit.is_proceedings);
  setPublished(edit.is_published);
 setAffiliated(edit.is_affilated);
 setAuthorNo(edit.author_no);
  },[edit])
  const handleChange = (e) => {
    // console.log("EEEE", e)
    if (!e.target) {
      setDate(e);
      // body.year = e.target.value
      setBody({
        _id: edit._id,
        __v: edit.__v,
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
        _id: edit._id,
        __v: edit.__v,
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
        _id: edit._id,
        __v: edit.__v,
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
        _id: edit._id,
        __v: edit.__v,
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
        _id: edit._id,
        __v: edit.__v,
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
        _id: edit._id,
        __v: edit.__v,
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
        _id: edit._id,
        __v: edit.__v,
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
        _id: edit._id,
        __v: edit.__v,
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
        _id: edit._id,
        __v: edit.__v,
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
        _id: edit._id,
        __v: edit.__v,
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
        _id: edit._id,
        __v: edit.__v,
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
        _id: edit._id,
        __v: edit.__v,
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
        _id: edit._id,
        __v: edit.__v,
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
        _id: edit._id,
        __v: edit.__v,
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
        _id: edit._id,
        __v: edit.__v,
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
        _id: edit._id,
        __v: edit.__v,
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
        _id: edit._id,
        __v: edit.__v,
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

  return (
    <>
    
      <Modal show={show} onHide={handleClose} size="xl" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>
            Edit Publication <a style={{ color: "#548C42" }}>{edit.title}</a>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-green">
          <MDBContainer fluid>
            <MDBRow className="d-flex justify-content-center align-items-center">
              <MDBCol col="12" className="m-5">
                <MDBCard
                  className="card-registration card-registration-2"
                  style={{ borderRadius: "15px" }}
                >
                  <MDBCardBody className="p-0">
                    <form id="insert-data" ref={formRef} onSubmit={onSubmit}>
                      <MDBRow>
                        <MDBCol md="6" className="p-5 bg-white">
                          {/* <h3 className="fw-normal mb-5" style={{ color: '#6C9449' }}>Publication Information</h3> */}
                          <TextField
                            required
                            id="publication"
                            name="publication"
                            label={Publication.title}
                            fullWidth
                            variant="standard"
                            defaultValue={edit.title}
                            onChange={handleChange}
                          />
                          <br />
                          <br />
                          <TextField
                            required
                            id="authors"
                            name="authors"
                            label={Publication.username+'  (Add multiple authors seperated by ",")'}
                            fullWidth
                            variant="standard"
                            defaultValue={edit.username}
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
                                  {Publication.cjb}
                                </InputLabel>
                                <Select
                                  labelId="c/j/b/bc"
                                  id="c/j/b/bc"
                                  value={cjb}
                                  onChange={handleChangeCjb}
                                  label="C/J/B/BC"
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
                                  {Publication.branch}
                                </InputLabel>
                                <Select
                                  labelId="branch"
                                  id="branch"
                                  value={branch}
                                  onChange={handleChangeBranch}
                                  label="Branch"
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
                                  {Publication.nationality}
                                </InputLabel>
                                <Select
                                  labelId="nationality"
                                  id="nationality"
                                  value={nationality}
                                  onChange={handleChangeNationality}
                                  label="Inter/National"
                                  required
                                >
                                  <MenuItem value="">
                                    <em>None</em>
                                  </MenuItem>
                                  <MenuItem value={"National"}>
                                    National
                                  </MenuItem>
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
                            defaultValue={edit.name_cjb}
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
                            defaultValue={edit.doi}
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
                            defaultValue={edit.cite}
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
                            defaultValue={edit.organised_by}
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
                            defaultValue={edit.link}
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
                                defaultValue={edit.vol}
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
                                defaultValue={edit.issue}
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
                                sx={{ minWidth: 80 }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  {Publication.year}
                                </InputLabel>
                                <Select
                                  labelId="year"
                                  id="year"
                                  value={yearvalue}
                                  onChange={handleChangeYear}
                                  label="year"
                                  required
                                >
                                  {years.map((item) => (
                                    <MenuItem
                                      value={item === "None" ? "" : item}
                                    >
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
                                sx={{ minWidth: 80 }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  {Publication.month}
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
                                    <MenuItem
                                      value={item === "None" ? "" : item}
                                    >
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
                                  // required
                                >
                                  <MenuItem value="">
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
                                defaultValue={edit.starting_page}
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
                                defaultValue={edit.ending_page}
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
                                defaultValue={edit.scl}
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
                                defaultValue={edit.citation_scopus}
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
                                defaultValue={edit.citation_google}
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
                          {/* <Button variant="contained" color='secondary' type='submit' form="insert-data" onClick={() => { formRef.current.reportValidity(); setSend(send + 1) }}>Submit</Button> */}
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
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ marginRight: "10px" }}
            variant="contained"
            color="error"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            style={{ marginLeft: "10px" }}
            variant="contained"
            color="success"
            onClick={handleUpdate}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <TooltipFloating label={"Edit"} position="top"> */}

      <Tooltip arrow title="Edit" placement="top" TransitionComponent={Zoom}>

      <IconEdit onClick={() => {
        handleShow();
      }}color="white" className="button-edit" size={23} />
      </Tooltip>
        {/* <ActionIcon
          
          size={25}
          // className="button-edit"
          variant="default"
        > */}
        {/* </ActionIcon> */}
      {/* </TooltipFloating> */}

      {/* <div style={{ "height": "fill", "width": "100wh", backgroundColor: "#c5d299", "paddingBottom": "100px" }}>
                
            </div> */}
    </>
  );
}

export default HelpModal;
