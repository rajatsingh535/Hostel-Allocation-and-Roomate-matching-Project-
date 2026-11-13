const mongoose = require("mongoose");

const roomSwapSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    requestedByName: { type: String, required: true },
    requestedByRoll: { type: String, required: true },
    requestedByGender: { type: String, enum: ["Male", "Female"], required: true },
    currentHostel: { type: String, required: true },
    currentRoom: { type: String, required: true },
    currentBedNumber: { type: String },
    
    targetStudentRoll: { type: String }, // Optional: specific student to swap with
    targetStudentName: { type: String },
    targetHostel: { type: String }, // Desired hostel
    targetRoomType: { type: String }, // Desired room type
    
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
    adminNotes: { type: String },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    processedAt: { type: Date },
    
    // If approved and matched with another student
    matchedWithRoll: { type: String },
    matchedWithName: { type: String },
    swapCompletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RoomSwap", roomSwapSchema);
