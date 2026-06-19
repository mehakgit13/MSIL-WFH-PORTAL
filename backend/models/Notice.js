import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "General",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notice", noticeSchema);