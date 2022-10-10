const mongoose = require("mongoose");

const raspberrySchema = new mongoose.Schema(
  {
    cpuTemp: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const raspberry = mongoose.model("raspberry", raspberrySchema);

module.exports = raspberry;
