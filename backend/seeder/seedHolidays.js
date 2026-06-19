import mongoose from "mongoose";
import dotenv from "dotenv";

import Holiday from "../models/Holiday.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

await Holiday.deleteMany();

await Holiday.insertMany([
  {
    title: "Independence Day",
    date: new Date("2026-08-15"),
    description: "National Holiday",
  },
  {
    title: "Gandhi Jayanti",
    date: new Date("2026-10-02"),
    description: "National Holiday",
  },
  {
    title: "Diwali",
    date: new Date("2026-11-08"),
    description: "Festival Holiday",
  },
  {
    title: "Christmas",
    date: new Date("2026-12-25"),
    description: "Holiday",
  },
]);

console.log("Holiday Records Seeded");

await mongoose.connection.close();