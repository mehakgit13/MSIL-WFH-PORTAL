import Attendance from "../models/Attendance.js";

export const getAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({
      employee: req.user._id,
    }).sort({
      date: -1,
    });

    const presentDays = records.filter(
      (r) => r.status === "Present"
    ).length;

    const totalDays = records.length;

    const percentage =
      totalDays === 0
        ? 0
        : Math.round((presentDays / totalDays) * 100);

    res.json({
      percentage,
      presentDays,
      totalDays,
      records,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};