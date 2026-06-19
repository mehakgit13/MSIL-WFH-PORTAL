import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/User.js";
import Notification from "../models/Notification.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const users = await User.find();

await Notification.deleteMany();

const notifications = [];

for (const user of users) {
  notifications.push(
    {
      employee: user._id,
      title: "WFH Request Approved",
      message: "Your recent WFH request has been approved by your reporting manager.",
      isRead: false,
    },
    {
      employee: user._id,
      title: "Leave Request Submitted",
      message: "Your leave request has been submitted and is pending approval.",
      isRead: false,
    },
    {
      employee: user._id,
      title: "Policy Update",
      message: "Updated WFH policy is now available in Company Notices.",
      isRead: false,
    }
  );
}

await Notification.insertMany(notifications);

console.log("Notifications Seeded");

await mongoose.connection.close();