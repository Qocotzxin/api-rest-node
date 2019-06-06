const jwt = require("jsonwebtoken");

/**
 * Verifies token
 */
const tokenVerify = (req, res, next) => {
  const token = req.get("Authorization"); //Header name to retrieve

  jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
    if (err) return res.status(401).json({ err: { message: "Invalid token" } });
    req.user = decoded.user;
    next();
  });
};

/**
 * Verifies ADMIN role
 */
const adminVerify = (req, res, next) => {
  const { role } = req.user;

  if (role !== "ADMIN") {
    return res.status(401).json({
      err: { message: "You don't have permission to perform this operation" }
    });
  }

  next();
};

/**
 * Verifies token by URL
 */
const tokenImageToken = (req, res, next) => {
  const token = req.query.token;

  jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
    if (err) return res.status(401).json({ err: { message: "Invalid token" } });
    req.user = decoded.user;
    next();
  });
};

module.exports = {
  tokenVerify,
  adminVerify,
  tokenImageToken
};
