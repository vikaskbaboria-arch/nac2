import mongoose from 'mongoose';
const { Schema } = mongoose;
const MovieSchema =new Schema ({
    movieid:{
     type:Number
    },
    media_type: {
        type: String,
        enum: ["movie", "tv"],
        default: "movie"
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


export default mongoose.models.Movie ||
    mongoose.model("Movie", MovieSchema);