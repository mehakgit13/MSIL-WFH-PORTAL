import Leave from "../models/Leave.js";
import WFH from "../models/WFH.js";
import Holiday from "../models/Holiday.js";
import Notification from "../models/Notification.js";

const ANNUAL_LEAVE_QUOTA = 20;
const SICK_LEAVE_QUOTA = 8;
const YEARLY_WFH_QUOTA = 24;

export const getDashboard = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const year = new Date().getFullYear();

    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

    const annualLeavesUsed = await Leave.countDocuments({
      employee: employeeId,
      leaveType: "Annual",
      status: "Approved",
    });

    const sickLeavesUsed = await Leave.countDocuments({
      employee: employeeId,
      leaveType: "Sick",
      status: "Approved",
    });

    const pendingLeaves = await Leave.countDocuments({
      employee: employeeId,
      status: "Pending",
    });

    const wfhRecords = await WFH.find({
      employee: employeeId,
      date: {
        $gte: startOfYear,
        $lte: endOfYear,
      },
    });

    const usedWFH = wfhRecords.filter((x) => x.status === "Used").length;
    const upcomingWFH = wfhRecords.filter(
      (x) => x.status === "Allocated" || x.status === "Shifted"
    ).length;
    const shiftedWFH = wfhRecords.filter((x) => x.status === "Shifted").length;

    const upcomingHolidays = await Holiday.countDocuments({
      date: { $gte: new Date() },
    });

    const unreadNotifications = await Notification.countDocuments({
      employee: employeeId,
      isRead: false,
    });

    res.json({
      employee: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        employeeId: req.user.employeeId,
        department: req.user.department,
        designation: req.user.designation,
        manager: req.user.manager,
        location: req.user.location,
      },

      leaves: {
        annualQuota: ANNUAL_LEAVE_QUOTA,
        annualUsed: annualLeavesUsed,
        annualRemaining: Math.max(ANNUAL_LEAVE_QUOTA - annualLeavesUsed, 0),

        sickQuota: SICK_LEAVE_QUOTA,
        sickUsed: sickLeavesUsed,
        sickRemaining: Math.max(SICK_LEAVE_QUOTA - sickLeavesUsed, 0),

        pending: pendingLeaves,
      },

      wfh: {
        yearlyQuota: YEARLY_WFH_QUOTA,
        totalAllocated: wfhRecords.length,
        used: usedWFH,
        upcoming: upcomingWFH,
        shifted: shiftedWFH,
        remaining: upcomingWFH,
        left: upcomingWFH,
      },

      holidays: {
        upcoming: upcomingHolidays,
      },

      notifications: {
        unread: unreadNotifications,
      },

      policy: {
        annualLeaveQuota: ANNUAL_LEAVE_QUOTA,
        sickLeaveQuota: SICK_LEAVE_QUOTA,
        yearlyWFHQuota: YEARLY_WFH_QUOTA,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};