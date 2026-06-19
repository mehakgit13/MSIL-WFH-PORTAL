import User from "../models/User.js";

export const getMyTeam = async (req, res) => {
  try {
    const teamMembers = await User.find({
      manager: req.user.name,
    }).select("-password");

    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find()
      .select("-password")
      .sort({
        department: 1,
        name: 1,
      });

    res.json(employees);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};