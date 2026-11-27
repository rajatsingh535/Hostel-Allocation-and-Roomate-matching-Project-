const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Application = require("../models/Application");
const Student = require("../models/Student");
const Hostel = require("../models/Hostel");
const Room = require("../models/Room");
const Bed = require("../models/Bed");
const authMiddleware = require("../middleware/authMiddleware");

const JWT_SECRET = process.env.JWT_SECRET || "lpu_hostel_jwt_secret_2026";

// GET /api/applications
// Rejects student tokens with 403 Forbidden (Negative Access Test), allows Admin token or dashboard read
router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== "admin" || !decoded.adminId) {
          return res.status(403).json({
            success: false,
            code: "FORBIDDEN_ROLE",
            message: "403 Forbidden: Student role is not authorized to access Admin application records.",
          });
        }
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired authorization token.",
        });
      }
    }

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

// GET /api/applications/my - Authenticated student's own applications
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const roll = req.user.rollNumber;
    const apps = await Application.find({ studentRollNumber: roll }).sort({ submittedAt: -1 }).lean();
    res.json({
      success: true,
      count: apps.length,
      data: apps,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching student applications." });
  }
});

// POST /api/applications - Create new hostel application
router.post("/", async (req, res) => {
  try {
    let rollFromToken = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const decoded = jwt.verify(authHeader.split(" ")[1], JWT_SECRET);
        rollFromToken = decoded.rollNumber;
      } catch (_) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token.",
        });
      }
    }

    const rawRoll = rollFromToken || req.body.studentRollNumber;
    if (!rawRoll) {
      return res.status(400).json({
        success: false,
        message: "Student Registration Number (rollNumber) is required.",
      });
    }

    const normalizedRoll = String(rawRoll).trim().toUpperCase();

    let student = await Student.findOne({ rollNumber: normalizedRoll });
    if (!student && req.body.studentName && req.body.gender) {
      student = await Student.create({
        rollNumber: normalizedRoll,
        name: req.body.studentName,
        email: req.body.studentEmail || `${normalizedRoll}@student.lpu.co.in`,
        department: req.body.department || "Computer Science",
        year: Number(req.body.year) || 2,
        gender: req.body.gender,
        cgpa: Number(req.body.cgpa) || 8.0,
      });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found. Please use a registered UMS ID.",
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

      const acPreference = p.acPreference || p.acType || "Either";
      const roomType = p.roomType || "Quad";

      if (!validRoomTypes.includes(roomType) || !validAcPreferences.includes(acPreference)) {
        return res.status(400).json({
          success: false,
          message: `Invalid room type or AC preference at position ${i + 1}.`,
        });
      }

      let hostel = null;
      if (p.hostelId && mongoose.Types.ObjectId.isValid(p.hostelId)) {
        hostel = await Hostel.findById(p.hostelId);
      }
      if (!hostel && p.hostelCode) {
        const cleanCode = p.hostelCode.replace(/^([A-Z]{2})(\d+)$/i, "$1-$2").toUpperCase();
        hostel = await Hostel.findOne({
          $or: [{ code: p.hostelCode }, { code: cleanCode }],
        });
      }

      if (!hostel) {
        return res.status(400).json({
          success: false,
          message: `Selected hostel does not exist at position ${i + 1}.`,
        });
      }

      if (hostel.genderAllowed !== "Co-ed" && hostel.genderAllowed !== student.gender) {
        return res.status(400).json({
          success: false,
          message: `Gender Policy Violation: ${hostel.name} (${hostel.code}) is for ${hostel.genderAllowed} students only, and ${student.name} is registered as ${student.gender}.`,
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

    // Prevent duplicate active applications
    const existingApplication = await Application.findOne({
      studentRollNumber: normalizedRoll,
      status: { $ne: "REJECTED" },
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "An active application already exists for this roll number.",
        data: { applicationId: existingApplication.applicationId },
      });
    }

    const applicationId = `APP-${new Date().getFullYear()}-${Date.now()
      .toString()
      .slice(-6)}${Math.floor(Math.random() * 10)}`;

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
      message: "Hostel application successfully submitted!",
      data: newApp,
    });
  } catch (err) {
    console.error("[API:Applications] Submission error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to submit application.",
    });
  }
});

