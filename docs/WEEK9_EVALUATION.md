# Week 9 Evaluation — Functional System Review (30 Marks)
## Policy-Driven Hostel Allocation & Roommate Matching System
**Institutional Domain**: Lovely Professional University (LPU) Residential Services  
**Assigned Role**: Database Architecture, Backend APIs, Persistence & Security  
**Evaluation Gate**: Gate II — Functional Gate (30 Marks)  
**Status**: Defence-Ready & Fully Verified  

---

## 1. Executive Summary & Week 9 Architecture

The Week 9 Functional System Review verifies that the core system works **end-to-end with real database persistence, controlled role-based access, and server-enforced business logic**. Moving beyond the Week 5 architectural foundation, this milestone establishes:

1. **MongoDB Real Database Persistence**: Full schema enforcement using Mongoose models for `Hostel`, `Block`, `Room`, `Bed`, `Student`, `Application`, `Admin`, and `Auth`.
2. **Robust Authentication & Authorization**: Dual-role JWT authentication (`Student` and `Admin`/`Warden`) with bcrypt salted password hashing (10 rounds) and server-side middleware protection.
3. **End-to-End Server Actions & CRUD**:
   - Students submit hostel allocation applications with ranked preferences (room type, AC preference, accessibility accommodation).
   - Wardens/Admins review applications, inspect student CGPA and department, and execute room allocation.
   - Admin manages hostel blocks and rooms with relational integrity checks (preventing deletion of occupied rooms).
4. **Automated Policy Allocation Engine**: Algorithmic bed allocation matching students to vacant rooms based on merit (CGPA desc), gender restrictions, and accessibility constraints with atomic bed reservation and capacity rollback.
5. **Roommate Matching Algorithm**: Weighted compatibility engine computing compatibility percentage scores (0–100%) and categorizing matches (Excellent, Good, Average, Low) across 6 lifestyle dimensions.

---

## 2. Parameter-Wise Rubric Coverage (30 Marks)

| Parameter | Marks | Rubric Requirement | Week 9 Implementation Evidence |
| :--- | :---: | :--- | :--- |
| **Backend/API & Database** | **6** | Working API endpoints, MongoDB persistence for all main entities, live CRUD connected to Next.js frontend, error handling & status codes. | Verified with MongoDB. Endpoints: `/api/hostels`, `/api/applications`, `/api/allocations`, `/api/rooms`, `/api/students`, `/api/stats`. Mongoose schemas with validation and timestamps. |
| **Authentication & Authorization** | **7** | Login/session mechanism, role representation (Student vs Admin/Warden), protected operations with middleware, negative access tests. | `/api/auth/login` (Student), `/api/admin-auth/login` (Admin). `authMiddleware` & `adminMiddleware` enforce JWT verification. Student attempting admin operations returns HTTP 403 Forbidden. |
| **Server Actions & CRUD** | **5** | CRUD workflows, business rules enforced server-side (capacity limits, gender checks, duplicate prevention), state changes reflected in UI. | `POST /api/applications` validates gender compatibility and blocks duplicates with HTTP 409 Conflict. `PATCH /:id/status` & `/api/allocations/run` decrement availability and update bed occupation atomically. |
| **Product Functionality** | **4** | End-to-end primary user journey, secondary workflow (roommate matching & hostel management), institutional problem solved. | Complete workflow: Student submits application ➔ Admin reviews & allocates ➔ Bed assigned ➔ Roommate compatibility calculated ➔ UI displays room & peers with compatibility score. |
| **Performance & Security** | **3** | Input validation, bcrypt password hashing, sensitive data protection (no password exposure in JSON), controlled error states. | Passwords hashed with bcrypt (cost 10). JWT signed with expiration. Inputs sanitized and checked with Mongoose validators. No sensitive fields leaked in API responses. |
| **Code Quality & Viva** | **5** | Readable component and file structure, clean route modularity, automated test suite, clear defense explanation without slides. | Automated verification script `server/test_week9.js` runs all checks in <5s. Clear modular architecture: `models/`, `routes/`, `middleware/`, `utils/`. |

---

## 3. Mandatory Week 9 Demonstration Script Walkthrough

### Step 1: Login as Role A (Student)
- **URL**: `http://localhost:3000/student/login`
- **Action**: Click `✨ 1-Click Demo Credentials Autofill` or enter Registration Number `12345678` and Password `password123`.
- **System Behavior**:
  - Browser sends `POST http://localhost:5000/api/auth/login` with `{ rollNumber: "12345678", password: "password123" }`.
  - Backend verifies bcrypt password hash against the `Auth` collection.
  - Generates JWT signed with `JWT_SECRET` containing `{ rollNumber: "12345678", role: "student" }`.
  - Returns HTTP 200 with JWT token and student profile (`Arjun Sharma`, CSE, Year 2, CGPA 8.5).
  - Student dashboard displays personalized greeting and live hostel inventory.

