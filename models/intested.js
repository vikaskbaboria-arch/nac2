import mongoose from "mongoose";

const InterestedSchema = new mongoose.Schema(
  {
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
    },
  },
  { timestamps: true }
);

// Prevent duplicate interest
InterestedSchema.index({ user: 1, movie: 1 }, { unique: true });

export default mongoose.models.Interested ||
  mongoose.model("Interested", InterestedSchema);
