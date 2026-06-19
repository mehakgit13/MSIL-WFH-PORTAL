import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/User.js";
import Attendance from "../models/Attendance.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const users = await User.find();

await Attendance.deleteMany();

const records = [];

const dates = [
  "2026-06-01",
  "2026-06-02",
  "2026-06-03",
  "2026-06-04",
  "2026-06-05",
  "2026-06-08",
  "2026-06-09",
  "2026-06-10",
  "2026-06-11",
  "2026-06-12",
  "2026-06-15",
  "2026-06-16",
  "2026-06-17",
  "2026-06-18",
  "2026-06-19",
  "2026-06-22",
  "2026-06-23",
  "2026-06-24",
  "2026-06-25",
  "2026-06-26"
];

for (const user of users) {
  dates.forEach((date, index) => {
    let status = "Present";

    if (index === 5) {
      status = "Leave";
    }

    if (index === 9 || index === 14) {
      status = "WFH";
    }

    records.push({
      employee: user._id,
      date: new Date(date),
      loginTime: status === "Present" || status === "WFH" ? "09:02 AM" : "",
      logoutTime: status === "Present" || status === "WFH" ? "06:10 PM" : "",
      status
    });
  });
}

await Attendance.insertMany(records);

console.log("Attendance Records Seeded");

await mongoose.connection.close();