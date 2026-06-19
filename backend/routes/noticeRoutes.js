import express from "express";

import {
  getNotices,
  getNoticeById,
} from "../controllers/noticeController.js";

const router = express.Router();

router.get("/", getNotices);
router.get("/:id", getNoticeById);

export default router;