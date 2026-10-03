import mongoose from "mongoose";

const SpaceSchema = new mongoose.Schema({
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    spaceType:{
        type:String,
        enum:["news","trailer","discussion"],
        required:true
    },
    title:{
        type:String,
        default:null
    },
    movieId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Movie",
    },
    content:{
        type:String,
        required:true
    },
    img:{
        type:String,
        default:null
    },
    backdrop:{
        type:String,
        default:null
    },
    video:{
        type:String,
        default:null
    }
},{
    timestamps:true
})

export default mongoose.models.Space ||
    mongoose.model("Space", SpaceSchema);