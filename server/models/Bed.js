const mongoose = require("mongoose");

const BedSchema = new mongoose.Schema(
  {
    bedNumber: { type: String, required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel", required: true },
    isOccupied: { type: Boolean, default: false },
    occupiedBy: {
      rollNumber: String,
      name: String,
      department: String,
      gender: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Bed || mongoose.model("Bed", BedSchema);
