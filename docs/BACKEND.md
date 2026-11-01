# 🔧 Backend Documentation

**Module Owner:** Aditi  
**Tech Stack:** Node.js 22, Express.js 4, Mongoose 8

---

## 🎯 Overview

The backend is a RESTful API built with Express.js, handling all business logic, data validation, and database operations for the hostel allocation system.

## 🏗️ Architecture

### Server Structure

```
server/
├── index.js              # Main server file
├── config/
│   └── db.js             # MongoDB connection
├── models/
│   ├── Hostel.js         # Hostel schema
│   ├── Application.js    # Application schema
│   └── Room.js           # Room schema
├── routes/
│   ├── hostels.js        # Hostel routes
│   ├── applications.js   # Application routes
│   ├── allocations.js    # Allocation routes
│   └── friendRequests.js # Friend request routes
└── seeds/
    └── hostelSeeds.js    # Database seeder
```

## 🚀 Server Setup

### Main Server (index.js)

```javascript
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/hostels", require("./routes/hostels"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/allocations", require("./routes/allocations"));
app.use("/api/friend-requests", require("./routes/friendRequests"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// Start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
```

## 🗄️ Database Connection

### config/db.js

```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hostel_db";
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## 📊 Data Models

### 1. Hostel Model

```javascript
const hostelSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Co-ed"], required: true },
  description: String,
  amenities: [String],
  totalRooms: { type: Number, required: true },
  availableRooms: { type: Number, required: true },
  pricing: {
    single: Number,
    double: Number,
    triple: Number,
    quad: Number
  },
  images: [String],
  location: String,
  contactPhone: String,
  wardenName: String
}, { timestamps: true });

module.exports = mongoose.model("Hostel", hostelSchema);
```

### 2. Application Model

```javascript
const applicationSchema = new mongoose.Schema({
  applicationId: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  studentRollNumber: { type: String, required: true },
  studentEmail: { type: String, required: true },
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel" },
  roomType: { type: String, enum: ["Single", "Double", "Triple", "Quad"] },
  acPreference: { type: String, enum: ["AC", "Non-AC"] },
  preferences: {
    floor: String,
    quietZone: Boolean,
    studyFocused: Boolean
  },
  friendRollNumbers: [String],
  status: { 
    type: String, 
    enum: ["Pending", "Allocated", "Rejected"], 
    default: "Pending" 
  },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);
```

### 3. Room Model

```javascript
const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel" },
  floor: Number,
  capacity: Number,
  occupancy: { type: Number, default: 0 },
  isQuietZone: { type: Boolean, default: false },
  isStudyFocused: { type: Boolean, default: false },
  roomType: String,
  acType: String,
  students: [{ type: String }]  // Array of roll numbers
}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);
```

## 🛣️ API Routes

### 1. Hostel Routes (routes/hostels.js)

```javascript
const router = require("express").Router();
const Hostel = require("../models/Hostel");

