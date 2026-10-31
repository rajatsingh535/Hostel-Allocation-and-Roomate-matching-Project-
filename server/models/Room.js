
const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      trim: true
    },
    floor: {
      type: Number,
      required: true,
      min: 0
    },
    blockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Block",
      required: true
    },
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true
    },
    roomType: {
      type: String,
      enum: ["Single", "Double", "Triple", "Quad"],
      required: true
    },
    acType: {
      type: String,
      enum: ["AC", "Non-AC"],
      required: true
    },
    totalBeds: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
      validate: {
        validator: Number.isInteger,
        message: "Total beds must be a whole number."
      }
    },
    availableBeds: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Available beds must be a whole number."
      }
    },
    occupancyGender: {
    type: String,
    enum: ["Male", "Female", "Other", null],
    default: null
    },
    rentPerSemester: {
      type: Number,
      required: true,
      min: 0
    },
    isPwDAccessible: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Prevent duplicate room numbers within the same block.
RoomSchema.index(
  { blockId: 1, roomNumber: 1 },
  { unique: true }
);

// Validate bed capacity against room type.
RoomSchema.pre("validate", function () {
  const roomCapacity = {
    Single: 1,
    Double: 2,
    Triple: 3,
    Quad: 4
  };

  if (this.roomType && this.totalBeds !== roomCapacity[this.roomType]) {
    this.invalidate(
      "totalBeds",
      `A ${this.roomType} room must have exactly ${roomCapacity[this.roomType]} bed(s).`
    );
  }

  if (this.availableBeds > this.totalBeds) {
    this.invalidate(
      "availableBeds",
      "Available beds cannot exceed total beds."
    );
  }
});

module.exports =
  mongoose.models.Room || mongoose.model("Room", RoomSchema);
