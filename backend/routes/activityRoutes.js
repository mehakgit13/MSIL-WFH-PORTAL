import express from "express";

import {
  getActivities,
  getActivityById,
} from "../controllers/activityController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getActivities);
router.get("/:id", protect, getActivityById);

export default router;