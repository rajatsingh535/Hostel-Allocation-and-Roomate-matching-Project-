
const express = require("express");
const router = express.Router();

const Application = require("../models/Application");
const Hostel = require("../models/Hostel");
const Room = require("../models/Room");
const Bed = require("../models/Bed");
const Student = require("../models/Student");

const { calculateCompatibility } = require("../utils/roommateMatching");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Prevent overlapping allocation runs in the same server process.
let allocationRunInProgress = false;


// Release a reserved bed.
async function releaseBed(bed, application) {
  await Bed.updateOne(
    {
      _id: bed._id,
      isOccupied: true,
      "occupiedBy.rollNumber": application.studentRollNumber
    },
    {
      $set: { isOccupied: false },
      $unset: { occupiedBy: 1 }
    }
  );
}


// Clear the room gender only when the room has no occupied beds.
async function clearRoomGenderIfEmpty(roomId, gender) {
  const occupiedBeds = await Bed.countDocuments({
    roomId,
    isOccupied: true
  });

  if (occupiedBeds === 0) {
    await Room.updateOne(
      {
        _id: roomId,
        occupancyGender: gender
      },
      {
        $set: { occupancyGender: null }
      }
    );
  }
}


// Restore completed allocation steps if allocation fails.
async function rollbackAllocation({
  bed,
  room,
  hostel,
  application,
  roomCountUpdated,
  hostelCountUpdated
}) {
  if (hostelCountUpdated) {
    await Hostel.updateOne(
      { _id: hostel._id },
      { $inc: { availableCapacity: 1 } }
    );
  }

  if (roomCountUpdated) {
    await Room.updateOne(
      { _id: room._id },
      { $inc: { availableBeds: 1 } }
    );
  }

  if (bed) {
    await releaseBed(bed, application);
  }

  await clearRoomGenderIfEmpty(
    room._id,
    application.gender
  );
}


