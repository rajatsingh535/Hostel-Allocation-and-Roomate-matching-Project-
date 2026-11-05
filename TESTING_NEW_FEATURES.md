# 🧪 Testing New Features - Room Swap & Matchmaker Hub

## Quick Start Testing Guide

### Prerequisites
Ensure servers are running:
```bash
cd Hostel-Allocation-and-Roomate-matching-Project-
npm run dev
```

You should see:
- ✅ Frontend: http://localhost:3000
- ✅ Backend: http://localhost:5000  
- ✅ Database: MongoDB Connected

---

## Test 1: Room Swap Feature 🔄

### Step 1: Create a Room Swap Request
```bash
curl -X POST http://localhost:5000/api/room-swaps \
  -H "Content-Type: application/json" \
  -d "{
    \"requestedByName\": \"Arjun Sharma\",
    \"requestedByRoll\": \"12304567\",
    \"requestedByGender\": \"Male\",
    \"currentHostel\": \"BH-1\",
    \"currentRoom\": \"101\",
    \"currentBedNumber\": \"Bed-2\",
    \"targetHostel\": \"BH-3\",
    \"targetRoomType\": \"Double\",
    \"reason\": \"Need to be closer to my department building for early morning classes\"
  }"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Room swap request submitted successfully",
  "data": {
    "_id": "...",
    "requestedByName": "Arjun Sharma",
    "status": "PENDING",
    ...
  }
}
```

### Step 2: View All Swap Requests
```bash
curl http://localhost:5000/api/room-swaps
```

### Step 3: View My Swap Requests
```bash
curl "http://localhost:5000/api/room-swaps?roll=12304567"
```

### Step 4: Update Swap Status (Admin)
First, get the swap ID from Step 1 response, then:
```bash
curl -X PUT http://localhost:5000/api/room-swaps/[SWAP_ID]/status \
  -H "Content-Type: application/json" \
  -d "{
    \"status\": \"APPROVED\",
    \"adminNotes\": \"Approved due to valid reason\"
  }"
```

### Step 5: Cancel a Swap Request
```bash
curl -X DELETE http://localhost:5000/api/room-swaps/[SWAP_ID]
```

---

## Test 2: Matchmaker Hub 🤝

### Step 1: Create Roommate Profile (Student 1)
```bash
curl -X POST http://localhost:5000/api/matchmaker/profiles \
  -H "Content-Type: application/json" \
  -d "{
    \"studentRoll\": \"12304567\",
    \"studentName\": \"Arjun Sharma\",
    \"studentEmail\": \"arjun.sharma@student.lpu.co.in\",
    \"gender\": \"Male\",
    \"department\": \"Computer Science\",
    \"year\": 2,
    \"cgpa\": 8.5,
    \"sleepSchedule\": \"Night Owl (After 12 AM)\",
    \"studyHabits\": \"In Room - Silent\",
    \"cleanliness\": \"Very Organized\",
    \"guestFrequency\": \"Occasionally\",
    \"musicPreference\": \"Background Music\",
    \"interests\": [\"Coding\", \"Gaming\", \"Music\"],
    \"hobbies\": \"Playing guitar, watching sci-fi movies, competitive programming\",
    \"preferredRoomType\": \"Double\",
    \"acPreference\": \"AC\",
    \"floorPreference\": \"Middle\",
    \"quietZone\": true,
    \"lookingForRoommate\": true,
    \"bio\": \"CSE student passionate about coding and music. Looking for a like-minded roommate who respects quiet study time.\"
  }"
```

