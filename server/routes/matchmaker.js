const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const RoommateProfile = require("../models/RoommateProfile");
const Student = require("../models/Student");

const DEFAULT_PEER_PROFILES = [
  {
    studentRoll: "12345680",
    studentName: "Rahul Verma",
    studentEmail: "rahul.verma@student.lpu.co.in",
    gender: "Male",
    department: "Business Administration",
    year: 3,
    cgpa: 7.8,
    sleepSchedule: "11PM-7AM",
    wakeUpTime: "7AM",
    studyHabits: "Moderate",
    cleanliness: "Very Clean",
    guestFrequency: "Rarely",
    musicPreference: "Quiet",
    interests: ["Coding", "Fitness", "Music", "Reading"],
    bio: "B.Tech / BBA student looking for a clean, study-focused AC Double/Triple room in BH-1.",
    lookingForRoommate: true,
  },
  {
    studentRoll: "12345682",
    studentName: "Aditya Kumar",
    studentEmail: "aditya.kumar@student.lpu.co.in",
    gender: "Male",
    department: "Mechanical Engineering",
    year: 4,
    cgpa: 8.1,
    sleepSchedule: "10PM-6AM",
    wakeUpTime: "6AM",
    studyHabits: "Intensive",
    cleanliness: "Clean",
    guestFrequency: "Occasionally",
    musicPreference: "Low Volume",
    interests: ["Sports", "Gaming", "Travel", "Coding"],
    bio: "Early riser, enjoys morning gym & evening coding sessions in Boys Hostel.",
    lookingForRoommate: true,
  },
  {
    studentRoll: "12345684",
    studentName: "Rohan Mehta",
    studentEmail: "rohan.mehta@student.lpu.co.in",
    gender: "Male",
    department: "Computer Science",
    year: 2,
    cgpa: 8.8,
    sleepSchedule: "11PM-7AM",
    wakeUpTime: "7AM",
    studyHabits: "Moderate",
    cleanliness: "Very Clean",
    guestFrequency: "Rarely",
    musicPreference: "Quiet",
    interests: ["Coding", "Reading", "Photography"],
    bio: "CSE sophomore looking for a quiet, organized roommate in BH-1 or BH-2.",
    lookingForRoommate: true,
  },
  {
    studentRoll: "12345681",
    studentName: "Sneha Singh",
    studentEmail: "sneha.singh@student.lpu.co.in",
    gender: "Female",
    department: "Information Technology",
    year: 2,
    cgpa: 8.9,
    sleepSchedule: "11PM-7AM",
    wakeUpTime: "7AM",
    studyHabits: "Moderate",
    cleanliness: "Very Clean",
    guestFrequency: "Rarely",
    musicPreference: "Quiet",
    interests: ["Reading", "Music", "Coding", "Art"],
    bio: "IT student looking for a neat, friendly roommate in Girls Hostel GH-1 or GH-2.",
    lookingForRoommate: true,
  },
  {
    studentRoll: "12345683",
    studentName: "Ananya Gupta",
    studentEmail: "ananya.gupta@student.lpu.co.in",
    gender: "Female",
    department: "Computer Science",
    year: 2,
    cgpa: 9.1,
    sleepSchedule: "10PM-6AM",
    wakeUpTime: "6AM",
    studyHabits: "Intensive",
    cleanliness: "Very Clean",
    guestFrequency: "Rarely",
    musicPreference: "Low Volume",
    interests: ["Coding", "Reading", "Fitness", "Travel"],
    bio: "CSE student preferring quiet evening study hours in GH-1 AC Double room.",
    lookingForRoommate: true,
  },
];

async function ensurePeerProfilesSeeded() {
  try {
    await RoommateProfile.collection.dropIndex("studentId_1").catch(() => {});
    for (const p of DEFAULT_PEER_PROFILES) {
      await RoommateProfile.updateOne(
        { studentRoll: p.studentRoll },
        {
          $setOnInsert: {
            ...p,
            studentId: new mongoose.Types.ObjectId(),
          },
        },
        { upsert: true }
      );
    }
  } catch (_) {}
}

function formatProfileOutput(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    lifestyle: {
      sleepSchedule: obj.sleepSchedule || "11PM-7AM",
      wakeUpTime: obj.wakeUpTime || "7AM",
      studyHabits: obj.studyHabits || "Moderate",
      cleanliness: obj.cleanliness || "Very Clean",
      guestFrequency: obj.guestFrequency || "Rarely",
      musicPreference: obj.musicPreference || "Quiet",
    },
  };
}

// GET /api/matchmaker/profiles
router.get("/profiles", async (req, res) => {
  try {
    await ensurePeerProfilesSeeded();
    const { roll, gender, department, year, lookingForRoommate } = req.query;
    const filter = { isActive: true };

    if (roll) filter.studentRoll = roll;
    if (gender) filter.gender = gender;
    if (department) filter.department = department;
    if (year) filter.year = Number(year);
    if (lookingForRoommate !== undefined) filter.lookingForRoommate = lookingForRoommate === "true";

    const profiles = await RoommateProfile.find(filter)
      .sort({ profileCompleteness: -1, createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: profiles.length,
      data: profiles.map(formatProfileOutput),
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch roommate profiles",
      error: error.message,
    });
  }
});

