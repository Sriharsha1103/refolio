const VerifySchema=require('../db/VerificationSchema')
const LoginSchema=require('../db/LoginSchema')
const EmailSchema=require('../lib/EmailController')
const Main=require('./EmailController')

module.exports.Checkemail=async function(req,res,next){
    try{
        const user=await LoginSchema.findOne({Email:req.body.Email})
        if (user!==null)
        {next()
        }
        else
        {res.status(404).json('fail')}
    }
    catch(e){
        {res.status(404).json(e)}
    }
}

module.exports.Sendmail=async function(req,res){
    try{
        const info=Main.main()
        console.log(info)
    }
    catch(e)
    {console.log(e)}
}


module.exports.Addrequest=async function(req,res){
    try{
        var request=await VerifySchema.findOne(req.body)
        if(request==null)
        {request=await VerifySchema.create(req.body)}
        var a=process.env.URL_FORGOT+request.id 
        // send link 'a' as email code here
        var s="<h3>Password Reset</h3> <body>The url to reset your password for BVRITH Research Publication Search Engine portal is <br/>"+"<a href="+a+">Click here to change password.</a><br/>The above link expires in 10 minutes<br/></body>"
        var sub="Reset Password - BVRITH Research Publication SE"
        EmailSchema.main(s,sub,req.body.Email).catch(console.error)
        res.status(200).json(request)
    }
    catch(e){
        res.status(404)
    }
}

module.exports.ForgotPassword=async function(req,res){
    try{
        const request=await VerifySchema.findById({_id:req.body.id.id})
        // console.log(request)
        res.status(200).json(request)
    }
    catch(e){
        // console.log(e)
        res.status(404)
    }
}

module.exports.NewPassword=async function(req,res){
    try{
        const user=await LoginSchema.findOneAndUpdate({Email:req.body.Email},{$set:{Password:req.body.Password}})
        await VerifySchema.findOneAndUpdate({Email:req.body.Email},{$set:{verified:true}})
        res.status(200)
    }
    catch(e){res.status(404)}
}
