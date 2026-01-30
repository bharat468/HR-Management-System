import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["employee", "admin"], default: "employee" },
  joiningDate: { type: Date, default: Date.now },
  leaveBalance: { type: Number, default: 20 }
});

export default mongoose.model("User", userSchema);
