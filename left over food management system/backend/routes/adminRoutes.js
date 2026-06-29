const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Food=require("../models/Food");

// GET all providers
router.get("/providers", async (req, res) => {
  try {
    const providers = await User.find({ role: "provider" });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/summary", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalProviders = await User.countDocuments({ role: "provider" });

    res.json({
      totalUsers,
      totalProviders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/posts", async (req, res) => {
  try {
    const foods = await Food.find();

    let available = 0;
    let requested = 0;
    let delivered = 0;
    let expired = 0;

    foods.forEach((food) => {
      if (food.status === "available") {
        available++;
      }

      if (food.status === "expired") {
        expired++;
      }

      food.requests.forEach((request) => {
        if (request.status === "requested") {
          requested++;
        }

        if (request.status === "delivered") {
          delivered++;
        }
      });
    });

    res.json({
      available,
      requested,
      delivered,
      expired,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});




module.exports = router;