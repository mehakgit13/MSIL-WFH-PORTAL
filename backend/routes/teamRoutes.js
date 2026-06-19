import express from "express";
import {
  getMyTeam,
  getAllEmployees,
} from "../controllers/teamController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyTeam);
router.get("/all", protect, getAllEmployees);

export default router;