### Step 2 & 3: Perform Primary Action (Apply) & Verify Database Persistence
- **URL**: `http://localhost:3000/student/dashboard`
- **Action**: Click "Book BH1 Now", select Quad room, AC preference, and submit.
- **System Behavior**:
  - Browser issues `POST http://localhost:5000/api/applications` with `Authorization: Bearer <student_token>`.
  - Server verifies student profile and checks gender suitability (BH1 is Male, student is Male -> OK).
  - Verifies that no active application exists for roll number `12345678`.
  - Generates unique ID `APP-2026-XXXXX` and writes the document to the `applications` collection in MongoDB with status `SUBMITTED`.
  - Returns HTTP 201 Created. The UI displays the persistent confirmation receipt.

### Step 4: Login as Authorised Reviewing Role (Chief Warden / Admin)
- **URL**: `http://localhost:3000/admin/login`
- **Action**: Click `✨ 1-Click Demo Admin Autofill` (`admin@lpu.co.in` / `adminpassword`) and submit.
- **System Behavior**:
  - Browser sends `POST http://localhost:5000/api/admin-auth/login`.
  - Backend verifies credentials against `Admin` collection in MongoDB.
  - Returns JWT token with `{ adminId: "...", role: "admin" }`.
  - Redirects to `/admin/dashboard` showing Chief Warden Command Center, aggregate metrics, and pending applications queue.

### Step 5: Process Record & Show State Transition in Database and UI
- **URL**: `http://localhost:3000/admin/dashboard` (Tab: "📋 Student Applications")
- **Action**:
  - Click `🔍 Mark Review` on the application -> Status transitions to `UNDER_REVIEW` in MongoDB.
  - Click `✅ Allocate Room` or `🚀 Run Policy Batch Allocation Solver`.
- **System Behavior**:
  - The Policy Allocation Solver locks the target room, identifies vacant bed slot `#1`, and updates `Bed.isOccupied: true`, `Bed.occupiedBy: { rollNumber: "12345678", name: "Arjun Sharma" }`.
  - Decrements `Room.availableBeds` by 1 and `Hostel.availableCapacity` by 1.
  - Updates `Application` status to `ALLOCATED` with `assignedHostelName`, `assignedRoomNumber`, and `assignedBedNumber`.
  - Real-time UI updates: Badge changes to green `ALLOCATED`, room assignment is displayed, and capacity metrics update across all views.

### Step 6: Negative Tests (Server-Side Access Control & Validation)
1. **Unauthorised Role Action**:
   - A student attempts to call `GET http://localhost:5000/api/applications` using their student token.
   - Result: `adminMiddleware` detects `role !== "admin"` and immediately rejects with **HTTP 403 Forbidden** (`"Admin or Warden access only."`).
2. **Duplicate Application Prevention**:
   - Student attempts to submit a second application while an active one is already pending or allocated.
   - Result: Server detects active record and blocks submission with **HTTP 409 Conflict** (`"An active application already exists for this roll number."`).
3. **Gender Incompatibility Block**:
   - A male student attempts to apply for a Girls Hostel (`GH1`, `GH2`, or `GH3`).
   - Result: Server validates gender eligibility and returns **HTTP 400 Bad Request** (`"Selected hostel is restricted to Female students."`).
4. **Invalid Input Handling**:
   - An API request is sent with missing preferences array or invalid enum values.
   - Result: Mongoose schema and route validation reject the payload with **HTTP 400 Bad Request**.

### Step 7: Refresh & Query Persistence
- **Action**: Reload the page or log out and log back in.
- **System Behavior**:
  - All applications, room vacancies, and bed occupancy details are re-queried directly from MongoDB.
  - No data is lost; persisted state remains 100% consistent.

---

## 4. Entity-Relationship Data Model & MongoDB Collections

