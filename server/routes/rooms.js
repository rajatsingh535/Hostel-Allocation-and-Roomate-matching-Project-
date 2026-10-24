const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const Bed = require("../models/Bed");
const Hostel = require("../models/Hostel");

// DELETE /api/rooms/:id  — delete a room and its beds
router.delete("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found." });
    }

    // Remove all beds in this room
    await Bed.deleteMany({ roomId: room._id });

    // Update hostel available capacity
    await Hostel.findByIdAndUpdate(room.hostelId, {
      $inc: {
        totalCapacity: -room.totalBeds,
        availableCapacity: -room.availableBeds,
      },
    });

    await Room.findByIdAndDelete(req.params.id);

    console.log(`[API:Rooms] Deleted room ${room.roomNumber}`);
    res.json({ success: true, message: `Room ${room.roomNumber} deleted successfully.` });
  } catch (err) {
    console.error("[API:Rooms] Delete error:", err);
    res.status(500).json({ success: false, message: "Error deleting room." });
  }
});

module.exports = router;
