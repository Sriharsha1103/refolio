import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../Comp.css";
import { Container, PasswordInput, TextInput } from "@mantine/core";
import { sha512 } from "js-sha512";
import { useNavigate } from "react-router-dom";
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBRow,
} from "mdb-react-ui-kit";
import { Button } from "@mui/material";
import Service from "../../Service/http";

function Forgotpassword() {
  const service = new Service();
  const navigate = useNavigate();
  const [Comp, setComp] = useState(true);
  const [email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [CPass, setCpass] = useState("");
  var id = useParams();
  useEffect(() => {
    service
      .post("forgotpassword", { id })
      .then((res) => {
        setComp(res.verified);
        setEmail(res.Email);
      })
      .catch((e) => {
        setComp(true);
      });
  }, []);

  const validPassword = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  function check() {
    var s = "";
    if (!validPassword.test(Password)) {
      s +=
        "Invalid Password , must have upper case , lower case ,number and special character of atleast 8 characters \n";
    }
    if (Password != CPass) {
      s += "Password and Confirm passwords do not match";
    }
    return s;
  }
  if (!Comp) {
    return (
      <div
        class="col d-flex justify-content-center"
        style={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "#c5d299",
          paddingTop: "90px",
        }}
      >
        <MDBCard style={{ maxHeight: "379px", maxWidth: "900px" }}>
          <MDBRow className="g-0">
            <MDBCol md="8">
              <MDBCardImage src={require("../static/hompage.jpg")} fluid />
            </MDBCol>

            <MDBCol md="4">
              <MDBCardBody
               
              >
                <table
                  style={{ width: "100%", height: "100%", color: "#6C9449" }}
                >
                  <tbody>
                    <tr>
                      <td>
                        <div className="Heading">Change Password</div>
                      </td>
                    </tr><br/>
                    <tr>
                      <td colSpan={3}>
                        <label id="label">New Password</label>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3}>
                        <input
                          type="password"
                          className="Left_full"
                          placeholder="Enter new Password"
                          onChange={(e) => {
                            setPassword(e.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <br />
                    <tr>
                      <td>
                        <label id="label">Confirm New Password</label>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="password"
                          className="Left_full"
                          placeholder="Enter confirm password"
                          onChange={(e) => {
                            setCpass(e.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <br/>
                    <tr>
                      <td>
                      <Button variant="contained" color='secondary' onClick={() => {
                            var st = check();
                            if (st == "") {
                              var pas = sha512(Password);
                              service
                                .post("newpassword", {
                                  Email: email,
                                  Password: pas,
                                })
                                .then((res) => {
                                  window.alert("Changed Successfully");
                                })
                                .catch((e) => {
                                  window.alert(
                                    "Already changed the password using this link"
                                  );
                                });
                              window.alert(
                                "Password Changed Successfully.Redirecting to the login page"
                              );
                              navigate("../");
                            } else {
                              window.alert(st);
                            }
                          }}>Change</Button>
                        {/* <button
                          className="Button"
                          onClick={() => {
                            var st = check();
                            if (st == "") {
                              var pas = sha512(Password);
                              axios
                                .post("http://localhost:8000/newpassword", {
                                  Email: email,
                                  Password: pas,
                                })
                                .then((res) => {
                                  window.alert("Changed Successfully");
                                })
                                .catch((e) => {
                                  window.alert(
                                    "Already changed the password using this link"
                                  );
                                });
                              window.alert(
                                "Password Changed Successfully.Redirecting to the login page"
                              );
                              navigate("../");
                            } else {
                              window.alert(st);
                            }
                          }}
                        >
                          Change
                        </button> */}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div></div>
                {/* <MDBCardBody style={{'display': 'flex', justifyContent: 'center',alignItems: 'center',height: '100%', width:'100%'}}>
          {/* <MDBCardImage src={require('./static/bvrit-logo.jpg')} fluid /> 
            <p style={{"fontSize":"35px",'color':'#6C9449'}}>Research Publications Search Engine</p> */}
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </div>

      //     <div id='forgot' style={{backgroundImage:{image}}}>
      //         <Container style={{display:'flex',width:'60%',height:'80%',position:'absolute',top:'10%',left:'20%',right:'20%',bottom:'10%'}}>
      //         <h3 style={{position:'absolute',left:'35%'}}>Change Password</h3>
      //         <div style={{display:'flex',flexDirection:'column',position:'absolute',bottom:'10%',top:'10%',left:'30%',width:'40%'}}>
      //         <div>New Password</div>
      //         <input type='password' label='New Password' placeholder="Enter new Password" onChange={(e)=>{setPassword(e.target.value)}}/>
      //         <br/>
      //         <div>Confirm New Password</div>
      //         <input type='password' label='Confirm New Password' placeholder="Enter confirm password" onChange={(e)=>{setCpass(e.target.value)}}/>
      //         <br/>
      //         <button className="Button"
      //         onClick={()=>{
      //             var st=check()
      //             if(st=='')
      //             {
      //                 var pas=sha512(Password)
      //                 axios.post('http://localhost:8000/newpassword',{Email:email,Password:pas})
      //                 .then((res)=>{window.alert('Changed Successfully')
      //             })
      //                 .catch((e)=>{window.alert('Already changed the password using this link')})
      //             window.alert('Password Changed Successfully.Redirecting to the login page')
      //             navigate('../')
      //             }
      //             else
      //             {window.alert(st)}
      //         }}
      //         >Change</button></div>
      //    </Container>
      //     </div>
    );
  } else {
    return (
      <div>
        <h1>Invalid link or Link Expired</h1>
      </div>
    );
  }
}
export default Forgotpassword;
