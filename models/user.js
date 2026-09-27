import mongoose from 'mongoose';
const { Schema } = mongoose;
const UserSchema =new Schema ({
    username:{
        type:String,
        required:true,

    },
    isAdmin:{
        type:Boolean,
        default:false
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
    fav_genres:{
        type:Array,
        default:[],

    },
 
    role:{
        type:String,
        default:"user",
        enum:["user", "admin"],
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