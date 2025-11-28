import React from "react";
import '../Comp.css'
import { TextInput,PasswordInput } from "@mantine/core";
import { useDispatch,useSelector } from "react-redux";
import { Register,Forgot, Signin, Signout } from "./Actions";
import { useState,useEffect} from "react";
import {useNavigate} from 'react-router-dom'
import { sha512 } from "js-sha512";
import { Button } from "@mui/material";
import Service from "../../Service/http";
function Login(){
    const [Email,setEmail]=useState('')
    const service = new Service()
    const [Password,setPassword]=useState('')
    const dispatch=useDispatch()
    const navigate=useNavigate()
    // const sign=useSelector(state=>state.Login)
    const loggedIn = useSelector((state)=>state.logged);
    useEffect(()=>{
        
        if(loggedIn){
            navigate('../home')
        }
        // localStorage.setItem('status',false)
        // localStorage.setItem('Name','')
        // localStorage.setItem('Email','')
        // localStorage.setItem('Verify',)
        // console.log(localStorage.getItem('status'))
    },[])
    return(
        <div>
        <table style={{width:'90%',height:'100%',color:'#6C9449'}}>
            <tbody>
            <tr>
                <td colSpan={3}><div className="Heading">
                Sign in to your account
            </div></td>
            </tr>
            <br/>
            <tr>
                <td >
                    <label id='label'>Email</label>
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
            <br/>   
            <tr>
                <td>
                    <label id='label'>Password</label>
                </td>
            </tr>
            <tr>
                <td colSpan={3}> 
                    <input  className='Left_full' type='password' placeholder='Password' onChange={(e)=>{
                        setPassword(e.target.value)}}/>
                </td>
            </tr>
            <tr>
                <td colSpan={3}>
                    <br/>
                    <Button variant="contained" color='secondary' onClick={()=>{
                        var email=Email+'@bvrithyderabad.edu.in'
                        var pas=sha512(Password)
                        service.post('userlogin',{Email:email,Password:pas})
                        .then((res)=>{
                            console.log('Users are',res.Email,res.Name,res)
                            dispatch(Signin(res.Email,res.Name,res.role=="admin"?true:false,res.role=="super-admin"?true:false,res.verified))
                            // localStorage.setItem('status',true)
                            // // localStorage.setItem('Email',res.Email)
                            // localStorage.setItem('Name',res.Name)
                            // localStorage.setItem('Role',res.role)
                            // localStorage.setItem('Verify',res.verified)
                            navigate('../home')
                        })
                        .catch((e)=>{
                            console.log("error",e)
                            window.alert('Invalid  Credentials')})
                    }}>Login</Button>
                    {/* <button
                    className='Button'
                    onClick={()=>{
                        var email=Email+'@bvrithyderabad.edu.in'
                        var pas=sha512(Password)
                        axios.post('http://localhost:8000/userlogin',{Email:email,Password:pas})
                        .then((res)=>{
                            console.log('Users are',res.data.Email,res.data.Name)
                            dispatch(Signin(res.data.Email,res.data.Name))
                            localStorage.setItem('status',true)
                            localStorage.setItem('Email',res.data.Email)
                            localStorage.setItem('Name',res.data.Name)
                            navigate('../home')
                        })
                        .catch((e)=>{window.alert('Invalid  Credentials')})
                    }}
                    >Login</button> */}
                </td>
            </tr>
            <br/>
            <tr>
                <td >
                <a id="link1" className="link_pages" onClick={()=>dispatch(Register())}>Register</a>
                </td>
                {' '}
                <td>
                <a id='link2' className="link_pages" onClick={()=>{dispatch(Forgot())}}>Forgot Password?</a>
                </td>
            </tr>
            </tbody>
        </table>
        </div>

            /* 
            <div id="input_email">
                <label>Username</label>
                <br/>
                <TextInput className="input" id='email'/>
                <input className="input" id='input_domain' placeholder="@bvrith.edu.in"  disabled/>
            </div>
            <br/>
            <div>
                <PasswordInput id='password' label='Password' placeholder="Password"/>
            </div>
            <br/>
            <div>
                <Button>Login</Button>
            </div>
            <br/>
            <div id='link'>
                <a id="link1" className="link_pages" onClick={()=>dispatch(Register())}>Register</a>
                {' '}
                <a id='link2' className="link_pages" onClick={()=>{dispatch(Forgot())}}>Forgot Password?</a>
            </div>
        </div> */
    )
}
export default Login;