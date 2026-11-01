# 🗄️ Database Documentation

**Module Owner:** Yash  
**Tech Stack:** MongoDB 7, Mongoose 8

---

## 🎯 Overview

The database layer uses MongoDB with Mongoose ODM for data persistence, providing flexible schema design and efficient querying for the hostel allocation system.

## 🏗️ Database Architecture

### Connection Details
- **Database Name:** `hostel_db`
- **Host:** `mongodb://127.0.0.1:27017`
- **Driver:** Mongoose 8.x
- **Connection Pooling:** Enabled

### Collections Overview
```
hostel_db/
├── hostels           # Hostel information
├── applications      # Student applications
├── rooms             # Room details
├── friendrequests    # Friend requests (to be migrated)
└── groups            # Student groups (to be migrated)
```

## 📊 Schema Definitions

### 1. Hostels Collection

**Schema:**
```javascript
{
  _id: ObjectId,
  code: String (unique, required),
  name: String (required),
  gender: String (enum: ["Male", "Female", "Co-ed"]),
  description: String,
  amenities: [String],
  totalRooms: Number,
  availableRooms: Number,
  pricing: {
    single: Number,
    double: Number,
    triple: Number,
    quad: Number
  },
  images: [String],
  location: String,
  contactPhone: String,
  wardenName: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
db.hostels.createIndex({ code: 1 }, { unique: true });
db.hostels.createIndex({ gender: 1 });
db.hostels.createIndex({ availableRooms: 1 });
```

**Sample Document:**
```json
{
  "_id": "64abc123def456789",
  "code": "BH-A-01",
  "name": "Boys Hostel Block A",
  "gender": "Male",
  "description": "Modern hostel with all facilities",
  "amenities": ["WiFi", "Gym", "Laundry", "Common Room"],
  "totalRooms": 200,
  "availableRooms": 150,
  "pricing": {
    "single": 50000,
    "double": 35000,
    "triple": 25000,
    "quad": 20000
  },
  "images": ["https://example.com/hostel1.jpg"],
  "location": "Near Library",
  "contactPhone": "+91-1234567890",
  "wardenName": "Mr. Sharma",
  "createdAt": "2026-01-15T10:00:00Z",
  "updatedAt": "2026-01-15T10:00:00Z"
}
```

### 2. Applications Collection

**Schema:**
```javascript
{
  _id: ObjectId,
  applicationId: String (unique, required),
  studentName: String (required),
  studentRollNumber: String (required),
  studentEmail: String (required),
  hostelId: ObjectId (ref: "Hostel"),
  department: String,
  year: Number,
  gender: String,
  cgpa: Number,
  roomType: String (enum: ["Single", "Double", "Triple", "Quad"]),
  acPreference: String (enum: ["AC", "Non-AC"]),
  preferences: {
    floor: String,
    quietZone: Boolean,
    studyFocused: Boolean
  },
  friendRollNumbers: [String],
  specialAccommodations: String,
  status: String (enum: ["Pending", "Allocated", "Rejected"]),
  allocatedRoom: String,
  submittedAt: Date,
  processedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
db.applications.createIndex({ applicationId: 1 }, { unique: true });
db.applications.createIndex({ studentRollNumber: 1 });
db.applications.createIndex({ status: 1 });
db.applications.createIndex({ hostelId: 1 });
db.applications.createIndex({ submittedAt: -1 });
```

**Sample Document:**
```json
{
  "_id": "64abc789def123456",
  "applicationId": "APP-1730445600000",
  "studentName": "Rajat Singh",
  "studentRollNumber": "12345678",
  "studentEmail": "rajat@lpu.in",
  "hostelId": "64abc123def456789",
  "department": "Computer Science",
  "year": 2,
  "gender": "Male",
  "cgpa": 8.5,
  "roomType": "Double",
  "acPreference": "AC",
  "preferences": {
    "floor": "1-3",
    "quietZone": true,
    "studyFocused": true
  },
  "friendRollNumbers": ["12345679", "12345680"],
  "specialAccommodations": "",
  "status": "Pending",
  "allocatedRoom": null,
  "submittedAt": "2026-11-01T08:30:00Z",
  "processedAt": null,
  "createdAt": "2026-11-01T08:30:00Z",
  "updatedAt": "2026-11-01T08:30:00Z"
}
```

### 3. Rooms Collection

**Schema:**
```javascript
{
  _id: ObjectId,
  roomNumber: String (required),
  hostelId: ObjectId (ref: "Hostel"),
  floor: Number,
  capacity: Number,
  occupancy: Number (default: 0),
  isQuietZone: Boolean (default: false),
  isStudyFocused: Boolean (default: false),
  roomType: String (enum: ["Single", "Double", "Triple", "Quad"]),
  acType: String (enum: ["AC", "Non-AC"]),
  students: [String],  // Array of roll numbers
  amenities: [String],
  status: String (enum: ["Available", "Partially Filled", "Full", "Maintenance"]),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
db.rooms.createIndex({ roomNumber: 1, hostelId: 1 }, { unique: true });
db.rooms.createIndex({ hostelId: 1 });
db.rooms.createIndex({ status: 1 });
db.rooms.createIndex({ occupancy: 1, capacity: 1 });
```

