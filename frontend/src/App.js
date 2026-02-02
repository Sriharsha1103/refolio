import "./App.css";
import FirstData from "./components/publications/NewPublication";
import Publications2 from "./components/publications/Publications2";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ChangePassword from "./pages/ChangePassword";
import VerifiedEmail from "./pages/VerifiedEmail";
import Unverified from "./pages/Unverified";
import Users from "./components/users/Users";
import Patents from "./components/patents/Patents";
import Research from "./components/research/Research";
import NewPatent from "./components/patents/NewPatent";
import NewResearch from "./components/research/NewResearch";
import Consultancy from "./components/consultancy/Consultancy";
import NewConsultancy from "./components/consultancy/NewConsultancy";
import AppLayout from "./components/AppLayout/AppLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ErrorPage from "./pages/ErrorPage";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <BrowserRouter basename="/refolio">
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/home" element={<Home />} />

                <Route path="/login" element={<Dashboard />} />
                <Route path="/changepassword" element={<ChangePassword />} />
               
                <Route path="/verifyemail/:id" element={<VerifiedEmail />} />
                <Route path="/verify" element={<Unverified />} />

                <Route path="/users" element={<Users />} />
                <Route path="/publications" element={<Publications2 />} />
                <Route path="/patents" element={<Patents />} />
                <Route path="/research" element={<Research />} />
                <Route path="/consultancy" element={<Consultancy />} />

                <Route path="/insertPublications" element={<FirstData />} />
                <Route path="/insertPatents" element={<NewPatent />} />
                <Route path="/insertResearch" element={<NewResearch />} />
                <Route path="/insertConsultancy" element={<NewConsultancy />} />
                <Route path="*" element={<ErrorPage />} />
              </Route>
            </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
