require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
const seedData = require("./seed");
const Hostel = require("./models/Hostel");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/hostels", require("./routes/hostels"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/stats", require("./routes/stats"));
app.use("/api/rooms", require("./routes/rooms"));
app.use("/api/allocations", require("./routes/allocations"));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Hostel Allocation API",
    timestamp: new Date().toISOString(),
    version: "2.0.0 (3D Edition)",
  });
});

async function startServer() {
  try {
    console.log("[Server] Connecting to MongoDB...");
    await connectDB();

    const count = await Hostel.countDocuments();
    if (count === 0) {
      console.log("[Server] Database is empty. Running automatic seed...");
      await seedData();
    } else {
      console.log(`[Server] Database contains ${count} hostels. Skipping auto-seed.`);
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
