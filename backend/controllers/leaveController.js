import Leave from "../models/Leave.js";
import Activity from "../models/Activity.js";

export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      employee: req.user._id,
    }).sort({ startDate: -1 });

    const annualUsed = await Leave.countDocuments({
      employee: req.user._id,
      leaveType: "Annual",
      status: "Approved",
    });

    const sickUsed = await Leave.countDocuments({
      employee: req.user._id,
      leaveType: "Sick",
      status: "Approved",
    });

    const casualUsed = await Leave.countDocuments({
      employee: req.user._id,
      leaveType: "Casual",
      status: "Approved",
    });

    res.json({
      balance: {
        annual: {
          quota: 20,
          used: annualUsed,
          remaining: 20 - annualUsed,
        },
        sick: {
          quota: 8,
          used: sickUsed,
          remaining: 8 - sickUsed,
        },
        casual: {
          quota: 5,
          used: casualUsed,
          remaining: 5 - casualUsed,
        },
      },
      leaves,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const leave = await Leave.create({
      employee: req.user._id,
      leaveType,
      startDate,
      endDate,
      reason,
      status: "Pending",
    });

    await Activity.create({
      employee: req.user._id,
      title: "Leave Request Submitted",
      description: `${leaveType} leave request submitted from ${startDate} to ${endDate}.`,
    });

    res.status(201).json({
      message: "Leave request submitted successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllLeaveRequests = async (req, res) => {
  try {
    const leaves = await Leave.find({})
      .populate("employee", "name email employeeId department designation manager")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Approved or Rejected",
      });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    leave.status = status;
    leave.approvedBy = req.user.name;

    await leave.save();

    await Activity.create({
      employee: leave.employee,
      title: `Leave Request ${status}`,
      description: `Your leave request was ${status} by ${req.user.name}.`,
    });

    res.json({
      message: `Leave request ${status}`,
      leave,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};