```
+---------------------------------------------------------------------------------+
|                                    MONGODB DATABASE                             |
+---------------------------------------------------------------------------------+
|                                                                                 |
|  [Hostels] (12 blocks: BH1-BH9, GH1-GH3)                                        |
|  - _id: ObjectId                                                                |
|  - name: String ("Boys Hostel 1")                                               |
|  - code: String UK ("BH1")                                                      |
|  - genderAllowed: Enum ("Male", "Female", "Co-ed")                              |
|  - totalCapacity: Number (360)                                                  |
|  - availableCapacity: Number (decrements on allocation)                         |
|  - amenities: Array<String>                                                     |
|                                                                                 |
|  [Rooms] (1,080 rooms total, 90 per hostel)                                     |
|  - _id: ObjectId                                                                |
|  - hostelId: ObjectId (ref: Hostel)                                             |
|  - blockId: ObjectId (ref: Block)                                               |
|  - roomNumber: String ("101")                                                   |
|  - floor: Number (1-9)                                                          |
|  - roomType: Enum ("Single", "Double", "Triple", "Quad")                        |
|  - acType: Enum ("AC", "Non-AC")                                                |
|  - totalBeds: Number (4)                                                        |
|  - availableBeds: Number (decrements on allocation)                             |
|  - occupancyGender: Enum ("Male", "Female", null)                               |
|  - isPwDAccessible: Boolean                                                     |
|                                                                                 |
|  [Beds] (4,320 total beds)                                                      |
|  - _id: ObjectId                                                                |
|  - roomId: ObjectId (ref: Room)                                                 |
|  - hostelId: ObjectId (ref: Hostel)                                             |
|  - bedNumber: String ("1", "2", "3", "4")                                       |
|  - isOccupied: Boolean (true / false)                                           |
|  - occupiedBy: { rollNumber, name, department, gender }                         |
|                                                                                 |
|  [Students]                                                                     |
|  - rollNumber: String UK ("12345678")                                           |
|  - name: String ("Arjun Sharma")                                                |
|  - email: String                                                                |
|  - department: String ("Computer Science")                                     |
|  - year: Number (2)                                                             |
|  - gender: Enum ("Male", "Female")                                              |
|  - cgpa: Number (8.5)                                                           |
|  - roommatePreferences: { sleepSchedule, foodPreference, cleanliness,           |
|                          studyHabits, socialHabits, noiseTolerance }            |
|                                                                                 |
|  [Applications]                                                                 |
|  - applicationId: String UK ("APP-2026-XXXXX")                                  |
|  - studentRollNumber: String                                                    |
|  - preferences: [{ hostelId, hostelCode, roomType, acPreference, priority }]   |
|  - status: Enum ("SUBMITTED", "UNDER_REVIEW", "ALLOCATED", "REJECTED")          |
|  - assignedHostelId, assignedRoomNumber, assignedBedNumber                      |
|  - submittedAt, allocatedAt                                                     |
|                                                                                 |
|  [Auth]                                                                         |
|  - rollNumber: String UK                                                        |
|  - passwordHash: String (bcrypt salted hash, 10 rounds)                         |
|                                                                                 |
|  [Admin]                                                                        |
|  - email: String UK ("admin@lpu.co.in")                                         |
|  - username: String ("admin_lpu")                                               |
|  - passwordHash: String (bcrypt salted hash, 10 rounds)                         |
|  - role: Enum ("admin", "warden")                                               |
+---------------------------------------------------------------------------------+
```

---

## 5. Technical Viva Questions & Defensible Answers

### Q1: How does your database handle concurrency and prevent overbooking when multiple students apply simultaneously?
> **Answer**:  
> In `server/routes/allocations.js`, we prevent race conditions and overbooking at three levels:
> 1. **In-process Mutual Exclusion**: An atomic flag `allocationRunInProgress` prevents concurrent allocation routines from firing simultaneously on the same Node.js event loop.
> 2. **Atomic MongoDB Find-And-Modify**: We use `Room.findOneAndUpdate({ _id: room._id, availableBeds: { $gt: 0 }, ... })` and `Bed.findOneAndUpdate({ roomId: room._id, isOccupied: false }, ...)`. Because MongoDB documents are locked atomically at the document level during update operations, no two transactions can acquire the same vacant bed.
> 3. **Defensive Compensation & Rollback**: If an update conflict occurs (`modifiedCount !== 1`), our `rollbackAllocation()` subroutine immediately executes compensating actions: releasing the reserved bed, incrementing room and hostel vacancies back, and resetting the room's occupancy gender if left empty.

### Q2: How do you enforce authorization server-side rather than just relying on UI controls?
> **Answer**:  
> UI buttons can easily be manipulated via browser dev tools or cURL. Therefore, all protected routes use Express middleware (`authMiddleware.js` and `adminMiddleware.js`):
> - Every API call to privileged endpoints (`/api/applications`, `/api/allocations/run`, `POST /api/hostels`, `DELETE /api/hostels/:id`) must supply a valid `Authorization: Bearer <jwt_token>` header.
> - The middleware verifies the JWT cryptographic signature using our server secret.
> - `adminMiddleware` specifically checks `decoded.role === "admin"`. If a regular student token is provided, the server rejects the request with **HTTP 403 Forbidden** before any controller logic executes.
> - In student-specific routes (e.g. `/api/students/:rollNumber/preferences`), the middleware verifies that the student in the token matches `req.params.rollNumber`, preventing one student from modifying another student's profile.

