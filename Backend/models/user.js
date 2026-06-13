import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema({
  loginTime: {
    type: Date,
    default: Date.now,
  },
  ip: String,
  userAgent: String,
});

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  picture: String,
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  loginHistory: [loginHistorySchema],
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;
