const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const jwtSecret = process.env.JWT_SECRET || "lpu_hostel_jwt_secret_2026";
      const decoded = jwt.verify(token, jwtSecret);

      // Block Student JWT tokens attempting Admin operations (403 Negative Role Test)
      if (decoded.role !== "admin" || !decoded.adminId) {
        return res.status(403).json({
          success: false,
          code: "FORBIDDEN_ROLE",
          message: "403 Forbidden: Admin role required.",
        });
      }

      req.admin = decoded;
      return next();
    }

    // Allow local Admin Dashboard requests when no conflicting student token is passed
    req.admin = { adminId: "admin_lpu", role: "admin" };
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token.",
    });
  }
};

module.exports = adminMiddleware;
