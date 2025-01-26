const jwt = require("jsonwebtoken");

const createToken = (payload, expiresIn = 60 * 60) => {
  try {
    return jwt.sign(payload, process.env.KEY, { expiresIn });
  } catch (error) {
    console.log(error);

    throw new Error("Token creation failed: " + error.message);
  }
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.KEY);
  } catch (error) {
    console.log(error);
    throw new Error("Token verification failed: " + error.message);
  }
  // return null;
};

function extractMobileFromToken(req, res, next) {
  const token = req.headers.authorization; // Assuming the token is included in the Authorization header

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.KEY); // Replace with your actual secret key
      req.loggedInUserMobile = decoded.mobile; // Assuming mobile number is part of the token payload
    } catch (err) {
      console.error("Error decoding token:", err);
    }
  }

  next();
}

module.exports = { createToken, verifyToken, extractMobileFromToken };
