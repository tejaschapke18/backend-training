const jwt = require("jsonwebtoken");

const secretKey =
  "b44fd2de00412db5ebc7350536b59e86731142f100deef1d486972b9c22e6b11";

const authenticate = (req, res, next) => {
  const token = req.headers.auth;

  if (!token) {
    return res
      .status(401)
      .json({ error: "Authentication failed. Token is missing." });
  }

  if (!token.startsWith("")) {
    return res
      .status(401)
      .json({ error: "Authentication failed. Invalid token format." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Authentication failed. Invalid token." });
  }
};

module.exports = authenticate;
