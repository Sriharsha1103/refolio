import React from 'react'

export const LoginReducer=(state={Email:'',Name:'',logged:false,isAdmin:null,isSuperAdmin:null,verify:null,Page:'Login',tab:'home'},action)=>{
    // console.log("STORE",state);
    Object.freeze(state)
    switch(action.type)
    {
        case 'Login':
            return {...state,Page:'Login',tab:'login'}
        case 'Register':
            return {...state,Page:'Register',tab:'login'}
        case 'Forgot':
            return {...state,Page:'Forgot',tab:'login'}
        case 'Signin' :
            return {...state,Email:action.email,Name:action.user,logged:true,isAdmin:action.isAdmin,isSuperAdmin:action.isSuperAdmin,verify:action.verify}
        case 'Signout':
            return {...state,Email:'',Name:'',logged:false,isAdmin:null,isSuperAdmin:null,verify:null,Page:'Login',tab:'login'}
        case 'tab':
            return {...state,tab:action.page}
        default:
            return state
    }
}

// const Store= createStore(LoginReducer)
// export default Store