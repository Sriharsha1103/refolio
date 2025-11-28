
const cors = require('cors');
var express = require('express');
require('dotenv').config()
var dbConnect = require('./dbConnect');
var apiRouter = require('./router/apiRouter');
var usersRouter = require('./router/usersRouter');
var patentsRouter = require('./router/patentsRouter');
var researchRouter = require('./router/ResearchRouter');
var consultancyRouter = require('./router/ConsultancyRouter');


const bodyParser= require('body-parser')
const jsonParser=bodyParser.json()
var dbLib = require("./lib/fetchUtils")
const Login=require('./lib/LoginController')
const Verify=require('./lib/VerificationController');
const Email=require('./lib/EmailController')
const Register=require('./lib/RegisterController')
const JSONTransport = require('nodemailer/lib/json-transport');
const path = require('path');
dbConnect.connect(true)
var app = express();
app.use(cors());
app.use(express.json());
app.use('/api/publications',apiRouter)
app.use('/api/users',usersRouter)
app.use('/api/patents',patentsRouter)
app.use('/api/research',researchRouter)
app.use('/api/consultancy',consultancyRouter)

app.use(express.static(path.join(__dirname, '..','frontend','build')));

// Define your API routes or other backend logic here

// Send the React app for any other requests
// app.get('/api/publications', dbLib.getData);
// app.post('/api/data', dbLib.postData)
// app.post('/api/edit')
// app.get('/api/data', dbLib.getData);
// app.post('/api/data', dbLib.postData)
app.post('/registerme',jsonParser,Login.Adduser,Register.Addrequest)
app.post('/userlogin',jsonParser,Login.Checkuser)
app.post('/changePassword',jsonParser,Login.ChangePassword)
app.post('/verify',jsonParser,Login.Sendverification)
app.post('/unverified',jsonParser,Register.Addrequest)
app.post('/forgot',jsonParser,Verify.Checkemail,Verify.Addrequest)
app.post('/forgotpassword',jsonParser,Verify.ForgotPassword)
app.post('/newpassword',jsonParser,Verify.NewPassword)
app.post('/verifyemail',jsonParser,Register.VerifyEmail)
// app.get('/message', (req, res) => {
  //     res.json({ message: "Hello from server!" });
  // });
  
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..','frontend','build', 'index.html'));
  });
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on port .`+PORT);
  });
  