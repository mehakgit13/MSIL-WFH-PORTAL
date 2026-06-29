import WFH from "../models/WFH.js";
import User from "../models/User.js";
import WFHSwapRequest from "../models/WFHSwapRequest.js";

function dayRange(date) {
  const d = new Date(date);
  return {
    start: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
    end: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999),
  };
}

async function getPopulatedRequest(id) {
  return WFHSwapRequest.findById(id)
    .populate("requestedBy", "name email employeeId department designation manager role")
    .populate("requestedTo", "name email employeeId department designation manager role")
    .populate({
      path: "fromWFH",
      select: "date status employee",
      populate: { path: "employee", select: "name employeeId department designation" },
    })
    .populate({
      path: "toWFH",
      select: "date status employee",
      populate: { path: "employee", select: "name employeeId department designation" },
    });
}

function isManagerOf(managerUser, employeeUser) {
  if (!managerUser || !employeeUser) return false;

  return (
    String(employeeUser.manager || "") === String(managerUser._id) ||
    String(employeeUser.manager || "").toLowerCase() ===
      String(managerUser.name || "").toLowerCase() ||
    String(employeeUser.manager || "").toLowerCase() ===
      String(managerUser.email || "").toLowerCase()
  );
}

async function swapWFHDates(request) {
  const fromWFH = await WFH.findById(request.fromWFH);
  const toWFH = await WFH.findById(request.toWFH);

  if (!fromWFH || !toWFH) throw new Error("WFH records not found.");

  if (fromWFH.status !== "Allocated" || toWFH.status !== "Allocated") {
    throw new Error("Only allocated WFH dates can be swapped.");
  }

  const toRange = dayRange(toWFH.date);
  const fromRange = dayRange(fromWFH.date);

  const duplicateForRequester = await WFH.findOne({
    _id: { $ne: fromWFH._id },
    employee: fromWFH.employee,
    date: { $gte: toRange.start, $lte: toRange.end },
  });

  const duplicateForReceiver = await WFH.findOne({
    _id: { $ne: toWFH._id },
    employee: toWFH.employee,
    date: { $gte: fromRange.start, $lte: fromRange.end },
  });

  if (duplicateForRequester || duplicateForReceiver) {
    throw new Error(
      "Swap not allowed because one employee already has WFH on the target date."
    );
  }

  const oldFromDate = fromWFH.date;
  const oldToDate = toWFH.date;

  fromWFH.originalDate = fromWFH.originalDate || oldFromDate;
  toWFH.originalDate = toWFH.originalDate || oldToDate;

  fromWFH.date = oldToDate;
  toWFH.date = oldFromDate;

  fromWFH.type = "Shifted";
  toWFH.type = "Shifted";

  fromWFH.status = "Allocated";
  toWFH.status = "Allocated";

  fromWFH.reason = "WFH date swapped after employee and manager approval";
  toWFH.reason = "WFH date swapped after employee and manager approval";

  await fromWFH.save();
  await toWFH.save();
}

