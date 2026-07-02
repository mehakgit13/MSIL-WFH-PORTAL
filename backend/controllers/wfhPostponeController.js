import WFH from "../models/WFH.js";
import User from "../models/User.js";
import WFHPostponeRequest from "../models/WFHPostponeRequest.js";

function getTodayStart() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function isWeekend(date) {
  const day = new Date(date).getDay();
  return day === 0 || day === 6;
}

function dateRange(date) {
  const d = new Date(date);
  return {
    start: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
    end: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999),
  };
}

function getNextAvailableDate(existingDates, currentDate) {
  const usedDates = new Set(
    existingDates.map((item) => new Date(item.date).toISOString().split("T")[0])
  );

  let newDate = new Date(currentDate);
  newDate.setDate(newDate.getDate() + 1);

  for (let i = 0; i < 90; i++) {
    const key = newDate.toISOString().split("T")[0];

    if (!isWeekend(newDate) && !usedDates.has(key)) {
      return newDate;
    }

    newDate.setDate(newDate.getDate() + 1);
  }

  return null;
}

function isManagerOf(managerUser, employeeUser) {
  if (!managerUser || !employeeUser) return false;

  return (
    String(employeeUser.manager || "").toLowerCase() ===
      String(managerUser.name || "").toLowerCase() ||
    String(employeeUser.manager || "").toLowerCase() ===
      String(managerUser.email || "").toLowerCase() ||
    String(employeeUser.manager || "") === String(managerUser._id)
  );
}

export const createPostponeRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body || {};

    const wfh = await WFH.findOne({
      _id: id,
      employee: req.user._id,
    });

    if (!wfh) {
      return res.status(404).json({ message: "WFH record not found." });
    }

    if (wfh.status === "Used") {
      return res.status(400).json({
        message: "Used or past WFH cannot be postponed.",
      });
    }

    if (new Date(wfh.date) < getTodayStart()) {
      return res.status(400).json({
        message: "Past WFH cannot be postponed.",
      });
    }

    const pending = await WFHPostponeRequest.findOne({
      employee: req.user._id,
      wfh: id,
      status: "Pending Manager",
    });

    if (pending) {
      return res.status(400).json({
        message: "Postpone request is already pending for manager approval.",
      });
    }

    const existingDates = await WFH.find({
      employee: req.user._id,
    });

    const requestedDate = getNextAvailableDate(existingDates, wfh.date);

    if (!requestedDate) {
      return res.status(400).json({
        message: "No available working day found.",
      });
    }

    const request = await WFHPostponeRequest.create({
      employee: req.user._id,
      wfh: wfh._id,
      currentDate: wfh.date,
      requestedDate,
      reason: reason || "Employee requested WFH postpone",
      status: "Pending Manager",
    });

    res.status(201).json({
      message: "Postpone request sent to manager for approval.",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyPostponeRequests = async (req, res) => {
  try {
    const requests = await WFHPostponeRequest.find({
      employee: req.user._id,
    })
      .populate("wfh", "date status")
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getManagerPostponeRequests = async (req, res) => {
  try {
    if (!["manager", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only managers can view postpone approvals.",
      });
    }

    const allPending = await WFHPostponeRequest.find({
      status: "Pending Manager",
    })
      .populate("employee", "name email employeeId department designation manager")
      .populate("wfh", "date status")
      .sort({ createdAt: -1 });

    if (req.user.role === "admin") {
      return res.json({ requests: allPending });
    }

    const managerName = String(req.user.name || "").toLowerCase();
    const managerEmail = String(req.user.email || "").toLowerCase();
    const managerId = String(req.user._id);

    const filtered = allPending.filter((item) => {
      const employeeManager = String(item.employee?.manager || "").toLowerCase();

      return (
        employeeManager === managerName ||
        employeeManager === managerEmail ||
        String(item.employee?.manager || "") === managerId
      );
    });

    res.json({ requests: filtered });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const managerRespondPostpone = async (req, res) => {
  try {
    const { status } = req.body || {};

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Approved or Rejected.",
      });
    }

    if (!["manager", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only manager can approve or reject.",
      });
    }

    const request = await WFHPostponeRequest.findById(req.params.id).populate(
      "employee",
      "name email manager"
    );

    if (!request) {
      return res.status(404).json({
        message: "Postpone request not found.",
      });
    }

    if (request.status !== "Pending Manager") {
      return res.status(400).json({
        message: "This request is already processed.",
      });
    }

    const canApprove =
      req.user.role === "admin" || isManagerOf(req.user, request.employee);

    if (!canApprove) {
      return res.status(403).json({
        message: "You are not manager of this employee.",
      });
    }

    if (status === "Rejected") {
      request.status = "Rejected";
      request.managerActionBy = req.user._id;
      request.managerActionAt = new Date();
      await request.save();

      return res.json({
        message: "Postpone request rejected.",
        request,
      });
    }

    const wfh = await WFH.findById(request.wfh);

    if (!wfh) {
      return res.status(404).json({
        message: "WFH record not found.",
      });
    }

    const range = dateRange(request.requestedDate);

    const duplicate = await WFH.findOne({
      _id: { $ne: wfh._id },
      employee: wfh.employee,
      date: { $gte: range.start, $lte: range.end },
    });

    if (duplicate) {
      return res.status(400).json({
        message: "Employee already has WFH on requested date.",
      });
    }

    wfh.originalDate = wfh.originalDate || wfh.date;
    wfh.date = request.requestedDate;
    wfh.status = "Shifted";
    wfh.type = "Shifted";
    wfh.reason = "WFH postponed after manager approval";

    await wfh.save();

    request.status = "Approved";
    request.managerActionBy = req.user._id;
    request.managerActionAt = new Date();

    await request.save();

    res.json({
      message: "Postpone request approved.",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};