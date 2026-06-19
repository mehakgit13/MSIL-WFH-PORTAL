import Holiday from "../models/Holiday.js";

export const getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({
      date: 1,
    });

    res.json(holidays);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};