### Q3: Why is password hashing done with bcrypt and salt rounds = 10?
> **Answer**:  
> Storing plaintext passwords or simple MD5/SHA hashes is insecure due to rainbow tables and fast ASIC brute-forcing. `bcrypt` utilizes a slow key-derivation function with an adaptive work factor (cost 10 = $2^{10} = 1,024$ key expansion rounds). A unique salt is automatically generated and embedded into the hash to defeat precomputed dictionary attacks.

### Q4: How does your roommate compatibility matching algorithm work?
> **Answer**:  
> In `server/utils/roommateMatching.js`, compatibility is computed over 6 weighted behavioral dimensions:
> - Sleep Schedule (Weight: 20)
> - Cleanliness (Weight: 20)
> - Study Habits (Weight: 20)
> - Food Preference (Weight: 15)
> - Noise Tolerance (Weight: 15)
> - Social Habits (Weight: 10)
> 
> When two students are assigned to the same room, their preferences are compared. Flexible options (e.g., "Flexible" study habits or food preference) are treated as universal matches. The formula computes:
> $$\text{Score} = \left(\frac{\sum \text{Earned Points}}{\sum \text{Total Evaluated Weight}}\right) \times 100$$
> Scores are categorized into:
> - **80%–100%**: Excellent Match
> - **60%–79%**: Good Match
> - **40%–59%**: Average Match
> - **<40%**: Low Compatibility
> Both the aggregate percentage and trait-by-trait comparisons are returned to the student UI.

---

## 6. Verification Test Results (Automated Suite Output)

Running `npm run test:week9` outputs:

```text
=======================================================================
       LPU HOSTEL ALLOCATION & ROOMMATE MATCHING SYSTEM
       WEEK 9 FUNCTIONAL SYSTEM EVALUATION SUITE (30 MARKS)
=======================================================================

[Database] Successfully connected to MongoDB.
🔄 Resetting database with initial Week 9 state...
[Seeder] Seeded 3 Administrator & Warden accounts.
[Seeder] Seeded 12 Hostels (BH1-9, GH1-3).
[Seeder] Seeded 4320 Beds across all 12 Hostels.
[Seeder] Seeded 6 Students with Roommate Preferences.
[Seeder] Seeded 6 Student Login Credentials (password: password123).
[Seeder] Seeded 6 Initial Applications.
✅ Database reset complete.

-----------------------------------------------------------------------
  4.1 MANDATORY WEEK 9 DEMONSTRATION SCRIPT EXECUTION
-----------------------------------------------------------------------
[Step 1] Login as Role A (Student - Roll: 12345678, Arjun Sharma)...
  ✅ Student Login HTTP 200 OK
  👤 Authenticated as: Arjun Sharma (12345678)
  🔑 JWT Token Issued (expiresIn: 1d)

[Step 2 & 3] Submit Hostel Application & verify MongoDB persistence...
  ✅ Application Successfully Created: HTTP 201 Created
  📋 Application ID: APP-2026-85999279
  📊 Status: SUBMITTED
  💾 Verified directly from MongoDB: record exists

[Step 4] Login as Authorized Reviewing Role (Admin - admin@lpu.co.in)...
  ✅ Admin Login HTTP 200 OK
  🛡️ Authenticated Role: admin
  🔑 Admin JWT Token Issued

[Step 5] Process Application: Transition status & run bed allocation...
  🔍 Transition 1: Status updated to -> UNDER_REVIEW
  ✅ Transition 2: Status updated to -> ALLOCATED
  🏨 Allocated Hostel: Boys Hostel 1
  🚪 Allocated Room: 101
  🛏️  Allocated Bed Slot: #1
  📉 Capacity Decrement Check: Before=360, After=359 (decreased by 1)
  🛏️  Bed Record Verification: isOccupied=true, student=Arjun Sharma

[Step 6] Negative Access & Validation Tests:
  👉 6.1 Unauthorised Role Action: HTTP 403 Forbidden - PASSED ✅
  👉 6.2 Duplicate Application Prevention: HTTP 409 Conflict - PASSED ✅
  👉 6.3 Gender Incompatibility Block: HTTP 400 Bad Request - PASSED ✅
  👉 6.4 Invalid Input Validation: HTTP 400 Bad Request - PASSED ✅

[Step 7] Persistence After Reload / New Query Check...
  ✅ Verified from MongoDB persistence

-----------------------------------------------------------------------
  PRODUCT FEATURE: ROOMMATE MATCHING ALGORITHM (Institutional Value)
-----------------------------------------------------------------------
  Student: Rohan Gupta (12304567)
  Allotted: Boys Hostel 1, Room 101
  Matched Roommates in Room: 3
  Roommate: Arjun Sharma (Computer Science)
  Algorithmic Compatibility Score: 85% (Excellent)

=======================================================================
  🎉 ALL WEEK 9 REQUIREMENTS FULLY VERIFIED & CONFIRMED DEFENCE-READY!
=======================================================================
```

