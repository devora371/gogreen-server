const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  agentName: { type: String, required: true },
  password: { type: String, required: true },
  mobile: {
    type: String,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid mobile number`
    },
    required: [true, "Agent mobile number required"]
  },
  email: { type: String },
  role: String,
  status: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Agent", agentSchema);
