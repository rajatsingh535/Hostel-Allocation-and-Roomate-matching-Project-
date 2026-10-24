const mongoose = require("mongoose");

const PreferenceSchema = new mongoose.Schema({
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel" },
  hostelCode: { type: String },
  hostelName: { type: String, default: "Hostel" },
  roomType: { type: String, default: "Double" },
  acPreference: { type: String, default: "Either" },
  priority: { type: Number, default: 1 },
}, { _id: false });

const ApplicationSchema = new mongoose.Schema(
  {
    applicationId: { type: String, required: true, unique: true },
    studentRollNumber: { type: String, required: true },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: Number, required: true },
    gender: { type: String, required: true },
    cgpa: { type: Number, required: true },
    preferences: [PreferenceSchema],
    specialAccommodations: { type: String, default: "" },
    status: {
      type: String,
      enum: ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "ALLOCATED", "REJECTED"],
      default: "SUBMITTED",
    },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
