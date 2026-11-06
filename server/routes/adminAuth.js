const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");

const router = express.Router();

// ADMIN REGISTRATION
router.post("/register", async (req, res) => {
  try {
    const registrationSecret = req.headers["x-admin-registration-secret"];

    if (!process.env.ADMIN_REGISTRATION_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Admin registration is not configured",
      });
    }

    if (registrationSecret !== process.env.ADMIN_REGISTRATION_SECRET) {
      return res.status(403).json({
        success: false,
        message: "Invalid admin registration secret",
      });
    }

    const { email, adminId, password } = req.body;
    const identifier = (adminId || email || "").trim().toLowerCase();

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Administrator ID and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const existingAdmin = await Admin.findOne({ email: identifier });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin account already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await Admin.create({
      email: identifier,
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
    const identifier = (req.body.adminId || req.body.email || "").trim().toLowerCase();
    const { password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        code: "MISSING_FIELDS",
        error: "400 Bad Request — Missing Credentials",
        message: "Administrator ID and password are required.",
      });
    }

    const admin = await Admin.findOne({
      email: identifier,
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        code: "UNREGISTERED_ADMIN",
        error: "401 Unauthorized — Unregistered Administrator",
        message: `Unauthorized Access: Administrator ID '${identifier}' is not registered in the LPU Warden & Admin Directory.`,
      });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        code: "INVALID_ADMIN_PASSWORD",
        error: "401 Unauthorized — Wrong Admin Password",
        message: `Unauthorized Access: Invalid password entered for Administrator '${identifier}'. Access to Warden Panel denied.`,
      });
    }

    const jwtSecret = process.env.JWT_SECRET || "lpu_hostel_jwt_secret_2026";

    const token = jwt.sign(
      {
        adminId: admin._id,
        email: admin.email,
        role: admin.role,
      },
      jwtSecret,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        adminId: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      code: "SERVER_ERROR",
      error: "500 Internal Server Error",
      message: "Admin login failed",
    });
  }
});

module.exports = router;
