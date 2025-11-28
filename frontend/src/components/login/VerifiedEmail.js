import { useState,useEffect } from "react"
import { useParams } from "react-router-dom"
import Service from "../../Service/http"
function VerifiedEmail(){
    const service = new Service()
    const id=useParams()
    const [Comp,setComp]=useState(<h1></h1>)
    useEffect(()=>{
        // console.log(id)
        service.post('verifyemail',{id})
        .then((res)=>{
            setComp(<h1>Your email is verified</h1>)
            })
        .catch((e)=>{setComp(<h1>Invalid URL</h1>)})
    },[])

    return(Comp)

}

export default VerifiedEmail