**Sample Document:**
```json
{
  "_id": "64abc999def111222",
  "roomNumber": "A-101",
  "hostelId": "64abc123def456789",
  "floor": 1,
  "capacity": 2,
  "occupancy": 0,
  "isQuietZone": true,
  "isStudyFocused": false,
  "roomType": "Double",
  "acType": "AC",
  "students": [],
  "amenities": ["Attached Bathroom", "Study Table", "Wardrobe"],
  "status": "Available",
  "createdAt": "2026-01-15T10:00:00Z",
  "updatedAt": "2026-01-15T10:00:00Z"
}
```

### 4. Friend Requests Collection (To Be Created)

**Proposed Schema:**
```javascript
{
  _id: ObjectId,
  requestId: String (unique),
  fromStudent: {
    rollNumber: String,
    name: String,
    email: String
  },
  toStudent: {
    rollNumber: String,
    name: String,
    email: String
  },
  message: String,
  status: String (enum: ["pending", "accepted", "rejected"]),
  createdAt: Date,
  respondedAt: Date,
  updatedAt: Date
}
```

### 5. Groups Collection (To Be Created)

**Proposed Schema:**
```javascript
{
  _id: ObjectId,
  groupId: String (unique),
  members: [{
    rollNumber: String,
    name: String,
    email: String
  }],
  status: String (enum: ["active", "inactive", "allocated"]),
  allocatedRoom: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🌱 Database Seeding

### Hostel Seeder (server/seeds/hostelSeeds.js)

```javascript
const mongoose = require("mongoose");
const Hostel = require("../models/Hostel");

const hostels = [
  {
    code: "BH-A-01",
    name: "Boys Hostel Block A",
    gender: "Male",
    description: "Modern hostel with WiFi and gym facilities",
    amenities: ["WiFi", "Gym", "Laundry", "Common Room", "Study Hall"],
    totalRooms: 200,
    availableRooms: 150,
    pricing: { single: 50000, double: 35000, triple: 25000, quad: 20000 },
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
    location: "Near Main Gate",
    contactPhone: "+91-1234567890",
    wardenName: "Mr. Sharma"
  },
  {
    code: "GH-B-01",
    name: "Girls Hostel Block B",
    gender: "Female",
    description: "Safe and comfortable with 24x7 security",
    amenities: ["WiFi", "Gym", "Beauty Parlor", "Reading Room"],
    totalRooms: 180,
    availableRooms: 120,
    pricing: { single: 50000, double: 35000, triple: 25000, quad: 20000 },
    images: ["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800"],
    location: "Near Library",
    contactPhone: "+91-1234567891",
    wardenName: "Mrs. Verma"
  },
  // ... more hostels
];

async function seedDatabase() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/hostel_db");
    
    const count = await Hostel.countDocuments();
    
    if (count > 0) {
      console.log(`Database already seeded with ${count} hostels`);
      return;
    }
    
    await Hostel.insertMany(hostels);
    console.log(`✅ Seeded ${hostels.length} hostels`);
    
  } catch (error) {
    console.error("❌ Seeding error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
```

**Run Seeder:**
```bash
node server/seeds/hostelSeeds.js
```

## 🔍 Common Queries

### Get All Available Hostels
```javascript
db.hostels.find({ availableRooms: { $gt: 0 } });
```

### Get Pending Applications
```javascript
db.applications.find({ status: "Pending" })
  .sort({ submittedAt: 1 });
```

### Get Applications by Student
```javascript
db.applications.find({ studentRollNumber: "12345678" })
  .populate("hostelId");
```

### Get Available Rooms in Hostel
```javascript
db.rooms.find({
  hostelId: ObjectId("64abc123def456789"),
  occupancy: { $lt: "$capacity" }
});
```

### Count Applications by Status
```javascript
db.applications.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
]);
```

## 🔧 Maintenance

### Backup Database
```bash
mongodump --db hostel_db --out ./backups/backup-$(date +%Y%m%d)
```

### Restore Database
```bash
mongorestore --db hostel_db ./backups/backup-20261101/hostel_db
```

### Optimize Indexes
```javascript
db.hostels.reIndex();
db.applications.reIndex();
db.rooms.reIndex();
```

## 📊 Performance Optimization

### Query Performance
```javascript
// Use indexes for frequent queries
db.applications.find({ status: "Pending" }).explain("executionStats");
```

### Connection Pooling
```javascript
mongoose.connect(uri, {
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 30000
});
```

## 🔒 Security

### Data Validation
```javascript
const applicationSchema = new mongoose.Schema({
  studentEmail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: "Invalid email format"
    }
  }
});
```

### Sanitization
```javascript
const sanitize = require("mongo-sanitize");
const clean = sanitize(req.body);
```

## 📈 Monitoring

### Database Statistics
```javascript
db.stats();
db.hostels.stats();
db.applications.stats();
```

### Slow Query Log
```javascript
db.setProfilingLevel(1, { slowms: 100 });
db.system.profile.find().sort({ ts: -1 }).limit(5);
```

---

## 📞 Support

For database issues, contact: **Yash**  
Email: yash@example.com

---

**Last Updated:** November 2026  
**Version:** 1.0.0
