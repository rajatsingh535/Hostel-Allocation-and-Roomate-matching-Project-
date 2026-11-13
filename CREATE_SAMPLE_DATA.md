# 🧪 Sample Data for Testing

## Create Sample Roommate Profiles

Run these curl commands to add 3 sample students for matchmaker testing:

### Student 1: Arjun Sharma (Male - Night Owl, Coding)
```bash
curl -X POST http://localhost:5000/api/matchmaker/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "studentRoll": "12304567",
    "studentName": "Arjun Sharma",
    "studentEmail": "arjun.sharma@student.lpu.co.in",
    "gender": "Male",
    "department": "Computer Science",
    "year": 2,
    "cgpa": 8.5,
    "sleepSchedule": "Night Owl (After 12 AM)",
    "studyHabits": "In Room - Silent",
    "cleanliness": "Very Organized",
    "guestFrequency": "Occasionally",
    "musicPreference": "Background Music",
    "interests": ["Coding", "Gaming", "Music"],
    "hobbies": "Playing guitar, competitive programming",
    "preferredRoomType": "Double",
    "acPreference": "AC",
    "floorPreference": "Middle",
    "quietZone": true,
    "lookingForRoommate": true,
    "bio": "CSE student passionate about coding and music. Looking for a like-minded roommate."
  }'
```

### Student 2: Rohit Kumar (Male - Night Owl, Coding) - 85% Match with Arjun
```bash
curl -X POST http://localhost:5000/api/matchmaker/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "studentRoll": "12304590",
    "studentName": "Rohit Kumar",
    "studentEmail": "rohit.kumar@student.lpu.co.in",
    "gender": "Male",
    "department": "Computer Science",
    "year": 2,
    "cgpa": 8.2,
    "sleepSchedule": "Night Owl (After 12 AM)",
    "studyHabits": "In Room - Silent",
    "cleanliness": "Very Organized",
    "guestFrequency": "Rarely",
    "musicPreference": "Quiet Environment",
    "interests": ["Coding", "Reading", "Sports"],
    "hobbies": "Competitive programming, reading tech blogs",
    "preferredRoomType": "Double",
    "acPreference": "AC",
    "lookingForRoommate": true,
    "bio": "Love coding marathons and late-night study sessions. Prefer quiet environment."
  }'
```

### Student 3: Priya Patel (Female - Early Bird, Reading)
```bash
curl -X POST http://localhost:5000/api/matchmaker/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "studentRoll": "12304680",
    "studentName": "Priya Patel",
    "studentEmail": "priya.patel@student.lpu.co.in",
    "gender": "Female",
    "department": "Computer Science",
    "year": 2,
    "cgpa": 9.0,
    "sleepSchedule": "Early Bird (Before 10 PM)",
    "studyHabits": "Library/Outside",
    "cleanliness": "Very Organized",
    "guestFrequency": "Occasionally",
    "musicPreference": "Background Music",
    "interests": ["Reading", "Art", "Music"],
    "hobbies": "Reading novels, painting",
    "preferredRoomType": "Double",
    "acPreference": "AC",
    "lookingForRoommate": true,
    "bio": "Love reading and art. Looking for a calm and organized roommate in GH hostels."
  }'
```

### Student 4: Sanya Singh (Female - Early Bird) - 80% Match with Priya
```bash
curl -X POST http://localhost:5000/api/matchmaker/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "studentRoll": "12304695",
    "studentName": "Sanya Singh",
    "studentEmail": "sanya.singh@student.lpu.co.in",
    "gender": "Female",
    "department": "Computer Science",
    "year": 2,
    "cgpa": 8.8,
    "sleepSchedule": "Early Bird (Before 10 PM)",
    "studyHabits": "Library/Outside",
    "cleanliness": "Very Organized",
    "guestFrequency": "Rarely",
    "musicPreference": "Quiet Environment",
    "interests": ["Reading", "Fitness", "Cooking"],
    "hobbies": "Morning yoga, cooking healthy meals",
    "preferredRoomType": "Double",
    "acPreference": "AC",
    "lookingForRoommate": true,
    "bio": "Early riser who loves fitness and healthy living. Looking for similar habits."
  }'
```

---

## Test Matchmaker

### Find matches for Arjun (should show Rohit with 85% match):
```bash
curl -X POST http://localhost:5000/api/matchmaker/find-matches/12304567
```

### Find matches for Priya (should show Sanya with 80% match):
```bash
curl -X POST http://localhost:5000/api/matchmaker/find-matches/12304680
```

---

## Create Sample Room Swap Requests

### Room Swap 1: Arjun wants to swap BH-1 → BH-3
```bash
curl -X POST http://localhost:5000/api/room-swaps \
  -H "Content-Type: application/json" \
  -d '{
    "requestedByName": "Arjun Sharma",
    "requestedByRoll": "12304567",
    "requestedByGender": "Male",
    "currentHostel": "BH-1",
    "currentRoom": "101",
    "currentBedNumber": "Bed-2",
    "targetStudentRoll": "12304590",
    "targetStudentName": "Rohit Kumar",
    "targetHostel": "BH-3",
    "targetRoomType": "Double",
    "reason": "Want to be closer to my best friend Rohit who lives in BH-3"
  }'
```

### Room Swap 2: Priya wants swap within GH
```bash
curl -X POST http://localhost:5000/api/room-swaps \
  -H "Content-Type: application/json" \
  -d '{
    "requestedByName": "Priya Patel",
    "requestedByRoll": "12304680",
    "requestedByGender": "Female",
    "currentHostel": "GH-1",
    "currentRoom": "201",
    "currentBedNumber": "Bed-1",
    "targetHostel": "GH-2",
    "targetRoomType": "Double",
    "reason": "GH-2 is closer to my department building"
  }'
```

---

## Verify Data

### Check all profiles:
```bash
curl http://localhost:5000/api/matchmaker/profiles
```

### Check all room swaps:
```bash
curl http://localhost:5000/api/room-swaps
```

### Check hostels:
```bash
curl http://localhost:5000/api/hostels
```

---

## Expected Compatibility Scores

When students use matchmaker:

**Male Students:**
- Arjun ↔ Rohit: **85% compatible** ✅
  - Both: Night Owl, Silent Study, Very Organized, Coding interest
  
**Female Students:**
- Priya ↔ Sanya: **80% compatible** ✅
  - Both: Early Bird, Library Study, Very Organized, Reading interest

---

## Run All Commands at Once (PowerShell)

```powershell
# Create all 4 profiles
$profiles = @(
  @{roll="12304567"; name="Arjun Sharma"; gender="Male"; sleep="Night Owl (After 12 AM)"; interests=@("Coding","Gaming","Music")},
  @{roll="12304590"; name="Rohit Kumar"; gender="Male"; sleep="Night Owl (After 12 AM)"; interests=@("Coding","Reading","Sports")},
  @{roll="12304680"; name="Priya Patel"; gender="Female"; sleep="Early Bird (Before 10 PM)"; interests=@("Reading","Art","Music")},
  @{roll="12304695"; name="Sanya Singh"; gender="Female"; sleep="Early Bird (Before 10 PM)"; interests=@("Reading","Fitness","Cooking")}
)

Write-Output "Creating sample profiles..."
# Run the curl commands above
```

---

**After creating this data, login as any of these students and test the matchmaker hub!** 🚀
