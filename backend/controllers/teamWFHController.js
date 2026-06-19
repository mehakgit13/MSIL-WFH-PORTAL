import WFH from "../models/WFH.js";
import User from "../models/User.js";

const WFH_PER_MONTH = 2;
const YEARLY_WFH_LIMIT = 24;

function isWeekend(date) {
  return date.getDay() === 0 || date.getDay() === 6;
}

function getWorkingDays(year, month) {
  const days = [];
  const total = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= total; day++) {
    const date = new Date(year, month, day);
    if (!isWeekend(date)) days.push(date);
  }

  return days;
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export const generateTeamWFH = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const today = new Date();

    const users = await User.find({
      role: { $in: ["employee", "manager", "admin"] },
    });

    if (users.length === 0) {
      return res.status(400).json({ message: "No users found" });
    }

    await WFH.deleteMany({
      date: {
        $gte: new Date(year, 0, 1),
        $lte: new Date(year, 11, 31, 23, 59, 59, 999),
      },
    });

    const records = [];

    for (let month = 0; month < 12; month++) {
      const workingDays = shuffle(getWorkingDays(year, month));
      let pointer = 0;

      for (const user of users) {
        for (let i = 0; i < WFH_PER_MONTH; i++) {
          const date = workingDays[pointer % workingDays.length];
          pointer++;

          const isPast = date < today;

          records.push({
            employee: user._id,
            date,
            originalDate: null,
            reason: "System allocated WFH day",
            type: isPast ? "Used" : "Allocated",
            status: isPast ? "Used" : "Allocated",
          });
        }
      }
    }

    const created = await WFH.insertMany(records);

    res.status(201).json({
      message: "Team WFH allocation generated successfully",
      totalRecords: created.length,
      perEmployee: YEARLY_WFH_LIMIT,
      totalEmployees: users.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeamWFHByDate = async (req, res) => {
  try {
    const selected = req.query.date ? new Date(req.query.date) : new Date();

    const start = new Date(
      selected.getFullYear(),
      selected.getMonth(),
      selected.getDate(),
      0,
      0,
      0,
      0
    );

    const end = new Date(
      selected.getFullYear(),
      selected.getMonth(),
      selected.getDate(),
      23,
      59,
      59,
      999
    );

    const records = await WFH.find({
      date: { $gte: start, $lte: end },
    }).populate("employee", "name employeeId department designation email");

    res.json({
      count: records.length,
      members: records.map((item) => ({
        id: item._id,
        date: item.date,
        status: item.status,
        name: item.employee?.name,
        employeeId: item.employee?.employeeId,
        department: item.employee?.department,
        designation: item.employee?.designation,
        email: item.employee?.email,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTeamWFH = async (req, res) => {
  try {
    const records = await WFH.find()
      .populate("employee", "name employeeId department designation email")
      .sort({ date: 1 });

    res.json({
      count: records.length,
      records: records.map((item) => ({
        id: item._id,
        date: item.date,
        status: item.status,
        name: item.employee?.name,
        employeeId: item.employee?.employeeId,
        department: item.employee?.department,
        designation: item.employee?.designation,
        email: item.employee?.email,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};