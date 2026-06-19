import WFH from "../models/WFH.js";

const YEARLY_WFH_LIMIT = 24;

const startOfYear = (year) => new Date(year, 0, 1);
const endOfYear = (year) => new Date(year, 11, 31, 23, 59, 59, 999);

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

export const generateMyWFHDays = async (req, res) => {
  res.status(400).json({
    message:
      "Use Generate Team WFH Allocation. WFH is now generated for all team members.",
  });
};

export const shiftWFHDate = async (req, res) => {
  try {
    const currentWFH = await WFH.findOne({
      _id: req.params.id,
      employee: req.user._id,
    });

    if (!currentWFH) {
      return res.status(404).json({ message: "WFH allocation not found" });
    }

    if (currentWFH.status === "Used") {
      return res.status(400).json({ message: "Used WFH cannot be shifted" });
    }

    let newDate = new Date(currentWFH.date);
    newDate.setDate(newDate.getDate() + 1);

    const existing = await WFH.find({ employee: req.user._id });

    const dateKey = (d) => new Date(d).toISOString().split("T")[0];

    while (
      newDate.getDay() === 0 ||
      newDate.getDay() === 6 ||
      existing.some((x) => dateKey(x.date) === dateKey(newDate))
    ) {
      newDate.setDate(newDate.getDate() + 1);
    }

    currentWFH.originalDate = currentWFH.originalDate || currentWFH.date;
    currentWFH.date = newDate;
    currentWFH.status = "Shifted";
    currentWFH.type = "Shifted";
    currentWFH.reason = "Employee shifted allocated WFH day";

    await currentWFH.save();

    res.json({
      message: "WFH date shifted successfully",
      request: currentWFH,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const applyWFH = async (req, res) => {
  res.status(400).json({
    message: "Manual WFH request disabled. WFH days are system allocated.",
  });
};