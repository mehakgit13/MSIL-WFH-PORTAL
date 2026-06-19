import Holiday from "../models/Holiday.js";
import Leave from "../models/Leave.js";
import WFH from "../models/WFH.js";

export const getCalendarData = async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 });

    const leaves = await Leave.find({
      employee: req.user._id,
      status: "Approved",
    }).sort({ startDate: 1 });

    const wfh = await WFH.find({
      employee: req.user._id,
    }).sort({ date: 1 });

    res.json({
      holidays,
      leaves,
      wfh,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};