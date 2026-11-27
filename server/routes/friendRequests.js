const express = require("express");
const router = express.Router();

let friendRequests = [];
let groupBookings = [];

// POST /api/friend-requests/send
router.post("/send", async (req, res) => {
  try {
    const { fromStudent, toStudent, senderRollNumber, receiverRollNumber, message } = req.body;

    const normalizedFrom = fromStudent || {
      rollNumber: String(senderRollNumber || "12304567").trim(),
      name: req.body.senderName || "LPU Student",
    };
    const normalizedTo = toStudent || {
      rollNumber: String(receiverRollNumber || "12345680").trim(),
      name: req.body.receiverName || "Matched Roommate",
    };

    if (!normalizedFrom.rollNumber || !normalizedTo.rollNumber) {
      return res.status(400).json({
        success: false,
        message: "Both sender and receiver roll numbers are required.",
      });
    }

    if (normalizedFrom.rollNumber === normalizedTo.rollNumber) {
      return res.status(400).json({
        success: false,
        code: "SELF_INVITE_FORBIDDEN",
        message: "You cannot send a roommate pairing invite to your own Registration Number.",
      });
    }

    const request = {
      id: Date.now().toString(),
      pairingToken: `LPU-PAIR-${Date.now().toString().slice(-6)}`,
      fromStudent: normalizedFrom,
      toStudent: normalizedTo,
      message: message || `${normalizedFrom.name} wants to be your roommate!`,
      status: "pending",
      createdAt: new Date(),
    };

    friendRequests.push(request);

    res.status(201).json({
      success: true,
      message: "Roommate pairing invite sent successfully",
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

// GET /api/friend-requests/received/:rollNumber
router.get("/received/:rollNumber", async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const received = friendRequests.filter(
      (r) => r.toStudent?.rollNumber === rollNumber && r.status === "pending"
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

// GET /api/friend-requests/sent/:rollNumber
router.get("/sent/:rollNumber", async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const sent = friendRequests.filter((r) => r.fromStudent?.rollNumber === rollNumber);
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

// PATCH /api/friend-requests/:id/:action
router.patch("/:id/:action", async (req, res) => {
  try {
    const { id, action } = req.params;
    const request = friendRequests.find((r) => r.id === id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    request.status = action === "accept" ? "accepted" : "rejected";
    request.updatedAt = new Date();

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

// POST /api/friend-requests/group
router.post("/group", async (req, res) => {
  try {
    const { students, preferences } = req.body;
    const group = {
      id: Date.now().toString(),
      students: students || [],
      preferences: preferences || [],
      createdAt: new Date(),
      status: "active",
    };
    groupBookings.push(group);
    res.status(201).json({
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

// GET /api/friend-requests/groups/:rollNumber
router.get("/groups/:rollNumber", async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const myGroups = groupBookings.filter((group) =>
      (group.students || []).some((s) => s?.rollNumber === rollNumber)
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

// GET /api/friend-requests/all
router.get("/all", async (req, res) => {
  res.json({
    success: true,
    data: {
      requests: friendRequests,
      groups: groupBookings,
    },
  });
});

module.exports = router;
