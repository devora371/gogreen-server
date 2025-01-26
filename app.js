const express = require("express");
require("./models/db");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
// app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const Port = process.env.PORT || 9999;

app.use((req, res, next) => {
  res.header("Access-Control-Expose-Headers", "x-accesstoken,x-refreshtoken");
  next();
});

const userRoutes = require("./routes/user.route");
const metaRoutes = require("./routes/metainfo.route");
const winnerRoute = require("./routes/winner.route");

// API routes
app.use("/api/superadmin", require("./routes/superadmin.route")); //create super admin
app.use("/api/agent", require("./routes/agent.route")); //create super admin
app.use("/api/auth", require("./routes/auth.route")); //logi for super admin,agent,users
app.use("/api/user", userRoutes);
app.use("/api/metadata", metaRoutes);
app.use("/api/winners", winnerRoute);

app.listen(Port, () => {
  console.log(`Server is listening on ${Port}`);
});