// GET /api/matchmaker/profiles/:roll
router.get("/profiles/:roll", async (req, res) => {
  try {
    await ensurePeerProfilesSeeded();
    const profile = await RoommateProfile.findOne({ studentRoll: req.params.roll });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }
    res.json({
      success: true,
      data: formatProfileOutput(profile),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
});

// POST /api/matchmaker/profiles
router.post("/profiles", async (req, res) => {
  try {
    await ensurePeerProfilesSeeded();
    const {
      studentRoll,
      studentName,
      studentEmail,
      gender,
      department,
      year,
      cgpa,
      lifestyle = {},
      sleepSchedule,
      wakeUpTime,
      studyHabits,
      cleanliness,
      guestFrequency,
      musicPreference,
      interests,
      hobbies,
      preferredRoomType,
      acPreference,
      floorPreference,
      quietZone,
      lookingForRoommate,
      bio,
    } = req.body;

    if (!studentRoll) {
      return res.status(400).json({
        success: false,
        message: "studentRoll is required to save roommate profile.",
      });
    }

    const studentDoc = await Student.findOne({ rollNumber: String(studentRoll).trim() }).lean();

    const resolvedFields = {
      studentId: studentDoc?._id || new mongoose.Types.ObjectId(),
      studentRoll: String(studentRoll).trim(),
      studentName: studentName || studentDoc?.name || (gender === "Female" ? "Priya Patel" : "Arjun Sharma"),
      studentEmail: studentEmail || studentDoc?.email || `${studentRoll}@student.lpu.co.in`,
      gender: gender || studentDoc?.gender || "Male",
      department: department || studentDoc?.department || "Computer Science",
      year: Number(year || studentDoc?.year || 2),
      cgpa: Number(cgpa || studentDoc?.cgpa || 8.5),
      sleepSchedule: lifestyle.sleepSchedule || sleepSchedule || "11PM-7AM",
      wakeUpTime: lifestyle.wakeUpTime || wakeUpTime || "7AM",
      studyHabits: lifestyle.studyHabits || studyHabits || "Moderate",
      cleanliness: lifestyle.cleanliness || cleanliness || "Very Clean",
      guestFrequency: lifestyle.guestFrequency || guestFrequency || "Rarely",
      musicPreference: lifestyle.musicPreference || musicPreference || "Quiet",
      interests: Array.isArray(interests) ? interests : ["Coding", "Music"],
      hobbies: hobbies || "",
      preferredRoomType: preferredRoomType || "Double",
      acPreference: acPreference || "AC",
      floorPreference: floorPreference || "No Preference",
      quietZone: Boolean(quietZone),
      lookingForRoommate: lookingForRoommate !== false,
      bio: bio || "",
    };

    let profile = await RoommateProfile.findOne({ studentRoll: resolvedFields.studentRoll });
    if (profile) {
      Object.assign(profile, resolvedFields);
      profile.calculateCompleteness();
      await profile.save();
      return res.json({
        success: true,
        message: "Profile updated successfully",
        data: formatProfileOutput(profile),
      });
    }

    profile = new RoommateProfile(resolvedFields);
    profile.calculateCompleteness();
    await profile.save();

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: formatProfileOutput(profile),
    });
  } catch (error) {
    console.error("Error creating/updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create/update profile",
      error: error.message,
    });
  }
});

// POST /api/matchmaker/find-matches/:roll
router.post("/find-matches/:roll", async (req, res) => {
  try {
    await ensurePeerProfilesSeeded();
    let myProfile = await RoommateProfile.findOne({ studentRoll: req.params.roll });

    if (!myProfile) {
      const studentDoc = await Student.findOne({ rollNumber: req.params.roll }).lean();
      myProfile = await RoommateProfile.create({
        studentRoll: req.params.roll,
        studentName: studentDoc?.name || "Arjun Sharma",
        studentEmail: studentDoc?.email || `${req.params.roll}@student.lpu.co.in`,
        gender: studentDoc?.gender || "Male",
        department: studentDoc?.department || "Computer Science",
        year: studentDoc?.year || 2,
        sleepSchedule: "11PM-7AM",
        studyHabits: "Moderate",
        cleanliness: "Very Clean",
        guestFrequency: "Rarely",
        musicPreference: "Quiet",
        interests: ["Coding", "Music", "Reading"],
      });
    }

    const otherProfiles = await RoommateProfile.find({
      gender: myProfile.gender,
      studentRoll: { $ne: myProfile.studentRoll },
      isActive: true,
    });

    const matches = otherProfiles.map((profile) => {
      let score = 35; // Base same-wing compatibility

      if (myProfile.sleepSchedule === profile.sleepSchedule) score += 18;
      else score += 9;

      if (myProfile.studyHabits === profile.studyHabits) score += 15;
      else score += 8;

      if (myProfile.cleanliness === profile.cleanliness) score += 12;
      else score += 6;

      if (myProfile.guestFrequency === profile.guestFrequency) score += 8;
      if (myProfile.musicPreference === profile.musicPreference) score += 7;

      const myInt = myProfile.interests || [];
      const pInt = profile.interests || [];
      const common = myInt.filter((i) => pInt.includes(i)).length;
      score += Math.min(10, common * 4);

      const compatibilityScore = Math.min(98, Math.max(62, Math.round(score)));

      return {
        ...formatProfileOutput(profile),
        compatibilityScore,
      };
    });

    matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.json({
      success: true,
      count: matches.length,
      data: matches.slice(0, 20),
    });
  } catch (error) {
    console.error("Error finding matches:", error);
    res.status(500).json({
      success: false,
      message: "Failed to find matches",
      error: error.message,
    });
  }
});

module.exports = router;
