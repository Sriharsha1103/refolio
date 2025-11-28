const EmailSchema=require('../lib/EmailController')
const RegisterSchema=require('../db/RegisterSchema')
const LoginSchema=require('../db/LoginSchema')
module.exports.Addrequest=async function(req,res){
    try{
        var request=await RegisterSchema.findOne({Email:req.body.Email})
        if(request==null)
        {request=await RegisterSchema.create(req.body)}
        var a= process.env.URL_VERIFY+request.id 
        // send link 'a' as email code here
       var s= "<h3>Verify your Email</h3> <body>The url to verify your email for BVRITH Research Publication Search Engine portal is <br/>"+"<a href="+a+">Clickk here to Register.</a></body>"
       var sub='Verify your Email - BVRITH Research Publication SE' 
       EmailSchema.main(s,sub,req.body.Email).catch(console.error)
        res.status(200).json(request)
    }
    catch(e){
        res.status(404)
    }
}

module.exports.VerifyEmail=async function(req,res){
    try{
        var request=await RegisterSchema.findByIdAndDelete({_id:req.body.id.id})
        if(request!==null){
            const user=await LoginSchema.findOneAndUpdate({Email:request.Email},{$set:{verified:true}})
            res.status(200).json('success')
        }
        else
        {
            res.status(404).json('error')
        }
    }
    catch(e){
        res.status(404).json(e)
    }
}

