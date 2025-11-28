import React from "react";
import '../Comp.css'
import { TextInput,PasswordInput } from "@mantine/core";
import { useDispatch } from "react-redux";
import { Login } from "./Actions";
import { useState,useEffect } from "react";
import {sha512} from 'js-sha512'
import { Button } from "@mui/material";
import Service from "../../Service/http";
function Register(){
    const dispatch=useDispatch()
    const service = new Service();
    const [Name,setName]=useState('')
    const [Branch,setBranch] =useState('')
    const [Email,setEmail]=useState('')
    const [Password,setPassword]=useState('')
    const [CPass,setCpass]=useState('')
    const validPassword = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
    function check(){
        var s=''
        if( Name.length==0)
        {s+='Invalid Name \n'}
        // if(Email.length!=10)
        // {
        //     s+='Invalid Email id \n'
        // }

        if(!validPassword.test(Password))
        {
            s+='Invalid Password , must have upper case , lower case ,number and special character of atleast 8 characters \n'
        }
        if(Password!=CPass)
        {
            s+='Password and Confirm passwords do not match \n'
        }
        if(Branch==""){
            s+='Branch cannot be empty.'
        }
        return s
    }

    useEffect(()=>{
        //console.log(Name,Email,Password,CPass)
    },[Name,Email,Password,CPass])

    function send(Name,Email,Password){
        var e=Email+'@bvrithyderabad.edu.in'
        var Pas=sha512(Password)
        service.post('registerme',{Name,Email:e,Password:Pas,branch:Branch})
        .then((res)=>{
            window.alert('Successful Registration .Redirecting to login page')
            window.location.reload(false)})
        .catch((e)=>{
            window.alert('ERROR while Registering the user.')
            console.log(e)})
    }

    return(

        <table style={{width:'100%',height:'100%',color:'#6C9449', padding:'20px'}}>
        <tbody>
            <tr>
                <td colSpan={3}><div className="Heading">
                Sign up for an account
            </div></td>
            </tr>
            <tr>
                <td >
                    <label id='label'>Name</label>
                </td>
                <td >
                    <label id='label'>Branch</label>
                </td>
            </tr>
            <tr>
                 <td >
                    <input className='Left_full' width={100} onChange={(e)=>{setName(e.target.value)}}/>
                </td>
                <td colSpan={1.5}>
                    {/* <input className='Left_full' width={100} onChange={(e)=>{setBranch(e.target.value)}}/> */}
                    <select name="branch" id="branch" style={{width:"100%", height:"100%"}}onChange={(e)=>{setBranch(e.target.value)}}>
                    <option value="">None</option>
  <option value="IT">IT</option>
  <option value="CSE">CSE</option>
  <option value="ECE">ECE</option>
  <option value="EEE">EEE</option>
  <option value="AI/ML">AI/ML</option>
  <option value="BS&H">BS&H</option>
</select>
                </td>
                </tr>
            <tr>
                <td >
                    <label id='label'>Email</label>
                </td>
            </tr>
            <tr>
                <td>
                    <input onChange={(e)=>{
                        setEmail(e.target.value)}
                        }
                    />
                </td>
                <td>
                    <input placeholder="@bvrithyderabad.edu.in" disabled/>
                </td>
            </tr>
            <tr>
                <td>
                    <label id='label'>Password</label>
                </td>
            </tr>
            <tr>
                <td colSpan={3}> 
                    <input  className='Left_full' type='password' width={100} onChange={(e)=>{setPassword(e.target.value)}} />
                </td>
            </tr>
            <tr>
                <td>
                    <label id='label'>Confirm Password</label>
                </td>
            </tr>
            <tr>
                <td colSpan={3}> 
                    <input  className='Left_full' type='password' width={100} onChange={(e)=>{setCpass(e.target.value)}}/>
                </td>
            </tr>
            <br/>
            <tr>
                <td colSpan={1}>

<a id="link1" className="link_pages" onClick={()=>dispatch(Login())}>Login</a>
                </td>
                <td colSpan={2}>
                    
                    <Button variant="contained" color='secondary' onClick={
                        ()=>{
                            var s=check()
                            if (s=='')
                            {
                                // console.log('Ok')
                               send(Name,Email,Password,Branch)
                            }
                            else
                            {
                                window.alert(s)
                            }
                        }
                    }>Register</Button>

                    {/* <button className='Button'
                    onClick={()=>{
                        var s=check()
                        if (s=='')
                        {
                            console.log('Ok')
                           send(Name,Email,Password)
                        }
                        else
                        {
                            window.alert(s)
                        }
                    }}
                    >Register</button> */}
                </td>
            </tr>
          
                
           
                
            
            </tbody>
        </table>



        // <div className="Box">
        //     <div className="Heading">
        //         Sign up for an account
        //     </div>
        //     <div>
        //         <TextInput label='Name' placeholder="Name" />
        //     </div> 
        //     <div id='url'>
        //         <TextInput label='Email' placeholder="Email" />
        //         <span>@gmail.com</span>
        //     </div>
        //     <div>
        //         <PasswordInput label='Password' placeholder="Password"/>
        //     </div>
        //     <div>
        //         <PasswordInput label='Confirm Password' placeholder="Password"/>
        //     </div>
        //     <br/>
        //     <div>
        //         <Button>Register</Button>
        //     </div>
        //     <div id='center_link'>
        //         <a className="link_pages" id="link" onClick={()=>{dispatch(Login())}}>Login</a>
        //     </div>
        // </div>
    )
}
export default Register;