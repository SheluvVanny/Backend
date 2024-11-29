const express = require("express");
const router = express.Router();

// Place a new order
router.post("/", async (req, res) => {
  const db = req.app.locals.db;
  const order = req.body;

  try {
    await db.collection("orders").insertOne(order);
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(400).json({ error: "Failed to place order" });
  }
});

module.exports = router;
