const { verifyToken } = require("./token");

const authorize = (roles) => {
  return (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
      const payload = verifyToken(token);
      const role = payload?.role;
      console.log(roles);

      if (roles?.includes(role)) return next();
      else
        res
          .status(401)
          .send({ message: "You are not authorize to access", error: "" });
    }
  };
};
module.exports = authorize;
