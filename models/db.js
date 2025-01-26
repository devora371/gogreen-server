const mongoose = require("mongoose");
// local url
// const url = "mongodb://127.0.0.1:27017/go-green";

// deployed database url for project
const url =
"mongodb+srv://gogreenuser:gogreenuser@cluster0.pm0l5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(url, {
  connectTimeoutMS: 30000
});

const conn = mongoose.connection;

conn.on("connected", () => {
  console.log("connection established with DB");
});

conn.on("error", () => {
  console.log("connection is not established with DB");
});

conn.on("disconnected", () => {
  console.log("connection is ended with DB");
});

// mongodb+srv://phadtarepawan:<password>@cluster0.jmyues0.mongodb.net/
