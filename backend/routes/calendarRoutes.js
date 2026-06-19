import express from "express";
import { getCalendarData } from "../controllers/calendarController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCalendarData);

export default router;