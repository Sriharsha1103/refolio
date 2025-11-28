import React from "react";
import './Comp.css'
import {Button,PasswordInput } from "@mantine/core";
function Reset(){
    return(
        <div>
        <table border={3} >
            <tbody>
            <tr>
                <td colSpan={3}>
                    <div className="Heading">Reset Password</div>
                </td>
            </tr>
            <tr>
                <td colSpan={3}>
                    <div>New Password</div>
                </td>
            </tr>
            <tr>
                <td colSpan={3}> 
                    <PasswordInput width={100}/>
                </td>
            </tr>
            <tr>
                <td>
                    <label id='label'>Confirm Password</label>
                </td>
            </tr>
            <tr>
                <td colSpan={3}> 
                    <PasswordInput width={100}/>
                </td>
            </tr>
            <tr>
                <td colSpan={3}>
                    <br/>
                    <Button>Reset</Button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>

    )
}
export default Reset;