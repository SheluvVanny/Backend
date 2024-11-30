const express = require("express");
const mongodb = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
console.log("MongoDB URI:", process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to use database connection in routes
app.use(cors());
app.use(express.json());

// Import routes
const lessonsRoutes = require("./routes/lessons");
const ordersRoutes = require("./routes/orders");

// Use routes
app.use("/api/lessons", lessonsRoutes);
app.use("/api/orders", ordersRoutes);

MongoClient.connect(process.env.MONGO_URI)
  .then((client) => {
    console.log("Connected to MongoDB");
    db = client.db(); // Save database connection
    app.locals.db = db;

    const lessonsRoute = require("./routes/lessons");
    app.use("/api/lessons", lessonsRoute);

    const ordersRoute = require("./routes/orders");
    app.use("/api/orders", ordersRoute);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
