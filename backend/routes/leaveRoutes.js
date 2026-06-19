import express from "express";
import {
  getMyLeaves,
  applyLeave,
  getAllLeaveRequests,
  updateLeaveStatus,
} from "../controllers/leaveController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyLeaves);
router.post("/apply", protect, applyLeave);

router.get("/all", protect, getAllLeaveRequests);
router.patch("/:id/status", protect, updateLeaveStatus);

export default router;