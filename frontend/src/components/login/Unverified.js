
import { useEffect } from "react"
import {useNavigate} from 'react-router-dom'
import Service from "../../Service/http"
import { useDispatch, useSelector } from "react-redux"
import { Signout } from "./Actions"

function Unverified(){
    const navigate=useNavigate()
    const service = new Service()
    const verify = useSelector((state)=>state.verify);
    const email = useSelector((state)=>state.Email);
    const loggedIn = useSelector((state)=>state.logged);
    const dispatch=useDispatch()
    useEffect(()=>{
        if(!loggedIn){
            navigate('../')
        }
        if(verify)
        {navigate('../home')}
        if(!verify && loggedIn)
        { 
            service.post('unverified',{Email:email})
            .then((res)=>{})
            .catch((err)=>{console.log(err)})
        }
    },[])
    if(!verify){
    return(<div style={{textAlign:'center'}}>

        <h1>Your Email is not verified yet</h1>
        <br/>
        <h3>Please verify your account</h3><br/>
        <h3>We have sent you an email for the account verification</h3>
        <a className='link_pages' onClick={()=>{navigate('../');localStorage.clear(); dispatch(Signout())}} > Back to Login Page</a>
    </div>)}
}

export default Unverified