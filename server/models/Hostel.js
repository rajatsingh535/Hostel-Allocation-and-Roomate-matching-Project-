const mongoose = require("mongoose");

const HostelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    genderAllowed: { type: String, enum: ["Male", "Female", "Co-ed"], required: true },
    campusLocation: { type: String, required: true },
    totalCapacity: { type: Number, required: true },
    availableCapacity: { type: Number, required: true },
    amenities: [{ type: String }],
    imageUrl: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Hostel || mongoose.model("Hostel", HostelSchema);
