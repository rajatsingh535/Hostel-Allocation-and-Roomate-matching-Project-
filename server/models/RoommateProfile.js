const mongoose = require("mongoose");

const roommateProfileSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },
    studentName: { type: String, required: true },
    studentRoll: { type: String, required: true, unique: true },
    studentEmail: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    department: { type: String, required: true },
    year: { type: Number, required: true },
    cgpa: { type: Number },
    
    // Lifestyle preferences
    sleepSchedule: {
      type: String,
      enum: ["Early Bird (Before 10 PM)", "Night Owl (After 12 AM)", "Flexible"],
      default: "Flexible",
    },
    studyHabits: {
      type: String,
      enum: ["Library/Outside", "In Room - Silent", "In Room - With Music", "Flexible"],
      default: "Flexible",
    },
    cleanliness: {
      type: String,
      enum: ["Very Organized", "Moderately Clean", "Relaxed", "Flexible"],
      default: "Flexible",
    },
    guestFrequency: {
      type: String,
      enum: ["Rarely", "Occasionally", "Frequently", "Flexible"],
      default: "Flexible",
    },
    musicPreference: {
      type: String,
      enum: ["Quiet Environment", "Background Music", "Loud Music Okay", "Flexible"],
      default: "Flexible",
    },
    
    // Interests & Hobbies
    interests: [{ type: String }], // e.g., ["Sports", "Reading", "Gaming", "Music"]
    hobbies: { type: String }, // Free text
    
    // Room preferences
    preferredRoomType: {
      type: String,
      enum: ["Single", "Double", "Triple", "Quad"],
    },
    acPreference: {
      type: String,
      enum: ["AC", "Non-AC", "No Preference"],
      default: "No Preference",
    },
    floorPreference: { type: String }, // e.g., "Ground", "Top", "Middle", "No Preference"
    quietZone: { type: Boolean, default: false },
    
    // Matchmaking
    lookingForRoommate: { type: Boolean, default: true },
    bio: { type: String, maxlength: 500 }, // Short bio about themselves
    matchCompatibility: [
      {
        matchedWithRoll: { type: String },
        matchedWithName: { type: String },
        compatibilityScore: { type: Number }, // 0-100
        matchedAt: { type: Date, default: Date.now },
      },
    ],
    
    isActive: { type: Boolean, default: true },
    profileCompleteness: { type: Number, default: 0 }, // Percentage
  },
  {
    timestamps: true,
  }
);

// Calculate profile completeness
roommateProfileSchema.methods.calculateCompleteness = function () {
  let score = 0;
  const fields = [
    "sleepSchedule",
    "studyHabits",
    "cleanliness",
    "guestFrequency",
    "musicPreference",
    "interests",
    "hobbies",
    "preferredRoomType",
    "acPreference",
    "bio",
  ];
  
  fields.forEach((field) => {
    if (field === "interests") {
      if (this[field] && this[field].length > 0) score += 10;
    } else if (this[field] && this[field] !== "Flexible" && this[field] !== "No Preference") {
      score += 10;
    }
  });
  
  this.profileCompleteness = score;
  return score;
};

module.exports = mongoose.model("RoommateProfile", roommateProfileSchema);
