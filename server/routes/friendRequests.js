const express = require("express");
const router = express.Router();

// In-memory storage for friend requests (replace with MongoDB in production)
let friendRequests = [];
let groupBookings = [];

// Send friend request
router.post("/send", async (req, res) => {
  try {
    const { fromStudent, toStudent, message } = req.body;
    
    const request = {
      id: Date.now().toString(),
      fromStudent,
      toStudent,
      message: message || `${fromStudent.name} wants to be your roommate!`,
      status: "pending",
      createdAt: new Date(),
    };
    
    friendRequests.push(request);
    
    res.json({
      success: true,
      message: "Friend request sent successfully",
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending friend request",
      error: error.message,
    });
  }
});

// Get received friend requests
router.get("/received/:rollNumber", async (req, res) => {
  try {
    const { rollNumber } = req.params;
    
    const received = friendRequests.filter(
      req => req.toStudent.rollNumber === rollNumber && req.status === "pending"
    );
    
    res.json({
      success: true,
      data: received,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching friend requests",
      error: error.message,
    });
  }
});

// Get sent friend requests
router.get("/sent/:rollNumber", async (req, res) => {
  try {
    const { rollNumber } = req.params;
    
    const sent = friendRequests.filter(
      req => req.fromStudent.rollNumber === rollNumber
    );
    
    res.json({
      success: true,
      data: sent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching sent requests",
      error: error.message,
    });
  }
});

// Accept/Reject friend request
router.patch("/:id/:action", async (req, res) => {
  try {
    const { id, action } = req.params;
    
    const request = friendRequests.find(r => r.id === id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }
    
    request.status = action === "accept" ? "accepted" : "rejected";
    request.updatedAt = new Date();
    
    // If accepted, create a group booking
    if (action === "accept") {
      const group = {
        id: Date.now().toString(),
        students: [request.fromStudent, request.toStudent],
        createdAt: new Date(),
        status: "active",
      };
      groupBookings.push(group);
    }
    
    res.json({
      success: true,
      message: `Friend request ${action}ed successfully`,
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating friend request",
      error: error.message,
    });
  }
});

// Create group booking
router.post("/group", async (req, res) => {
  try {
    const { students, preferences } = req.body;
    
    const group = {
      id: Date.now().toString(),
      students,
      preferences,
      createdAt: new Date(),
      status: "active",
    };
    
    groupBookings.push(group);
    
    res.json({
      success: true,
      message: "Group booking created successfully",
      data: group,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating group booking",
      error: error.message,
    });
  }
});

// Get my groups
router.get("/groups/:rollNumber", async (req, res) => {
  try {
    const { rollNumber } = req.params;
    
    const myGroups = groupBookings.filter(group =>
      group.students.some(s => s.rollNumber === rollNumber)
    );
    
    res.json({
      success: true,
      data: myGroups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching groups",
      error: error.message,
    });
  }
});

// Get all friend requests (admin)
router.get("/all", async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        requests: friendRequests,
        groups: groupBookings,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching data",
      error: error.message,
    });
  }
});

module.exports = router;
