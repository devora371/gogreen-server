const mongoose = require("mongoose");

const ContestSchema = new mongoose.Schema({
  contestRules: [{ type: String, required: true }],
  awarenessData: [
    {
      url: String,
      title: String,
    },
  ],
  termsAndConditions: [{ type: String, required: true }],
  contestResultDate: { type: String },
  contestTitle: String,
  couponAmt: Number,
  conteastPrize: String,
  createdAt: { type: Date, default: Date.now },
});

const ContestModel = mongoose.model("Metadata", ContestSchema);

module.exports = ContestModel;
