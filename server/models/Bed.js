
const mongoose = require("mongoose");

const BedSchema = new mongoose.Schema(
  {
    bedNumber: {
      type: String,
      required: true,
      trim: true
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true
    },
    isOccupied: {
      type: Boolean,
      default: false
    },
    occupiedBy: {
      rollNumber: {
        type: String,
        trim: true
      },
      name: {
        type: String,
        trim: true
      },
      department: {
        type: String,
        trim: true
      },
      gender: {
        type: String,
        enum: ["Male", "Female", "Other"]
      }
    }
  },
  { timestamps: true }
);

// Prevent duplicate bed numbers within the same room.
BedSchema.index(
  { roomId: 1, bedNumber: 1 },
  { unique: true }
);

// Keep occupancy details consistent.
BedSchema.pre("validate", function () {
  if (this.isOccupied) {
    if (
      !this.occupiedBy ||
      !this.occupiedBy.rollNumber ||
      !this.occupiedBy.name
    ) {
      this.invalidate(
        "occupiedBy",
        "An occupied bed must have student roll number and name."
      );
    }
  } else {
    this.occupiedBy = undefined;
  }
});

module.exports =
  mongoose.models.Bed || mongoose.model("Bed", BedSchema);
