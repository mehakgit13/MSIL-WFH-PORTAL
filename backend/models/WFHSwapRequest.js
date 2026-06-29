import mongoose from "mongoose";

const swapSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    requestedTo: {
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

    reason: {
      type: String,
      default: "Employee requested WFH swap",
    },

    status: {
      type: String,
      enum: ["Pending", "Pending Employee", "Pending Manager", "Approved", "Rejected"],
      default: "Pending Employee",
    },

    employeeAcceptedAt: {
      type: Date,
      default: null,
    },

    managerApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    managerActionAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("WFHSwapRequest", swapSchema);