import WFH from "../models/WFH.js";

const YEARLY_WFH_LIMIT = 24;

const startOfYear = (year) => new Date(year, 0, 1);
const endOfYear = (year) => new Date(year, 11, 31, 23, 59, 59, 999);

function isWeekend(date) {
  return date.getDay() === 0 || date.getDay() === 6;
}

export const getMyWFH = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const today = new Date();

    const requests = await WFH.find({
      employee: req.user._id,
      date: {
        $gte: startOfYear(year),
        $lte: endOfYear(year),
      },
    }).sort({ date: 1 });

    for (const item of requests) {
      if (new Date(item.date) < today && item.status === "Allocated") {
        item.status = "Used";
        item.type = "Used";
        await item.save();
      }
    }

    const updated = await WFH.find({
      employee: req.user._id,
      date: {
        $gte: startOfYear(year),
        $lte: endOfYear(year),
      },
    }).sort({ date: 1 });

    const used = updated.filter((x) => x.status === "Used").length;
    const upcoming = updated.filter((x) => x.status === "Allocated").length;
    const shifted = updated.filter((x) => x.status === "Shifted").length;

    res.json({
      yearlyQuota: YEARLY_WFH_LIMIT,
      totalAllocated: updated.length,
      used,
      upcoming,
      allocated: upcoming,
      shifted,
      left: upcoming + shifted,
      remaining: upcoming + shifted,
      requests: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const shiftWFHDate = async (req, res) => {
  try {
    const { newDate } = req.body;

    if (!newDate) {
      return res.status(400).json({
        message: "Please select a new WFH date.",
      });
    }

    const currentWFH = await WFH.findOne({
      _id: req.params.id,
      employee: req.user._id,
    });

    if (!currentWFH) {
      return res.status(404).json({
        message: "WFH allocation not found.",
      });
    }

    if (currentWFH.status === "Used") {
      return res.status(400).json({
        message: "Past/used WFH cannot be shifted.",
      });
    }

    const selectedDate = new Date(newDate);

    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        message: "You cannot shift WFH to a past date.",
      });
    }

    const day = selectedDate.getDay();

    if (day === 0 || day === 6) {
      return res.status(400).json({
        message: "WFH cannot be shifted to Saturday or Sunday.",
      });
    }

    const start = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      0,
      0,
      0,
      0
    );

    const end = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      23,
      59,
      59,
      999
    );

    const alreadyAssigned = await WFH.findOne({
      _id: { $ne: currentWFH._id },
      date: { $gte: start, $lte: end },
    }).populate("employee", "name employeeId");

    if (alreadyAssigned) {
      return res.status(400).json({
        message: `This date is already assigned to ${alreadyAssigned.employee?.name}. Please select another free working day or send a swap request.`,
      });
    }

    currentWFH.originalDate = currentWFH.originalDate || currentWFH.date;
    currentWFH.date = selectedDate;
    currentWFH.status = "Shifted";
    currentWFH.type = "Shifted";
    currentWFH.reason = "Employee shifted WFH date";

    await currentWFH.save();

    res.json({
      message: "WFH date shifted successfully.",
      request: currentWFH,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const generateMyWFHDays = async (req, res) => {
  res.status(400).json({
    message: "Use Generate Team WFH Allocation only.",
  });
};

export const applyWFH = async (req, res) => {
  res.status(400).json({
    message: "Manual WFH request disabled. WFH days are system allocated.",
  });
};