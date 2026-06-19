import express from "express";
import {
  generateTeamWFH,
  getTeamWFHByDate,
  getAllTeamWFH,
} from "../controllers/teamWFHController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate-team", protect, generateTeamWFH);
router.get("/by-date", protect, getTeamWFHByDate);
router.get("/all", protect, getAllTeamWFH);

export default router;