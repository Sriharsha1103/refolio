import React, { useEffect, useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  TextField,
  Autocomplete,
  Card,
  CardContent,
  Grid,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select as MUISelect,
  MenuItem,
} from "@mui/material";
import Service from '../../Service/http';
import { Departments, ConsultancyKey } from '../../Service/keyValueMap';
import { useDispatch, useSelector } from 'react-redux';
import { Tab } from "../../store/Actions";


function NewConsultancy() {
  // const classes = useStyles();
  const containsIgnoreCase = (array, searchString) => {
    const lowerCaseSearch = searchString.toLowerCase();
    return array.some(item => item.toLowerCase() === lowerCaseSearch);
  }
  
  const yearpre = new Date();
  const years = [];
  for (let step = 2012; step < 1 + yearpre.getFullYear(); step++) {
    years.push(step);
  }
  const loggedIn = useSelector((state)=>state.logged);
  const verify = useSelector((state)=>state.verify);
  const isSuperAdmin = useSelector((state)=>state.isSuperAdmin);
  const isAdmin = useSelector((state)=>state.isAdmin);
  const service = new Service();
  const multiSelectRef = React.useRef(null);
  const patentRef = React.useRef(null)
  const designRef = React.useRef(null)
  const dispatch=useDispatch()
  const formRef = React.useRef();

  const bodyInitialState = {
    title : "",
    industry: "",
    ngo : "",
    pi : "",
    co_pi  : "",
    dept : [],
    amount : "",
  };

  const bodyReducer = (state, action) => {
    switch (action.type) {
      case 'SET_FIELD':
        return {
          ...state,
          [action.field]: action.value,
        };
      case 'SET_MULTIPLE':
        return {
          ...state,
          ...action.payload,
        };
      case 'RESET':
        return bodyInitialState;
      default:
        return state;
    }
  };

  const [body, dispatchBody] = useReducer(bodyReducer, bodyInitialState);

  const [cjb, setCjb] = useState([]);
  const [ngo, setNGO] = useState("");
  const [titles, setTitles] = useState([]);

  const navigate = useNavigate();
  
  const onSubmit = (event) => {
    console.log("HERE sub",event)
    event.preventDefault();
    
    // if(body.year==""||body.year==null){
    //   window.alert('Select Year')
    //   event.preventDefault()
    // }
    
        // designRef.current.setCustomValidity((design===""||design===null)?"Please Select A Value.":"")
        
      let confirm = window.confirm("This action will add the data into the Database")
      if(confirm){
    service
      .post("api/consultancy/data", body)
      .then((json) => {
        // console.log("JSON", json);
        window.alert("Succesfully Added "+body.title)
        navigate("/consultancy");
      })
      .catch((error) => {
        window.alert("Error while adding "+body.title+ ". \nPlease Try again later.")
        console.log(error);
      });
    }else{
      window.alert("Cancelled the insert action."); 
      event.preventDefault()
    }
    
    // console.log("EVENT",body)
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "title") {
      dispatchBody({
        type: 'SET_FIELD',
        field: 'title',
        value: value.replace(/\s+/g, ' ')
      });
    } else if (id === "authors") {
      dispatchBody({ type: 'SET_FIELD', field: 'pi', value });
    } else if (id === "co_authors") {
      dispatchBody({ type: 'SET_FIELD', field: 'co_pi', value });
    } else if (id === "amount") {
      dispatchBody({ type: 'SET_FIELD', field: 'amount', value });
    } else if (id === "ngo") {
      dispatchBody({ type: 'SET_FIELD', field: 'ngo', value });
    } else if (id === "industry") {
      dispatchBody({ type: 'SET_FIELD', field: 'industry', value });
    }
  };

  const handleChangeDesign = (event) => {
    const value = event.target.value;
    setNGO(value);
    dispatchBody({
      type: 'SET_FIELD',
      field: 'ngo',
      value,
    });
  };

  const handleChangeDept = (event, value) => {
    setCjb(value);
    dispatchBody({
      type: 'SET_FIELD',
      field: 'dept',
      value,
    });
  };

  useEffect(()=>{
    dispatch(Tab('new-consultancy'));
    if(!loggedIn){
        navigate("../")}
    else if(!verify){
      navigate("../verify")
    }else if(isSuperAdmin){
      navigate("../consultancy")
    }
    if(titles.length==0){
    service.get('api/consultancy/titles').then((res)=>{
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
      <div
        style={{
          height: "81.5vh",
          width: "100wh",
          backgroundColor: "#c5d299",
          // paddingBottom: "100px",
        }}
      >
        {/* <br/> */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <form id="insert-data" ref={formRef} onSubmit={onSubmit}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      sx={{ color: "#6C9449", fontWeight: 500 }}
                    >
                      Consultancy Project Information
                    </Typography>

                    <TextField
                      inputRef={patentRef}
                      label={ConsultancyKey.title}
                      placeholder={ConsultancyKey.title}
                      id="title"
                      required
                      fullWidth
                      margin="normal"
                      value={body.title}
                      onChange={handleChange}
                    />

                    <TextField
                      label={ConsultancyKey.pi + '  (Add multiple authors seperated by ",")'}
                      id="authors"
                      placeholder={ConsultancyKey.pi}
                      required
                      fullWidth
                      margin="normal"
                      value={body.pi}
                      onChange={handleChange}
                    />

                    <TextField
                      label={ConsultancyKey.co_pi+'  (Add multiple authors seperated by ",")'}
                      id="co_authors"
                      placeholder={ConsultancyKey.co_pi}
                      required
                      fullWidth
                      margin="normal"
                      value={body.co_pi}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Grid container spacing={2} sx={{ mt: { xs: 0, md: 4 } }}>
                      <Grid item xs={12} md={6}>
                        <Autocomplete
                          multiple
                          disableCloseOnSelect
                          options={Departments}
                          value={cjb}
                          onChange={handleChangeDept}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={ConsultancyKey.dept}
                              placeholder={cjb.length === 0 ? "Select At least One" : "Type to search"}
                              required
                              inputRef={multiSelectRef}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth required>
                          <InputLabel id="ngo-label">{ConsultancyKey.ngo}</InputLabel>
                          <MUISelect
                            labelId="ngo-label"
                            id="ngo"
                            label={ConsultancyKey.ngo}
                            inputRef={designRef}
                            value={ngo}
                            onChange={handleChangeDesign}
                          >
                            <MenuItem value="Private">Private</MenuItem>
                            <MenuItem value="Public">Public</MenuItem>
                            <MenuItem value="NGO">NGO</MenuItem>
                          </MUISelect>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <TextField
                      label={ConsultancyKey.industry}
                      placeholder="Enter Industry"
                      id="industry"
                      required
                      fullWidth
                      margin="normal"
                      value={body.industry}
                      onChange={handleChange}
                    />

                    <TextField
                      label={ConsultancyKey.amount}
                      placeholder="Enter Amount"
                      id="amount"
                      required
                      fullWidth
                      margin="normal"
                      value={body.amount}
                      onChange={handleChange}
                    />

                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      form="insert-data"
                      sx={{ mt: 2 }}
                      onClick={() => {
                        patentRef.current?.setCustomValidity(
                          containsIgnoreCase(titles, body.title)
                            ? "Title Already exist"
                            : ""
                        );
                        multiSelectRef.current?.setCustomValidity(
                          cjb.length === 0 ? "Please Select a Value." : ""
                        );
                        designRef.current?.setCustomValidity(
                          ngo === "" ? "Please Select A Value." : ""
                        );
                        formRef.current.reportValidity();
                      }}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Container>
      </div>
    </>
  );
}

export default NewConsultancy;