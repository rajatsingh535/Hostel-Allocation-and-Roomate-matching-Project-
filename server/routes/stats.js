const express = require("express");
const router = express.Router();
const Hostel = require("../models/Hostel");
const Room = require("../models/Room");
const Bed = require("../models/Bed");
const Application = require("../models/Application");

router.get("/", async (req, res) => {
  try {
    const [totalHostels, totalRooms, totalBeds, occupiedBeds, totalApplications, pendingReview] =
      await Promise.all([
        Hostel.countDocuments(),
        Room.countDocuments(),
        Bed.countDocuments(),
        Bed.countDocuments({ isOccupied: true }),
        Application.countDocuments(),
        Application.countDocuments({ status: { $in: ["SUBMITTED", "UNDER_REVIEW"] } }),
      ]);

    const availableBeds = totalBeds - occupiedBeds;
   const occupancyRate = totalBeds > 0 ? Number(((occupiedBeds / totalBeds) * 100).toFixed(2)) : 0;
    res.json({
      success: true,
      data: {
        totalHostels,
        totalRooms,
        totalBeds,
        occupiedBeds,
        availableBeds,
        occupancyRate,
        totalApplications,
        pendingReview,
      },
    });
  } catch (err) {
    console.error("[API:Stats] Error computing stats:", err);
    res.status(500).json({ success: false, message: "Error calculating stats." });
  }
});

module.exports = router;