// POST /api/allocations/run
// Allocate rooms according to student preferences.
router.post("/run", adminMiddleware, async (req, res) => {

  if (allocationRunInProgress) {
    return res.status(409).json({
      success: false,
      message: "An allocation run is already in progress. Please try again later."
    });
  }

  allocationRunInProgress = true;

  const results = {
    allocated: [],
    notAllocated: []
  };

  try {
    const filter = {
      status: { $in: ["SUBMITTED", "UNDER_REVIEW"] }
    };

    if (req.body.applicationId !== undefined) {
      if (
        typeof req.body.applicationId !== "string" ||
        !req.body.applicationId.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "A valid application ID is required."
        });
      }

      filter.applicationId = req.body.applicationId.trim();
    }

    const applications = await Application.find(filter)
      .sort({ cgpa: -1, submittedAt: 1 });

    for (const application of applications) {
      const preferences = [...(application.preferences || [])]
        .sort((a, b) => a.priority - b.priority);

      let assigned = null;
      let applicationChanged = false;

      for (const preference of preferences) {
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

        if (
          hostel.genderAllowed !== "Co-ed" &&
          hostel.genderAllowed !== application.gender
        ) {
          continue;
        }

        const roomQuery = {
          hostelId: hostel._id,
          availableBeds: { $gt: 0 }
        };

        if (preference.roomType) {
          roomQuery.roomType = preference.roomType;
        }

        if (
          preference.acPreference &&
          preference.acPreference !== "Either"
        ) {
          roomQuery.acType = preference.acPreference;
        }

        if (
          application.specialAccommodations &&
          /ground|mobility|wheelchair|accessible/i.test(
            application.specialAccommodations
          )
        ) {
          roomQuery.isPwDAccessible = true;
        }

        const rooms = await Room.find(roomQuery)
          .sort({ floor: 1, roomNumber: 1 });

        for (const room of rooms) {

          // Atomically lock the room to the student's gender.
          const lockedRoom = await Room.findOneAndUpdate(
            {
              _id: room._id,
              availableBeds: { $gt: 0 },
              $or: [
                { occupancyGender: null },
                { occupancyGender: application.gender }
              ]
            },
            {
              $set: {
                occupancyGender: application.gender
              }
            },
            {
              new: true
            }
          );

          if (!lockedRoom) continue;

          let bed = null;
          let roomCountUpdated = false;
          let hostelCountUpdated = false;

          try {
            // Atomically reserve an unoccupied bed.
            bed = await Bed.findOneAndUpdate(
              {
                roomId: room._id,
                isOccupied: false
              },
              {
                $set: {
                  isOccupied: true,
                  occupiedBy: {
                    rollNumber: application.studentRollNumber,
                    name: application.studentName,
                    department: application.department,
                    gender: application.gender
                  }
                }
              },
              {
                new: true,
                sort: { bedNumber: 1 },
                runValidators: true
              }
            );

            if (!bed) {
              await clearRoomGenderIfEmpty(
                room._id,
                application.gender
              );
              continue;
            }

            // Atomically decrease room availability.
            const roomUpdate = await Room.updateOne(
              {
                _id: room._id,
                availableBeds: { $gt: 0 },
                occupancyGender: application.gender
              },
              {
                $inc: { availableBeds: -1 }
              }
            );

            if (roomUpdate.modifiedCount !== 1) {
              const error = new Error("Room capacity update failed.");
              error.code = "ALLOCATION_CONFLICT";
              throw error;
            }

            roomCountUpdated = true;

            // Atomically decrease hostel availability.
            const hostelUpdate = await Hostel.updateOne(
              {
                _id: hostel._id,
                availableCapacity: { $gt: 0 }
              },
              {
                $inc: { availableCapacity: -1 }
              }
            );

            if (hostelUpdate.modifiedCount !== 1) {
              const error = new Error("Hostel capacity update failed.");
              error.code = "ALLOCATION_CONFLICT";
              throw error;
            }

            hostelCountUpdated = true;

            // Update only if the application is still pending.
            const updatedApplication =
              await Application.findOneAndUpdate(
                {
                  _id: application._id,
                  status: {
                    $in: ["SUBMITTED", "UNDER_REVIEW"]
                  }
                },
                {
                  $set: {
                    status: "ALLOCATED",
                    assignedHostelId: hostel._id,
                    assignedHostelName: hostel.name,
                    assignedRoomId: room._id,
                    assignedRoomNumber: room.roomNumber,
                    assignedBedNumber: String(bed.bedNumber),
                    allocatedAt: new Date()
                  }
                },
                {
                  new: true,
                  runValidators: true
                }
              );

            if (!updatedApplication) {
              applicationChanged = true;

              const error = new Error(
                "Application status changed during allocation."
              );

              error.code = "ALLOCATION_CONFLICT";
              throw error;
            }

            assigned = {
              applicationId: application.applicationId,
              studentRollNumber: application.studentRollNumber,
              studentName: application.studentName,
              hostel: hostel.name,
              roomNumber: room.roomNumber,
              bedNumber: String(bed.bedNumber),
              preferencePriority: preference.priority
            };

            break;

          } catch (error) {

            // Perform rollback only once.
            await rollbackAllocation({
              bed,
              room,
              hostel,
              application,
              roomCountUpdated,
              hostelCountUpdated
            });

            if (error.code === "ALLOCATION_CONFLICT") {
              if (applicationChanged) break;
              continue;
            }

            throw error;
          }
        }

        if (assigned || applicationChanged) break;
      }

      if (assigned) {
        results.allocated.push(assigned);
      } else if (applicationChanged) {
        results.notAllocated.push({
          applicationId: application.applicationId,
          studentRollNumber: application.studentRollNumber,
          studentName: application.studentName,
          reason: "Application status changed during allocation."
        });
      } else {
        results.notAllocated.push({
          applicationId: application.applicationId,
          studentRollNumber: application.studentRollNumber,
          studentName: application.studentName,
          reason:
            "No available bed matched the student's hostel, room, AC, gender, and accessibility preferences."
        });
      }
    }

    return res.json({
      success: true,
      message: `Allocation run complete: ${results.allocated.length} allocated, ${results.notAllocated.length} not allocated.`,
      data: results
    });

  } catch (err) {
    console.error("[API:Allocations] Allocation run failed:", err);

    return res.status(500).json({
      success: false,
      message:
        "Allocation failed. Check the server logs and current bed occupancy before retrying."
    });

  } finally {
    allocationRunInProgress = false;
  }
});


// GET /api/allocations/roommates/:rollNumber
// Retrieve roommates and compatibility scores.
router.get(
  "/roommates/:rollNumber",
  authMiddleware,
  async (req, res) => {
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

      const currentStudent = await Student.findOne({
        rollNumber
      }).lean();

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
        .filter(
          bed => bed.occupiedBy?.rollNumber !== rollNumber
        )
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

      return res.json({
        success: true,
        data: {
          hostel: application.assignedHostelName,
          roomNumber: application.assignedRoomNumber,
          roommates
        }
      });

    } catch (err) {
      console.error("Roommate matching error:", err);

      return res.status(500).json({
        success: false,
        message: "Could not retrieve roommate compatibility."
      });
    }
  }
);

module.exports = router;
