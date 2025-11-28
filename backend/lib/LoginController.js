const LoginSchema=require('../db/LoginSchema')
const emailsender = require('./EmailController')
module.exports.Adduser=async function(req,res,next){
    try{
        const c=await LoginSchema.create(req.body)
        next()
        res.status(200).json(c)
    }
    catch(e)
    {
        res.status(404).json(e+'Invalid')
    }
}

module.exports.Checkuser=async function(req,res){
    try{
        console.log(req.body)
        const user=await LoginSchema.findOne({Email:req.body.Email}).select('-_id -__v')
        if(user==null)
        {
            res.status(404).json('User Not found')
        }
        else
        {   
           // console.log(user)
            if (req.body.Password===user.Password){
              // console.log(user.Name)
              user.Password = '';
                res.status(200).json(user)
            }
            else
            res.status(404).json('Invalid Username or Password')
        }
    }
    catch(e){
        res.status(404).json('Invalid Credentials')
    }
}

module.exports.ChangePassword=async function(req,res){
    try{
        const user=await LoginSchema.findOneAndUpdate({Email:req.body.Email},{$set:{Password:req.body.Password}})
        res.status(200)
    }
    catch(e){res.status(404)}
}

module.exports.allUsers=async function(req,res){
    try{
    let username = req.query.username || ""
    let branch = req.query.branch || ""
    let admin = req.query.admin || "ALL"
    let page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 10
    let registeredDate = req.query.registeredDate=="1"? { createdAt: 'asc' } : { createdAt: 'desc' }
    // let endDate = req.query.endDate?new Date(req.query.endDate):0
    // let startYear = parseInt(req.query.startYear) || 0
    // let endYear = parseInt(req.query.endYear) || 0
    // let startMonth = startDate !== 0 ? startDate.getMonth() : 0
    // let endMonth = endDate !== 0 ? endDate.getMonth() : 0

    console.log(admin)
    let query = {};
    if (username!=""){
        query["Name"]= { $regex: '.*' + username + '.*', "$options" : "i" }
    }
    if (branch!=""){
        console.log("IN BRANCH")
        query["branch"] = { $regex: '.*' + branch + '.*', "$options" : "i" }
    }
    
    if (admin!="ALL"){
        console.log(admin)
        query["role"] = admin=="true"?"admin":"user"
        // console.log(query)
    }else{
        query["role"] = { $ne: 'super-admin' }
    }
    
    
    if(limit===0){
        LoginSchema.paginate(query,{page:page,limit:0,sort:registeredDate},function(err,result) {
            if (err) res.status(500).send(err);
            else{
                limit=result.total
                console.log("Result",result)
            // ...
            // res.json(result)
            // console.log("RESULT", result)
            }
          });

    }
    LoginSchema.paginate(query,{page:page,limit:limit,sort:registeredDate},function(err,result) {
        if (err) {console.log(err);res.status(500).send(err)}
        else{
            // console.log("Result",result)
        // ...
        return res.status(200).json(result)
        // console.log("RESULT", result)
        }
      });
    // console.log("DATA",data)
    // return res.status(200).json(data);
}
catch(error){
    console.log(error);
    return res.status(500).json(error)
}
}
module.exports.editRole = async function(req,res){
    try{
        LoginSchema.findOneAndUpdate({_id:req.body._id},{role:req.body.role},{runValidators:true,new:true}, function(err,result){
            if(err) throw err;
            console.log("updated");
            return res.status(200).json({msg:"Successfully Updated"})
        })
    }
    catch(err){
        return res.status(500).json(err)
    }
}

module.exports.Sendverification=async function(){
    res.writeHead(200, {'Content-Type': 'text/plain'});
        const status=await emailsender('hello world')
        if (status=='success')
        {res.end('ok')}
        else
        res.end('fail')
}

module.exports.deleteUser = async function(req,res){
    try{
        const id = req.params.id;
        LoginSchema.findByIdAndDelete(id,function(err,result){
            if(err) throw err;
            console.log("success")
            return res.status(200).json(result);
        })
    }
    catch(error){
        return res.status(500).json(error)
    }
}
