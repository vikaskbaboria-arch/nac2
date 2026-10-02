import mongoose from "mongoose";

const UserCollectionGroupSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    nameKey: {
      type: String,
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

UserCollectionGroupSchema.index({ user: 1, nameKey: 1 }, { unique: true });

export default mongoose.models.UserCollectionGroup ||
  mongoose.model("UserCollectionGroup", UserCollectionGroupSchema);
