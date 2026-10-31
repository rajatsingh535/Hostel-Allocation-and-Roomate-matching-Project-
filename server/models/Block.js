const mongoose = require("mongoose");

const BlockSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel", required: true },
    floorsCount: { type: Number, default: 4 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Block || mongoose.model("Block", BlockSchema);
