const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// REGISTER (bcrypt)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, providerType, userType } = req.body;
    const existingUser = await User.findOne({ email });

if (existingUser) {
  return res.status(400).json({
    message: "Email already exists"
  });
}

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      providerType,
      userType
    });

    await user.save();

    res.json({
      message: "User Registered Successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


// LOGIN (JWT)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await  User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch =  await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


module.exports = router;