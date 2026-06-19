import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/User.js";
import WFH from "../models/WFH.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const users = await User.find();

await WFH.deleteMany();

const requests = [];

for (const user of users) {
  requests.push({
    employee: user._id,
    date: new Date("2026-06-03"),
    reason: "Work From Home",
    status: "Approved",
    approvedBy: "Reporting Manager",
  });

  requests.push({
    employee: user._id,
    date: new Date("2026-06-11"),
    reason: "Work From Home",
    status: "Approved",
    approvedBy: "Reporting Manager",
  });

  requests.push({
    employee: user._id,
    date: new Date("2026-06-25"),
    reason: "Personal Requirement",
    status: "Pending",
  });
}

await WFH.insertMany(requests);

console.log("WFH Records Seeded");

await mongoose.connection.close();