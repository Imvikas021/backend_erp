const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) return res.status(401).json({ message: "Token missing" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "MY_SECRET_KEY");
    req.user = decoded;  // contains { user_name }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token expired or invalid" });
  }
};