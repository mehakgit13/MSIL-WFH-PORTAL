import Notice from "../models/Notice.js";

export const getNotices = async (req, res) => {
  const notices = await Notice.find().sort({
    createdAt: -1,
  });

  res.json(notices);
};

export const getNoticeById = async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (!notice) {
    return res.status(404).json({
      message: "Notice not found",
    });
  }

  res.json(notice);
};