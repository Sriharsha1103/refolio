import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import HomeNavbar from "../RNavbar";

const Header = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Assuming role is stored in localStorage after login
    const userRole = localStorage.getItem("role"); 
    setRole(userRole);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AppBar position="static" color="default" sx={{ height: 'auto', justifyContent: 'space-between', width: '100vw', }}>
      <Toolbar sx={{  width: '100vw', paddingLeft: '0px !important' }}>
        <HomeNavbar/>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
