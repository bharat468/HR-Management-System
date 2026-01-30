import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String,
  startDate: Date,
  endDate: Date,
  totalDays: Number,
  status: { type: String, default: "Pending" },
  reason: String,
  appliedDate: { type: Date, default: Date.now }
});

export default mongoose.model("Leave", leaveSchema);
