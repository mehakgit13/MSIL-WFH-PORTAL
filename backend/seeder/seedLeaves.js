import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/User.js";
import Leave from "../models/Leave.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const users = await User.find();

await Leave.deleteMany();

const leaves = [];

for (const user of users) {
  leaves.push({
    employee: user._id,
    leaveType: "Annual",
    startDate: new Date("2026-06-10"),
    endDate: new Date("2026-06-12"),
    reason: "Family Function",
    status: "Approved",
    approvedBy: "HR Manager",
  });

  leaves.push({
    employee: user._id,
    leaveType: "Sick",
    startDate: new Date("2026-05-05"),
    endDate: new Date("2026-05-06"),
    reason: "Medical Leave",
    status: "Approved",
    approvedBy: "HR Manager",
  });

  leaves.push({
    employee: user._id,
    leaveType: "Casual",
    startDate: new Date("2026-07-20"),
    endDate: new Date("2026-07-20"),
    reason: "Personal Work",
    status: "Pending",
    approvedBy: null,
  });
}

await Leave.insertMany(leaves);

console.log("Leave Records Seeded");

await mongoose.connection.close();