const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Student = require("../models/Student");
const Auth = require("../models/Auth");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "lpu_hostel_week9_secure_jwt_secret_key_2026";

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { rollNumber, password, name, email, department, year, gender, cgpa } = req.body;

    if (!rollNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Registration number and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const normalizedRoll = rollNumber.trim().toUpperCase();

    let student = await Student.findOne({ rollNumber: normalizedRoll });

    // If student doesn't exist yet and registration payload provides details, create student profile
    if (!student) {
      if (!name || !gender) {
        return res.status(400).json({
          success: false,
          message: "Student profile not found. Name and gender are required to register a new student account.",
        });
      }
      student = await Student.create({
        rollNumber: normalizedRoll,
        name: name.trim(),
        email: email ? email.trim().toLowerCase() : `${normalizedRoll.toLowerCase()}@student.lpu.co.in`,
        department: department || "Computer Science",
        year: Number(year) || 1,
        gender: gender,
        cgpa: Number(cgpa) || 8.0,
      });
    }

    const existingAuth = await Auth.findOne({ rollNumber: normalizedRoll });
    if (existingAuth) {
      return res.status(409).json({
        success: false,
        message: "An account already exists for this registration number. Please login.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await Auth.create({ rollNumber: normalizedRoll, passwordHash });

    res.status(201).json({
      success: true,
      message: "Student account successfully created! You can now log in.",
    });
  } catch (error) {
    console.error("[API:Auth] Registration error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const rawRoll = req.body.rollNumber || req.body.regNo || "";
    const password = req.body.password;

    if (!rawRoll || !password) {
      return res.status(400).json({
        success: false,
        message: "Registration / Roll number and password are required",
      });
    }

    const rollNumber = rawRoll.trim().toUpperCase();

    const user = await Auth.findOne({ rollNumber });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid registration number or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid registration number or password",
      });
    }

    const student = await Student.findOne({ rollNumber }).lean();

    const token = jwt.sign(
      {
        rollNumber: user.rollNumber,
        studentId: student?._id,
        role: "student",
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Student logged in successfully",
      token,
      student: student
        ? {
            rollNumber: student.rollNumber,
            name: student.name,
            email: student.email,
            department: student.department,
            year: student.year,
            gender: student.gender,
            cgpa: student.cgpa,
            roommatePreferences: student.roommatePreferences,
          }
        : { rollNumber: user.rollNumber },
    });
  } catch (error) {
    console.error("[API:Auth] Login error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
});

// CURRENT STUDENT PROFILE
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findOne({ rollNumber: req.user.rollNumber });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student record not found" });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
