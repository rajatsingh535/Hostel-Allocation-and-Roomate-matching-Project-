const { connectDB, closeDB } = require("./db");
const Hostel = require("./models/Hostel");
const Block = require("./models/Block");
const Room = require("./models/Room");
const Bed = require("./models/Bed");
const Student = require("./models/Student");
const Application = require("./models/Application");
const AllocationDraft = require("./models/AllocationDraft");

async function seedData() {
  console.log("[Seeder] Starting database seeding process...");
  await connectDB();

  await Promise.all([
    Hostel.deleteMany(),
    Block.deleteMany(),
    Room.deleteMany(),
    Bed.deleteMany(),
    Student.deleteMany(),
    Application.deleteMany(),
    AllocationDraft.deleteMany(),
  ]);
  console.log("[Seeder] Cleared previous database collections.");

  // Boys Hostels (BH1-9)
  const boysHostels = [];
  for (let i = 1; i <= 9; i++) {
    const hostel = {
      name: `Boys Hostel ${i}`,
      code: `BH${i}`,
      genderAllowed: "Male",
      campusLocation: "LPU Campus",
      totalCapacity: 360, // 4 students per room, 10 rooms per floor, 9 floors
      availableCapacity: Math.floor(Math.random() * 50 + 50), // Random availability
      amenities: ["WiFi", "Laundry", "Mess", "Security", "Common Room", "Study Hall"],
      imageUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
      description: `Modern boys hostel with ${9} floors and comprehensive facilities for ${360} students.`
    };
    boysHostels.push(hostel);
  }

  // Girls Hostels (GH1-3)
  const girlsHostels = [];
  for (let i = 1; i <= 3; i++) {
    const hostel = {
      name: `Girls Hostel ${i}`,
      code: `GH${i}`,
      genderAllowed: "Female",
      campusLocation: "LPU Campus",
      totalCapacity: 360,
      availableCapacity: Math.floor(Math.random() * 50 + 50),
      amenities: ["WiFi", "Laundry", "Mess", "Security", "Common Room", "Study Hall", "Beauty Salon"],
      imageUrl: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80",
      description: `Secure girls hostel with ${9} floors and enhanced amenities for ${360} students.`
    };
    girlsHostels.push(hostel);
  }

  const allHostels = [...boysHostels, ...girlsHostels];
  const createdHostels = await Hostel.insertMany(allHostels);
  console.log(`[Seeder] Seeded ${createdHostels.length} Hostels (BH1-9, GH1-3).`);

  // Create floors, rooms, and beds for each hostel
  let totalBeds = 0;
  for (const hostel of createdHostels) {
    const blocks = [];
    
    // Create 9 floors per hostel
    for (let floor = 1; floor <= 9; floor++) {
      const block = {
        hostelId: hostel._id,
        name: `Floor ${floor}`,
        code: `${hostel.code}-F${floor}`,
        floorsCount: 1
      };
      blocks.push(block);
    }
    
    const createdBlocks = await Block.insertMany(blocks);
    
    // Create rooms and beds for each floor
    for (const block of createdBlocks) {
      const rooms = [];
      
      // 10 rooms per floor (5 AC, 5 Non-AC)
      for (let roomNum = 1; roomNum <= 10; roomNum++) {
        const isAC = roomNum <= 5; // First 5 rooms are AC
        const floorNum = blocks.indexOf(block) + 1;
        const room = {
          blockId: block._id,
          hostelId: hostel._id,
          roomNumber: `${floorNum}${roomNum.toString().padStart(2, '0')}`,
          floor: floorNum,
          roomType: "Quad", // 4 students per room
          acType: isAC ? "AC" : "Non-AC",
          totalBeds: 4,
          availableBeds: Math.floor(Math.random() * 3 + 1), // 1-3 available beds
          rentPerSemester: isAC ? 25000 : 18000,
          isPwDAccessible: floorNum === 1 // Ground floor accessible
        };
        rooms.push(room);
      }
      
      const createdRooms = await Room.insertMany(rooms);
      
      // Create beds for each room
      for (const room of createdRooms) {
        const beds = [];
        for (let bedNum = 1; bedNum <= 4; bedNum++) {
          const bed = {
            roomId: room._id,
            blockId: room.blockId,
            hostelId: room.hostelId,
            bedNumber: bedNum,
            isOccupied: Math.random() > 0.7, // 30% occupancy rate
            studentId: null
          };
          beds.push(bed);
          totalBeds++;
        }
        await Bed.insertMany(beds);
      }
    }
  }

  console.log(`[Seeder] Seeded ${totalBeds} Beds across all hostels.`);

  // Create sample students
  const sampleStudents = [
    {
      name: "Arjun Sharma",
      email: "arjun.sharma@student.lpu.co.in",
      rollNumber: "12345678",
      department: "Computer Science",
      gender: "Male",
      year: 2,
      cgpa: 8.5,
      category: "General"
    },
    {
      name: "Priya Patel",
      email: "priya.patel@student.lpu.co.in", 
      rollNumber: "12345679",
      department: "Electronics",
      gender: "Female",
      year: 1,
      cgpa: 9.2,
      category: "General"
    },
    {
      name: "Rahul Verma",
      email: "rahul.verma@student.lpu.co.in",
      rollNumber: "12345680",
      department: "Business Administration",
      gender: "Male", 
      year: 3,
      cgpa: 7.8,
      category: "OBC"
    },
    {
      name: "Sneha Singh",
      email: "sneha.singh@student.lpu.co.in",
      rollNumber: "12345681",
      department: "Information Technology",
      gender: "Female",
      year: 2,
      cgpa: 8.9,
      category: "General"
    },
    {
      name: "Aditya Kumar",
      email: "aditya.kumar@student.lpu.co.in",
      rollNumber: "12345682", 
      department: "Mechanical Engineering",
      gender: "Male",
      year: 4,
      cgpa: 8.1,
      category: "SC"
    }
  ];

  const createdStudents = await Student.insertMany(sampleStudents);

  // Create sample applications
  const sampleApplications = [];
  for (let i = 0; i < createdStudents.length; i++) {
    const student = createdStudents[i];
    const eligibleHostels = createdHostels.filter(h => h.genderAllowed === student.gender);
    
    const application = {
      applicationId: `APP-2026-${(10000 + i).toString()}`,
      studentRollNumber: student.rollNumber,
      studentName: student.name,
      studentEmail: student.email,
      department: student.department,
      year: student.year,
      gender: student.gender,
      cgpa: student.cgpa,
      preferences: eligibleHostels.slice(0, 3).map((hostel, index) => ({
        hostelId: hostel._id,
        hostelName: hostel.name,
        roomType: "Quad",
        acPreference: Math.random() > 0.5 ? "AC" : "Non-AC",
        priority: index + 1
      })),
      specialAccommodations: i === 0 ? "Ground floor room due to mobility issues" : "",
      status: ["SUBMITTED", "UNDER_REVIEW", "ALLOCATED"][Math.floor(Math.random() * 3)],
      submittedAt: new Date()
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