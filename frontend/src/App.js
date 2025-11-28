// import "bootswatch/dist/lumen/bootstrap.min.css";
// import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import Main from "./components/login/Main";
import Home  from "./components/Home";
import FirstData from "./components/publications/NewPublication";
import Publications2 from "./components/publications/Publications2";
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Notifications } from "@mantine/notifications";

import ChangePassword from "./components/login/ChangePasswordPage";
import Forgotpassword from "./components/login/forgotpassword";
import VerifiedEmail from "./components/login/VerifiedEmail";
import Unverified from "./components/login/Unverified";
import Users from "./components/users/Users";
import Patents from "./components/patents/Patents";
import Research from "./components/research/Research";
import NewPatent from "./components/patents/NewPatent";
import NewResearch from "./components/research/NewResearch";
import Consultancy from "./components/consultancy/Consultancy";
import NewConsultancy from "./components/consultancy/NewConsultancy";
import Footer from "./components/Footer";
function App() {
  return (
    <MantineProvider>
      
    <div className="App">
      <Notifications position="top-right" zIndex={1000}/>
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/home" element={<Home/>}/>

          <Route path="/login" element={<Main/>}/>
          <Route path="/changepassword" element={<ChangePassword/>}/>
          <Route path='/forgotpassword/:id' element={<Forgotpassword />}/>
          <Route path='/verifyemail/:id' element={<VerifiedEmail/>}/>
          <Route path="/verify" element={<Unverified/>}/>

          <Route path="/users" element={<Users/>}/>
          <Route path="/publications" element={<Publications2/>}/>
          <Route path="/patents" element={<Patents/>}/>
          <Route path="/research" element={<Research/>}/>
          <Route path="/consultancy" element={<Consultancy/>}/>

          <Route path="/insertPublications" element={<FirstData/>}/>
          <Route path="/insertPatents" element={<NewPatent/>}/>
          <Route path="/insertResearch" element={<NewResearch/>}/>
          <Route path="/insertConsultancy" element={<NewConsultancy/>}/>
    
        </Routes>
      </BrowserRouter>
      <Footer/>
    </div>
    {/* </NotificationsProvider> */}
    </MantineProvider>
    
  );
}

export default App