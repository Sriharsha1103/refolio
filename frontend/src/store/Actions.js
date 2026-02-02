import React from "react"

export const Login= ()=>{
    return{
        type:'Login'
    }
}
export const Register= ()=>{
    return{
        type:'Register'
    }
}
export const Forgot= ()=>{
    return{
        type:'Forgot'
    }
}
export const Tab=(page)=>{
    return{
        type:'tab',
        page:page
    }
}

export const Signin= (Email,Name,isAdmin,isSuperAdmin,verify)=>{
    return{
        type:'Signin',
        email:Email,
        user:Name,
        isAdmin:isAdmin,
        isSuperAdmin:isSuperAdmin,
        verify:verify
    }
}

export const Signout= ()=>{
    return{
        type:'Signout'
    }
}
