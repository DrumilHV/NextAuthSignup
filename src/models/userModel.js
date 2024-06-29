import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "please enter username !"],
    unique: [true, "this user name is taken, unlike you !"],
  },
  email: {
    type: String,
    required: [true, "please enter email !"],
    unique: [true, "this email is registered, please login !"],
  },
  password: {
    type: String,
    required: [true, "please enter password !"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

const User = mongoose.models.user || mongoose.model("users", userSchema);
export default User;
