import mongoose from "mongoose";

const NacCollectionSchema = new mongoose.Schema(
  {
    movieId: {
      type: Number,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["movie", "tv"],
      default: "movie",
    },
    title: {
      type: String,
      required: true,
    },
    poster_path: {
      type: String,
      default: "",
    },
    backdrop_path: {
      type: String,
      default: "",
    },
    vote_average: {
      type: Number,
      default: 0,
    },
    release_date: {
      type: String,
      default: "",
    },
    genres: {
      type: [String],
      default: [],
    },
    overview: {
      type: String,
      default: "",
    },
    tag: {
      type: String,
      default: "NAC Vault",
    },
    curatorNote: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

NacCollectionSchema.index({ movieId: 1, mediaType: 1 }, { unique: true });

export default mongoose.models.NacCollection ||
  mongoose.model("NacCollection", NacCollectionSchema);
