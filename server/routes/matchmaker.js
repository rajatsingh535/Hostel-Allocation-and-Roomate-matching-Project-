const express = require("express");
const router = express.Router();
const RoommateProfile = require("../models/RoommateProfile");

// @route   GET /api/matchmaker/profiles
// @desc    Get all active roommate profiles
// @access  Public
router.get("/profiles", async (req, res) => {
  try {
    const { gender, department, year, lookingForRoommate } = req.query;
    let filter = { isActive: true };
    
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
      data: profiles,
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

// @route   GET /api/matchmaker/profiles/:roll
// @desc    Get roommate profile by roll number
// @access  Public
router.get("/profiles/:roll", async (req, res) => {
  try {
    const profile = await RoommateProfile.findOne({ studentRoll: req.params.roll });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }
    
    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
});

// @route   POST /api/matchmaker/profiles
// @desc    Create or update roommate profile
// @access  Public
router.post("/profiles", async (req, res) => {
  try {
    const {
      studentRoll,
      studentName,
      studentEmail,
      gender,
      department,
      year,
      cgpa,
      sleepSchedule,
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
    
    // Validation
    if (!studentRoll || !studentName || !studentEmail || !gender || !department || !year) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    
    // Check if profile exists
    let profile = await RoommateProfile.findOne({ studentRoll });
    
    if (profile) {
      // Update existing profile
      profile.studentName = studentName;
      profile.studentEmail = studentEmail;
      profile.gender = gender;
      profile.department = department;
      profile.year = year;
      profile.cgpa = cgpa || profile.cgpa;
      profile.sleepSchedule = sleepSchedule || profile.sleepSchedule;
      profile.studyHabits = studyHabits || profile.studyHabits;
      profile.cleanliness = cleanliness || profile.cleanliness;
      profile.guestFrequency = guestFrequency || profile.guestFrequency;
      profile.musicPreference = musicPreference || profile.musicPreference;
      profile.interests = interests || profile.interests;
      profile.hobbies = hobbies || profile.hobbies;
      profile.preferredRoomType = preferredRoomType || profile.preferredRoomType;
      profile.acPreference = acPreference || profile.acPreference;
      profile.floorPreference = floorPreference || profile.floorPreference;
      profile.quietZone = quietZone !== undefined ? quietZone : profile.quietZone;
      profile.lookingForRoommate = lookingForRoommate !== undefined ? lookingForRoommate : profile.lookingForRoommate;
      profile.bio = bio || profile.bio;
      
      profile.calculateCompleteness();
      await profile.save();
      
      return res.json({
        success: true,
        message: "Profile updated successfully",
        data: profile,
      });
    }
    
    // Create new profile
    profile = new RoommateProfile({
      studentRoll,
      studentName,
      studentEmail,
      gender,
      department,
      year,
      cgpa,
      sleepSchedule,
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
    });
    
    profile.calculateCompleteness();
    const savedProfile = await profile.save();
    
    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: savedProfile,
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

// @route   POST /api/matchmaker/find-matches/:roll
// @desc    Find compatible roommates based on preferences
// @access  Public
router.post("/find-matches/:roll", async (req, res) => {
  try {
    const myProfile = await RoommateProfile.findOne({ studentRoll: req.params.roll });
    
    if (!myProfile) {
      return res.status(404).json({
        success: false,
        message: "Your profile not found. Please create a profile first.",
      });
    }
    
    // Find profiles with same gender and different roll number
    const otherProfiles = await RoommateProfile.find({
      gender: myProfile.gender,
      studentRoll: { $ne: myProfile.studentRoll },
      lookingForRoommate: true,
      isActive: true,
    });
    
    // Calculate compatibility scores
    const matches = otherProfiles.map((profile) => {
      let score = 0;
      let maxScore = 0;
      
      // Sleep schedule compatibility
      if (myProfile.sleepSchedule && profile.sleepSchedule) {
        maxScore += 20;
        if (myProfile.sleepSchedule === profile.sleepSchedule) score += 20;
        else if (myProfile.sleepSchedule === "Flexible" || profile.sleepSchedule === "Flexible") score += 10;
      }
      
      // Study habits compatibility
      if (myProfile.studyHabits && profile.studyHabits) {
        maxScore += 20;
        if (myProfile.studyHabits === profile.studyHabits) score += 20;
        else if (myProfile.studyHabits === "Flexible" || profile.studyHabits === "Flexible") score += 10;
      }
      
      // Cleanliness compatibility
      if (myProfile.cleanliness && profile.cleanliness) {
        maxScore += 15;
        if (myProfile.cleanliness === profile.cleanliness) score += 15;
        else if (myProfile.cleanliness === "Flexible" || profile.cleanliness === "Flexible") score += 7;
      }
      
      // Guest frequency compatibility
      if (myProfile.guestFrequency && profile.guestFrequency) {
        maxScore += 10;
        if (myProfile.guestFrequency === profile.guestFrequency) score += 10;
        else if (myProfile.guestFrequency === "Flexible" || profile.guestFrequency === "Flexible") score += 5;
      }
      
      // Music preference compatibility
      if (myProfile.musicPreference && profile.musicPreference) {
        maxScore += 10;
        if (myProfile.musicPreference === profile.musicPreference) score += 10;
        else if (myProfile.musicPreference === "Flexible" || profile.musicPreference === "Flexible") score += 5;
      }
      
      // Department match bonus
      if (myProfile.department === profile.department) {
        score += 10;
      }
      maxScore += 10;
      
      // Year match bonus
      if (myProfile.year === profile.year) {
        score += 5;
      }
      maxScore += 5;
      
      // Interests overlap
      if (myProfile.interests && myProfile.interests.length > 0 && profile.interests && profile.interests.length > 0) {
        const commonInterests = myProfile.interests.filter((interest) =>
          profile.interests.includes(interest)
        );
        const interestScore = (commonInterests.length / Math.max(myProfile.interests.length, profile.interests.length)) * 10;
        score += interestScore;
        maxScore += 10;
      } else {
        maxScore += 10;
      }
      
      // Calculate percentage
      const compatibilityScore = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
      
      return {
        ...profile.toObject(),
        compatibilityScore,
      };
    });
    
    // Sort by compatibility score
    matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    
    // Return top 20 matches
    const topMatches = matches.slice(0, 20);
    
    res.json({
      success: true,
      count: topMatches.length,
      data: topMatches,
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

// @route   PUT /api/matchmaker/profiles/:roll/toggle-status
// @desc    Toggle looking for roommate status
// @access  Public
router.put("/profiles/:roll/toggle-status", async (req, res) => {
  try {
    const profile = await RoommateProfile.findOne({ studentRoll: req.params.roll });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }
    
    profile.lookingForRoommate = !profile.lookingForRoommate;
    await profile.save();
    
    res.json({
      success: true,
      message: `Looking for roommate status ${profile.lookingForRoommate ? "enabled" : "disabled"}`,
      data: profile,
    });
  } catch (error) {
    console.error("Error toggling status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle status",
      error: error.message,
    });
  }
});

module.exports = router;