// PATCH /api/applications/:id/status - Update status or allocate room/bed
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "ALLOCATED", "REJECTED"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const appDoc = await Application.findById(req.params.id);
    if (!appDoc) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    if (status === "ALLOCATED" && appDoc.status !== "ALLOCATED") {
      const pref = (appDoc.preferences && appDoc.preferences[0]) || {};
      let hostel = null;
      if (pref.hostelId) hostel = await Hostel.findById(pref.hostelId);
      if (!hostel && pref.hostelCode) hostel = await Hostel.findOne({ code: pref.hostelCode });
      if (!hostel) hostel = await Hostel.findOne({ genderAllowed: appDoc.gender });

      if (hostel) {
        const room = await Room.findOne({ hostelId: hostel._id, availableBeds: { $gt: 0 } }).sort({
          floor: 1,
          roomNumber: 1,
        });
        if (room) {
          const bed = await Bed.findOne({ roomId: room._id, isOccupied: false }).sort({
            bedNumber: 1,
          });
          if (bed) {
            bed.isOccupied = true;
            bed.occupiedBy = {
              rollNumber: appDoc.studentRollNumber,
              name: appDoc.studentName,
              allocatedAt: new Date(),
            };
            await bed.save();
            await Room.findByIdAndUpdate(room._id, { $inc: { availableBeds: -1 } });
            await Hostel.findByIdAndUpdate(hostel._id, { $inc: { availableCapacity: -1 } });

            appDoc.assignedHostelId = hostel._id;
            appDoc.assignedHostelName = hostel.name;
            appDoc.assignedRoomId = room._id;
            appDoc.assignedRoomNumber = room.roomNumber;
            appDoc.assignedBedNumber = bed.bedNumber;
            appDoc.allocatedAt = new Date();
          }
        }
      }
    }

    appDoc.status = status;
    await appDoc.save();

    res.json({
      success: true,
      message: `Status updated to ${status}`,
      data: appDoc,
    });
  } catch (err) {
    console.error("[API:Applications] Status update error:", err);
    res.status(500).json({ success: false, message: "Error updating status." });
  }
});

// GET /api/applications/:id/allotment-pass — Week 13 Official Digital Hostel Allotment Letter & QR Pass
router.get("/:id/allotment-pass", async (req, res) => {
  try {
    const paramId = req.params.id;
    let appDoc = null;
    if (mongoose.Types.ObjectId.isValid(paramId)) {
      appDoc = await Application.findById(paramId).lean();
    }
    if (!appDoc) {
      appDoc = await Application.findOne({
        $or: [{ applicationId: paramId }, { studentRollNumber: paramId }],
      })
        .sort({ submittedAt: -1 })
        .lean();
    }

    if (!appDoc) {
      return res.status(404).json({
        success: false,
        message: "Application record not found for Allotment Pass generation.",
      });
    }

    const pref = (appDoc.preferences && appDoc.preferences[0]) || {};
    const hostelCode = pref.hostelCode || (appDoc.gender === "Female" ? "GH-1" : "BH-1");
    const hostelName = appDoc.assignedHostelName || pref.hostelName || (appDoc.gender === "Female" ? "Girls Hostel 1" : "Boys Hostel 1");
    const roomNumber = appDoc.assignedRoomNumber || "101";
    const bedNumber = appDoc.assignedBedNumber || 1;
    const roomType = pref.roomType || "Double";
    const acPreference = pref.acPreference || "AC";

    const feeMap = {
      Single: acPreference === "AC" ? 135000 : 105000,
      Double: acPreference === "AC" ? 95000 : 75000,
      Triple: acPreference === "AC" ? 82000 : 64000,
      Quad: acPreference === "AC" ? 72000 : 56000,
    };
    const hostelAnnualFee = feeMap[roomType] || 95000;
    const messFee = 42000;
    const securityDeposit = 5000;

    const crypto = require("crypto");
    const verificationToken =
      "LPU-QR-2026-" +
      crypto
        .createHash("sha256")
        .update(`${appDoc.applicationId}:${appDoc.studentRollNumber}:${hostelCode}:${roomNumber}`)
        .digest("hex")
        .slice(0, 12)
        .toUpperCase();

    res.json({
      success: true,
      data: {
        passNumber: `LPU-PASS-${appDoc.applicationId}`,
        verificationToken,
        qrPayload: JSON.stringify({
          pass: `LPU-PASS-${appDoc.applicationId}`,
          roll: appDoc.studentRollNumber,
          name: appDoc.studentName,
          hostel: hostelCode,
          room: roomNumber,
          bed: bedNumber,
          status: appDoc.status,
          token: verificationToken,
        }),
        university: "Lovely Professional University, Phagwara, Punjab",
        session: "Academic Session 2026-27",
        student: {
          name: appDoc.studentName,
          rollNumber: appDoc.studentRollNumber,
          email: appDoc.studentEmail,
          gender: appDoc.gender,
          department: appDoc.department,
          year: appDoc.year,
          cgpa: appDoc.cgpa,
        },
        allotment: {
          applicationId: appDoc.applicationId,
          status: appDoc.status,
          hostelCode,
          hostelName,
          roomNumber,
          bedNumber: `Bed #${bedNumber}`,
          roomType: `${acPreference} ${roomType} Seater`,
          allocatedAt: appDoc.allocatedAt || appDoc.submittedAt || new Date().toISOString(),
        },
        feeReceipt: {
          receiptNumber: `LPU-FEE-${String(appDoc.studentRollNumber).slice(-4)}-2026`,
          hostelAnnualFee,
          messFee,
          securityDeposit,
          totalPayable: hostelAnnualFee + messFee + securityDeposit,
          paymentStatus: appDoc.status === "ALLOCATED" ? "VERIFIED & ALLOTTED" : "PROVISIONAL",
        },
        issuedBy: "Office of the Chief Warden, Division of Residential Services, LPU",
        issuedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("[API:Applications:AllotmentPass] Error:", err);
    res.status(500).json({ success: false, message: "Error generating allotment pass." });
  }
});

module.exports = router;
