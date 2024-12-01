const express = require("express");
const mongodb = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

// Debug logs
console.log("MongoDB URI:", process.env.MONGO_URI);
const port = process.env.PORT || 8080; // Default port
console.log("PORT is set to:", port); // Debug log
console.log("Environment Variables:", process.env); // Debug log

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.send("Fullstackcw Page");
});

// Import routes
const lessonsRoutes = require("./routes/lessons");
const ordersRoutes = require("./routes/orders");

// MongoDB Connection
MongoClient.connect(process.env.MONGO_URI)
  .then((client) => {
    console.log("Connected to MongoDB");
    const db = client.db(); // Save database connection
    app.locals.db = db;

    // Use routes 
    app.use("/api/lessons", lessonsRoutes);
    app.use("/api/orders", ordersRoutes);

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
