import WFH from "../models/WFH.js";
import WFHSwapRequest from "../models/WFHSwapRequest.js";

export const createSwapRequest = async (req, res) => {
  try {
    const { fromWFHId, toWFHId, reason } = req.body;

    const fromWFH = await WFH.findOne({
      _id: fromWFHId,
      employee: req.user._id,
    });

    if (!fromWFH) {
      return res.status(404).json({ message: "Your WFH record not found." });
    }

    if (fromWFH.status === "Used") {
      return res.status(400).json({ message: "Used WFH cannot be swapped." });
    }

    const toWFH = await WFH.findById(toWFHId);

    if (!toWFH) {
      return res.status(404).json({ message: "Target WFH record not found." });
    }

    if (String(toWFH.employee) === String(req.user._id)) {
      return res.status(400).json({ message: "You cannot swap with yourself." });
    }

    if (toWFH.status === "Used") {
      return res.status(400).json({ message: "Used WFH cannot be swapped." });
    }

    const existing = await WFHSwapRequest.findOne({
      fromEmployee: req.user._id,
      fromWFH: fromWFHId,
      toWFH: toWFHId,
      status: "Pending",
    });

    if (existing) {
      return res.status(400).json({
        message: "Swap request already pending.",
      });
    }

    const request = await WFHSwapRequest.create({
      fromEmployee: req.user._id,
      toEmployee: toWFH.employee,
      fromWFH: fromWFH._id,
      toWFH: toWFH._id,
      reason,
    });

    res.status(201).json({
      message: "WFH swap request sent successfully.",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMySwapRequests = async (req, res) => {
  try {
    const received = await WFHSwapRequest.find({
      toEmployee: req.user._id,
      status: "Pending",
    })
      .populate("fromEmployee", "name employeeId department designation")
      .populate("fromWFH")
      .populate("toWFH")
      .sort({ createdAt: -1 });

    const sent = await WFHSwapRequest.find({
      fromEmployee: req.user._id,
    })
      .populate("toEmployee", "name employeeId department designation")
      .populate("fromWFH")
      .populate("toWFH")
      .sort({ createdAt: -1 });

    res.json({ received, sent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptSwapRequest = async (req, res) => {
  try {
    const request = await WFHSwapRequest.findOne({
      _id: req.params.id,
      toEmployee: req.user._id,
      status: "Pending",
    });

    if (!request) {
      return res.status(404).json({ message: "Swap request not found." });
    }

    const fromWFH = await WFH.findById(request.fromWFH);
    const toWFH = await WFH.findById(request.toWFH);

    if (!fromWFH || !toWFH) {
      return res.status(404).json({ message: "WFH records not found." });
    }

    const tempDate = fromWFH.date;
    const tempOriginal = fromWFH.originalDate;

    fromWFH.originalDate = fromWFH.originalDate || fromWFH.date;
    toWFH.originalDate = toWFH.originalDate || toWFH.date;

    fromWFH.date = toWFH.date;
    toWFH.date = tempDate;

    fromWFH.status = "Shifted";
    fromWFH.type = "Shifted";
    fromWFH.reason = "WFH swapped with another employee";

    toWFH.status = "Shifted";
    toWFH.type = "Shifted";
    toWFH.reason = "WFH swapped with another employee";

    await fromWFH.save();
    await toWFH.save();

    request.status = "Accepted";
    await request.save();

    res.json({
      message: "WFH swap accepted successfully.",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectSwapRequest = async (req, res) => {
  try {
    const request = await WFHSwapRequest.findOne({
      _id: req.params.id,
      toEmployee: req.user._id,
      status: "Pending",
    });

    if (!request) {
      return res.status(404).json({ message: "Swap request not found." });
    }

    request.status = "Rejected";
    await request.save();

    res.json({
      message: "WFH swap request rejected.",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};