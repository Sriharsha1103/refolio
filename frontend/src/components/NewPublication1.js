import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import Modal from 'react-bootstrap/Modal';
import MenuItem from '@mui/material/MenuItem';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
} from 'mdb-react-ui-kit';
import { useNavigate } from "react-router-dom";
import HomeNavbar from "./RNavbar";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Button } from '@mui/material';
import Service from '../Service/http';
import HelpModal from './HelpModal';
import DatePicker from 'react-datepicker';

function FirstData1() {
    // const classes = useStyles();
    const service = new Service()
    // const username = query.get('')
    const formRef = React.useRef();
    const [body, setBody] = useState({
        username: '',
        cjb: '',
        branch: '',
        nationality: '',
        is_proceeding: '',
        is_affilated: '',
        is_published: '',
        author_no: '',
        title: '',
        name_cjb: '',
        vol: '',
        issue: '',
        year: '',
        month: '',
        doi: '',
        organised_by: '',
        scl: '',
        citation_scopus: '',
        citation_google: '',
        link: '',
        starting_page: 0,
        ending_page: 0,
        cite: ''
    })
    const [cjb, setCjb] = useState('')
    const [branch, setBranch] = useState('')
    const [nationality, setNational] = useState('')
    const [is_proceedings, setProceedings] = useState('')
    const [is_published, setPublished] = useState('')
    const [is_affilated, setAffiliated] = useState('')
    const [author_no, setAuthorNo] = useState('')
    const [send, setSend] = useState(0)
    const [show, setShow] = useState(false)
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
            cite: body.cite
        })
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
            cite: body.cite
        })
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
            cite: body.cite
        })
    }
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
            cite: body.cite
        })
    }
    const handleChangePublished = (event) => {
        setPublished(event.target.value)
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
            cite: body.cite
        })
    }
    const handleChangeAffiliated = (event) => {
        setAffiliated(event.target.value)
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
            cite: body.cite
        })
    }
    const handleChangeAuthorNo = (event) => {
        setAuthorNo(event.target.value)
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
            cite: body.cite
        })
    }
    const onSubmit = (event) => {
        // console.log("ONSUBMIT", body)
        service.post('api/data', body).then((json) => {
            // console.log("JSON", json)

        }).catch((error) => {
            
            console.log(error);
        });
        // console.log("EVENT",body)
    }
    const handleChange = (e) => {
        if (e.target.id === "publication") {
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
                cite: body.cite
            })
        }
        if (e.target.id === 'authors') {
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
                cite: body.cite
            })
        }
        if (e.target.id === 'name_c-j-b') {
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
                cite: body.cite
            })
        }
        if (e.target.id === 'vol') {
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
                cite: body.cite
            })
        }
        if (e.target.id === 'issue') {
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
                cite: body.cite
            })
        }
        if (e.target.id === 'year') {
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
                year: e.target.value,
                month: body.month,
                doi: body.doi,
                organised_by: body.organised_by,
                scl: body.scl,
                citation_scopus: body.citation_scopus,
                citation_google: body.citation_google,
                link: body.link,
                starting_page: body.starting_page,
                ending_page: body.ending_page,
                cite: body.cite
            })
        }
        if (e.target.id === 'month') {
            // body.month = e.target.value
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
                month: e.target.value,
                doi: body.doi,
                organised_by: body.organised_by,
                scl: body.scl,
                citation_scopus: body.citation_scopus,
                citation_google: body.citation_google,
                link: body.link,
                starting_page: body.starting_page,
                ending_page: body.ending_page,
                cite: body.cite
            })
        }
        if (e.target.id === 'issn') {
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
                cite: body.cite
            })
        }
        if (e.target.id === 'organizor') {
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
                cite: body.cite
            })
        }
        if (e.target.id === 'scopus') {
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
                cite: body.cite
            })
        }
        if (e.target.id === 'citationscopus') {
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
                cite: body.cite
            })
        }
        if (e.target.id === 'citationgoogle') {
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
                cite: body.cite
            })
        }
        if (e.target.id === 'link') {
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
                cite: body.cite
            })
        }
        if (e.target.id === 'startingPage') {
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
                cite: body.cite
            })
        }
        if (e.target.id === 'endingPage') {
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
                cite: body.cite
            })
        }
        if (e.target.id === 'article-cite') {
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
                cite: e.target.value
            })
        }
        // console.log("IN HANDLE CHANGE", body)
    }
    
    useEffect(()=>{
    var a=localStorage.getItem('status')
    if(a==='false'){
        navigate("../")}
    })
    return (
        <>
            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Sample Publication Data</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ "overflowY": "scroll", "paddingBottom": "20px", "backgroundColor": "#c5d299" }}>
                    <HelpModal />
                    <br />
                    <br />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="contained" color="error" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <HomeNavbar />
            <div style={{ "height": "fill", "width": "100wh", backgroundColor: "#c5d299", "paddingBottom": "100px" }}>
                <MDBContainer fluid className='h-custom'>

                    <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                        <MDBCol col='12' className='m-5'>

                            <MDBCard className='card-registration card-registration-2' style={{ borderRadius: '15px' }}>

                                <MDBCardBody className='p-0'>
                                    <form id="insert-data" ref={formRef} onSubmit={onSubmit}>
                                        <MDBRow>

                                            <MDBCol md='6' className='p-5 bg-white'>

                                                <h3 className="fw-normal mb-5" style={{ color: '#6C9449' }}>Publication Information</h3>
                                                <TextField
                                                    required
                                                    id="publication"
                                                    name="publication"
                                                    label="Publication Name"
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
                                                    label="Authors Name"
                                                    fullWidth
                                                    variant="standard"
                                                    onChange={handleChange}
                                                />
                                                <br />
                                                <br />
                                                <MDBRow>

                                                    <MDBCol md='4'>
                                                        <FormControl variant="standard" sx={{ minWidth: 120 }}>
                                                            <InputLabel id="demo-simple-select-standard-label">C/J/B/BC</InputLabel>
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

                                                    <MDBCol md='4'>
                                                        <FormControl variant="standard" sx={{ minWidth: 120 }}>
                                                            <InputLabel id="demo-simple-select-standard-label">Branch</InputLabel>
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
                                                            </Select>

                                                        </FormControl>
                                                    </MDBCol>
                                                    <MDBCol md='4'>
                                                        <FormControl variant="standard" sx={{ minWidth: 120 }}>
                                                            <InputLabel id="demo-simple-select-standard-label">Inter/National</InputLabel>
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
                                                                <MenuItem value={"National"}>National</MenuItem>
                                                                <MenuItem value={"International"}>International</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </MDBCol>
                                                </MDBRow>
                                                <br />

                                                <TextField
                                                    required
                                                    id="name_c-j-b"
                                                    name="name_c-j-b"
                                                    label="Name of C/J/B/BC"
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
                                                    label="ISSN/ISBN/DOI"
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
                                                    label="Article Cite"
                                                    fullWidth
                                                    variant="standard"
                                                    onChange={handleChange}
                                                />


                                            </MDBCol>


                                            <MDBCol md='6' className='bg-indigo p-5'>

                                                <TextField
                                                    required
                                                    id="organizor"
                                                    name="organizor"
                                                    label="Organizor"
                                                    fullWidth
                                                    variant="standard"
                                                    color='secondary'
                                                    onChange={handleChange}
                                                />
                                                <br />
                                                <br />
                                                <TextField
                                                    // required
                                                    id="link"
                                                    name="link"
                                                    label="Link"
                                                    fullWidth
                                                    variant="standard"
                                                    color='secondary'
                                                    onChange={handleChange}
                                                />
                                                <br />
                                                <br />
                                                <MDBRow>

                                                    <MDBCol md='3'>
                                                        <TextField
                                                            required
                                                            id="vol"
                                                            name="vol"
                                                            label="Volume"
                                                            fullWidth
                                                            variant="standard"
                                                            color='secondary'
                                                            onChange={handleChange}
                                                        />
                                                    </MDBCol>

                                                    <MDBCol md='3'>
                                                        <TextField
                                                            required
                                                            id="issue"
                                                            name="issue"
                                                            label="Issue"
                                                            fullWidth
                                                            variant="standard"
                                                            color='secondary'
                                                            onChange={handleChange}
                                                        />
                                                    </MDBCol>
                                                    <MDBCol md='6'>
                                                        <DatePicker
                                                            selected={body.year}
                                                            onChange={handleChange}
                                                            dateFormat="MM/yyyy"
                                                            showMonthYearPicker
                                                            required
                                                        />
                                                        {/* <TextField
                                                required
                                                id="year"
                                                name="year"
                                                label="Year"
                                                fullWidth
                                                variant="standard"
                                                color='secondary'
                                                onChange={handleChange}
                                            />
                                                </MDBCol>
                                                <MDBCol md='3'>
                                                <TextField
                                                required
                                                id="month"
                                                name="month"
                                                label="Month"
                                                fullWidth
                                                variant="standard"
                                                color='secondary'
                                                onChange={handleChange}
                                            /> */}
                                                    </MDBCol>

                                                </MDBRow>
                                                <br />

                                                <MDBRow>

                                                    <MDBCol md='4'>
                                                        <FormControl variant="standard" sx={{ minWidth: 120 }}>
                                                            <InputLabel id="demo-simple-select-standard-label" color='secondary'>In Proceedings?</InputLabel>
                                                            <Select
                                                                labelId="proceedings"
                                                                id="proceedings"
                                                                value={is_proceedings}
                                                                onChange={handleChangeProceedings}
                                                                label="In Proceedings?"
                                                                color='secondary'
                                                                required
                                                            >
                                                                <MenuItem value="">
                                                                    <em>None</em>
                                                                </MenuItem>
                                                                <MenuItem value={"Yes"}>Yes</MenuItem>
                                                                <MenuItem value={"No"}>No</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </MDBCol>

                                                    <MDBCol md='4'>
                                                        {/* <MDBInput wrapperClass='mb-4' labelClass='text-white' label='Phone Number' size='lg' id='form10' type='text' /> */}
                                                        <FormControl variant="standard" sx={{ minWidth: 120 }}>
                                                            <InputLabel id="demo-simple-select-standard-label" color='secondary'>Abstract Published?</InputLabel>
                                                            <Select
                                                                labelId="published"
                                                                id="published"
                                                                value={is_published}
                                                                onChange={handleChangePublished}
                                                                label="Abstract Published?"
                                                                color='secondary'
                                                                required
                                                            >
                                                                <MenuItem value="">
                                                                    <em>None</em>
                                                                </MenuItem>
                                                                <MenuItem value={"Yes"}>Yes</MenuItem>
                                                                <MenuItem value={"No"}>No</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </MDBCol>
                                                    <MDBCol md='4'>
                                                        <FormControl variant="standard" sx={{ minWidth: 120 }}>
                                                            <InputLabel color='secondary'>Affiliated?</InputLabel>
                                                            <Select
                                                                labelId="affiliated"
                                                                id="affiliated"
                                                                value={is_affilated}
                                                                onChange={handleChangeAffiliated}
                                                                label="Affiliated?"
                                                                color='secondary'
                                                                required
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

                                                    <MDBCol md='4'>
                                                        <FormControl variant="standard" sx={{ minWidth: 120 }}>
                                                            <InputLabel id="demo-simple-select-standard-label" color='secondary'>Are You Author?</InputLabel>
                                                            <Select
                                                                labelId="author_no"
                                                                id="author_no"
                                                                value={author_no}
                                                                onChange={handleChangeAuthorNo}
                                                                label="Are You Author?"
                                                                color='secondary'
                                                                required
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

                                                    <MDBCol md='4'>
                                                        <TextField
                                                            required
                                                            id="startingPage"
                                                            name="startingPage"
                                                            label="Starting Page"
                                                            fullWidth
                                                            variant="standard"
                                                            color='secondary'
                                                            type="number"
                                                            onChange={handleChange}
                                                        />
                                                    </MDBCol>
                                                    <MDBCol md='4'>
                                                        <TextField
                                                            required
                                                            id="endingPage"
                                                            name="endingPage"
                                                            label="Ending Page"
                                                            fullWidth
                                                            variant="standard"
                                                            color='secondary'
                                                            type="number"
                                                            onChange={handleChange}
                                                        />
                                                    </MDBCol>
                                                </MDBRow>
                                                <br />
                                                <MDBRow>

                                                    <MDBCol md='4'>
                                                        <TextField
                                                            required
                                                            id="scopus"
                                                            name="scopus"
                                                            label="Scopus/WoS/SCI"
                                                            fullWidth
                                                            variant="standard"
                                                            color='secondary'
                                                            onChange={handleChange}
                                                        />
                                                    </MDBCol>

                                                    <MDBCol md='4'>
                                                        <TextField
                                                            required
                                                            id="citationscopus"
                                                            name="citationscopus"
                                                            label="Citation in Scopus/WoS"
                                                            fullWidth
                                                            variant="standard"
                                                            color='secondary'
                                                            onChange={handleChange}
                                                        />
                                                    </MDBCol>
                                                    <MDBCol md='4'>
                                                        <TextField
                                                            required
                                                            id="citationgoogle"
                                                            name="citationgoogle"
                                                            label="Citation in GoogleScholar"
                                                            fullWidth
                                                            variant="standard"
                                                            color='secondary'
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
                                                <Button variant="contained" color='secondary' type='submit' form="insert-data" onClick={() => { formRef.current.reportValidity(); setSend(send + 1) }}>Submit</Button>
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

export default FirstData1;