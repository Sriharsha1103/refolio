import React, { useState } from "react";
import '../Comp.css'
import { Login } from "./Actions";
import { Button } from "@mui/material";
import { TextInput, AppShellAside } from "@mantine/core";
import { useDispatch } from "react-redux";
import Service from "../../Service/http";
import { useNavigate } from "react-router-dom";

function Forgot(){
    const service = new Service()
    const [Email,setEmail]=useState('')
    const dispatch=useDispatch()
    const navigate=useNavigate()
    return(

        // <div>
        <table style={{width:'100%',height:'100%',color:'#6C9449'}} >
            <tbody>
            <tr>
                <td colSpan={3}><div className="Heading">
                Forgot Password
            </div></td>
            </tr>
            <br/>
            <tr>
                <td id='label'>
                    Registered Email Id
                </td>
            </tr>
            <tr>    
                <td>
                    <input onChange={(e)=>{setEmail(e.target.value)}}/>
                </td>
                <td>
                    <input placeholder="@bvrithyderabad.edu.in" disabled/>
                </td>
            </tr>
            <tr>
                    <td colSpan={1}>
                    <a id="link1" className="link_pages" onClick={()=>dispatch(Login())}>Back</a>
                    </td>
                <td colSpan={2}>
                    <br/>
                    <Button variant="contained" color='secondary' onClick={()=>{
                        var e=Email+'@bvrithyderabad.edu.in'
                        service.post('forgot',{Email:e})
                        .then((res)=>{
                            // console.log(res.data._id)
                            window.alert('Sent the change password link to the respective mail . Please check the mail')})
                        .catch((e)=>{
                            window.alert('Not Found')})
                    }}>Send Code</Button>
                    {/* <button
                    className="Button" 
                    onClick={()=>{
                        var e=Email+'@bvrithyderabad.edu.in'
                        axios.post('http://localhost:8000/forgot',{Email:e})
                        .then((res)=>{
                            console.log(res.data._id)
                            window.alert('Sent the change password link to the respective mail . Please check the mail')})
                        .catch((e)=>{
                            window.alert('Not Found')})
                    }}
                    >Verify</button> */}
                </td>
            </tr>
            <br/>
            <tr>
            </tr>
            </tbody>
        </table>
        // </diSv>


        // <div className="Box">
        //     <div className="Heading">
        //         Forgot Password
        //     </div>
        //     <br/>
        //     <div>
        //         <TextInput label='Registered Email ID' placeholder="Email" />
        //     </div>
        //     <br/>
        //     <div>
        //         <Button>Verify</Button>
        //     </div>
        //     <br/>
        //     <div>
        //         <a className="link_pages" onClick={()=>{dispatch(Login())}}>Back</a>
        //     </div>
        // </div>
    )
}
export default Forgot;