const express = require("express");
const router = express.Router();
const Food = require("../models/Food");


// 🟢 ADD FOOD
router.post("/", async (req, res) => {
  try {
    const newFood = new Food(req.body);
    await newFood.save();
    res.status(201).json(newFood);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🟢 GET FOODS BY PROVIDER ID
router.get("/provider/:providerId", async (req, res) => {
  try {
    const foods = await Food.find({
      providerId: req.params.providerId,
    });

    res.status(200).json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🟢 GET ALL FOODS (optional admin use)
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// 🟢 DELETE FOOD
router.delete("/:id", async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: "Food deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





router.put(
  "/:foodId/requests/:requestId/deliver",
  async (req, res) => {
    try {
      const food = await Food.findById(
        req.params.foodId
      );

      if (!food) {
        return res.status(404).json({
          message: "Food not found",
        });
      }

      const request = food.requests.id(
        req.params.requestId
      );

      if (!request) {
        return res.status(404).json({
          message: "Request not found",
        });
      }

      request.status = "delivered";

      await food.save();

      res.json(food);
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);



// 🟢 REQUEST FOOD (NGO side future feature)
router.put("/request/:id", async (req, res) => {
  try {
    const {
      userId,
      userName,
      requestedQuantity,
    } = req.body;

    const food = await Food.findById(
      req.params.id
    );

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    if (
      new Date(food.expiryTime) <
      new Date()
    ) {
      return res.status(400).json({
        message: "Food has expired",
      });
    }

    if (
      requestedQuantity <= 0 ||
      requestedQuantity >
        food.remainingQuantity
    ) {
      return res.status(400).json({
        message: "Invalid quantity",
      });
    }

    food.requests.push({
      userId,
      userName,
      requestedQuantity,
    });

    food.remainingQuantity -=
      requestedQuantity;

    if (food.remainingQuantity <= 0) {
      food.status = "unavailable";
    }
    

    await food.save();

    res.status(200).json(food);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


// 🟢 AUTO EXPIRE CHECK (simple version)
router.put("/check-expiry/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    if (new Date(food.expiryTime) < new Date()) {
      food.status = "expired";

      food.requests.forEach((request) => {
        if (request.status === "requested") {
          request.status = "expired";
        }
      });

      await food.save();
    }

    res.json(food);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


module.exports = router;

