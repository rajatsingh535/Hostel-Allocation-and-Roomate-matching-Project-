
const express = require("express");
const router = express.Router();

const Room = require("../models/Room");
const Bed = require("../models/Bed");
const Hostel = require("../models/Hostel");

// GET /api/rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate("hostelId", "name code genderAllowed")
      .sort({ roomNumber: 1 });

    const data = await Promise.all(
      rooms.map(async (room) => {
        const occupiedBeds = await Bed.countDocuments({
          roomId: room._id,
          isOccupied: true,
        });

        return {
          ...room.toObject(),
          occupiedBeds,
          hostel: room.hostelId,
        };
      })
    );

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error("[API:Rooms] Fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching rooms.",
    });
  }
});

// DELETE /api/rooms/:id
router.delete("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }

    const occupiedBeds = await Bed.countDocuments({
      roomId: room._id,
      isOccupied: true,
    });

    if (occupiedBeds > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Cannot delete a room with occupied beds. Reassign students first.",
      });
    }

    await Bed.deleteMany({ roomId: room._id });

    await Hostel.findByIdAndUpdate(room.hostelId, {
      $inc: {
        totalCapacity: -room.totalBeds,
        availableCapacity: -room.availableBeds,
      },
    });

    await Room.findByIdAndDelete(req.params.id);

    console.log(`[API:Rooms] Deleted room ${room.roomNumber}`);

    res.json({
      success: true,
      message: `Room ${room.roomNumber} deleted successfully.`,
    });
  } catch (err) {
    console.error("[API:Rooms] Delete error:", err);
    res.status(500).json({
      success: false,
      message: "Error deleting room.",
    });
  }
});

module.exports = router;
