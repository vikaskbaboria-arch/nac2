import mongoose from "mongoose";


const ConservationSchema = new mongoose.Schema({
    members:[{
           type: mongoose.Schema.Types.ObjectId,
           ref:"User",
           required:true
    }
    ],
    message:{
        type:String,
        red:"Message"
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

},{timestamps:true})
export default mongoose.models.Conversation || mongoose.model("Conversation",ConservationSchema);