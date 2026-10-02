import mongoose from "mongoose";

const UserCollectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCollectionGroup",
      required: true,
    },
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
  },
  { timestamps: true }
);

UserCollectionSchema.index(
  { user: 1, collectionId: 1, movieId: 1, mediaType: 1 },
  { unique: true }
);

const existingUserCollection = mongoose.models.UserCollection;
if (
  existingUserCollection &&
  (!existingUserCollection.schema.path("collectionId") ||
    existingUserCollection.schema.path("collection"))
) {
  mongoose.deleteModel("UserCollection");
}

export default mongoose.models.UserCollection ||
  mongoose.model("UserCollection", UserCollectionSchema);
