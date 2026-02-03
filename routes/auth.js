


const express = require("express");
const router = express.Router();
const User = require("../models/User");
console.log("User model:", User);
router.get("/ping", (req, res) => {
  res.send("Auth routes working");
});

// Temporary OTP storage
const otpStore = {};

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

/*
  Send OTP
*/
router.post("/send-otp", (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone required" });
  }

  const otp = generateOTP();

  otpStore[phone] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000
  };

  console.log(`OTP for ${phone}:`, otp);

  res.json({ message: "OTP sent (check terminal)" });
});

/*
  Verify OTP
*/
router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  const data = otpStore[phone];

  if (!data || data.otp != otp || Date.now() > data.expires) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  delete otpStore[phone];

  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({ phone });
  }

  res.json({
    message: "Phone verified",
    user
  });
});

module.exports = router;
