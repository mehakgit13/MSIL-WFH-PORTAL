import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "../models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const password = await bcrypt.hash("password123", 10);

const users = [

  //----------------------------------------
  // Engineering Manager
  //----------------------------------------

  {
    employeeId: "MS10001",
    name: "Rahul Sharma",
    email: "rahul.sharma@maruti.co.in",
    password,
    department: "Engineering",
    designation: "Engineering Manager",
    manager: "Director Engineering",
    role: "manager",
    location: "Gurgaon Plant",
  },

  //----------------------------------------
  // Employees under Rahul
  //----------------------------------------

  {
    employeeId: "MS10002",
    name: "Anjali Gupta",
    email: "anjali.gupta@maruti.co.in",
    password,
    department: "Information Technology",
    designation: "Senior Developer",
    manager: "Rahul Sharma",
    role: "employee",
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
    role: "employee",
    location: "Manesar Plant",
  },

  {
    employeeId: "MS10008",
    name: "Karan Malhotra",
    email: "karan.malhotra@maruti.co.in",
    password,
    department: "Engineering",
    designation: "Software Engineer",
    manager: "Rahul Sharma",
    role: "employee",
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
    role: "employee",
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
    role: "employee",
    location: "Gurgaon Plant",
  },

  //----------------------------------------
  // HR Manager
  //----------------------------------------

  {
    employeeId: "MS10011",
    name: "CHRO",
    email: "chro@maruti.co.in",
    password,
    department: "Human Resources",
    designation: "Chief Human Resources Officer",
    manager: "CEO",
    role: "manager",
    location: "Gurgaon HQ",
  },

  {
    employeeId: "MS10004",
    name: "Priya Verma",
    email: "priya.verma@maruti.co.in",
    password,
    department: "Human Resources",
    designation: "HR Manager",
    manager: "CHRO",
    role: "employee",
    location: "Gurgaon HQ",
  },

  //----------------------------------------
  // Plant Head
  //----------------------------------------

  {
    employeeId: "MS10012",
    name: "Plant Head",
    email: "plant.head@maruti.co.in",
    password,
    department: "Production",
    designation: "Plant Head",
    manager: "Director Manufacturing",
    role: "manager",
    location: "Manesar Plant",
  },

  {
    employeeId: "MS10005",
    name: "Amit Singh",
    email: "amit.singh@maruti.co.in",
    password,
    department: "Production",
    designation: "Plant Supervisor",
    manager: "Plant Head",
    role: "employee",
    location: "Manesar Plant",
  },

  //----------------------------------------
  // Finance Manager
  //----------------------------------------

  {
    employeeId: "MS10013",
    name: "Finance Manager",
    email: "finance.manager@maruti.co.in",
    password,
    department: "Finance",
    designation: "Finance Manager",
    manager: "CFO",
    role: "manager",
    location: "Gurgaon HQ",
  },

  {
    employeeId: "MS10006",
    name: "Neha Arora",
    email: "neha.arora@maruti.co.in",
    password,
    department: "Finance",
    designation: "Finance Analyst",
    manager: "Finance Manager",
    role: "employee",
    location: "Gurgaon HQ",
  },

  //----------------------------------------
  // SCM Head
  //----------------------------------------

  {
    employeeId: "MS10014",
    name: "SCM Head",
    email: "scm.head@maruti.co.in",
    password,
    department: "Supply Chain",
    designation: "Supply Chain Manager",
    manager: "Director Operations",
    role: "manager",
    location: "Gurgaon Plant",
  },

  {
    employeeId: "MS10007",
    name: "Rohan Mehta",
    email: "rohan.mehta@maruti.co.in",
    password,
    department: "Supply Chain",
    designation: "Supply Chain Executive",
    manager: "SCM Head",
    role: "employee",
    location: "Gurgaon Plant",
  },

  //----------------------------------------
  // Admin
  //----------------------------------------

  {
    employeeId: "MS99999",
    name: "System Admin",
    email: "admin@maruti.co.in",
    password,
    department: "Administration",
    designation: "System Administrator",
    manager: "CEO",
    role: "admin",
    location: "Gurgaon HQ",
  },
];

await User.deleteMany();

await User.insertMany(users);

console.log("=================================");
console.log("Users Seeded Successfully");
console.log("Total Users:", users.length);
console.log("Managers: 5");
console.log("Employees: 9");
console.log("Admin: 1");
console.log("=================================");

process.exit();