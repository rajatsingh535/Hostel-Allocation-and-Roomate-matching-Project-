const mongoose = require("mongoose");

const roommateProfileSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: false,
    },
    studentName: { type: String, default: "LPU Student" },
    studentRoll: { type: String, required: true, unique: true },
    studentEmail: { type: String, default: "student@lpu.co.in" },
    gender: { type: String, enum: ["Male", "Female"], default: "Male" },
    department: { type: String, default: "Computer Science" },
    year: { type: Number, default: 2 },
    cgpa: { type: Number, default: 8.5 },

    // Lifestyle preferences (supports both preset strings and custom schedules)
    sleepSchedule: { type: String, default: "11PM-7AM" },
    wakeUpTime: { type: String, default: "7AM" },
    studyHabits: { type: String, default: "Moderate" },
    cleanliness: { type: String, default: "Very Clean" },
    guestFrequency: { type: String, default: "Rarely" },
    musicPreference: { type: String, default: "Quiet" },

    // Interests & Hobbies
    interests: [{ type: String }],
    hobbies: { type: String, default: "" },

    // Room preferences
    preferredRoomType: {
      type: String,
      enum: ["Single", "Double", "Triple", "Quad"],
      default: "Double",
    },
    acPreference: {
      type: String,
      enum: ["AC", "Non-AC", "No Preference"],
      default: "AC",
    },
    floorPreference: { type: String, default: "No Preference" },
    quietZone: { type: Boolean, default: false },

    // Matchmaking
    lookingForRoommate: { type: Boolean, default: true },
    bio: { type: String, maxlength: 500, default: "" },
    matchCompatibility: [
      {
        matchedWithRoll: { type: String },
        matchedWithName: { type: String },
        compatibilityScore: { type: Number },
        matchedAt: { type: Date, default: Date.now },
      },
    ],

    isActive: { type: Boolean, default: true },
    profileCompleteness: { type: Number, default: 85 },
  },
  {
    timestamps: true,
  }
);

roommateProfileSchema.methods.calculateCompleteness = function () {
  let score = 0;
  const fields = [
    "sleepSchedule",
    "studyHabits",
    "cleanliness",
    "guestFrequency",
    "musicPreference",
    "interests",
    "bio",
  ];

  fields.forEach((field) => {
    if (field === "interests") {
      if (this[field] && this[field].length > 0) score += 20;
    } else if (this[field]) {
      score += 13;
    }
  });

  this.profileCompleteness = Math.min(100, score);
  return this.profileCompleteness;
};

module.exports = mongoose.model("RoommateProfile", roommateProfileSchema);
