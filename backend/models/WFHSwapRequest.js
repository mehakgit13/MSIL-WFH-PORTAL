import mongoose from "mongoose";

const swapSchema = new mongoose.Schema(
  {
    fromEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    toEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fromWFH: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WFH",
      required: true,
    },

    toWFH: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WFH",
      required: true,
    },

    reason: String,

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "WFHSwapRequest",
  swapSchema
);