// GET all hostels
router.get("/", async (req, res) => {
  try {
    const hostels = await Hostel.find();
    res.json({ success: true, data: hostels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET hostel by ID
router.get("/:id", async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ success: false, message: "Hostel not found" });
    }
    res.json({ success: true, data: hostel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
```

### 2. Application Routes (routes/applications.js)

```javascript
const router = require("express").Router();
const Application = require("../models/Application");

// POST create application
router.post("/", async (req, res) => {
  try {
    const applicationId = `APP-${Date.now()}`;
    
    const application = new Application({
      ...req.body,
      applicationId,
      preferences: {
        floor: req.body.roomPreferences?.floor,
        quietZone: req.body.roomPreferences?.quietZone,
        studyFocused: req.body.roomPreferences?.studyFocused
      }
    });
    
    await application.save();
    
    res.json({ 
      success: true, 
      message: "Application submitted successfully",
      data: application 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET applications by roll number
router.get("/student/:rollNumber", async (req, res) => {
  try {
    const applications = await Application.find({ 
      studentRollNumber: req.params.rollNumber 
    }).populate("hostelId");
    
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
```

### 3. Friend Request Routes (routes/friendRequests.js)

```javascript
const router = require("express").Router();

// In-memory storage (replace with MongoDB in production)
let friendRequests = [];
let groupBookings = [];

// POST send friend request
router.post("/send", async (req, res) => {
  try {
    const { fromStudent, toStudent, message } = req.body;
    
    const request = {
      id: Date.now().toString(),
      fromStudent,
      toStudent,
      message: message || `${fromStudent.name} wants to be your roommate!`,
      status: "pending",
      createdAt: new Date()
    };
    
    friendRequests.push(request);
    
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET received requests
router.get("/received/:rollNumber", async (req, res) => {
  try {
    const received = friendRequests.filter(
      req => req.toStudent.rollNumber === req.params.rollNumber && req.status === "pending"
    );
    
    res.json({ success: true, data: received });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH accept request
router.patch("/:id/accept", async (req, res) => {
  try {
    const request = friendRequests.find(r => r.id === req.params.id);
    
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }
    
    request.status = "accepted";
    
    // Create group
    const group = {
      id: Date.now().toString(),
      members: [request.fromStudent, request.toStudent],
      createdAt: new Date(),
      status: "active"
    };
    
    groupBookings.push(group);
    
    res.json({ success: true, message: "Friend request accepted", data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
```

### 4. Allocation Routes (routes/allocations.js)

```javascript
const router = require("express").Router();
const Application = require("../models/Application");
const Room = require("../models/Room");

// POST run allocation algorithm
router.post("/run", async (req, res) => {
  try {
    const applications = await Application.find({ status: "Pending" });
    const rooms = await Room.find({ $expr: { $lt: ["$occupancy", "$capacity"] } });
    
    // 8-tier priority allocation
    const priorityQueue = sortByPriority(applications);
    
    let allocated = 0;
    
    for (const app of priorityQueue) {
      const suitableRoom = findSuitableRoom(rooms, app);
      
      if (suitableRoom) {
        app.status = "Allocated";
        suitableRoom.students.push(app.studentRollNumber);
        suitableRoom.occupancy++;
        
        await app.save();
        await suitableRoom.save();
        
        allocated++;
      }
    }
    
    res.json({
      success: true,
      message: "Allocation completed",
      stats: {
        total: applications.length,
        allocated,
        pending: applications.length - allocated
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

function sortByPriority(applications) {
  // 8-tier priority logic
  return applications.sort((a, b) => {
    // Priority 1: Group bookings
    if (a.friendRollNumbers?.length > 0 && !b.friendRollNumbers?.length) return -1;
    if (!a.friendRollNumbers?.length && b.friendRollNumbers?.length > 0) return 1;
    
    // Priority 2-5: Preferences
    // ... (detailed logic)
    
    return 0;
  });
}

module.exports = router;
```

## 🔒 Security

### Input Validation
```javascript
const validateApplication = (req, res, next) => {
  const { studentName, studentRollNumber, studentEmail } = req.body;
  
  if (!studentName || !studentRollNumber || !studentEmail) {
    return res.status(400).json({ 
      success: false, 
      message: "Missing required fields" 
    });
  }
  
  next();
};

router.post("/", validateApplication, async (req, res) => {
  // Handle request
});
```

### Error Handling
```javascript
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: "Internal Server Error" 
  });
});
```

## 🧪 Testing

### API Testing with Postman
```
POST http://localhost:5000/api/applications
Content-Type: application/json

{
  "studentName": "John Doe",
  "studentRollNumber": "12345678",
  "studentEmail": "john@example.com",
  "hostelId": "64abc123...",
  "roomType": "Double",
  "acPreference": "AC"
}
```

## 📝 Logging

```javascript
const morgan = require("morgan");
app.use(morgan("dev"));

// Custom logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});
```

---

## 📞 Support

For backend issues, contact: **Aditi**  
Email: aditi@example.com

---

**Last Updated:** November 2026  
**Version:** 1.0.0
