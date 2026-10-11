import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ["review", "movie", "provider", "space", "movie_info"],
      required: true,
      index: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    targetTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    targetContent: {
      type: String,
      default: "",
      maxlength: 5000,
    },
    mediaId: {
      type: Number,
      min: 1,
    },
    mediaType: {
      type: String,
      enum: ["movie", "tv"],
    },
    providerId: {
      type: Number,
      min: 1,
    },
    providerName: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    reason: {
      type: String,
      enum: [
        "inaccurate_information",
        "inappropriate_content",
        "spam",
        "harassment",
        "not_available",
        "incorrect_provider",
        "wrong_region",
        "other",
      ],
      required: true,
    },
    details: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "in_review", "resolved", "dismissed"],
      default: "pending",
      index: true,
    },
    adminNote: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  { timestamps: true }
);

ReportSchema.index({ status: 1, createdAt: -1 });
ReportSchema.index({ reportedBy: 1, createdAt: -1 });

export default mongoose.models.Report ||
  mongoose.model("Report", ReportSchema);
