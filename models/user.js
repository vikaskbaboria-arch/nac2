import mongoose from 'mongoose';
const { Schema } = mongoose;
const UserSchema =new Schema ({
    username:{
        type:String,
        required:true,

    },
       email:{
        type:String,
        required:true
    },
    name:{
        type:String
    },
   
    profilepic:{
        type:String
    },
    coverpic:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
})


export default mongoose.models.User ||
  mongoose.model("User", UserSchema);