import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
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

    rating: {
      type: Number,
      min: 0.5,
      max: 10,
      required: false,
    },

    review: {
      type: String,
      maxlength: 2000,
    },

    spoiler: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// One review per user per movie
ReviewSchema.index({ user: 1, movie: 1 }, { unique: true });

export default mongoose.models.Review ||
  mongoose.model("Review", ReviewSchema);
