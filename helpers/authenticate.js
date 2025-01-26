const { verifyToken } = require("./token");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const payload = verifyToken(token);
    req.user = payload; // Set user information in req.user
    next();
  } else {
    res.status(401).send({ message: "Unauthorized", error: "" });
  }
};

module.exports = authenticate;
