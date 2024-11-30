const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");


// Get all lessons
router.get("/", async (req, res) => {
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
  const db = req.app.locals.db; // Access the shared database connection
  const newLesson = req.body; // Extract the new lesson data from the request body

  // Check request body
  if (!newLesson.subject || !newLesson.location || !newLesson.price || !newLesson.availability || !newLesson.image) {
    return res.status(400).json({ error: "All fields (subject, location, price, availability, image) are required." });
  }

  console.log("Adding new lesson:", newLesson); // Debugging log

  try {
    const result = await db.collection("lessons").insertOne(newLesson); // Insert the new lesson

    console.log("Insert result:", result); // Debugging log
    // Fetch the new lesson
    const insertedLesson = await db.collection("lessons").findOne({ _id: result.insertedId });

    res.status(201).json({ message: "Lesson added successfully", lesson: insertedLesson });
  } catch (err) {
    console.error("Error adding lesson:", err); // Log errors for debugging
    res.status(500).json({ error: "Failed to add lesson" });
  }
});


// Update a lesson
router.put("/:id", async (req, res) => {
  const db = req.app.locals.db; // Use the shared database connection
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
