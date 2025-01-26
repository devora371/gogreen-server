const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
  },

  firstCoupon: String,

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Winners", userSchema);
