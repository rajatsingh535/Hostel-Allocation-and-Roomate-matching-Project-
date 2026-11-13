const express = require("express");
const router = express.Router();
const RoomSwap = require("../models/RoomSwap");

// @route   GET /api/room-swaps
// @desc    Get all room swap requests (with optional filters)
// @access  Public (in demo mode)
router.get("/", async (req, res) => {
  try {
    const { status, roll, gender } = req.query;
    let filter = {};
    
    if (status) filter.status = status;
    if (roll) filter.requestedByRoll = roll;
    if (gender) filter.requestedByGender = gender;
    
    const swaps = await RoomSwap.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      count: swaps.length,
      data: swaps,
    });
  } catch (error) {
    console.error("Error fetching room swaps:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch room swap requests",
      error: error.message,
    });
  }
});

// @route   GET /api/room-swaps/:id
// @desc    Get single room swap request by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const swap = await RoomSwap.findById(req.params.id);
    
    if (!swap) {
      return res.status(404).json({
        success: false,
        message: "Room swap request not found",
      });
    }
    
    res.json({
      success: true,
      data: swap,
    });
  } catch (error) {
    console.error("Error fetching room swap:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch room swap request",
      error: error.message,
    });
  }
});

// @route   POST /api/room-swaps
// @desc    Create a new room swap request
// @access  Public (in demo mode)
router.post("/", async (req, res) => {
  try {
    const {
      requestedByName,
      requestedByRoll,
      requestedByGender,
      currentHostel,
      currentRoom,
      currentBedNumber,
      targetStudentRoll,
      targetStudentName,
      targetHostel,
      targetRoomType,
      reason,
    } = req.body;
    
    // Validation
    if (!requestedByName || !requestedByRoll || !requestedByGender || !currentHostel || !currentRoom || !reason) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    
    // Check for existing pending swap for this student
    const existingSwap = await RoomSwap.findOne({
      requestedByRoll,
      status: "PENDING",
    });
    
    if (existingSwap) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending room swap request. Please wait for it to be processed.",
      });
    }
    
    const newSwap = new RoomSwap({
      requestedByName,
      requestedByRoll,
      requestedByGender,
      currentHostel,
      currentRoom,
      currentBedNumber,
      targetStudentRoll,
      targetStudentName,
      targetHostel,
      targetRoomType,
      reason,
      status: "PENDING",
    });
    
    const savedSwap = await newSwap.save();
    
    res.status(201).json({
      success: true,
      message: "Room swap request submitted successfully",
      data: savedSwap,
    });
  } catch (error) {
    console.error("Error creating room swap:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create room swap request",
      error: error.message,
    });
  }
});

// @route   PUT /api/room-swaps/:id/status
// @desc    Update room swap status (Admin action)
// @access  Admin
router.put("/:id/status", async (req, res) => {
  try {
    const { status, adminNotes, matchedWithRoll, matchedWithName } = req.body;
    
    const swap = await RoomSwap.findById(req.params.id);
    
    if (!swap) {
      return res.status(404).json({
        success: false,
        message: "Room swap request not found",
      });
    }
    
    swap.status = status || swap.status;
    swap.adminNotes = adminNotes || swap.adminNotes;
    swap.processedAt = new Date();
    
    if (status === "COMPLETED" && matchedWithRoll && matchedWithName) {
      swap.matchedWithRoll = matchedWithRoll;
      swap.matchedWithName = matchedWithName;
      swap.swapCompletedAt = new Date();
    }
    
    const updatedSwap = await swap.save();
    
    res.json({
      success: true,
      message: `Room swap request ${status.toLowerCase()}`,
      data: updatedSwap,
    });
  } catch (error) {
    console.error("Error updating room swap status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update room swap status",
      error: error.message,
    });
  }
});

// @route   DELETE /api/room-swaps/:id
// @desc    Cancel room swap request (Student action)
// @access  Public
router.delete("/:id", async (req, res) => {
  try {
    const swap = await RoomSwap.findById(req.params.id);
    
    if (!swap) {
      return res.status(404).json({
        success: false,
        message: "Room swap request not found",
      });
    }
    
    if (swap.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Only pending swap requests can be cancelled",
      });
    }
    
    swap.status = "CANCELLED";
    await swap.save();
    
    res.json({
      success: true,
      message: "Room swap request cancelled successfully",
      data: swap,
    });
  } catch (error) {
    console.error("Error cancelling room swap:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel room swap request",
      error: error.message,
    });
  }
});

module.exports = router;
