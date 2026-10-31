const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Admin token required.",
      });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "lpu_hostel_week9_secure_jwt_secret_key_2026";

    const decoded = jwt.verify(token, secret);

    if ((decoded.role !== "admin" && decoded.role !== "warden") || !decoded.adminId) {
      return res.status(403).json({
        success: false,
        message: "Admin or Warden access only.",
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token.",
    });
  }
};

module.exports = adminMiddleware;
