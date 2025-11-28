
import {
    Title,
    Text,
} from "@mantine/core"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomeNavbar from "./RNavbar";

function WorkFlow() {
    const navigate = useNavigate();
    useEffect(()=>{
        let tokens = localStorage.getItem("token")
    // console.log("tokens")
    if(!tokens){
        navigate("/login")
    }
    })
  return (
    <>
    <HomeNavbar/>
      <div style={{height: "90vh",
        width: "100vw",
      "backgroundColor":"#c5d299"}}>
        
                                    <Title >Work in progress</Title>
                                    <Text color="dimmed" size="lg">
                                        This page is under construction
                                    </Text>
                               
                                <img
                                    src={require("./static/under-cons.png")}
                                    alt=""
                                />
                                 </div>
    </>
  );
}

export default WorkFlow;