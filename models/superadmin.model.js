const mongoose = require("mongoose");

// super admin schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: {
    type: String,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid mobile number`,
    },
    required: [true, "User mobile number required"],
  },
  role: String,
  status: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Users", userSchema);
