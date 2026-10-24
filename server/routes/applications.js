const express = require("express");
const router = express.Router();
const Application = require("../models/Application");

router.get("/", async (req, res) => {
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

router.post("/", async (req, res) => {
  try {
    const {
      studentRollNumber,
      studentName,
      studentEmail,
      department,
      year,
      gender,
      cgpa,
      preferences,
      specialAccommodations,
    } = req.body;

    if (!studentRollNumber || !studentName || !studentEmail || !department) {
      return res.status(400).json({
        success: false,
        message: "Missing required student details (Roll Number, Name, Email, Department).",
      });
    }

    if (!preferences || !Array.isArray(preferences) || preferences.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one hostel preference must be provided.",
      });
    }

    const normalizedPreferences = preferences.map((p, idx) => ({
      hostelId: p.hostelId || null,
      hostelCode: p.hostelCode || "",
      hostelName: p.hostelName || p.hostelCode || "Hostel",
      roomType: p.roomType || "Double",
      acPreference: p.acPreference || p.acType || "Either",
      priority: Number(p.priority) || idx + 1,
    }));

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const applicationId = `APP-2026-${randomSuffix}`;

    const newApp = await Application.create({
      applicationId,
      studentRollNumber: studentRollNumber.trim().toUpperCase(),
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim().toLowerCase(),
      department,
      year: Number(year) || 1,
      gender: gender || "Other",
      cgpa: Number(cgpa) || 7.5,
      preferences: normalizedPreferences,
      specialAccommodations: specialAccommodations || "",
      status: "SUBMITTED",
      submittedAt: new Date(),
    });

    console.log(`[API:Applications] Created new application ${applicationId} for student ${studentName}`);

    res.status(201).json({
      success: true,
      message: "Hostel application successfully submitted!",
      data: newApp,
    });
  } catch (err) {
    console.error("[API:Applications] Submission error:", err);
    res.status(500).json({ success: false, message: "Failed to submit application: " + err.message });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "ALLOCATED", "REJECTED"];
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
