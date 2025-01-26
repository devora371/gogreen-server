const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/superadmin.model");
const AgentModel = require("../models/agent.model");
const UserCreatedByAgentModel = require("../models/user.model");
const { createToken, verifyToken } = require("../helpers/token");

const authController = {
  async login(req, res) {
    const { mobile, password, role, status } = req.body;

    try {
      let user;

      if (role.toLowerCase() === "super admin") {
        // Super Admin login based on mobile number
        user = await UserModel.findOne({
          mobile: mobile,
        });
      } else if (role.toLowerCase() === "agent") {
        // Agent login based on mobile number
        user = await AgentModel.findOne({ mobile: mobile });
      } else if (role.toLowerCase() === "user") {
        // Agent login based on mobile number
        user = await UserCreatedByAgentModel.findOne({ mobile: mobile });
      }

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // Check if the stored password is hashed
      const isPasswordHashed = user.password.startsWith("$2a$");

      // Compare passwords based on their type (hashed or plain text)
      if (isPasswordHashed) {
        // Compare with hashed password
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).send({ message: "Invalid password" });
        }
      } else {
        // Compare with plain text password
        if (password !== user.password) {
          return res.status(401).send({ message: "Invalid password" });
        }
      }

      // Generate a JWT token
      // const token = jwt.sign(
      //   { userId: user._id, role: user.role },
      //   "your_secret_key",
      //   {
      //     expiresIn: "30m", // Token expiration time (30 minutes)
      //   }
      // );

      const accessToken = createToken(
        {
          id: user?._id,
          role: user?.role,
          type: "access",
        },
        30 * 60 //time for AccessToken
      );

      const refreshToken = createToken(
        {
          id: user?._id,
          role: user?.role,
          type: "refresh",
        },
        60 * 60 //time for AccessToken
      );

      // add token in response in headers

      res.set("x-accesstoken", accessToken);

      res.set("x-refreshtoken", refreshToken);

      // send response
      console.log("auth controller-AccessToken:", accessToken);
      console.log("auth controller-refreshToken:", refreshToken);

      res
        .status(200)
        .send({ message: "Login successful", status: "success", data: user });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Internal Server Error", status: "failed" });
    }
  },

  validateToken(req, res) {
    const { token } = req.body;

    // verifytoken gives payload like object

    const payload = verifyToken(token);
    if (payload) {
      // valid token
      res
        .status(200)
        .send({ message: "Token is Valid", data: { id: payload?.id } });
    } else {
      res.status(400).send({ message: "Token is Invalid", error: null });
    }
  },
};

module.exports = authController;
