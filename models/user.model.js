const mongoose = require("mongoose");
const uuid = require("uuid");

const userSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },

  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: { type: String, required: true },

  email: { type: String },
  mobile: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid mobile number`,
    },
    required: [true, "User mobile number required"],
  },

  couponNumber: [
    {
      type: String,
      unique: true,
      sparse: true,
    },
  ],
  couponPaymentStatus: String,
  paymentMode: String,
  role: String,
  couponAmt: Number,
  couponCount: {
    type: Number,
    min: 1,
    max: [10, "Max 10 Coupons allowded"],
  },
  occupation: String,
  // status: Number,
  createdAt: { type: Date, default: Date.now },
});

// Ensure mobile and username are unique
userSchema.index({ mobile: 1 }, { unique: true });

module.exports = mongoose.model("userCreatedByAgent", userSchema);
