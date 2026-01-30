import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

dotenv.config();
connectDB();

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

/* ================= ROUTES ================= */

app.use("/auth", authRoutes);
app.use("/leaves", leaveRoutes);
app.use("/attendance", attendanceRoutes);

/* ================= START ================= */

app.listen(process.env.PORT || 5000, () => {
  console.log("✅ Server running on port 5000");
});