export const createSwapRequest = async (req, res) => {
  try {
    const { fromWFHId, toWFHId, reason } = req.body || {};

    if (!fromWFHId || !toWFHId) {
      return res.status(400).json({ message: "Both WFH dates are required." });
    }

    if (fromWFHId === toWFHId) {
      return res.status(400).json({ message: "You cannot swap the same WFH date." });
    }

    const fromWFH = await WFH.findById(fromWFHId);
    const toWFH = await WFH.findById(toWFHId);

    if (!fromWFH || !toWFH) {
      return res.status(404).json({ message: "WFH record not found." });
    }

    if (String(fromWFH.employee) !== String(req.user._id)) {
      return res.status(403).json({
        message: "You can only offer your own WFH date.",
      });
    }

    if (String(toWFH.employee) === String(req.user._id)) {
      return res.status(400).json({
        message: "You cannot send swap request to yourself.",
      });
    }

    if (fromWFH.status !== "Allocated" || toWFH.status !== "Allocated") {
      return res.status(400).json({
        message: "Only future allocated WFH dates can be swapped.",
      });
    }

    const existing = await WFHSwapRequest.findOne({
      requestedBy: req.user._id,
      requestedTo: toWFH.employee,
      fromWFH: fromWFHId,
      toWFH: toWFHId,
      status: { $in: ["Pending Employee", "Pending Manager", "Pending"] },
    });

    if (existing) {
      return res.status(400).json({ message: "Swap request already pending." });
    }

    const request = await WFHSwapRequest.create({
      requestedBy: req.user._id,
      requestedTo: toWFH.employee,
      fromWFH: fromWFHId,
      toWFH: toWFHId,
      reason: reason || "Employee requested WFH swap",
      status: "Pending Employee",
    });

    const populated = await getPopulatedRequest(request._id);

    res.status(201).json({
      message: "WFH swap request sent successfully.",
      request: populated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMySwapRequests = async (req, res) => {
  try {
    const sent = await WFHSwapRequest.find({ requestedBy: req.user._id })
      .populate("requestedBy", "name email employeeId department designation manager role")
      .populate("requestedTo", "name email employeeId department designation manager role")
      .populate({
        path: "fromWFH",
        select: "date status employee",
        populate: { path: "employee", select: "name employeeId department designation" },
      })
      .populate({
        path: "toWFH",
        select: "date status employee",
        populate: { path: "employee", select: "name employeeId department designation" },
      })
      .sort({ createdAt: -1 });

    const received = await WFHSwapRequest.find({ requestedTo: req.user._id })
      .populate("requestedBy", "name email employeeId department designation manager role")
      .populate("requestedTo", "name email employeeId department designation manager role")
      .populate({
        path: "fromWFH",
        select: "date status employee",
        populate: { path: "employee", select: "name employeeId department designation" },
      })
      .populate({
        path: "toWFH",
        select: "date status employee",
        populate: { path: "employee", select: "name employeeId department designation" },
      })
      .sort({ createdAt: -1 });

    res.json({ sent, received });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const respondSwapRequest = async (req, res) => {
  try {
    const { status } = req.body || {};

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Accepted or Rejected.",
      });
    }

    const request = await WFHSwapRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Swap request not found." });
    }

    if (String(request.requestedTo) !== String(req.user._id)) {
      return res.status(403).json({
        message: "Only the requested employee can respond.",
      });
    }

    if (!["Pending Employee", "Pending"].includes(request.status)) {
      return res.status(400).json({
        message: "This request is already processed.",
      });
    }

    if (status === "Rejected") {
      request.status = "Rejected";
      await request.save();

      return res.json({
        message: "Swap request rejected.",
        request: await getPopulatedRequest(request._id),
      });
    }

    request.status = "Pending Manager";
    request.employeeAcceptedAt = new Date();
    await request.save();

    res.json({
      message: "Swap accepted by employee. Waiting for manager approval.",
      request: await getPopulatedRequest(request._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getManagerSwapRequests = async (req, res) => {
  try {
    if (!["manager", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only managers can view approval requests.",
      });
    }

    const allPending = await WFHSwapRequest.find({
      status: "Pending Manager",
    })
      .populate("requestedBy", "name email employeeId department designation manager role")
      .populate("requestedTo", "name email employeeId department designation manager role")
      .populate({
        path: "fromWFH",
        select: "date status employee",
        populate: {
          path: "employee",
          select: "name employeeId department designation manager",
        },
      })
      .populate({
        path: "toWFH",
        select: "date status employee",
        populate: {
          path: "employee",
          select: "name employeeId department designation manager",
        },
      })
      .sort({ createdAt: -1 });

    if (req.user.role === "admin") {
      return res.json({ requests: allPending });
    }

    const managerName = String(req.user.name || "").toLowerCase();
    const managerEmail = String(req.user.email || "").toLowerCase();
    const managerId = String(req.user._id);

    const filtered = allPending.filter((item) => {
      const requestedByManager = String(item.requestedBy?.manager || "").toLowerCase();
      const requestedToManager = String(item.requestedTo?.manager || "").toLowerCase();

      return (
        requestedByManager === managerName ||
        requestedToManager === managerName ||
        requestedByManager === managerEmail ||
        requestedToManager === managerEmail ||
        String(item.requestedBy?.manager || "") === managerId ||
        String(item.requestedTo?.manager || "") === managerId
      );
    });

    res.json({ requests: filtered });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const managerRespondSwapRequest = async (req, res) => {
  try {
    const { status } = req.body || {};

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Approved or Rejected.",
      });
    }

    if (!["manager", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only managers can approve or reject this request.",
      });
    }

    const request = await WFHSwapRequest.findById(req.params.id)
      .populate("requestedBy", "name email manager")
      .populate("requestedTo", "name email manager");

    if (!request) {
      return res.status(404).json({ message: "Swap request not found." });
    }

    if (request.status !== "Pending Manager") {
      return res.status(400).json({
        message: "This request is not waiting for manager approval.",
      });
    }

    const canApprove =
      req.user.role === "admin" ||
      isManagerOf(req.user, request.requestedBy) ||
      isManagerOf(req.user, request.requestedTo);

    if (!canApprove) {
      return res.status(403).json({
        message: "You are not the manager of these employees.",
      });
    }

    if (status === "Rejected") {
      request.status = "Rejected";
      request.managerApprovedBy = req.user._id;
      request.managerActionAt = new Date();
      await request.save();

      return res.json({
        message: "Swap request rejected by manager.",
        request: await getPopulatedRequest(request._id),
      });
    }

    await swapWFHDates(request);

    request.status = "Approved";
    request.managerApprovedBy = req.user._id;
    request.managerActionAt = new Date();
    await request.save();

    res.json({
      message: "Swap approved by manager and WFH dates exchanged.",
      request: await getPopulatedRequest(request._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};