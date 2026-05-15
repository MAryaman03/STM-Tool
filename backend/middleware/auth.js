const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "wave_stm_secret_key_2026";

// Middleware: Verify JWT token and attach userId to request
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.userEmail = decoded.email;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Middleware: Admin-only access
const adminMiddleware = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// Helper: Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = { authMiddleware, adminMiddleware, generateToken, JWT_SECRET };
