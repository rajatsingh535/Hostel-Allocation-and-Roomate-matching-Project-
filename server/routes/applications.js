const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Application = require("../models/Application");
const Student = require("../models/Student");
const Hostel = require("../models/Hostel");
const Room = require("../models/Room");
const Bed = require("../models/Bed");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Helper function to allocate a single application
async function allocateSingleApplication(application) {
  const preferences = [...(application.preferences || [])].sort((a, b) => a.priority - b.priority);

  for (const pref of preferences) {
    const hostelQuery = pref.hostelId
      ? { _id: pref.hostelId }
      : pref.hostelCode
      ? { code: pref.hostelCode.toUpperCase() }
      : pref.hostelName
      ? { name: pref.hostelName }
      : null;

    if (!hostelQuery) continue;

    const hostel = await Hostel.findOne(hostelQuery);
    if (!hostel) continue;
    if (hostel.genderAllowed !== "Co-ed" && hostel.genderAllowed !== application.gender) continue;

    const roomQuery = {
      hostelId: hostel._id,
      availableBeds: { $gt: 0 },
    };
    if (pref.roomType) roomQuery.roomType = pref.roomType;
    if (pref.acPreference && pref.acPreference !== "Either") roomQuery.acType = pref.acPreference;
    if (application.specialAccommodations && /ground|mobility|wheelchair|accessible/i.test(application.specialAccommodations)) {
      roomQuery.isPwDAccessible = true;
    }

    const rooms = await Room.find(roomQuery).sort({ floor: 1, roomNumber: 1 });

    for (const room of rooms) {
      const lockedRoom = await Room.findOneAndUpdate(
        {
          _id: room._id,
          availableBeds: { $gt: 0 },
          $or: [{ occupancyGender: null }, { occupancyGender: application.gender }],
        },
        { $set: { occupancyGender: application.gender } },
        { new: true }
      );
      if (!lockedRoom) continue;

      const bed = await Bed.findOneAndUpdate(
        { roomId: room._id, isOccupied: false },
        {
          $set: {
            isOccupied: true,
            occupiedBy: {
              rollNumber: application.studentRollNumber,
              name: application.studentName,
              department: application.department,
              gender: application.gender,
            },
          },
        },
        { new: true, sort: { bedNumber: 1 } }
      );

      if (!bed) {
        const remainingOccupied = await Bed.countDocuments({ roomId: room._id, isOccupied: true });
        if (remainingOccupied === 0) {
          await Room.updateOne({ _id: room._id }, { $set: { occupancyGender: null } });
        }
        continue;
      }

      await Room.updateOne({ _id: room._id }, { $inc: { availableBeds: -1 } });
      await Hostel.updateOne({ _id: hostel._id }, { $inc: { availableCapacity: -1 } });

      application.status = "ALLOCATED";
      application.assignedHostelId = hostel._id;
      application.assignedHostelName = hostel.name;
      application.assignedRoomId = room._id;
      application.assignedRoomNumber = room.roomNumber;
      application.assignedBedNumber = String(bed.bedNumber);
      application.allocatedAt = new Date();
      await application.save();

      return {
        success: true,
        allocated: true,
        hostel: hostel.name,
        roomNumber: room.roomNumber,
        bedNumber: String(bed.bedNumber),
      };
    }
  }

  return { success: false, message: "No vacant bed found matching student preferences." };
}

// GET /api/applications/my  — fetch logged-in student's applications
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const rollNumber = (req.user.rollNumber || "").toUpperCase();
    const applications = await Application.find({ studentRollNumber: rollNumber })
      .sort({ submittedAt: -1 })
      .lean();

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (err) {
    console.error("[API:Applications] Error fetching student applications:", err);
    res.status(500).json({ success: false, message: "Error fetching student applications." });
  }
});

// GET /api/applications  — list all applications (Admin only)
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

// GET /api/applications/:id  — details of a single application
router.get("/:id", async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).lean();
    if (!app) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching application." });
  }
});

