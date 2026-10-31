const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Authentication token required.",
      });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "lpu_hostel_week9_secure_jwt_secret_key_2026";

    const decoded = jwt.verify(token, secret);
    req.user = decoded;

    // Students can access only their own records
    if (
      req.params.rollNumber &&
      req.params.rollNumber.toUpperCase() !== (req.user.rollNumber || "").toUpperCase()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this student's data.",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authMiddleware;
