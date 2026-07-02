import express from "express";
import {
  createPostponeRequest,
  getMyPostponeRequests,
  getManagerPostponeRequests,
  managerRespondPostpone,
} from "../controllers/wfhPostponeController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:id/request", protect, createPostponeRequest);
router.get("/my", protect, getMyPostponeRequests);
router.get("/manager", protect, getManagerPostponeRequests);
router.put("/:id/manager-respond", protect, managerRespondPostpone);

export default router;