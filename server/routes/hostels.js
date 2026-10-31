const express = require("express");
const router = express.Router();
const Hostel = require("../models/Hostel");
const Room = require("../models/Room");
const Bed = require("../models/Bed");
const adminMiddleware = require("../middleware/adminMiddleware");
// GET /api/hostels  — list all with room stats
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
        return { ...hostel, totalRooms, totalBeds, availableBeds };
      })
    );

    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (err) {
    console.error("[API:Hostels] Error fetching hostels:", err);
    res.status(500).json({ success: false, message: "Internal server error fetching hostels." });
  }
});

// GET /api/hostels/:id
router.get("/:id", async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id).lean();
    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found." });
    res.json({ success: true, data: hostel });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching hostel details." });
  }
});

// GET /api/hostels/:id/rooms
router.get("/:id/rooms",adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { roomType, acType } = req.query;
    const query = { hostelId: id };
    if (roomType && roomType !== "All") query.roomType = roomType;
    if (acType && acType !== "All") query.acType = acType;

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

// POST /api/hostels  — create a new hostel
router.post("/", adminMiddleware,async (req, res) => {
  try {
    const {
      name, code, genderAllowed, campusLocation,
      totalCapacity, availableCapacity, amenities, description,
    } = req.body;

    if (!name || !code || !genderAllowed || !campusLocation) {
      return res.status(400).json({ success: false, message: "Name, code, gender and location are required." });
    }

    const existing = await Hostel.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: `Hostel code ${code} already exists.` });
    }

    const hostel = await Hostel.create({
      name,
      code: code.toUpperCase(),
      genderAllowed,
      campusLocation,
      totalCapacity: Number(totalCapacity) || 0,
      availableCapacity: Number(availableCapacity) || 0,
      amenities: amenities || [],
      description: description || "",
    });

    console.log(`[API:Hostels] Created hostel ${hostel.code}`);
    res.status(201).json({ success: true, message: "Hostel created successfully.", data: hostel });
  } catch (err) {
    console.error("[API:Hostels] Create error:", err);
    res.status(500).json({ success: false, message: "Error creating hostel." });
  }
});

// POST /api/hostels/:id/rooms  — add a room to a hostel
router.post("/:id/rooms",adminMiddleware, async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found." });

    const { roomNumber, floor, roomType, acType, totalBeds, rentPerSemester, isPwDAccessible } = req.body;
    if (!roomNumber || !roomType || !acType || !totalBeds) {
      return res.status(400).json({ success: false, message: "Room number, type, AC type and beds are required." });
    }

    // Use first block of hostel or create a dummy blockId reference
    const Block = require("../models/Block");
    let block = await Block.findOne({ hostelId: hostel._id });
    if (!block) {
      block = await Block.create({
        name: "Block A",
        hostelId: hostel._id,
        floorsCount: Number(floor) || 1,
      });
    }

    const room = await Room.create({
      roomNumber,
      floor: Number(floor) || 1,
      blockId: block._id,
      hostelId: hostel._id,
      roomType,
      acType,
      totalBeds: Number(totalBeds),
      availableBeds: Number(totalBeds),
      rentPerSemester: Number(rentPerSemester) || 15000,
      isPwDAccessible: isPwDAccessible || false,
    });

    // Create bed records
    const beds = [];
    for (let i = 1; i <= Number(totalBeds); i++) {
      beds.push({ bedNumber: String(i), roomId: room._id, hostelId: hostel._id, isOccupied: false });
    }
    await Bed.insertMany(beds);

    // Update hostel capacity
    await Hostel.findByIdAndUpdate(hostel._id, {
      $inc: {
        totalCapacity: Number(totalBeds),
        availableCapacity: Number(totalBeds),
      },
    });

    console.log(`[API:Hostels] Added room ${roomNumber} to hostel ${hostel.code}`);
    res.status(201).json({ success: true, message: "Room added successfully.", data: room });
  } catch (err) {
    console.error("[API:Hostels] Add room error:", err);
    res.status(500).json({ success: false, message: "Error adding room." });
  }
});

// DELETE /api/hostels/:id  — delete hostel + all its rooms + beds
router.delete("/:id",adminMiddleware, async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found." });

    const occupiedBeds = await Bed.countDocuments({ hostelId: hostel._id, isOccupied: true });
    if (occupiedBeds > 0) {
      return res.status(409).json({ success: false, message: "Cannot delete a hostel with occupied beds. Reassign students first." });
    }
    const rooms = await Room.find({ hostelId: hostel._id });

    await Bed.deleteMany({ hostelId: hostel._id });
    await Room.deleteMany({ hostelId: hostel._id });
    await Hostel.findByIdAndDelete(hostel._id);

    console.log(`[API:Hostels] Deleted hostel ${hostel.code} with ${rooms.length} rooms`);
    res.json({ success: true, message: `Hostel ${hostel.code} and all its rooms deleted.` });
  } catch (err) {
    console.error("[API:Hostels] Delete error:", err);
    res.status(500).json({ success: false, message: "Error deleting hostel." });
  }
});

module.exports = router;
