import mongoose from "mongoose";

const wfhSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    originalDate: {
      type: Date,
      default: null,
    },

    reason: {
      type: String,
      default: "System allocated WFH day",
    },

    type: {
      type: String,
      enum: ["Allocated", "Shifted", "Used"],
      default: "Allocated",
    },

    status: {
      type: String,
      enum: ["Allocated", "Shifted", "Used"],
      default: "Allocated",
    },
  },
  { timestamps: true }
);

export default mongoose.model("WFH", wfhSchema);