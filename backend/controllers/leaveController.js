import Leave from "../models/Leave.js";
import User from "../models/User.js";

// APPLY LEAVE (EMPLOYEE)
export const applyLeave = async (req, res) => {
  try {
    const { startDate, endDate, type, reason } = req.body;

    const totalDays =
      (new Date(endDate) - new Date(startDate)) /
        (1000 * 60 * 60 * 24) +
      1;

    const leave = await Leave.create({
      user: req.user.id,
      type,
      startDate,
      endDate,
      totalDays,
      reason
    });

    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET LOGGED-IN USER LEAVES
export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user.id }).sort({
      appliedDate: -1
    });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: GET ALL LEAVES
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate(
      "user",
      "name email"
    );
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: APPROVE LEAVE
export const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id).populate("user");

    if (!leave)
      return res.status(404).json({ message: "Leave not found" });

    if (leave.status !== "Pending")
      return res
        .status(400)
        .json({ message: "Leave already processed" });

    if (leave.user.leaveBalance < leave.totalDays)
      return res
        .status(400)
        .json({ message: "Insufficient leave balance" });

    leave.status = "Approved";
    leave.user.leaveBalance -= leave.totalDays;

    await leave.user.save();
    await leave.save();

    res.json({ message: "Leave approved", leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: REJECT LEAVE
export const rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave)
      return res.status(404).json({ message: "Leave not found" });

    if (leave.status !== "Pending")
      return res
        .status(400)
        .json({ message: "Leave already processed" });

    leave.status = "Rejected";
    await leave.save();

    res.json({ message: "Leave rejected", leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
