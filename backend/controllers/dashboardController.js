import Leave from "../models/Leave.js";
import WFH from "../models/WFH.js";
import Holiday from "../models/Holiday.js";
import Attendance from "../models/Attendance.js";
import Notification from "../models/Notification.js";

const ANNUAL_LEAVE_QUOTA = 20;
const SICK_LEAVE_QUOTA = 8;
const WFH_MONTHLY_QUOTA = 5;

export const getDashboard = async (req, res) => {
  try {
    const employeeId = req.user._id;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(
      startOfMonth.getFullYear(),
      startOfMonth.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

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

    const approvedWFHThisMonth = await WFH.countDocuments({
      employee: employeeId,
      status: "Approved",
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });

    const pendingWFH = await WFH.countDocuments({
      employee: employeeId,
      status: "Pending",
    });

    const presentDays = await Attendance.countDocuments({
      employee: employeeId,
      status: "Present",
    });

    const totalAttendanceRecords = await Attendance.countDocuments({
      employee: employeeId,
    });

    const attendancePercentage =
      totalAttendanceRecords === 0
        ? 0
        : Math.round((presentDays / totalAttendanceRecords) * 100);

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

      attendance: {
        percentage: attendancePercentage,
        presentDays,
        totalRecords: totalAttendanceRecords,
      },

      leaves: {
        annualQuota: ANNUAL_LEAVE_QUOTA,
        annualUsed: annualLeavesUsed,
        annualRemaining: Math.max(
          ANNUAL_LEAVE_QUOTA - annualLeavesUsed,
          0
        ),

        sickQuota: SICK_LEAVE_QUOTA,
        sickUsed: sickLeavesUsed,
        sickRemaining: Math.max(SICK_LEAVE_QUOTA - sickLeavesUsed, 0),

        pending: pendingLeaves,
      },

      wfh: {
        monthlyQuota: WFH_MONTHLY_QUOTA,
        approved: approvedWFHThisMonth,
        pending: pendingWFH,
        remaining: Math.max(WFH_MONTHLY_QUOTA - approvedWFHThisMonth, 0),
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
        wfhMonthlyQuota: WFH_MONTHLY_QUOTA,
        workingHoursPerDay: 9,
        minimumAttendance: 90,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};