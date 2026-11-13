require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { connectDB } = require("./db");
const seedData = require("./seed");
const Hostel = require("./models/Hostel");
const Student = require("./models/Student");
const Auth = require("./models/Auth");
const Admin = require("./models/Admin");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/hostels", require("./routes/hostels"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/stats", require("./routes/stats"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin-auth", require("./routes/adminAuth"));
app.use("/api/rooms", require("./routes/rooms"));
app.use("/api/allocations", require("./routes/allocations"));
app.use("/api/students", require("./routes/students"));
app.use("/api/friend-requests", require("./routes/friendRequests"));
app.use("/api/matchmaker", require("./routes/matchmaker"));
app.use("/api/room-swaps", require("./routes/roomSwaps"));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Hostel Allocation API",
    timestamp: new Date().toISOString(),
    version: "2.0.0 (3D Edition)",
  });
});

async function ensureAuthCredentials() {
  const defaultStudents = [
    { name: "Arjun Sharma", email: "arjun.sharma@student.lpu.co.in", rollNumber: "12304567", department: "Computer Science", gender: "Male", year: 2, cgpa: 8.5, category: "General" },
    { name: "Priya Patel", email: "priya.patel@student.lpu.co.in", rollNumber: "12304568", department: "Electronics", gender: "Female", year: 1, cgpa: 9.2, category: "General" },
    { name: "Arjun Sharma", email: "arjun.sharma@student.lpu.co.in", rollNumber: "12345678", department: "Computer Science", gender: "Male", year: 2, cgpa: 8.5, category: "General" },
    { name: "Priya Patel", email: "priya.patel@student.lpu.co.in", rollNumber: "12345679", department: "Electronics", gender: "Female", year: 1, cgpa: 9.2, category: "General" },
    { name: "Rahul Verma", email: "rahul.verma@student.lpu.co.in", rollNumber: "12345680", department: "Business Administration", gender: "Male", year: 3, cgpa: 7.8, category: "OBC" },
    { name: "Sneha Singh", email: "sneha.singh@student.lpu.co.in", rollNumber: "12345681", department: "Information Technology", gender: "Female", year: 2, cgpa: 8.9, category: "General" },
    { name: "Aditya Kumar", email: "aditya.kumar@student.lpu.co.in", rollNumber: "12345682", department: "Mechanical Engineering", gender: "Male", year: 4, cgpa: 8.1, category: "SC" },
  ];

  const studentPassHash = await bcrypt.hash("password123", 10);
  for (const s of defaultStudents) {
    await Student.updateOne({ rollNumber: s.rollNumber }, { $setOnInsert: s }, { upsert: true });
    await Auth.updateOne(
      { rollNumber: s.rollNumber },
      { $setOnInsert: { rollNumber: s.rollNumber, passwordHash: studentPassHash } },
      { upsert: true }
    );
  }

  const adminPassHash = await bcrypt.hash("adminpassword", 10);
  const defaultAdmins = ["admin_lpu", "admin@lpu.co.in", "warden_bh", "warden_gh"];
  for (const adminEmail of defaultAdmins) {
    await Admin.updateOne(
      { email: adminEmail },
      { $setOnInsert: { email: adminEmail, passwordHash: adminPassHash, role: "admin" } },
      { upsert: true }
    );
  }
  console.log("[Server] Verified default Student & Warden/Admin auth accounts.");
}

async function startServer() {
  try {
    console.log("[Server] Connecting to MongoDB...");
    await connectDB();

    const count = await Hostel.countDocuments();
    if (count === 0) {
      console.log("[Server] Database is empty. Running automatic seed...");
      await seedData();
    } else {
      console.log(`[Server] Database contains ${count} hostels. Ensuring auth credentials...`);
      await ensureAuthCredentials();
    }

    app.listen(PORT, () => {
      console.log(`[Server] 🚀 Backend API running on http://localhost:${PORT}`);
      console.log(`[Server] 🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`[Server] 🏨 Hostels Endpoint: http://localhost:${PORT}/api/hostels`);
      console.log(`[Server] 📋 Applications Endpoint: http://localhost:${PORT}/api/applications`);
      console.log(`[Server] 📊 Stats Endpoint: http://localhost:${PORT}/api/stats`);
      console.log(`[Server] 🛏️  Rooms Endpoint: http://localhost:${PORT}/api/rooms`);
    });
  } catch (err) {
    console.error("[Server] Fatal startup failure:", err);
    process.exit(1);
  }
}

startServer();
