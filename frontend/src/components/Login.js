import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import React from 'react';
import { useState, useEffect } from 'react';
import {

  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBCardTitle,
  MDBCardText
}
from 'mdb-react-ui-kit';
import { useNavigate } from "react-router-dom";
function Login() {
    const navigate = useNavigate();
    // const [ profile, setProfile ] = useState(null);
    const [ login, setLogin] = useState("")
    const [token, setToken] = useState(localStorage.getItem("token")||"")
    const clientId = '1006405223734-89bsslid5t5ivhaspa7qpgp12v17d7f8.apps.googleusercontent.com';
    // console.log(token)
    if(token!==""){
        navigate("/home");
    }
    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: clientId,
                scope: ''
            });
        };
        gapi.load('client:auth2', initClient);
    });

    const onSuccess = (res) => {
        // console.log(res)
        if(res.profileObj.email.split('@')[1]==="bvrithyderabad.edu.in" || ('a'<=res.profileObj.email[0]<='z' || res.profileObj.email==="19wh1a1242@bvrithyderabad.edu.in" ||  res.profileObj.email==="your mail id iste login aitadi leda avad")){
            // console.log("TRUE")
            // setProfile(res.profileObj);
            navigate("/home");
            setToken(res.accessToken)
            localStorage.setItem("token",res.accessToken)
        }
        else{
            setLogin("FAILED")
            // console.log("HEREEE")
            // console.log(res.profileObj.email[0].isAlpha)
            logOut();

        }
        // setProfile(res.profileObj);
    };

    const onFailure = (err) => {
        console.log('failed', err);
    };

    const logOut = () => {
            const auth2 = window.gapi.auth2.getAuthInstance()
            let tokens = localStorage.getItem("token")
            if(tokens){
                localStorage.removeItem("token")
            }
            if (auth2 != null) {
              auth2.signOut().then(
                auth2.disconnect().then(this.props.onLogoutSuccess)
              )
            }
          
    };
  return (
    // <div style={{"backgroundColor":"#C8DF52"}}></div>
    <>    
    <div class="col d-flex justify-content-center" style={{height: "100vh",
        width: "100vw",
      "backgroundColor":"#c5d299", paddingTop:"90px"}}>

      <MDBCard style={{ maxHeight: '80%', maxWidth: '80%'}}>
        <MDBRow className='g-0'>

          <MDBCol md='6' style={{top:'10%'}}>
          <MDBCardImage src={require('./static/hompage.jpg')} style={{height:'500px',width:'600px'}}  />
          </MDBCol>
          <MDBCol md='5'>
          <MDBCardBody position='center' >
          <MDBCardImage style={{height:'50%',width:'80%'}} position='center' src={require('./static/bvrit-logo.png')} />
            <MDBCardTitle style={{"fontSize":"px80"}}>Research Publications Search Engine</MDBCardTitle>
            {login==="FAILED"?<MDBCardText style={{"color":"red"}}>Not AUTHORIZED User</MDBCardText>:""}
            <div>
              <div style={{fontSize:'30px'}}>Login</div>
              
            </div>
          </MDBCardBody>
          </MDBCol>

        </MDBRow>
      </MDBCard>

    </div>

    </>

 ) 
}

export default Login;
// app.route('/users', methods=["POST"])
// def users():
//   print("users endpoint reached...")
//   received_data = request.get_json()
//   print(f"received data: {received_data}")
//   message = received_data['data']
//   return_data = {
//   "status": "success",
//   "message": f"received: {message}"
//   }
//   return flask.Response(response=json.dumps(return_data), status=201)

// import { useEffect } from 'react';
// import React, { useState, useEffect } from 'react';
// function Login() {
//     const [ profile, setProfile ] = useState(null);
//     const [ login, setLogin] = useState("")
//     const clientId = '386932037035-k8v833noqjk7m4auae0t83vnkrqvvg3t.apps.googleusercontent.com';
//     useEffect(() => {
//         const initClient = () => {
//             gapi.client.init({
//                 clientId: clientId,
//                 scope: ''
//             });
//         };
//         gapi.load('client:auth2', initClient);
//     });

//     const onSuccess = (res) => {
//         if(res.profileObj.email.split('@')[1]==="bvrithyderabad.edu.in" && 'a'<=res.profileObj.email[0]<='z'){
//             console.log("TRUE")
//             setProfile(res.profileObj);
//         }
//         else{
//             setLogin("FAILED")
//             console.log("HEREEE")
//             console.log(res.profileObj.email[0].isAlpha)
//         }
//         // setProfile(res.profileObj);
//     };

//     const onFailure = (err) => {
//         console.log('failed', err);
//     };

//     const logOut = () => {
//         setProfile(null);
//     };

//     return (
//         <div>
//             <h2>React Google Login</h2>
//             <br />
//             <br />
//             {profile && login==="TRUE" ? (
//                 <div>
//                     <img src={profile.imageUrl} alt="user image" />
//                     <h3>User Logged in</h3>
//                     <p>Name: {profile.name}</p>
//                     <p>Email Address: {profile.email}</p>
//                     <br />
//                     <br />
//                     <GoogleLogout clientId={clientId} render={renderProps => (
//       <button onClick={renderProps.onClick} disabled={renderProps.disabled}>Logout</button>
//     )}buttonText="Log out" onLogoutSuccess={logOut} />
//                 </div>
//             ) : (login==="FAILED" ?
//                 (<div>NON AUTHORIZED USER<br/><br/>
//                 <GoogleLogin
//                     clientId={clientId}
//                     buttonText="Sign in with Google"
//                     onSuccess={onSuccess}
//                     onFailure={onFailure}
//                     cookiePolicy={'single_host_origin'}
//                     isSignedIn={true}
//                     hostedDomain={"bvrithyderabad.edu.in"}

//                 /></div>)
//                 :
//                 (<GoogleLogin
//                     clientId={clientId}
//                     buttonText="Sign in with Google"
//                     onSuccess={onSuccess}
//                     onFailure={onFailure}
//                     cookiePolicy={'single_host_origin'}
//                     isSignedIn={true}
//                     hostedDomain={"bvrithyderabad.edu.in"}

//                 />)
//             )}
//         </div>
//     );
// }
// export default Login;
