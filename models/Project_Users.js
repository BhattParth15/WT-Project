
const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");
const { required } = require("../Project_Schema");

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    }

});

userSchema.plugin(passportLocalMongoose);
const User=mongoose.model("User",userSchema);
module.exports=User;
