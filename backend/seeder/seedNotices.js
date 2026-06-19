import mongoose from "mongoose";
import dotenv from "dotenv";
import Notice from "../models/Notice.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

await Notice.deleteMany();

await Notice.insertMany([
  {
    title: "Updated Work From Home Policy",
    category: "Policy",
    content:
      "Employees may avail up to 5 approved Work From Home days per month subject to manager approval."
  },

  {
    title: "Cyber Security Awareness Week",
    category: "Training",
    content:
      "Mandatory cyber security awareness training will be conducted for all employees."
  },

  {
    title: "Quarterly Business Review",
    category: "Meeting",
    content:
      "Q2 Business Review meeting scheduled for department heads."
  }
]);

console.log("Notices Seeded");

await mongoose.connection.close();