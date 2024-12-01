const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");


// Get all lessons
router.get("/", async (req, res) => {
  const db = req.app.locals.db; // Access the shared database connection
  if (!db) {
    console.error("Database connection is not available.");
    return res.status(500).send("Database connection error");
  }

  try {
    const lessons = await db.collection("lessons").find({}).toArray();
    console.log("Fetched lessons from DB:", lessons); // Debugging log
    res.json(lessons);
  } catch (err) {
    console.error("Error fetching lessons:", err);
    res.status(500).send("Error fetching lessons");
  }
});

// Add a new lesson
router.post("/", async (req, res) => {
    console.log("POST Request Received"); // Log the request type
    console.log("Request Body:", req.body); // Log the incoming request body

    const db = req.app.locals.db; // Access the shared database connection
    if (!db) {
        console.error("Database connection is not available."); // Log the error
        return res.status(500).json({ error: "Database connection error" });
    }

    const newLesson = req.body;

    // Validate the incoming data
    if (!newLesson.subject || !newLesson.location || !newLesson.price || !newLesson.availability || !newLesson.image) {
        console.error("Validation Error: Missing Fields"); // Log the error
        return res
            .status(400)
            .json({ error: "All fields (subject, location, price, availability, image) are required." });
    }

    try {
        // Insert the lesson
        const result = await db.collection("lessons").insertOne(newLesson);
        console.log("Insert Result:", result); // Log the result of insertion

        // Directly use the result for confirmation
        const insertedLesson = { _id: result.insertedId, ...newLesson };

        console.log("Inserted Lesson:", insertedLesson); // Log the newly created lesson
        res.status(201).json({ message: "Lesson added successfully", lesson: insertedLesson });
    } catch (err) {
        // Log errors during insertion
        console.error("Error Adding Lesson:", err);
        res.status(500).json({ error: "Failed to add lesson" });
    }
});


// Update a lesson
router.put("/:id", async (req, res) => {
  const db = req.app.locals.db; // Use the shared database connection
  if (!db) {
    console.error("Database connection is not available.");
    return res.status(500).send("Database connection error");
  }

  const lessonId = req.params.id; // Extract the lesson ID from the URL
  const updateData = req.body; // Extract the update data from the request body

  try {
    const result = await db.collection("lessons").updateOne(
      { _id: new ObjectId(lessonId) }, // Ensure proper ObjectId conversion
      { $set: updateData } // Update the specified fields
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.json({ message: "Lesson updated successfully" });
  } catch (err) {
    console.error("Error updating lesson:", err); // Log the error for debugging
    res.status(400).json({ error: "Failed to update lesson" });
  }
});

module.exports = router;
