const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Student = require("../models/Student");
const Auth = require("../models/Auth");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { rollNumber, password } = req.body;

    if (!rollNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Roll number and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const student = await Student.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const existingUser = await Auth.findOne({ rollNumber });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Account already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await Auth.create({ rollNumber, passwordHash });

    res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { rollNumber, password } = req.body;

    if (!rollNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Roll number and password are required",
      });
    }

    const user = await Auth.findOne({ rollNumber });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid roll number or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid roll number or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
      { rollNumber: user.rollNumber },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;