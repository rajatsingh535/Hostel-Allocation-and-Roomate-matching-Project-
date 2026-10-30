
const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    rollNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    cgpa: { type: Number, required: true },
    category: { type: String, default: "General" },

    roommatePreferences: {
      sleepSchedule: {
        type: String,
        enum: ["Early Bird", "Night Owl", "Flexible"],
        default: "Flexible"
      },
      foodPreference: {
        type: String,
        enum: ["Vegetarian", "Non-Vegetarian", "Eggetarian", "Flexible"],
        default: "Flexible"
      },
      cleanliness: {
        type: String,
        enum: ["Very Clean", "Moderate", "Relaxed"],
        default: "Moderate"
      },
      studyHabits: {
        type: String,
        enum: ["Quiet", "Group Study", "Flexible"],
        default: "Flexible"
      },
      socialHabits: {
        type: String,
        enum: ["Introvert", "Extrovert", "Ambivert"],
        default: "Ambivert"
      },
      snoiseTolerance: {
      type: String,
      enum: ["Low", "Moderate", "High"],
      default: "Moderate"
}
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Student || mongoose.model("Student", StudentSchema);
