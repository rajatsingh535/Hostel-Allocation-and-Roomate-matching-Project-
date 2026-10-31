const bcrypt = require("bcryptjs");
const { connectDB, closeDB } = require("./db");
const Hostel = require("./models/Hostel");
const Block = require("./models/Block");
const Room = require("./models/Room");
const Bed = require("./models/Bed");
const Student = require("./models/Student");
const Application = require("./models/Application");
const Admin = require("./models/Admin");
const Auth = require("./models/Auth");
const AllocationDraft = require("./models/AllocationDraft");

async function seedData() {
  console.log("[Seeder] Starting Week 9 database seeding process...");
  await connectDB();

  await Promise.all([
    Hostel.deleteMany(),
    Block.deleteMany(),
    Room.deleteMany(),
    Bed.deleteMany(),
    Student.deleteMany(),
    Application.deleteMany(),
    Admin.deleteMany(),
    Auth.deleteMany(),
    AllocationDraft.deleteMany(),
  ]);
  console.log("[Seeder] Cleared all previous database collections.");

  // 1. Seed Administrators & Wardens
  const adminPasswordHash = await bcrypt.hash("adminpassword", 10);
  const sampleAdmins = [
    {
      email: "admin@lpu.co.in",
      username: "admin",
      name: "Chief Hostel Warden",
      passwordHash: adminPasswordHash,
      role: "admin",
    },
    {
      email: "admin_lpu@lpu.co.in",
      username: "admin_lpu",
      name: "LPU Allotment Officer",
      passwordHash: adminPasswordHash,
      role: "admin",
    },
    {
      email: "warden@lpu.co.in",
      username: "warden",
      name: "Residential Warden",
      passwordHash: adminPasswordHash,
      role: "warden",
    },
  ];
  await Admin.insertMany(sampleAdmins);
  console.log(`[Seeder] Seeded ${sampleAdmins.length} Administrator & Warden accounts.`);

  // 2. Boys Hostels (BH1-9)
  const boysHostels = [];
  for (let i = 1; i <= 9; i++) {
    boysHostels.push({
      name: `Boys Hostel ${i}`,
      code: `BH${i}`,
      genderAllowed: "Male",
      campusLocation: `LPU Campus Block ${String.fromCharCode(64 + i)}`,
      totalCapacity: 360,
      availableCapacity: 360,
      amenities: ["High-speed WiFi", "Laundry Service", "Pure Veg Mess", "24/7 Security", "Indoor Badminton", "Reading Room"],
      imageUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
      description: `Modern 9-storey residential block for ${360} male students with elevators and cafeteria.`,
    });
  }

  // 3. Girls Hostels (GH1-3)
  const girlsHostels = [];
  for (let i = 1; i <= 3; i++) {
    girlsHostels.push({
      name: `Girls Hostel ${i}`,
      code: `GH${i}`,
      genderAllowed: "Female",
      campusLocation: `LPU Campus Block G${i}`,
      totalCapacity: 360,
      availableCapacity: 360,
      amenities: ["High-speed WiFi", "Laundry Service", "Nutritious Mess", "Biometric Security", "In-house Salon", "Study Lounge"],
      imageUrl: "https://images.unsplash.com/photo-1596516109370-65d1f33bd24e?auto=format&fit=crop&w=800&q=80",
      description: `Premium 9-storey secure residential block for ${360} female students.`,
    });
  }

  const createdHostels = await Hostel.insertMany([...boysHostels, ...girlsHostels]);
  console.log(`[Seeder] Seeded ${createdHostels.length} Hostels (BH1-9, GH1-3).`);

  // 4. Create Floors (Blocks), Rooms, and Beds
  let totalBedsCount = 0;
  for (const hostel of createdHostels) {
    const blocks = [];
    for (let floor = 1; floor <= 9; floor++) {
      blocks.push({
        hostelId: hostel._id,
        name: `Floor ${floor}`,
        code: `${hostel.code}-F${floor}`,
        floorsCount: 1,
      });
    }
    const createdBlocks = await Block.insertMany(blocks);

    for (let fIdx = 0; fIdx < createdBlocks.length; fIdx++) {
      const block = createdBlocks[fIdx];
      const floorNum = fIdx + 1;
      const rooms = [];

      // 10 rooms per floor: rooms 1-5 are AC, 6-10 are Non-AC
      for (let roomNum = 1; roomNum <= 10; roomNum++) {
        const isAC = roomNum <= 5;
        rooms.push({
          blockId: block._id,
          hostelId: hostel._id,
          roomNumber: `${floorNum}${roomNum.toString().padStart(2, "0")}`,
          floor: floorNum,
          roomType: "Quad",
          acType: isAC ? "AC" : "Non-AC",
          totalBeds: 4,
          availableBeds: 4,
          rentPerSemester: isAC ? 25000 : 18000,
          isPwDAccessible: floorNum === 1,
        });
      }

      const createdRooms = await Room.insertMany(rooms);

      // Create 4 beds for each room
      const beds = [];
      for (const room of createdRooms) {
        for (let bedNum = 1; bedNum <= 4; bedNum++) {
          beds.push({
            roomId: room._id,
            hostelId: room.hostelId,
            bedNumber: String(bedNum),
            isOccupied: false,
          });
          totalBedsCount++;
        }
      }
      await Bed.insertMany(beds);
    }
  }

  console.log(`[Seeder] Seeded ${totalBedsCount} Beds across all 12 Hostels.`);

  // 5. Seed Students with Roommate Preferences
  const studentPasswordHash = await bcrypt.hash("password123", 10);
  const sampleStudents = [
    {
      name: "Arjun Sharma",
      email: "arjun.sharma@student.lpu.co.in",
      rollNumber: "12345678",
      department: "Computer Science",
      gender: "Male",
      year: 2,
      cgpa: 8.5,
      category: "General",
      roommatePreferences: {
        sleepSchedule: "Night Owl",
        foodPreference: "Vegetarian",
        cleanliness: "Very Clean",
        studyHabits: "Quiet",
        socialHabits: "Ambivert",
        noiseTolerance: "Low",
      },
    },
    {
      name: "Rohan Gupta",
      email: "rohan.gupta@student.lpu.co.in",
      rollNumber: "12304567",
      department: "Computer Science",
      gender: "Male",
      year: 2,
      cgpa: 8.7,
      category: "General",
      roommatePreferences: {
        sleepSchedule: "Night Owl",
        foodPreference: "Vegetarian",
        cleanliness: "Very Clean",
        studyHabits: "Quiet",
        socialHabits: "Ambivert",
        noiseTolerance: "Moderate",
      },
    },
    {
      name: "Priya Patel",
      email: "priya.patel@student.lpu.co.in",
      rollNumber: "12345679",
      department: "Electronics & Comm.",
      gender: "Female",
      year: 1,
      cgpa: 9.2,
      category: "General",
      roommatePreferences: {
        sleepSchedule: "Early Bird",
        foodPreference: "Vegetarian",
        cleanliness: "Very Clean",
        studyHabits: "Quiet",
        socialHabits: "Introvert",
        noiseTolerance: "Low",
      },
    },
    {
      name: "Rahul Verma",
      email: "rahul.verma@student.lpu.co.in",
      rollNumber: "12345680",
      department: "Business Administration",
      gender: "Male",
      year: 3,
      cgpa: 7.8,
      category: "OBC",
      roommatePreferences: {
        sleepSchedule: "Flexible",
        foodPreference: "Non-Vegetarian",
        cleanliness: "Moderate",
        studyHabits: "Group Study",
        socialHabits: "Extrovert",
        noiseTolerance: "High",
      },
    },
    {
      name: "Sneha Singh",
      email: "sneha.singh@student.lpu.co.in",
      rollNumber: "12345681",
      department: "Information Technology",
      gender: "Female",
      year: 2,
      cgpa: 8.9,
      category: "General",
      roommatePreferences: {
        sleepSchedule: "Early Bird",
        foodPreference: "Vegetarian",
        cleanliness: "Very Clean",
        studyHabits: "Quiet",
        socialHabits: "Ambivert",
        noiseTolerance: "Moderate",
      },
    },
    {
      name: "Aditya Kumar",
      email: "aditya.kumar@student.lpu.co.in",
      rollNumber: "12345682",
      department: "Mechanical Engineering",
      gender: "Male",
      year: 4,
      cgpa: 8.1,
      category: "SC",
      roommatePreferences: {
        sleepSchedule: "Night Owl",
        foodPreference: "Flexible",
        cleanliness: "Moderate",
        studyHabits: "Quiet",
        socialHabits: "Ambivert",
        noiseTolerance: "Moderate",
      },
    },
  ];

  const createdStudents = await Student.insertMany(sampleStudents);
  console.log(`[Seeder] Seeded ${createdStudents.length} Students with Roommate Preferences.`);

  // 6. Seed Student Authentication Credentials (Auth model)
  const authRecords = createdStudents.map((s) => ({
    rollNumber: s.rollNumber,
    passwordHash: studentPasswordHash,
  }));
  await Auth.insertMany(authRecords);
  console.log(`[Seeder] Seeded ${authRecords.length} Student Login Credentials (password: password123).`);

  // 7. Seed Initial Applications
  const sampleApplications = [];
  for (let i = 0; i < createdStudents.length; i++) {
    const student = createdStudents[i];
    const eligibleHostels = createdHostels.filter((h) => h.genderAllowed === student.gender);

    const appStatus = i === 0 ? "SUBMITTED" : i === 1 ? "UNDER_REVIEW" : i === 2 ? "SUBMITTED" : "UNDER_REVIEW";

    const application = {
      applicationId: `APP-2026-${(10001 + i).toString()}`,
      studentRollNumber: student.rollNumber,
      studentName: student.name,
      studentEmail: student.email,
      department: student.department,
      year: student.year,
      gender: student.gender,
      cgpa: student.cgpa,
      preferences: eligibleHostels.slice(0, 3).map((hostel, index) => ({
        hostelId: hostel._id,
        hostelCode: hostel.code,
        hostelName: hostel.name,
        roomType: "Quad",
        acPreference: index === 0 ? "AC" : "Non-AC",
        priority: index + 1,
      })),
      specialAccommodations: i === 0 ? "Ground floor preferred for ease of mobility" : "",
      status: appStatus,
      submittedAt: new Date(Date.now() - (6 - i) * 3600000),
    };
    sampleApplications.push(application);
  }

  await Application.insertMany(sampleApplications);
  console.log(`[Seeder] Seeded ${sampleApplications.length} Initial Applications.`);

  console.log("[Seeder] Database seeding successfully completed!");
}

module.exports = seedData;

if (require.main === module) {
  seedData()
    .then(() => {
      console.log("[Seeder] Standalone execution completed.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("[Seeder] Fatal error during seeding:", err);
      process.exit(1);
    });
}
