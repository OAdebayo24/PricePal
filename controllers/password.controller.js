const { users } = require("../models");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto"); // for secure OTP
const { Op } = require("sequelize");

// Generate OTP helper
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email_address } = req.body;
  try {
    const user = await users.findOne({ where: { email_address } });

    if (!user) {
      return res.status(404).json({ message: "No user with that email." });
    }

    const otp = generateOtp();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.forgot_password_otp = otp;
    user.otp_expire = otpExpire;
    await user.save();

    // In production, send via email or SMS.
    console.log(`OTP for password reset: ${otp}`);

    return res.status(200).json({ message: "OTP sent to email." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reset Password With OTP
exports.resetPassword = async (req, res) => {
  const { email_address, otp, newPassword } = req.body;
  try {
    const user = await users.findOne({ where: { email_address } });

    if (
      !user ||
      user.forgot_password_otp !== otp ||
      user.otp_expire < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    user.password = newPassword;
    user.forgot_password_otp = null;
    user.otp_expire = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successful." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Change Password (Logged-in User)
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?.id;

  try {
    const user = await users.findByPk(userId);

    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await user.validatePassword(currentPassword);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully." });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
