const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Hostel = require("../models/Hostel");
const Room = require("../models/Room");
const Bed = require("../models/Bed");
const Student = require("../models/Student");
const { calculateCompatibility } = require("../utils/roommateMatching");

// Generate real assignments for submitted applications. Applications are processed
// by CGPA (highest first), then submission date. A bed is reserved immediately so
// another application cannot be assigned to the same bed during this run.
router.post("/run", async (req, res) => {
  const results = { allocated: [], notAllocated: [] };
  try {
      const filter = { status: { $in: ["SUBMITTED", "UNDER_REVIEW"] } };
      if (req.body.applicationId) filter._id = req.body.applicationId;
      const applications = await Application.find(filter).sort({ cgpa: -1, submittedAt: 1 });

      for (const application of applications) {
        const prefs = [...(application.preferences || [])].sort((a, b) => a.priority - b.priority);
        let assigned = null;

        for (const preference of prefs) {
          const hostelQuery = preference.hostelId
            ? { _id: preference.hostelId }
            : preference.hostelCode
              ? { code: preference.hostelCode.toUpperCase() }
              : preference.hostelName
                ? { name: preference.hostelName }
                : null;
          if (!hostelQuery) continue;
          const hostel = await Hostel.findOne(hostelQuery);
          if (!hostel) continue;
          if (hostel.genderAllowed !== "Co-ed" && hostel.genderAllowed !== application.gender) continue;

          const roomQuery = { hostelId: hostel._id, availableBeds: { $gt: 0 } };
          if (preference.roomType) roomQuery.roomType = preference.roomType;
          if (preference.acPreference && preference.acPreference !== "Either") roomQuery.acType = preference.acPreference;
          if (application.specialAccommodations && /ground|mobility|wheelchair|accessible/i.test(application.specialAccommodations)) {
            roomQuery.isPwDAccessible = true;
          }
          const rooms = await Room.find(roomQuery).sort({ floor: 1, roomNumber: 1 });

          for (const room of rooms) {
            const roomBeds = await Bed.find({ roomId: room._id }).sort({ bedNumber: 1 });
            const existingGenders = new Set(roomBeds
              .filter((candidate) => candidate.isOccupied && candidate.occupiedBy?.gender)
              .map((candidate) => candidate.occupiedBy.gender));
            // Even in a co-ed hostel, do not place different genders in the same room.
            if (existingGenders.size > 0 && !existingGenders.has(application.gender)) continue;
            const bed = roomBeds.find((candidate) => !candidate.isOccupied);
            if (!bed) continue;
            bed.isOccupied = true;
            bed.occupiedBy = {
              rollNumber: application.studentRollNumber,
              name: application.studentName,
              department: application.department,
              gender: application.gender,
            };
            await bed.save();

            room.availableBeds = Math.max(0, room.availableBeds - 1);
            await room.save();
            hostel.availableCapacity = Math.max(0, hostel.availableCapacity - 1);
            await hostel.save();

            application.status = "ALLOCATED";
            application.assignedHostelId = hostel._id;
            application.assignedHostelName = hostel.name;
            application.assignedRoomId = room._id;
            application.assignedRoomNumber = room.roomNumber;
            application.assignedBedNumber = String(bed.bedNumber);
            application.allocatedAt = new Date();
            await application.save();

            assigned = {
              applicationId: application.applicationId,
              studentRollNumber: application.studentRollNumber,
              studentName: application.studentName,
              hostel: hostel.name,
              roomNumber: room.roomNumber,
              bedNumber: String(bed.bedNumber),
              preferencePriority: preference.priority,
            };
            break;
          }
          if (assigned) break;
        }
        if (assigned) results.allocated.push(assigned);
        else results.notAllocated.push({
          applicationId: application.applicationId,
          studentRollNumber: application.studentRollNumber,
          studentName: application.studentName,
          reason: "No available bed matched the student's hostel, room, AC, gender, and accessibility preferences.",
        });
      }
    res.json({ success: true, message: `Allocation run complete: ${results.allocated.length} allocated, ${results.notAllocated.length} not allocated.`, data: results });
  } catch (err) {
    console.error("[API:Allocations] Allocation run failed:", err);
    res.status(500).json({ success: false, message: "Allocation failed. Check the server logs and current bed occupancy before retrying." });
  }
});


router.get("/roommates/:rollNumber", async (req, res) => {
  try {
    const rollNumber = req.params.rollNumber.trim().toUpperCase();

    const application = await Application.findOne({
      studentRollNumber: rollNumber,
      status: "ALLOCATED",
      assignedRoomId: { $ne: null }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Student has no confirmed room allocation yet."
      });
    }

    const currentStudent = await Student.findOne({ rollNumber }).lean();

    if (!currentStudent) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found."
      });
    }

    const beds = await Bed.find({
      roomId: application.assignedRoomId,
      isOccupied: true
    }).lean();

    const roommateRollNumbers = beds
      .filter(bed => bed.occupiedBy?.rollNumber !== rollNumber)
      .map(bed => bed.occupiedBy?.rollNumber)
      .filter(Boolean);

    const roommates = [];

    for (const roommateRollNumber of roommateRollNumbers) {
      const roommate = await Student.findOne({
        rollNumber: roommateRollNumber
      }).lean();

      if (!roommate) continue;

      const compatibility = calculateCompatibility(
        currentStudent,
        roommate
      );

      roommates.push({
        rollNumber: roommate.rollNumber,
        name: roommate.name,
        department: roommate.department,
        compatibility
      });
    }

    res.json({
      success: true,
      data: {
        hostel: application.assignedHostelName,
        roomNumber: application.assignedRoomNumber,
        roommates
      }
    });

  } catch (err) {
    console.error("Roommate matching error:", err);

    res.status(500).json({
      success: false,
      message: "Could not retrieve roommate compatibility."
    });
  }
});



router.get("/roommates/:rollNumber", async (req, res) => {
  try {
    const application = await Application.findOne({
      studentRollNumber: req.params.rollNumber.trim().toUpperCase(),
      status: "ALLOCATED",
      assignedRoomId: { $ne: null },
    });
    if (!application) return res.status(404).json({ success: false, message: "Student has no confirmed room allocation yet." });
    const beds = await Bed.find({ roomId: application.assignedRoomId, isOccupied: true }).lean();
    const roommates = beds
      .filter((bed) => bed.occupiedBy?.rollNumber !== application.studentRollNumber)
      .map((bed) => ({
        rollNumber: bed.occupiedBy?.rollNumber || "",
        name: bed.occupiedBy?.name || "",
        department: bed.occupiedBy?.department || "",
        bedNumber: bed.bedNumber,
      }));
    res.json({ success: true, count: roommates.length, data: { hostel: application.assignedHostelName, roomNumber: application.assignedRoomNumber, roommates } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not retrieve roommate details." });
  }
});

module.exports = router;
