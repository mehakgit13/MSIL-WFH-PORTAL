import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const createEmployeeId = () => {
  return "MS" + Math.floor(10000 + Math.random() * 90000);
};

export const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
      designation,
      manager,
      location,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (!email.endsWith("@maruti.co.in")) {
      return res.status(400).json({
        message: "Only Maruti corporate email is allowed",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let employeeId = createEmployeeId();

    while (await User.findOne({ employeeId })) {
      employeeId = createEmployeeId();
    }

    const user = await User.create({
      employeeId,
      name,
      email,
      password: hashedPassword,
      department,
      designation,
      manager,
      location,
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        department: user.department,
        designation: user.designation,
        manager: user.manager,
        location: user.location,
        joiningDate: user.joiningDate,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    if (!email.endsWith("@maruti.co.in")) {
      return res.status(400).json({
        message: "Only Maruti corporate email is allowed",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        department: user.department,
        designation: user.designation,
        manager: user.manager,
        location: user.location,
        joiningDate: user.joiningDate,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};