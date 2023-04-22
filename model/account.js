import mongoose from "mongoose";
import passport from "passport";
import passportLocalMongoose from 'passport-local-mongoose';
const { Schema, model } = mongoose;

const userSchema=new Schema({
   email:{
        type:String,
        required:true,
   },
   password:{
        type:String,
        required:true,
   }
})

userSchema.plugin(passportLocalMongoose);

const User=model('User',userSchema);
export default User;