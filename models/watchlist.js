import mongoose from "mongoose";
const WatchSchema  = new mongoose.Schema({
    user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
          index: true,
        },
    
        movie: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Movie",
          required: true,
          index: true,
        }
},{timestamps: true})
WatchSchema.index({ user: 1, movie: 1 }, { unique: true });

export default mongoose.models.Watch ||
  mongoose.model("Watch", WatchSchema);