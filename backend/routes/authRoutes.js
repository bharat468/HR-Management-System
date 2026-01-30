import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// REGISTER
// POST /api/auth/register
router.post("/register", register);

// LOGIN
// POST /api/auth/login
router.post("/login", login);

export default router;