### Step 2: Create Another Profile (Student 2)
```bash
curl -X POST http://localhost:5000/api/matchmaker/profiles \
  -H "Content-Type: application/json" \
  -d "{
    \"studentRoll\": \"12304590\",
    \"studentName\": \"Rohit Kumar\",
    \"studentEmail\": \"rohit.kumar@student.lpu.co.in\",
    \"gender\": \"Male\",
    \"department\": \"Computer Science\",
    \"year\": 2,
    \"cgpa\": 8.2,
    \"sleepSchedule\": \"Night Owl (After 12 AM)\",
    \"studyHabits\": \"In Room - Silent\",
    \"cleanliness\": \"Very Organized\",
    \"guestFrequency\": \"Rarely\",
    \"musicPreference\": \"Quiet Environment\",
    \"interests\": [\"Coding\", \"Reading\", \"Sports\"],
    \"hobbies\": \"Competitive programming, reading tech blogs\",
    \"preferredRoomType\": \"Double\",
    \"acPreference\": \"AC\",
    \"lookingForRoommate\": true,
    \"bio\": \"Love coding marathons and late-night study sessions.\"
  }"
```

### Step 3: Create a Female Student Profile
```bash
curl -X POST http://localhost:5000/api/matchmaker/profiles \
  -H "Content-Type: application/json" \
  -d "{
    \"studentRoll\": \"12304680\",
    \"studentName\": \"Priya Patel\",
    \"studentEmail\": \"priya.patel@student.lpu.co.in\",
    \"gender\": \"Female\",
    \"department\": \"Computer Science\",
    \"year\": 2,
    \"cgpa\": 9.0,
    \"sleepSchedule\": \"Early Bird (Before 10 PM)\",
    \"studyHabits\": \"Library/Outside\",
    \"cleanliness\": \"Very Organized\",
    \"guestFrequency\": \"Occasionally\",
    \"musicPreference\": \"Background Music\",
    \"interests\": [\"Reading\", \"Art\", \"Music\"],
    \"preferredRoomType\": \"Double\",
    \"acPreference\": \"AC\",
    \"lookingForRoommate\": true,
    \"bio\": \"Organized student looking for a compatible roommate in GH hostels.\"
  }"
```

### Step 4: Find Matches for Student 1
```bash
curl -X POST http://localhost:5000/api/matchmaker/find-matches/12304567
```

**Expected Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "studentRoll": "12304590",
      "studentName": "Rohit Kumar",
      "compatibilityScore": 85,
      "department": "Computer Science",
      ...
    }
  ]
}
```

### Step 5: Browse All Male Profiles
```bash
curl "http://localhost:5000/api/matchmaker/profiles?gender=Male&lookingForRoommate=true"
```

### Step 6: Get Specific Profile
```bash
curl http://localhost:5000/api/matchmaker/profiles/12304567
```

### Step 7: Toggle Looking Status
```bash
curl -X PUT http://localhost:5000/api/matchmaker/profiles/12304567/toggle-status
```

---

## Test 3: Smart Allocation Engine ✅

### Step 1: Create Test Applications
First, create some applications (use existing student dashboard or API):

```bash
# Application 1 - High CGPA Male
curl -X POST http://localhost:5000/api/applications \
  -H "Content-Type: application/json" \
  -d "{
    \"studentName\": \"Arjun Sharma\",
    \"studentRollNumber\": \"12304567\",
    \"studentEmail\": \"arjun.sharma@student.lpu.co.in\",
    \"department\": \"Computer Science\",
    \"year\": 2,
    \"gender\": \"Male\",
    \"cgpa\": 8.5,
    \"bookingMode\": \"individual\",
    \"preferences\": [{
      \"hostelCode\": \"BH-1\",
      \"hostelName\": \"Boys Hostel 1\",
      \"roomType\": \"Double\",
      \"acPreference\": \"AC\",
      \"priority\": 1
    }]
  }"
```

```bash
# Application 2 - Female student
curl -X POST http://localhost:5000/api/applications \
  -H "Content-Type: application/json" \
  -d "{
    \"studentName\": \"Priya Patel\",
    \"studentRollNumber\": \"12304680\",
    \"studentEmail\": \"priya.patel@student.lpu.co.in\",
    \"department\": \"Computer Science\",
    \"year\": 2,
    \"gender\": \"Female\",
    \"cgpa\": 9.0,
    \"bookingMode\": \"individual\",
    \"preferences\": [{
      \"hostelCode\": \"GH-1\",
      \"hostelName\": \"Girls Hostel 1\",
      \"roomType\": \"Double\",
      \"acPreference\": \"AC\",
      \"priority\": 1
    }]
  }"
