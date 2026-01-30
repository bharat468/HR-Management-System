import Attendance from "../models/Attendance.js";

// MARK ATTENDANCE (EMPLOYEE)
export const markAttendance = async (req, res) => {
  try {
    const { status } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Prevent future attendance
    if (new Date(req.body.date) > today) {
      return res
        .status(400)
        .json({ message: "Cannot mark attendance for future dates" });
    }

    const existing = await Attendance.findOne({
      user: req.user.id,
      date: today
    });

    if (existing)
      return res
        .status(400)
        .json({ message: "Attendance already marked today" });

    const attendance = await Attendance.create({
      user: req.user.id,
      date: today,
      status
    });

    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET LOGGED-IN USER ATTENDANCE
export const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({
      user: req.user.id
    }).sort({ date: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: GET ALL ATTENDANCE
export const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().populate(
      "user",
      "name email"
    );
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
