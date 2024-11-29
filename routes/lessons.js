const express = require("express");
const router = express.Router();

// Get all lessons
router.get("/", async (req, res) => {
  const db = req.app.locals.db;
  try {
    const lessons = await db.collection("lessons").find().toArray();
    res.json(lessons); // Directly return lessons from the database
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
});

// Add a new lesson
router.post("/", async (req, res) => {
  const db = req.app.locals.db;
  try {
    const lesson = req.body;
    await db.collection("lessons").insertOne(lesson);
    res.status(201).json({ message: "Lesson added successfully", lesson });
  } catch (err) {
    res.status(400).json({ error: "Failed to add lesson" });
  }
});

// Update a lesson
router.put("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const lessonId = req.params.id;
  const updateData = req.body;

  try {
    const result = await db.collection("lessons").updateOne(
      { _id: new mongodb.ObjectId(lessonId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.json({ message: "Lesson updated successfully" });
  } catch (err) {
    res.status(400).json({ error: "Failed to update lesson" });
  }
});

module.exports = router;
