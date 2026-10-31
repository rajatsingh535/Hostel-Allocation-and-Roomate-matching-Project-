const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "lpu_hostel_week9_secure_jwt_secret_key_2026";

// ADMIN REGISTRATION
router.post("/register", async (req, res) => {
  try {
    const registrationSecret = req.headers["x-admin-registration-secret"];
    const expectedSecret = process.env.ADMIN_REGISTRATION_SECRET || "lpu_admin_secret_2026";

    if (registrationSecret !== expectedSecret) {
      return res.status(403).json({
        success: false,
        message: "Invalid admin registration secret",
      });
    }

    const { email, password, username, name, role } = req.body;

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

    const normalizedEmail = email.trim().toLowerCase();
    const existingAdmin = await Admin.findOne({ email: normalizedEmail });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin account already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      email: normalizedEmail,
      username: username ? username.trim().toLowerCase() : normalizedEmail.split("@")[0],
      name: name || "Hostel Administrator",
      passwordHash,
      role: role === "warden" ? "warden" : "admin",
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: {
        id: newAdmin._id,
        email: newAdmin.email,
        username: newAdmin.username,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error("[API:AdminAuth] Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Admin registration failed",
    });
  }
});

// ADMIN LOGIN
router.post("/login", async (req, res) => {
  try {
    const rawIdentifier = req.body.email || req.body.adminId || req.body.username || "";
    const password = req.body.password;

    if (!rawIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Admin ID / Email and password are required",
      });
    }

    const identifier = rawIdentifier.trim().toLowerCase();

    const admin = await Admin.findOne({
      $or: [
        { email: identifier },
        { email: `${identifier}@lpu.co.in` },
        { username: identifier },
      ],
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid administrator credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid administrator credentials",
      });
    }

    const token = jwt.sign(
      {
        adminId: admin._id,
        role: admin.role,
        email: admin.email,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Administrator authenticated successfully",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        username: admin.username,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("[API:AdminAuth] Login error:", error);
    res.status(500).json({
      success: false,
      message: "Admin authentication process failed",
    });
  }
});

// GET CURRENT ADMIN SESSION
router.get("/me", adminMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.adminId).select("-passwordHash");
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    res.json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
