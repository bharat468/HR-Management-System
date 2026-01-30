import express from "express";
import {
  applyLeave,
  approveLeave,
  rejectLeave,
  getMyLeaves,
  getAllLeaves
} from "../controllers/leaveController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// EMPLOYEE
// Apply for leave
// POST /api/leaves
router.post("/", protect, applyLeave);

// Get logged-in user's leaves
// GET /api/leaves/my
router.get("/my", protect, getMyLeaves);

// ADMIN
// Get all leave requests
// GET /api/leaves/all
router.get("/all", protect, adminOnly, getAllLeaves);

// Approve leave
// PUT /api/leaves/:id/approve
router.put("/:id/approve", protect, adminOnly, approveLeave);

// Reject leave
// PUT /api/leaves/:id/reject
router.put("/:id/reject", protect, adminOnly, rejectLeave);

export default router;
