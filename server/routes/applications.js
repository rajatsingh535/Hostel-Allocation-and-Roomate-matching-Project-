const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const Student = require("../models/Student");
const Hostel = require("../models/Hostel");
const mongoose = require("mongoose");
router.get("/", adminMiddleware, async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== "ALL") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { studentRollNumber: { $regex: search, $options: "i" } },
        { studentName: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
        { applicationId: { $regex: search, $options: "i" } },
      ];
    }

    const applications = await Application.find(query).sort({ submittedAt: -1 }).lean();

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (err) {
    console.error("[API:Applications] Error fetching applications:", err);
    res.status(500).json({ success: false, message: "Error fetching applications." });
  }
});


router.post("/", authMiddleware, async (req, res) => {
  try {
    const normalizedRoll = req.user.rollNumber.trim().toUpperCase();

    // Fetch trusted student details from the database
    const student = await Student.findOne({
      rollNumber: normalizedRoll
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found. Please complete your profile first."
      });
    }

    const { preferences, specialAccommodations } = req.body;

    if (!Array.isArray(preferences) || preferences.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one hostel preference must be provided."
      });
    }

    // Validate preference fields
    const validRoomTypes = ["Single", "Double", "Triple", "Quad"];
    const validAcPreferences = ["AC", "Non-AC", "Either"];

    const normalizedPreferences = [];

    for (let i = 0; i < preferences.length; i++) {
  const p = preferences[i];

  if (!p || typeof p !== "object") {
    return res.status(400).json({
      success: false,
      message: `Invalid hostel preference at position ${i + 1}.`
    });
  }

  const acPreference = p.acPreference || p.acType || "Either";

  if (
    !validRoomTypes.includes(p.roomType) ||
    !validAcPreferences.includes(acPreference)
  ) {
    return res.status(400).json({
      success: false,
      message: `Invalid room type or AC preference at position ${i + 1}.`
    });
  }

  // Find the hostel using its ID or hostel code
  let hostel;

  if (p.hostelId) {
    if (!mongoose.Types.ObjectId.isValid(p.hostelId)) {
      return res.status(400).json({
        success: false,
        message: `Invalid hostel ID at position ${i + 1}.`
      });
    }

    hostel = await Hostel.findById(p.hostelId);
  } else if (p.hostelCode) {
    hostel = await Hostel.findOne({ code: p.hostelCode });
  }

  if (!hostel) {
    return res.status(400).json({
      success: false,
      message: `Selected hostel does not exist at position ${i + 1}.`
    });
  }

  if (
    hostel.genderAllowed !== "Co-ed" &&
    hostel.genderAllowed !== student.gender
  ) {
    return res.status(400).json({
      success: false,
      message: `Selected hostel is not available for your gender at position ${i + 1}.`
    });
  }

  normalizedPreferences.push({
    hostelId: hostel._id,
    hostelCode: hostel.code,
    hostelName: hostel.name,
    roomType: p.roomType,
    acPreference,
    priority: i + 1
  });
}

    // Prevent duplicate active applications
    const existingApplication = await Application.findOne({
      studentRollNumber: normalizedRoll,
      status: { $ne: "REJECTED" }
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "An active application already exists for this roll number.",
        data: { applicationId: existingApplication.applicationId }
      });
    }

    const applicationId =
      `APP-${new Date().getFullYear()}-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 10)}`;

    const newApp = await Application.create({
      applicationId,
      studentRollNumber: normalizedRoll,
      studentName: student.name,
      studentEmail: student.email,
      department: student.department,
      year: student.year,
      gender: student.gender,
      cgpa: student.cgpa,
      preferences: normalizedPreferences,
      specialAccommodations: specialAccommodations || "",
      status: "SUBMITTED",
      submittedAt: new Date()
    });

    console.log(
      `[API:Applications] Created application ${applicationId} for ${normalizedRoll}`
    );

    res.status(201).json({
      success: true,
      message: "Hostel application successfully submitted!",
      data: newApp
    });

  } catch (err) {
    console.error("[API:Applications] Submission error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to submit application."
    });
  }
});


router.patch("/:id/status",adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "REJECTED"];
    if (status === "ALLOCATED") {
      return res.status(400).json({ success: false, message: "Use POST /api/allocations/run to allocate a real bed." });
    }
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    res.json({ success: true, message: `Status updated to ${status}`, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating status." });
  }
});

module.exports = router;
