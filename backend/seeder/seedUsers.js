import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "../models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const password = await bcrypt.hash("password123", 10);

const users = [
  {
    employeeId: "MS10001",
    name: "Rahul Sharma",
    email: "rahul.sharma@maruti.co.in",
    password,
    department: "Engineering",
    designation: "Engineering Manager",
    manager: "Director Engineering",
    location: "Gurgaon Plant",
  },

  {
    employeeId: "MS10002",
    name: "Anjali Gupta",
    email: "anjali.gupta@maruti.co.in",
    password,
    department: "Information Technology",
    designation: "Senior Developer",
    manager: "Rahul Sharma",
    location: "Gurgaon Plant",
  },

  {
    employeeId: "MS10003",
    name: "Vikas Kumar",
    email: "vikas.kumar@maruti.co.in",
    password,
    department: "Quality Assurance",
    designation: "QA Lead",
    manager: "Rahul Sharma",
    location: "Manesar Plant",
  },

  {
    employeeId: "MS10004",
    name: "Priya Verma",
    email: "priya.verma@maruti.co.in",
    password,
    department: "Human Resources",
    designation: "HR Manager",
    manager: "CHRO",
    location: "Gurgaon HQ",
  },

  {
    employeeId: "MS10005",
    name: "Amit Singh",
    email: "amit.singh@maruti.co.in",
    password,
    department: "Production",
    designation: "Plant Supervisor",
    manager: "Plant Head",
    location: "Manesar Plant",
  },

  {
    employeeId: "MS10006",
    name: "Neha Arora",
    email: "neha.arora@maruti.co.in",
    password,
    department: "Finance",
    designation: "Finance Analyst",
    manager: "Finance Manager",
    location: "Gurgaon HQ",
  },

  {
    employeeId: "MS10007",
    name: "Rohan Mehta",
    email: "rohan.mehta@maruti.co.in",
    password,
    department: "Supply Chain",
    designation: "Supply Chain Executive",
    manager: "SCM Head",
    location: "Gurgaon Plant",
  },

  {
    employeeId: "MS10008",
    name: "Karan Malhotra",
    email: "karan.malhotra@maruti.co.in",
    password,
    department: "Engineering",
    designation: "Software Engineer",
    manager: "Rahul Sharma",
    location: "Gurgaon Plant",
  },

  {
    employeeId: "MS10009",
    name: "Sneha Kapoor",
    email: "sneha.kapoor@maruti.co.in",
    password,
    department: "IT",
    designation: "Frontend Developer",
    manager: "Rahul Sharma",
    location: "Gurgaon Plant",
  },

  {
    employeeId: "MS10010",
    name: "Arjun Yadav",
    email: "arjun.yadav@maruti.co.in",
    password,
    department: "IT",
    designation: "Backend Developer",
    manager: "Rahul Sharma",
    location: "Gurgaon Plant",
  }
];

await User.deleteMany();

await User.insertMany(users);

console.log("Users Seeded Successfully");

process.exit();