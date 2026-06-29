import express from "express";
import {
  generateTeamWFH,
  getTeamWFH,
  getTeamWFHByDate,
  getTeamWFHByMonth,
} from "../controllers/teamWFHController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", protect, generateTeamWFH);
router.get("/", protect, getTeamWFH);
router.get("/by-date", protect, getTeamWFHByDate);
router.get("/month", protect, getTeamWFHByMonth);

export default router;