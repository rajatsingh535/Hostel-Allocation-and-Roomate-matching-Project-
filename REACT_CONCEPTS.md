# 🎓 React Concepts Used in LPU Hostel Allocation System

This document explains all **React and Next.js concepts** used in the frontend of this project, with real code examples from the codebase.

---

## 📋 Table of Contents

1. [Project Structure](#1-project-structure)
2. [React Hooks](#2-react-hooks)
3. [State Management](#3-state-management)
4. [Form Handling](#4-form-handling)
5. [Authentication](#5-authentication)
6. [Tab Navigation](#6-tab-navigation)
7. [API Integration](#7-api-integration)
8. [Conditional Rendering](#8-conditional-rendering)
9. [Component Composition](#9-component-composition)
10. [Preference Matching Algorithm](#10-preference-matching-algorithm)
11. [Matchmaker Hub](#11-matchmaker-hub)
12. [Group Booking](#12-group-booking)
13. [Real-time Updates](#13-real-time-updates)

---

## 1. Project Structure

### Next.js App Router Structure
```
app/
├── page.js                    # Homepage
├── globals.css               # Global styles
├── components/
│   └── LpuLogo.js           # Reusable logo component
├── student/
│   ├── login/
│   │   └── page.js          # Student login page
│   └── dashboard/
│       └── page.js          # Student dashboard
└── admin/
    ├── login/
    │   └── page.js          # Admin login page
    └── dashboard/
        └── page.js          # Admin dashboard
```

**Concept Used:** Next.js 13+ App Router with file-based routing

---

## 2. React Hooks

### 2.1 useState - State Management

**What it does:** Manages component state (data that changes over time)

**Example 1: Student Login Form**
```javascript
// app/student/login/page.js
const [formData, setFormData] = useState({ 
  regNo: "", 
  password: "" 
});
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);

// Update state when user types
onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
```

**Example 2: Tab Navigation**
```javascript
// app/student/dashboard/page.js
const [activeTab, setActiveTab] = useState("book");

// Switch tabs
onClick={() => setActiveTab("matchmaker")}
```

**Why useState?**
- Triggers re-render when state changes
- Preserves state between renders
- Makes UI reactive to user interactions

---

### 2.2 useEffect - Side Effects

**What it does:** Runs code after component renders (API calls, subscriptions, timers)

**Example 1: Load Data on Mount**
```javascript
// app/student/dashboard/page.js
useEffect(() => {
  // Runs once when component mounts
  fetch("http://localhost:5000/api/hostels")
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        setAllHostels(data.data);
      }
    });
}, []); // Empty dependency array = run once on mount
```

**Example 2: Load User Preferences**
```javascript
// Matchmaker Hub component
useEffect(() => {
  setLoading(true);
  fetch(`http://localhost:5000/api/matchmaker/profiles?roll=${studentRoll}`)
    .then(r => r.json())
    .then(d => {
      setLoading(false);
      if (d.success && d.data?.length > 0) {
        const profile = d.data[0];
        setProfile(profile);
        setFormData({
          sleepSchedule: profile.lifestyle?.sleepSchedule || "11PM-7AM",
          // ... other preferences
        });
      }
    });
}, [studentRoll]); // Re-run when studentRoll changes
```

**Dependency Array:**
- `[]` - Run once on mount
- `[var]` - Run when `var` changes
- No array - Run on every render (avoid!)

---

### 2.3 useRouter - Next.js Navigation

**What it does:** Programmatic navigation in Next.js

**Example: Redirect After Login**
```javascript
import { useRouter } from "next/navigation";

const router = useRouter();

const handleLogin = (e) => {
  e.preventDefault();
  // After successful login
  router.push(`/student/dashboard?gender=${gender}&roll=${rollNumber}`);
};
```

---

## 3. State Management

### 3.1 Complex State Objects

**Example: Booking Form State**
```javascript
const [bookingForm, setBookingForm] = useState({
  studentName: "Arjun Sharma",
  studentRollNumber: "12304567",
  studentEmail: "arjun.sharma@student.lpu.co.in",
  department: "Computer Science",
  year: "2",
  gender: "Male",
  cgpa: "8.5",
  friendRollNumbers: ["", "", ""], // For group booking
  roomPreferences: { 
    floor: "", 
    quietZone: false, 
    studyFocused: false 
  },
});
```

### 3.2 Updating Nested State

**Example 1: Update Single Field**
```javascript
onChange={(e) => setBookingForm({ 
  ...bookingForm,  // Spread existing state
  department: e.target.value  // Update one field
})}
```

**Example 2: Update Array Item**
```javascript
// Update friend roll number at specific index
onChange={(e) => {
  const newFriends = [...bookingForm.friendRollNumbers];
  newFriends[idx] = e.target.value;
  setBookingForm({ 
    ...bookingForm, 
    friendRollNumbers: newFriends 
  });
}}
```

**Example 3: Toggle Boolean in Nested Object**
```javascript
onChange={(e) => setBookingForm({
  ...bookingForm,
  roomPreferences: {
    ...bookingForm.roomPreferences,
    quietZone: e.target.checked
  }
})}
```

---

## 4. Form Handling

### 4.1 Controlled Components

**What it is:** Form inputs controlled by React state

**Example: Student Login Form**
```javascript
// State holds the value
const [formData, setFormData] = useState({ regNo: "", password: "" });

// Input value comes from state
<input
  type="text"
  value={formData.regNo}  // Controlled by state
  onChange={(e) => setFormData({ 
    ...formData, 
    regNo: e.target.value 
  })}
  required
/>
```

**Why Controlled?**
- Single source of truth (state)
- Easy validation
- Can manipulate before display
- React controls the input value

---

### 4.2 Form Submission

**Example: Student Login**
```javascript
const handleSubmit = (e) => {
  e.preventDefault(); // Prevent page reload
  
  // Validate
  if (!formData.regNo.trim() || !formData.password.trim()) {
    setError("Please fill in all fields");
    return;
  }
  
  setLoading(true);
  
  // Simulate API call
  setTimeout(() => {
    window.location.href = "/student/dashboard";
  }, 600);
};

<form onSubmit={handleSubmit}>
  {/* Form inputs */}
  <button type="submit" disabled={loading}>
    {loading ? "Verifying..." : "Sign In"}
  </button>
</form>
```

---

### 4.3 Form Validation

**Example 1: Client-Side Validation**
```javascript
const handleSubmitBooking = async (e) => {
  e.preventDefault();
  
  // Validation checks
  if (!selectedCategory || !selectedHostel || !consentGiven) {
    alert("Please select a room category, hostel, and agree to terms.");
    return;
  }
  
  // Proceed with submission
  setSubmitting(true);
  // ... API call
};
```

**Example 2: Real-time Validation**
```javascript
<input
  type="email"
  pattern="[a-z0-9._%+-]+@student.lpu.co.in$"
  title="Must be a valid LPU student email"
  required
/>
```

---

## 5. Authentication

### 5.1 localStorage for Session

**What it does:** Browser storage that persists between page reloads

**Example: Store Login Data**
```javascript
// Student Login - Store credentials
const handleLogin = (e) => {
  e.preventDefault();
  
  try {
    localStorage.setItem("lpu_student_roll", rollNumber);
    localStorage.setItem("lpu_student_gender", gender);
    if (name.trim()) {
      localStorage.setItem("lpu_student_name", name);
    }
  } catch (error) {
    console.error("LocalStorage error:", error);
  }
  
  router.push(`/student/dashboard?gender=${gender}&roll=${rollNumber}`);
};
```

**Example: Retrieve on Dashboard**
```javascript
useEffect(() => {
  let detectedGender = "Male";
  let detectedRoll = "12304567";
  
  try {
    // Get from URL params
    const params = new URLSearchParams(window.location.search);
    const urlGender = params.get("gender");
    const urlRoll = params.get("roll");
    
    // Or get from localStorage
    const storedGender = localStorage.getItem("lpu_student_gender");
    const storedRoll = localStorage.getItem("lpu_student_roll");
    
    if (urlGender) detectedGender = urlGender;
    else if (storedGender) detectedGender = storedGender;
    
    if (urlRoll) detectedRoll = urlRoll;
    else if (storedRoll) detectedRoll = storedRoll;
  } catch (_) {}
  
  setStudentGender(detectedGender);
  setBookingForm(prev => ({
    ...prev,
    studentRollNumber: detectedRoll,
  }));
}, []);
```

---

### 5.2 Protected Routes

**Example: Admin Middleware Check**
```javascript
// Backend: server/middleware/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token || token !== "ADMIN_SECRET") {
    return res.status(401).json({ 
      success: false, 
      message: "Unauthorized" 
    });
  }
  
  next();
};
```

---

## 6. Tab Navigation

### 6.1 Tab State Management

**Example: Student Dashboard Tabs**
```javascript
const [activeTab, setActiveTab] = useState("book");

// Tab configuration
const tabs = [
  { id: "book", label: "Individual Booking" },
  { id: "group", label: "Group Booking (With Friends)" },
  { id: "matchmaker", label: "🤝 Matchmaker Hub" },
  { id: "room-swap", label: "🔄 Room Swap" },
  { id: "waitlist", label: "Wait List" },
  { id: "my-applications", label: `My Applications (${myApplications.length})` },
];

// Render tabs
{tabs.map((t) => (
  <button
    key={t.id}
    onClick={() => {
      setActiveTab(t.id);
      if (t.id === "group") setBookingMode("group");
    }}
    className={activeTab === t.id ? "active" : ""}
  >
    {t.label}
  </button>
))}
```

---

### 6.2 Conditional Tab Content

**Example: Show Content Based on Active Tab**
```javascript
{/* Individual Booking Tab */}
{activeTab === "book" && (
  <div>
    <h2>Individual Booking</h2>
    {/* Booking form */}
  </div>
)}

{/* Matchmaker Hub Tab */}
{activeTab === "matchmaker" && (
  <MatchmakerHub 
    studentRoll={bookingForm.studentRollNumber} 
    studentGender={studentGender} 
  />
)}

{/* Room Swap Tab */}
{activeTab === "room-swap" && (
  <RoomSwapTab 
    studentRoll={bookingForm.studentRollNumber}
    studentName={bookingForm.studentName}
    studentGender={studentGender}
  />
)}
```

---

## 7. API Integration

### 7.1 Fetch API Calls

**Example 1: GET Request**
```javascript
const [hostels, setHostels] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  setLoading(true);
  
  fetch("http://localhost:5000/api/hostels")
    .then(response => response.json())
    .then(data => {
      setLoading(false);
      if (data.success && data.data?.length > 0) {
        setHostels(data.data);
      }
    })
    .catch(error => {
      setLoading(false);
      console.error("Error:", error);
    });
}, []);
```

**Example 2: POST Request**
```javascript
const handleSubmitBooking = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  
  const payload = {
    studentName: bookingForm.studentName,
    studentRollNumber: bookingForm.studentRollNumber,
    preferences: [{
      hostelCode: selectedHostel.code,
      roomType: selectedCategory.type,
      acPreference: selectedCategory.ac ? "AC" : "Non-AC",
    }],
  };
  
  try {
    const res = await fetch("http://localhost:5000/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    const data = await res.json();
    
    if (data.success) {
      setConfirmation(data.data);
      alert("✅ Application submitted!");
    } else {
      alert(data.message || "Submission failed");
    }
  } catch (error) {
    alert("Error submitting application");
  }
  
  setSubmitting(false);
};
```

---

### 7.2 Async/Await Pattern

**Example: Smart Allocation**
```javascript
const handleRunSmartAllocation = async () => {
  setSubmitting(true);
  
  try {
    const res = await fetch(`${API}/allocations/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    
    const data = await res.json();
    
    if (data.success) {
      showToast(`✅ Allocation complete! ${data.data.allocated.length} students allocated`);
      
      // Reload data
      const appsRes = await fetch(`${API}/applications`);
      const appsData = await appsRes.json();
      if (appsData.success) {
        setApplications(appsData.data);
      }
    }
  } catch (error) {
    console.error("Allocation error:", error);
  }
  
  setSubmitting(false);
};
```

---

## 8. Conditional Rendering

### 8.1 Ternary Operator

**Example 1: Loading State**
```javascript
{loading ? (
  <div className="spinner">Loading...</div>
) : (
  <div className="content">{/* Actual content */}</div>
)}
```

**Example 2: Button Text**
```javascript
<button type="submit" disabled={submitting}>
  {submitting ? "Submitting..." : "Submit Application"}
</button>
```

---

### 8.2 Logical AND (&&)

**Example: Show Only When Condition is True**
```javascript
{/* Show error message only if error exists */}
{error && (
  <div className="error-message">{error}</div>
)}

{/* Show matches only if profile exists */}
{profile && (
  <div>
    <h3>Find Compatible Roommates</h3>
    <button onClick={handleFindMatches}>
      🔍 Find Matches
    </button>
  </div>
)}
```

---

### 8.3 Multiple Conditions

**Example: Application Status Badge**
```javascript
{app.status !== "UNDER_REVIEW" && (
  <button onClick={() => updateAppStatus(app, "UNDER_REVIEW")}>
    Review
  </button>
)}

{app.status !== "ALLOCATED" && (
  <button onClick={() => updateAppStatus(app, "ALLOCATED")}>
    Allocate
  </button>
)}
```

---

## 9. Component Composition

### 9.1 Reusable Components

**Example: Logo Component**
```javascript
// app/components/LpuLogo.js
export default function LpuLogo({
  size = 42,
  showText = true,
  subtitle = "Hostel Allocation Portal",
  theme = "light",
}) {
  const isDark = theme === "dark";

  return (
    <div className="inline-flex items-center gap-3">
      <div style={{ width: `${size}px`, height: `${size}px` }}>
        <img src="/images/lpu/lpu-logo-media.png" alt="LPU Logo" />
      </div>
      
      {showText && (
        <div>
          <span className={isDark ? "text-white" : "text-stone-900"}>
            LPU <span className="text-orange-500">HOSTEL</span>
          </span>
          <span className="text-xs">{subtitle}</span>
        </div>
      )}
    </div>
  );
}
```

**Usage:**
```javascript
// Dark theme on left panel
<LpuLogo size={48} showText={true} theme="dark" />

// Light theme on right panel
<LpuLogo size={56} showText={false} />
```

---

### 9.2 Props Drilling

**Example: Pass Data to Child Components**
```javascript
// Parent component
const [studentRoll, setStudentRoll] = useState("12304567");
const [studentGender, setStudentGender] = useState("Male");

// Pass props to children
{activeTab === "matchmaker" && (
  <MatchmakerHub 
    studentRoll={studentRoll}
    studentGender={studentGender}
  />
)}

// Child component receives props
function MatchmakerHub({ studentRoll, studentGender }) {
  // Use the props
  fetch(`/api/matchmaker/profiles?roll=${studentRoll}&gender=${studentGender}`)
}
```

---

## 10. Preference Matching Algorithm

### 10.1 Filter by Preferences

**Example: Filter Hostels by Gender**
```javascript
const [studentGender, setStudentGender] = useState("Male");
const [allHostels, setAllHostels] = useState([]);

// Filter recommended hostels based on gender
const recommendedHostels = allHostels.filter(
  hostel => hostel.genderAllowed === studentGender
);

// Male student sees: BH-1, BH-2, ... BH-9
// Female student sees: GH-1, GH-2, GH-3
```

---

### 10.2 Sort by Priority

**Example: Sort Applications by CGPA**
```javascript
// Backend: server/routes/allocations.js
const applications = await Application.find({
  status: { $in: ["SUBMITTED", "UNDER_REVIEW"] }
})
.sort({ 
  cgpa: -1,          // Higher CGPA first (descending)
  submittedAt: 1     // Earlier submission first (ascending)
});

// Result: 
// 1. CGPA 9.5 (submitted first)
// 2. CGPA 9.5 (submitted second)
// 3. CGPA 8.7
// 4. CGPA 8.3
```

---

### 10.3 Room Type Matching

**Example: Match Room Category**
```javascript
const [selectedCategory, setSelectedCategory] = useState({
  type: "Double",
  ac: true,
  label: "AC Double Seater"
});

// Find rooms matching preference
const matchingRooms = await Room.find({
  hostelId: selectedHostel._id,
  roomType: selectedCategory.type,     // "Double"
  acType: selectedCategory.ac ? "AC" : "Non-AC",
  availableBeds: { $gt: 0 }
});
```

---

## 11. Matchmaker Hub

### 11.1 Preference Form State

**Example: Complex Lifestyle Preferences**
```javascript
const [formData, setFormData] = useState({
  sleepSchedule: "11PM-7AM",
  wakeUpTime: "7AM",
  studyHabits: "Moderate",
  cleanliness: "Very Clean",
  guestFrequency: "Rarely",
  musicPreference: "Quiet",
  interests: [],  // Array for multiple selections
  bio: "",
  lookingForRoommate: true,
});
```

---

### 11.2 Multi-Select Interests

**Example: Toggle Interest Tags**
```javascript
const INTEREST_OPTIONS = [
  "Sports", "Music", "Gaming", "Reading", 
  "Movies", "Coding", "Art", "Travel"
];

const [formData, setFormData] = useState({
  interests: []  // Empty array initially
});

const toggleInterest = (interest) => {
  setFormData(prev => ({
    ...prev,
    interests: prev.interests.includes(interest)
      ? prev.interests.filter(i => i !== interest)  // Remove if exists
      : [...prev.interests, interest]               // Add if doesn't exist
  }));
};

// Render buttons
{INTEREST_OPTIONS.map(interest => (
  <button
    key={interest}
    onClick={() => toggleInterest(interest)}
    className={formData.interests.includes(interest) ? "selected" : ""}
  >
    {interest}
  </button>
))}
```

---

### 11.3 Compatibility Scoring

**Example: Calculate Match Percentage**
```javascript
// Backend: server/utils/roommateMatching.js
function calculateCompatibility(student1, student2) {
  let score = 0;
  let maxScore = 100;
  
  // Sleep schedule match (20%)
  if (student1.lifestyle.sleepSchedule === student2.lifestyle.sleepSchedule) {
    score += 20;
  }
  
  // Study habits match (20%)
  if (student1.lifestyle.studyHabits === student2.lifestyle.studyHabits) {
    score += 20;
  }
  
  // Cleanliness match (15%)
  if (student1.lifestyle.cleanliness === student2.lifestyle.cleanliness) {
    score += 15;
  }
  
  // Common interests (10%)
  const commonInterests = student1.interests.filter(
    interest => student2.interests.includes(interest)
  );
  const interestScore = (commonInterests.length / Math.max(student1.interests.length, 1)) * 10;
  score += interestScore;
  
  return Math.round((score / maxScore) * 100); // Return percentage
}
```

**Frontend: Display Matches**
```javascript
const [matches, setMatches] = useState([]);

const handleFindMatches = async () => {
  const res = await fetch(`/api/matchmaker/find-matches/${studentRoll}`, {
    method: "POST"
  });
  const data = await res.json();
  
  if (data.success) {
    setMatches(data.data);
  }
};

// Render matches
{matches.map((match, idx) => (
  <div key={idx}>
    <h4>{match.studentRoll}</h4>
    <span className="badge">
      {Math.round(match.compatibilityScore)}% Match
    </span>
    <p>{match.bio}</p>
    <div>
      Sleep: {match.lifestyle.sleepSchedule}
      Study: {match.lifestyle.studyHabits}
    </div>
  </div>
))}
```

---

## 12. Group Booking

### 12.1 Dynamic Friend List

**Example: Array of Friend Roll Numbers**
```javascript
const [bookingForm, setBookingForm] = useState({
  friendRollNumbers: ["", "", ""]  // 3 friends max
});

// Render inputs for each friend
{bookingForm.friendRollNumbers.map((rollNo, idx) => (
  <div key={idx}>
    <label>Friend {idx + 1} Roll No.</label>
    <input
      type="text"
      value={rollNo}
      onChange={(e) => {
        const newFriends = [...bookingForm.friendRollNumbers];
        newFriends[idx] = e.target.value;
        setBookingForm({
          ...bookingForm,
          friendRollNumbers: newFriends
        });
      }}
    />
  </div>
))}
```

---

### 12.2 Booking Mode Toggle

**Example: Switch Between Individual and Group**
```javascript
const [bookingMode, setBookingMode] = useState("individual");

// Tab buttons
<button onClick={() => {
  setActiveTab("book");
  setBookingMode("individual");
}}>
  Individual Booking
</button>

<button onClick={() => {
  setActiveTab("group");
  setBookingMode("group");
}}>
  Group Booking
</button>

// Show friend inputs only in group mode
{bookingMode === "group" && (
  <div>
    <h3>Enter Friend Roll Numbers</h3>
    {/* Friend inputs */}
  </div>
)}

// Include friends in submission
const payload = {
  bookingMode,
  friendRollNumbers: bookingMode === "group" 
    ? bookingForm.friendRollNumbers.filter(Boolean)  // Remove empty strings
    : []
};
```

---

### 12.3 Group Allocation Logic

**Backend: Allocate Friends Together**
```javascript
// server/routes/allocations.js
const friendRolls = application.friendRollNumbers || [];

if (friendRolls.length > 0) {
  // Find friend applications
  const friendApps = await Application.find({
    studentRollNumber: { $in: friendRolls },
    status: { $in: ["SUBMITTED", "UNDER_REVIEW"] }
  });
  
  // Try to allocate in same room
  if (room.availableBeds >= friendApps.length + 1) {
    // Allocate all friends to same room
    for (const friendApp of friendApps) {
      // Assign bed to friend
    }
  } else {
    // Try same floor or same hostel
  }
}
```

---

## 13. Real-time Updates

### 13.1 Reload Data After Action

**Example: Refresh After Allocation**
```javascript
const handleRunSmartAllocation = async () => {
  // Run allocation
  const res = await fetch("/api/allocations/run", { method: "POST" });
  const data = await res.json();
  
  if (data.success) {
    // Reload applications to see new statuses
    const appsRes = await fetch("/api/applications");
    const appsData = await appsRes.json();
    if (appsData.success) {
      setApplications(appsData.data);  // Update state
    }
    
    // Reload hostels to see updated capacity
    const hostelsRes = await fetch("/api/hostels");
    const hostelsData = await hostelsRes.json();
    if (hostelsData.success) {
      setHostels(hostelsData.data);  // Update state
    }
  }
};
```

---

### 13.2 Optimistic UI Updates

**Example: Update UI Before API Response**
```javascript
const updateAppStatus = async (app, status) => {
  // Update UI immediately (optimistic)
  setApplications(prev => 
    prev.map(a => 
      a._id === app._id ? { ...a, status } : a
    )
  );
  
  // Then sync with backend
  try {
    await fetch(`/api/applications/${app._id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
  } catch (error) {
    // Revert on error
    setApplications(prev => 
      prev.map(a => 
        a._id === app._id ? { ...a, status: app.status } : a
      )
    );
  }
};
```

---

## 🎯 Summary of React Concepts

| Concept | Used In | Purpose |
|---------|---------|---------|
| `useState` | All forms, tabs, filters | Manage component state |
| `useEffect` | Data fetching, initial load | Side effects & API calls |
| `useRouter` | Login pages | Navigation after auth |
| Controlled Components | All forms | Synchronize input with state |
| Form Submission | Login, booking, matchmaker | Handle form data |
| Conditional Rendering | Loading, errors, tabs | Show/hide UI elements |
| Array Methods (map, filter) | Lists, preferences, matches | Transform & display data |
| Props | Component communication | Pass data between components |
| localStorage | Authentication | Persist user session |
| Async/Await | API calls | Handle promises |
| Event Handlers | Buttons, inputs, tabs | Respond to user actions |
| Component Composition | LpuLogo, StatusBadge | Reusable UI pieces |

---

## 📚 Learning Resources

- **React Docs:** https://react.dev/
- **Next.js Docs:** https://nextjs.org/docs
- **JavaScript Promises:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
- **Fetch API:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

---

**🎉 This project demonstrates real-world React patterns used in production applications!**
