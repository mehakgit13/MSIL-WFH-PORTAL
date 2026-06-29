import express from "express";
import {
  createSwapRequest,
  getMySwapRequests,
  respondSwapRequest,
  getManagerSwapRequests,
  managerRespondSwapRequest,
} from "../controllers/wfhSwapController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request", protect, createSwapRequest);
router.get("/my", protect, getMySwapRequests);
router.put("/:id/respond", protect, respondSwapRequest);

router.get("/manager", protect, getManagerSwapRequests);
router.put("/:id/manager-respond", protect, managerRespondSwapRequest);

export default router;