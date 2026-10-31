const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Student = require("../models/Student");
router.use("/:rollNumber", authMiddleware);
const allowedPreferences = {
  sleepSchedule: ["Early Bird", "Night Owl", "Flexible"],
  foodPreference: ["Vegetarian", "Non-Vegetarian", "Eggetarian", "Flexible"],
  cleanliness: ["Very Clean", "Moderate", "Relaxed"],
  studyHabits: ["Quiet", "Group Study", "Flexible"],
  socialHabits: ["Introvert", "Extrovert", "Ambivert"],
  noiseTolerance: ["Low", "Moderate", "High"]
};

// GET student roommate preferences
router.get("/:rollNumber/preferences", async (req, res) => {
  try {
    const student = await Student.findOne({
      rollNumber: req.params.rollNumber
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.json({
      success: true,
      data: student.roommatePreferences || {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// UPDATE student roommate preferences
router.put("/:rollNumber/preferences", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one preference"
      });
    }

    for (const [field, value] of Object.entries(req.body)) {
      if (!allowedPreferences[field] || !allowedPreferences[field].includes(value)) {
        return res.status(400).json({
          success: false,
          message: `Invalid value for ${field}`
        });
      }
    }

    const student = await Student.findOne({
      rollNumber: req.params.rollNumber
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    student.roommatePreferences = {
      ...student.roommatePreferences?.toObject?.(),
      ...req.body
    };

    await student.save();

    res.json({
      success: true,
      message: "Roommate preferences updated successfully",
      data: student.roommatePreferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// GET student profile
router.get("/:rollNumber", async (req, res) => {
  try {
    const student = await Student.findOne({
      rollNumber: req.params.rollNumber
    }).select("-roommatePreferences");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// UPDATE student profile
router.put("/:rollNumber", async (req, res) => {
  try {
    const allowedFields = [
    "name",
    "email",
    "department",
    "category"
];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid profile fields provided"
      });
    }

    const student = await Student.findOneAndUpdate(
      { rollNumber: req.params.rollNumber },
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-roommatePreferences");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.json({
      success: true,
      message: "Student profile updated successfully",
      data: student
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


module.exports = router;
