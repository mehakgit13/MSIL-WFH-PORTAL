import express from "express";
import {
  createSwapRequest,
  getMySwapRequests,
  acceptSwapRequest,
  rejectSwapRequest,
} from "../controllers/wfhSwapController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request", protect, createSwapRequest);
router.get("/my", protect, getMySwapRequests);
router.put("/accept/:id", protect, acceptSwapRequest);
router.put("/reject/:id", protect, rejectSwapRequest);

export default router;