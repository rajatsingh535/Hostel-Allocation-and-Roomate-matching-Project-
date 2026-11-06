const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Student = require("../models/Student");
const Auth = require("../models/Auth");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { rollNumber, password, name, email, department, gender, year, cgpa } = req.body;

    if (!rollNumber || !password) {
      return res.status(400).json({
        success: false,
        code: "MISSING_FIELDS",
        error: "400 Bad Request",
        message: "Registration Number (UMS ID) and password are required.",
      });
    }

    const cleanRoll = String(rollNumber).trim();

    if (!/^\d{8}$/.test(cleanRoll)) {
      return res.status(400).json({
        success: false,
        code: "INVALID_FORMAT",
        error: "400 Bad Request — Invalid UMS ID Format",
        message: "Registration Number (UMS ID) must be an 8-digit number (e.g., 12304567).",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        code: "WEAK_PASSWORD",
        error: "400 Bad Request — Weak Password",
        message: "Password must be at least 8 characters long.",
      });
    }

    let student = await Student.findOne({ rollNumber: cleanRoll });

    if (!student) {
      if (!name || !gender) {
        return res.status(404).json({
          success: false,
          code: "STUDENT_NOT_FOUND",
          error: "404 Not Found — Unregistered UMS ID",
          message: `Student with UMS ID '${cleanRoll}' was not found in the university records.`,
        });
      }
      student = await Student.create({
        rollNumber: cleanRoll,
        name: name.trim(),
        email: email || `${cleanRoll}@student.lpu.co.in`,
        department: department || "Computer Science",
        gender: gender,
        year: Number(year) || 2,
        cgpa: Number(cgpa) || 8.0,
      });
    }

    const existingUser = await Auth.findOne({ rollNumber: cleanRoll });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        code: "ALREADY_REGISTERED",
        error: "409 Conflict — Account Exists",
        message: `Account for UMS ID '${cleanRoll}' already exists. Please sign in.`,
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await Auth.create({ rollNumber: cleanRoll, passwordHash });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      student: {
        rollNumber: student.rollNumber,
        name: student.name,
        gender: student.gender,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      code: "SERVER_ERROR",
      message: error.message,
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { rollNumber, password, gender } = req.body;

    if (!rollNumber || !password) {
      return res.status(400).json({
        success: false,
        code: "MISSING_FIELDS",
        error: "400 Bad Request — Missing Credentials",
        message: "Registration Number (UMS ID) and password are required.",
      });
    }

    const cleanRoll = String(rollNumber).trim();

    if (!/^\d{8}$/.test(cleanRoll)) {
      return res.status(400).json({
        success: false,
        code: "INVALID_FORMAT",
        error: "400 Bad Request — Invalid UMS ID Format",
        message: `Invalid Registration Number '${cleanRoll}'. LPU UMS ID must be an 8-digit number (e.g., 12304567).`,
      });
    }

    const student = await Student.findOne({ rollNumber: cleanRoll });
    const user = await Auth.findOne({ rollNumber: cleanRoll });

    if (!student || !user) {
      return res.status(401).json({
        success: false,
        code: "UNREGISTERED_STUDENT",
        error: "401 Unauthorized — Unregistered Student",
        message: `Unauthorized Access: Registration Number '${cleanRoll}' is not registered in the LPU UMS Hostel Portal.`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        code: "INVALID_PASSWORD",
        error: "401 Unauthorized — Wrong Password",
        message: `Unauthorized Access: Incorrect password entered for Registration Number '${cleanRoll}'.`,
      });
    }

    if (gender && student.gender && gender !== student.gender) {
      return res.status(403).json({
        success: false,
        code: "GENDER_MISMATCH",
        error: "403 Unauthorized — Gender Policy Mismatch",
        message: `Unauthorized Selection: UMS ID '${cleanRoll}' (${student.name}) is registered as a ${student.gender} student. Please select '${student.gender}' to continue.`,
      });
    }

    const jwtSecret = process.env.JWT_SECRET || "lpu_hostel_jwt_secret_2026";

    const token = jwt.sign(
      { rollNumber: user.rollNumber, gender: student.gender, name: student.name },
      jwtSecret,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      student: {
        rollNumber: student.rollNumber,
        name: student.name,
        email: student.email,
        gender: student.gender,
        department: student.department,
        year: student.year,
        cgpa: student.cgpa,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      code: "SERVER_ERROR",
      error: "500 Internal Server Error",
      message: error.message,
    });
  }
});

module.exports = router;
