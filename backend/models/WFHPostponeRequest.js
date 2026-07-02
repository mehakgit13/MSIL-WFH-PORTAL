import mongoose from "mongoose";

const wfhPostponeRequestSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    wfh: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WFH",
      required: true,
    },

    currentDate: {
      type: Date,
      required: true,
    },

    requestedDate: {
      type: Date,
      required: true,
    },

    reason: {
      type: String,
      default: "Employee requested WFH postpone",
    },

    status: {
      type: String,
      enum: ["Pending Manager", "Approved", "Rejected"],
      default: "Pending Manager",
    },

    managerActionBy: {
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

export default mongoose.model("WFHPostponeRequest", wfhPostponeRequestSchema);