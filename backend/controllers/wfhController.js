import WFH from "../models/WFH.js";
import Activity from "../models/Activity.js";

const WFH_PER_MONTH = 2;
const YEARLY_WFH_LIMIT = 24;

function getDateKey(date) {
  return new Date(date).toISOString().split("T")[0];
}

function isWeekend(date) {
  const day = new Date(date).getDay();
  return day === 0 || day === 6;
}

function getRandomWorkingDateInMonth(year, month, usedDates) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let attempt = 0; attempt < 100; attempt++) {
    const day = Math.floor(Math.random() * daysInMonth) + 1;
    const date = new Date(year, month, day);
    const key = getDateKey(date);

    if (!isWeekend(date) && !usedDates.has(key)) {
      usedDates.add(key);
      return date;
    }
  }

  return null;
}

function getTodayStart() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

async function markPastWFHAsUsed(employeeId) {
  const today = getTodayStart();

  await WFH.updateMany(
    {
      employee: employeeId,
      status: "Allocated",
      date: { $lt: today },
    },
    {
      $set: {
        status: "Used",
        type: "Used",
      },
    }
  );

  await WFH.updateMany(
    {
      employee: employeeId,
      status: "Shifted",
      date: { $lt: today },
    },
    {
      $set: {
        status: "Used",
        type: "Used",
      },
    }
  );
}

function getNextAvailableDate(existingDates, currentDate) {
  const usedDates = new Set(existingDates.map((item) => getDateKey(item.date)));

  let newDate = new Date(currentDate);
  newDate.setDate(newDate.getDate() + 1);

  for (let i = 0; i < 90; i++) {
    const key = getDateKey(newDate);

    if (!isWeekend(newDate) && !usedDates.has(key)) {
      return newDate;
    }

    newDate.setDate(newDate.getDate() + 1);
  }

  return null;
}

export const generateMyWFHDays = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const year = new Date().getFullYear();

    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

    const existing = await WFH.find({
      employee: employeeId,
      date: {
        $gte: startOfYear,
        $lte: endOfYear,
      },
    }).sort({ date: 1 });

    if (existing.length > 0) {
      await markPastWFHAsUsed(employeeId);

      const updated = await WFH.find({
        employee: employeeId,
        date: {
          $gte: startOfYear,
          $lte: endOfYear,
        },
      }).sort({ date: 1 });

      return res.status(200).json({
        message: "WFH days already generated for this year",
        yearlyQuota: YEARLY_WFH_LIMIT,
        allocated: updated.length,
        used: updated.filter((item) => item.status === "Used").length,
        shifted: updated.filter((item) => item.status === "Shifted").length,
        remaining:
          YEARLY_WFH_LIMIT -
          updated.filter((item) => item.status === "Used").length,
        requests: updated,
      });
    }

    const usedDates = new Set();
    const randomDates = [];

    for (let month = 0; month < 12; month++) {
      for (let count = 0; count < WFH_PER_MONTH; count++) {
        const date = getRandomWorkingDateInMonth(year, month, usedDates);
        if (date) randomDates.push(date);
      }
    }

    const created = await WFH.insertMany(
      randomDates.map((date) => ({
        employee: employeeId,
        date,
        originalDate: null,
        reason: "System allocated WFH day",
        type: "Allocated",
        status: "Allocated",
      }))
    );

    await Activity.create({
      employee: employeeId,
      title: "WFH Days Generated",
      description:
        "24 yearly WFH days allocated automatically, 2 days per month.",
    });

    res.status(201).json({
      message: "24 WFH days generated successfully",
      yearlyQuota: YEARLY_WFH_LIMIT,
      allocated: created.length,
      used: 0,
      shifted: 0,
      remaining: YEARLY_WFH_LIMIT,
      requests: created.sort((a, b) => new Date(a.date) - new Date(b.date)),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyWFH = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const year = new Date().getFullYear();

    await markPastWFHAsUsed(employeeId);

    const requests = await WFH.find({
      employee: employeeId,
      date: {
        $gte: new Date(year, 0, 1),
        $lte: new Date(year, 11, 31, 23, 59, 59, 999),
      },
    }).sort({ date: 1 });

    const used = requests.filter((item) => item.status === "Used").length;
    const shifted = requests.filter((item) => item.status === "Shifted").length;

    res.json({
      yearlyQuota: YEARLY_WFH_LIMIT,
      allocated: requests.length,
      used,
      shifted,
      remaining: Math.max(YEARLY_WFH_LIMIT - used, 0),
      requests,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const shiftWFHDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body || {} ;

    await markPastWFHAsUsed(req.user._id);

    const currentWFH = await WFH.findOne({
      _id: id,
      employee: req.user._id,
    });

    if (!currentWFH) {
      return res.status(404).json({
        message: "WFH allocation not found",
      });
    }

    if (currentWFH.status === "Used") {
      return res.status(400).json({
        message: "Past or used WFH day cannot be shifted",
      });
    }

    const today = getTodayStart();

    if (new Date(currentWFH.date) < today) {
      currentWFH.status = "Used";
      currentWFH.type = "Used";
      await currentWFH.save();

      return res.status(400).json({
        message: "Past WFH day has already been marked as used",
      });
    }

    const existingDates = await WFH.find({
      employee: req.user._id,
    });

    const newDate = getNextAvailableDate(existingDates, currentWFH.date);

    if (!newDate) {
      return res.status(400).json({
        message: "No available working date found for shifting",
      });
    }

    currentWFH.originalDate = currentWFH.originalDate || currentWFH.date;
    currentWFH.date = newDate;
    currentWFH.type = "Shifted";
    currentWFH.status = "Shifted";
    currentWFH.reason = reason || "Employee requested alternate WFH date";

    await currentWFH.save();

    await Activity.create({
      employee: req.user._id,
      title: "WFH Date Shifted",
      description: `WFH date shifted to ${newDate.toDateString()}.`,
    });

    res.json({
      message: "WFH date shifted automatically",
      request: currentWFH,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const applyWFH = async (req, res) => {
  return res.status(400).json({
    message:
      "Manual WFH application is disabled. WFH days are system allocated automatically.",
  });
};