const mongoose = require("mongoose");

const DraftAssignmentSchema = new mongoose.Schema({
  studentRollNumber: { type: String, required: true },
  studentName: { type: String, required: true },
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel" },
  hostelName: { type: String, required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  roomNumber: { type: String, required: true },
  bedNumber: { type: String, required: true },
  score: { type: Number, default: 100 },
});

const AllocationDraftSchema = new mongoose.Schema(
  {
    academicYear: { type: String, required: true },
    semester: { type: String, required: true },
    status: { type: String, enum: ["DRAFT", "LOCKED", "PUBLISHED"], default: "DRAFT" },
    assignments: [DraftAssignmentSchema],
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.models.AllocationDraft || mongoose.model("AllocationDraft", AllocationDraftSchema);
