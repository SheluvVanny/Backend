const express = require("express");
const mongodb = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
console.log("MongoDB URI:", process.env.MONGO_URI);

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
const lessonsRoutes = require("./routes/lessons");
const ordersRoutes = require("./routes/orders");

// Use routes
app.use("/api/lessons", lessonsRoutes);
app.use("/api/orders", ordersRoutes);

// MongoDB Connection
const MongoClient = mongodb.MongoClient;
let db;

MongoClient.connect(process.env.MONGO_URI, )
  .then((client) => {
    console.log("Connected to MongoDB");
    db = client.db(); // Connect to the database from the URI
    app.locals.db = db;
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
