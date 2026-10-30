
const mongoose = require("mongoose");

const PreferenceSchema = new mongoose.Schema({
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
    default: null
  },
  hostelCode: {
    type: String,
    trim: true,
    default: ""
  },
  hostelName: {
    type: String,
    trim: true,
    default: "Hostel"
  },
  roomType: {
    type: String,
    enum: ["Single", "Double", "Triple", "Quad"],
    default: "Double"
  },
  acPreference: {
    type: String,
    enum: ["AC", "Non-AC", "Either"],
    default: "Either"
  },
  priority: {
    type: Number,
    min: 1,
    default: 1
  }
}, { _id: false });

const ApplicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    studentRollNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    studentName: {
      type: String,
      required: true,
      trim: true
    },
    studentEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    department: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"]
    },
    cgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    preferences: {
      type: [PreferenceSchema],
      required: true,
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "At least one hostel preference is required."
      }
    },
    specialAccommodations: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000
    },
    assignedHostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      default: null
    },
    assignedHostelName: {
      type: String,
      default: "",
      trim: true
    },
    assignedRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: null
    },
    assignedRoomNumber: {
      type: String,
      default: "",
      trim: true
    },
    assignedBedNumber: {
      type: String,
      default: "",
      trim: true
    },
    allocatedAt: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "ALLOCATED", "REJECTED"],
      default: "SUBMITTED"
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

ApplicationSchema.index({ studentRollNumber: 1 });

module.exports =
  mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);
