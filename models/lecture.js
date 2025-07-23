import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    lectureTitle: {
      required: true,
      type: String,
    },
    videoUrl: { type: String },
    publicId: { type: String },
    isPreviewFree: { type: Boolean },
  },
  { timestamps: true }
);

export const Lecture = mongoose.model("Lecture", lectureSchema);
