import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      default: "Information Technology",
    },

    designation: {
      type: String,
      default: "Employee",
    },

    manager: {
      type: String,
      default: "Reporting Manager",
    },

    location: {
      type: String,
      default: "Gurgaon Plant",
    },

    joiningDate: {
      type: Date,
      default: Date.now,
    },

    role: {
      type: String,
      enum: ["employee", "manager", "admin"],
      default: "employee",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);