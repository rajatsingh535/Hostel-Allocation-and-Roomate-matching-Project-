const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");

const router = express.Router();

// ADMIN REGISTRATION
router.post("/register", async (req, res) => {
  try {
    const registrationSecret =
      req.headers["x-admin-registration-secret"];

    if (!process.env.ADMIN_REGISTRATION_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Admin registration is not configured",
      });
    }

    if (
      registrationSecret !== process.env.ADMIN_REGISTRATION_SECRET
    ) {
      return res.status(403).json({
        success: false,
        message: "Invalid admin registration secret",
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const existingAdmin = await Admin.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin account already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await Admin.create({
      email: email.trim().toLowerCase(),
      passwordHash,
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Admin registration failed",
    });
  }
});

// ADMIN LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
      {
        adminId: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Admin login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Admin login failed",
    });
  }
});

module.exports = router;
