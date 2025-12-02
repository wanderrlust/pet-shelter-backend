const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "secret";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. Token missing." });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token." });
    }

    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
}

module.exports = { authenticateToken, isAdmin };
