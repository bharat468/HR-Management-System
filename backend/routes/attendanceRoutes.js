import express from "express";
import {
  markAttendance,
  getMyAttendance,
  getAllAttendance
} from "../controllers/attendanceController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// EMPLOYEE
// Mark attendance
// POST /api/attendance
router.post("/", protect, markAttendance);

// View my attendance history
// GET /api/attendance/my
router.get("/my", protect, getMyAttendance);

// ADMIN
// View all attendance
// GET /api/attendance/all
router.get("/all", protect, adminOnly, getAllAttendance);

export default router;
