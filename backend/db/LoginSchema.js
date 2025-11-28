const mongoose=require('mongoose')
var mongoosePaginate = require('mongoose-paginate');
const Schema=mongoose.Schema

const LoginSchema=new Schema({
    Name:{
        type : String,
        required:true
    },
    Email:{
        type: String,
        required:true,
        unique:true
    },
    branch:{
        type: String,
        required: true,
        enum: ['IT','CSE','ECE','EEE','AI/ML','BS&H']
    },
    Password:{
        type: String,
        require:true
    },
    role:{
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'super-admin']
    },
    verified:
    {
        type:Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
})
LoginSchema.plugin(mongoosePaginate);
const Login=mongoose.model('Login',LoginSchema,'LoginData')
module.exports=Login