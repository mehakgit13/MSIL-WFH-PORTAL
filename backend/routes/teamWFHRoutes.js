import express from "express";
import {
  generateTeamWFH,
  getTeamWFHByDate,
  getTeamWFHByMonth,
} from "../controllers/teamWFHController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate-team", protect, generateTeamWFH);
router.get("/by-date", protect, getTeamWFHByDate);
router.get("/by-month", protect, getTeamWFHByMonth);

export default router;