// POST /api/applications  — submit application (Student)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const normalizedRoll = req.user.rollNumber.trim().toUpperCase();

    // Fetch trusted student details from the database
    let student = await Student.findOne({ rollNumber: normalizedRoll });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found. Please complete your registration first.",
      });
    }

    const { preferences, specialAccommodations } = req.body;

    if (!Array.isArray(preferences) || preferences.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one hostel preference must be provided.",
      });
    }

    const validRoomTypes = ["Single", "Double", "Triple", "Quad"];
    const validAcPreferences = ["AC", "Non-AC", "Either"];
    const normalizedPreferences = [];

    for (let i = 0; i < preferences.length; i++) {
      const p = preferences[i];
      if (!p || typeof p !== "object") {
        return res.status(400).json({
          success: false,
          message: `Invalid hostel preference at position ${i + 1}.`,
        });
      }

      const roomType = p.roomType || "Quad";
      const acPreference = p.acPreference || p.acType || "Either";

      if (!validRoomTypes.includes(roomType) || !validAcPreferences.includes(acPreference)) {
        return res.status(400).json({
          success: false,
          message: `Invalid room type (${roomType}) or AC preference (${acPreference}) at position ${i + 1}.`,
        });
      }

      let hostel = null;
      if (p.hostelId && mongoose.Types.ObjectId.isValid(p.hostelId)) {
        hostel = await Hostel.findById(p.hostelId);
      } else if (p.hostelCode) {
        hostel = await Hostel.findOne({ code: p.hostelCode.toUpperCase() });
      } else if (p.hostelName) {
        hostel = await Hostel.findOne({ name: p.hostelName });
      }

      if (!hostel) {
        return res.status(400).json({
          success: false,
          message: `Selected hostel does not exist at preference #${i + 1}.`,
        });
      }

      // Gender rule enforcement
      if (hostel.genderAllowed !== "Co-ed" && hostel.genderAllowed !== student.gender) {
        return res.status(400).json({
          success: false,
          message: `Selected hostel (${hostel.name}) is restricted to ${hostel.genderAllowed} students. Your profile gender is ${student.gender}.`,
        });
      }

      normalizedPreferences.push({
        hostelId: hostel._id,
        hostelCode: hostel.code,
        hostelName: hostel.name,
        roomType,
        acPreference,
        priority: i + 1,
      });
    }

    // Negative test check: Prevent duplicate active applications
    const existingApplication = await Application.findOne({
      studentRollNumber: normalizedRoll,
      status: { $ne: "REJECTED" },
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: `An active application (${existingApplication.applicationId}) already exists for roll number ${normalizedRoll}.`,
        data: { applicationId: existingApplication.applicationId, status: existingApplication.status },
      });
    }

    const applicationId = `APP-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;

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
      submittedAt: new Date(),
    });

    console.log(`[API:Applications] Created application ${applicationId} for ${normalizedRoll}`);

    res.status(201).json({
      success: true,
      message: "Hostel allocation application successfully submitted and persisted!",
      data: newApp,
    });
  } catch (err) {
    console.error("[API:Applications] Submission error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to submit application: " + err.message,
    });
  }
});

// PATCH /api/applications/:id/status  — update application workflow status (Admin only)
router.patch("/:id/status", adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "ALLOCATED", "REJECTED"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    if (status === "ALLOCATED") {
      // Trigger live allocation for this application
      const allocationResult = await allocateSingleApplication(application);
      if (!allocationResult.success) {
        return res.status(400).json({
          success: false,
          message: allocationResult.message || "Failed to allocate bed.",
        });
      }
      return res.json({
        success: true,
        message: `Application successfully allocated to ${allocationResult.hostel}, Room ${allocationResult.roomNumber}, Bed ${allocationResult.bedNumber}`,
        data: application,
      });
    }

    application.status = status;
    await application.save();

    res.json({
      success: true,
      message: `Application status transitioned to ${status}`,
      data: application,
    });
  } catch (err) {
    console.error("[API:Applications] Status update error:", err);
    res.status(500).json({ success: false, message: "Error updating status: " + err.message });
  }
});

// DELETE /api/applications/:id  — cancel / delete application
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    // If student, can only delete their own application
    if (req.user.role !== "admin" && app.studentRollNumber !== req.user.rollNumber) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this application." });
    }

    if (app.status === "ALLOCATED") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel an already allocated application. Please contact hostel admin.",
      });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Application successfully withdrawn." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting application." });
  }
});

module.exports = router;
