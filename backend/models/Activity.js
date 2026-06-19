import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: {
      type: String,
      required: true,
    },

    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);