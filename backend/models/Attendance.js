import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
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

    loginTime: String,

    logoutTime: String,

    status: {
      type: String,
      enum: ["Present", "Absent", "WFH", "Leave"],
      default: "Present",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);