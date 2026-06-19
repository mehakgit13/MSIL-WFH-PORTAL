import express from "express";
import {
  getMyWFH,
  generateMyWFHDays,
  shiftWFHDate,
  applyWFH,
} from "../controllers/wfhController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyWFH);
router.post("/generate", protect, generateMyWFHDays);
router.post("/apply", protect, applyWFH);
router.put("/shift/:id", protect, shiftWFHDate);

export default router;