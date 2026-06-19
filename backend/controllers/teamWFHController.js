import WFH from "../models/WFH.js";
import User from "../models/User.js";

const WFH_PER_MONTH = 2;

function isWeekend(date) {
  return date.getDay() === 0 || date.getDay() === 6;
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function getWorkingDaysOfMonth(year, month) {
  const days = [];
  const totalDays = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day);

    if (!isWeekend(date)) {
      days.push(date);
    }
  }

  return days;
}

export const generateTeamWFH = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const today = new Date();

    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59, 999);

    const existing = await WFH.countDocuments({
      date: { $gte: start, $lte: end },
    });

    if (existing > 0) {
      return res.status(200).json({
        message: "WFH allocation already exists. Existing data was not changed.",
        totalRecords: existing,
      });
    }

    const users = await User.find({
      role: { $in: ["employee", "manager", "admin"] },
    }).sort({ name: 1 });

    if (users.length === 0) {
      return res.status(400).json({ message: "No employees found." });
    }

    const records = [];

    for (let month = 0; month < 12; month++) {
      const workingDays = shuffle(getWorkingDaysOfMonth(year, month));

      const required = users.length * WFH_PER_MONTH;

      if (required > workingDays.length) {
        return res.status(400).json({
          message: `Not enough working days in month ${month + 1}.`,
        });
      }

      let pointer = 0;

      for (const user of users) {
        for (let i = 0; i < WFH_PER_MONTH; i++) {
          const date = workingDays[pointer];
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
      message: "Team WFH allocation generated successfully.",
      totalRecords: created.length,
      employees: users.length,
      perEmployee: 24,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeamWFHByDate = async (req, res) => {
  try {
    const selected = req.query.date ? new Date(req.query.date) : new Date();

    const start = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
    const end = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), 23, 59, 59, 999);

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

export const getTeamWFHByMonth = async (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const month = Number(req.query.month) || new Date().getMonth() + 1;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    const records = await WFH.find({
      date: { $gte: start, $lte: end },
    })
      .populate("employee", "name employeeId department designation email")
      .sort({ date: 1 });

    res.json({
      month,
      year,
      count: records.length,
      records: records.map((item) => ({
        id: item._id,
        date: item.date,
        status: item.status,
        name: item.employee?.name,
        employeeId: item.employee?.employeeId,
        department: item.employee?.department,
        designation: item.employee?.designation,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};