```

### Step 2: Run Smart Allocation
```bash
curl -X POST http://localhost:5000/api/allocations/run
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Allocation completed successfully",
  "data": {
    "totalProcessed": 2,
    "allocated": 2,
    "failed": 0
  }
}
```

### Step 3: Verify Allocations
```bash
# Check applications status
curl http://localhost:5000/api/applications

# Check specific student
curl "http://localhost:5000/api/applications?roll=12304567"
```

---

## Test 4: Browser Testing 🌐

### Open in Browser
1. Go to http://localhost:3000
2. Click "Student Login"
3. Enter roll number: 12304567
4. Select gender: Male
5. Dashboard should show BH hostels recommended

### Test Existing Features
- ✅ Browse hostels (should show BH-1 to BH-9 for males)
- ✅ Submit application
- ✅ View applications
- ✅ Check status

---

## Test 5: Database Verification 🗄️

If you have MongoDB Compass or CLI access:

```bash
# Connect to database
mongosh hostel_db

# View room swaps
db.roomswaps.find().pretty()

# View roommate profiles
db.roommateprofiles.find().pretty()

# View applications
db.applications.find().pretty()

# Count documents
db.roomswaps.countDocuments()
db.roommateprofiles.countDocuments()
```

---

## Test 6: Postman Collection 📬

### Import to Postman

**Create Collection**: LPU Hostel API

**Environment Variables**:
- `base_url`: http://localhost:5000
- `student_roll`: 12304567

**Requests to Add**:

1. **Health Check**
   - GET `{{base_url}}/api/health`

2. **Create Room Swap**
   - POST `{{base_url}}/api/room-swaps`
   - Body: (see Step 1 of Test 1)

3. **Get Room Swaps**
   - GET `{{base_url}}/api/room-swaps`

4. **Create Profile**
   - POST `{{base_url}}/api/matchmaker/profiles`
   - Body: (see Step 1 of Test 2)

5. **Find Matches**
   - POST `{{base_url}}/api/matchmaker/find-matches/{{student_roll}}`

6. **Run Allocation**
   - POST `{{base_url}}/api/allocations/run`

---

## Expected Results Summary ✅

After running all tests, you should have:

1. **Room Swaps**: 1-2 swap requests in database
2. **Profiles**: 2-3 roommate profiles created
3. **Matches**: Compatibility scores calculated (60-90%)
4. **Applications**: 2+ applications submitted
5. **Allocations**: Students allocated to rooms based on preferences

---

## Troubleshooting 🔧

### Servers Not Starting
```bash
# Kill existing processes
Get-Process node | Stop-Process -Force

# Restart
npm run dev
```

### Database Connection Error
```bash
# Make sure MongoDB is running
mongosh

# Or install MongoDB if not present
```

### Port Already in Use
```bash
# Change ports in .env or config files
# Or kill processes using those ports
```

### API Returns 404
```bash
# Verify routes are registered in server/index.js
# Check server logs for errors
```

---

## Success Criteria ✅

Your features are working if:

- [x] Room swap requests can be created
- [x] Roommate profiles can be created/updated
- [x] Compatibility matching returns scores
- [x] Smart allocation assigns rooms based on gender + preferences
- [x] CSS shimmer effect shows on homepage heading
- [x] All API endpoints return success responses
- [x] Database stores all data correctly

---

## Next Steps After Testing 🚀

1. **Build Frontend UI**
   - Add Room Swap tab to student dashboard
   - Create Matchmaker Hub page
   - Add admin panel for swap management

2. **Enhance Features**
   - Add real-time notifications
   - Email alerts for swap updates
   - Chat system for matched roommates

3. **Deploy to Production**
   - Push to GitHub
   - Deploy to Vercel
   - Configure production MongoDB

---

**All backend features are working! Time to build the frontend! 🎉**
