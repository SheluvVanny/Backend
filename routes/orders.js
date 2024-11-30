const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

// Place a new order
router.post("/", async (req, res) => {
  const db = req.app.locals.db; // Use the shared database connection
  const newOrder = req.body; // Extract the order data from the request body

  // Check order data
  if (!newOrder.name || !newOrder.phone || !newOrder.items || !Array.isArray(newOrder.items)) {
    return res.status(400).json({ error: "Invalid order data. Name, phone, and items are required." });
  }

  try {
    const result = await db.collection("orders").insertOne(newOrder); // Save the order in MongoDB
    console.log("Order saved:", result.insertedId); // Debugging log
    res.status(201).json({ message: "Order saved successfully", orderId: result.insertedId });
  } catch (err) {
    console.error("Error saving order:", err); // Debugging log
    res.status(500).json({ error: "Failed to save order" });
  }
});

module.exports = router;

