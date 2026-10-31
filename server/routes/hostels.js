const express = require("express");
const router = express.Router();
const Hostel = require("../models/Hostel");
const Room = require("../models/Room");
const Bed = require("../models/Bed");
const Block = require("../models/Block");
const adminMiddleware = require("../middleware/adminMiddleware");

// GET /api/hostels  — list all hostels with real-time room & bed stats
router.get("/", async (req, res) => {
  try {
    const { gender, search } = req.query;
    const query = {};
    if (gender && gender !== "All") query.genderAllowed = gender;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
        { campusLocation: { $regex: search, $options: "i" } },
      ];
    }

    const hostels = await Hostel.find(query).sort({ name: 1 }).lean();
    const enriched = await Promise.all(
      hostels.map(async (hostel) => {
        const rooms = await Room.find({ hostelId: hostel._id }).lean();
        const totalRooms = rooms.length;
        const totalBeds = rooms.reduce((acc, r) => acc + (r.totalBeds || 0), 0);
        const availableBeds = rooms.reduce((acc, r) => acc + (r.availableBeds || 0), 0);
        return {
          ...hostel,
          totalRooms: totalRooms || 90,
          totalBeds: totalBeds || hostel.totalCapacity || 360,
          availableBeds: availableBeds !== undefined ? availableBeds : hostel.availableCapacity || 360,
        };
      })
    );

    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (err) {
    console.error("[API:Hostels] Error fetching hostels:", err);
    res.status(500).json({ success: false, message: "Internal server error fetching hostels." });
  }
});

// GET /api/hostels/:id  — get single hostel details
router.get("/:id", async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id).lean();
    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found." });
    res.json({ success: true, data: hostel });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching hostel details." });
  }
});

// GET /api/hostels/:id/rooms  — list rooms for a hostel (Accessible to students & admins)
router.get("/:id/rooms", async (req, res) => {
  try {
    const { id } = req.params;
    const { roomType, acType, floor } = req.query;
    const query = { hostelId: id };
    if (roomType && roomType !== "All") query.roomType = roomType;
    if (acType && acType !== "All") query.acType = acType;
    if (floor) query.floor = Number(floor);

    const rooms = await Room.find(query).sort({ floor: 1, roomNumber: 1 }).lean();
    const roomsWithBeds = await Promise.all(
      rooms.map(async (room) => {
        const beds = await Bed.find({ roomId: room._id }).sort({ bedNumber: 1 }).lean();
        return { ...room, beds };
      })
    );

    res.json({ success: true, count: roomsWithBeds.length, data: roomsWithBeds });
  } catch (err) {
    console.error("[API:Rooms] Error fetching rooms for hostel:", err);
    res.status(500).json({ success: false, message: "Error fetching rooms." });
  }
});

// POST /api/hostels  — create a new hostel (Admin only)
router.post("/", adminMiddleware, async (req, res) => {
  try {
    const {
      name,
      code,
      genderAllowed,
      campusLocation,
      totalCapacity,
      availableCapacity,
      amenities,
      description,
    } = req.body;

    if (!name || !code || !genderAllowed || !campusLocation) {
      return res.status(400).json({
        success: false,
        message: "Name, code, genderAllowed, and campusLocation are required.",
      });
    }

    const cleanCode = code.trim().toUpperCase();
    const existing = await Hostel.findOne({ code: cleanCode });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Hostel code ${cleanCode} already exists.`,
      });
    }

    const totCap = Number(totalCapacity) || 360;
    const availCap = availableCapacity !== undefined ? Number(availableCapacity) : totCap;

    const hostel = await Hostel.create({
      name: name.trim(),
      code: cleanCode,
      genderAllowed,
      campusLocation: campusLocation.trim(),
      totalCapacity: totCap,
      availableCapacity: availCap,
      amenities: Array.isArray(amenities) ? amenities : (amenities || "").split(",").map((a) => a.trim()).filter(Boolean),
      description: description || `Modern residential facility for LPU students.`,
      imageUrl: genderAllowed === "Female"
        ? "https://images.unsplash.com/photo-1596516109370-65d1f33bd24e?auto=format&fit=crop&w=800&q=80"
        : "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    });

    console.log(`[API:Hostels] Created hostel ${hostel.code}`);
    res.status(201).json({ success: true, message: "Hostel block successfully created in database.", data: hostel });
  } catch (err) {
    console.error("[API:Hostels] Create error:", err);
    res.status(500).json({ success: false, message: "Error creating hostel: " + err.message });
  }
});

// POST /api/hostels/:id/rooms  — add a room to a hostel (Admin only)
router.post("/:id/rooms", adminMiddleware, async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found." });

    const { roomNumber, floor, roomType, acType, totalBeds, rentPerSemester, isPwDAccessible } = req.body;
    if (!roomNumber || !roomType || !acType || !totalBeds) {
      return res.status(400).json({ success: false, message: "Room number, type, AC type, and beds are required." });
    }

    let block = await Block.findOne({ hostelId: hostel._id });
    if (!block) {
      block = await Block.create({
        name: `Floor ${floor || 1}`,
        code: `${hostel.code}-F${floor || 1}`,
        hostelId: hostel._id,
        floorsCount: 1,
      });
    }

    const bedsCount = Number(totalBeds) || 4;

    const room = await Room.create({
      roomNumber: String(roomNumber).trim(),
      floor: Number(floor) || 1,
      blockId: block._id,
      hostelId: hostel._id,
      roomType,
      acType,
      totalBeds: bedsCount,
      availableBeds: bedsCount,
      rentPerSemester: Number(rentPerSemester) || (acType === "AC" ? 25000 : 18000),
      isPwDAccessible: Boolean(isPwDAccessible),
    });

    // Create bed records
    const beds = [];
    for (let i = 1; i <= bedsCount; i++) {
      beds.push({
        bedNumber: String(i),
        roomId: room._id,
        hostelId: hostel._id,
        isOccupied: false,
      });
    }
    await Bed.insertMany(beds);

    // Update hostel capacity
    await Hostel.findByIdAndUpdate(hostel._id, {
      $inc: {
        totalCapacity: bedsCount,
        availableCapacity: bedsCount,
      },
    });

    console.log(`[API:Hostels] Added room ${roomNumber} to hostel ${hostel.code}`);
    res.status(201).json({ success: true, message: `Room ${roomNumber} added successfully to ${hostel.code}.`, data: room });
  } catch (err) {
    console.error("[API:Hostels] Add room error:", err);
    res.status(500).json({ success: false, message: "Error adding room: " + err.message });
  }
});

// DELETE /api/hostels/:id  — delete hostel + its rooms + beds (Admin only)
router.delete("/:id", adminMiddleware, async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found." });

    const occupiedBeds = await Bed.countDocuments({ hostelId: hostel._id, isOccupied: true });
    if (occupiedBeds > 0) {
      return res.status(409).json({
        success: false,
        message: `Cannot delete hostel ${hostel.code}: ${occupiedBeds} bed(s) are currently occupied by students. Reassign students first.`,
      });
    }

    await Bed.deleteMany({ hostelId: hostel._id });
    await Room.deleteMany({ hostelId: hostel._id });
    await Block.deleteMany({ hostelId: hostel._id });
    await Hostel.findByIdAndDelete(hostel._id);

    console.log(`[API:Hostels] Deleted hostel ${hostel.code}`);
    res.json({ success: true, message: `Hostel ${hostel.code} and its rooms have been permanently removed.` });
  } catch (err) {
    console.error("[API:Hostels] Delete error:", err);
    res.status(500).json({ success: false, message: "Error deleting hostel." });
  }
});

module.exports = router;
