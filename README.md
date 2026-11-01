# 🏨 LPU Hostel Allocation & Roommate Matching System

<div align="center">

**A Smart Hostel Management System for Lovely Professional University**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4-grey?style=for-the-badge&logo=express)](https://expressjs.com/)

[🌐 Live Demo](#) • [📖 Documentation](#project-structure) • [🐛 Report Bug](#) • [✨ Request Feature](#)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Team Members](#team-members)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Module Architecture](#module-architecture)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

The **LPU Hostel Allocation & Roommate Matching System** is an intelligent platform designed to streamline hostel room allocation for students at Lovely Professional University. It incorporates **AI-powered roommate matching**, **preference-based allocation**, **friend request systems**, and **group booking** capabilities.

### 🌟 Why This System?

- ✅ **Automated Allocation**: 8-tier priority algorithm for fair room distribution
- 🤝 **Friend Matching**: Send and accept friend requests to book together
- 👥 **Group Booking**: Automatic group formation for roommates
- 🎯 **Preference-Based**: Floor, quiet zone, and study-focused options
- 📊 **Real-time Analytics**: Live hostel availability and booking stats
- 📱 **Fully Responsive**: Works seamlessly on mobile, tablet, and desktop

---

## 👥 Team Members

<table>
  <tr>
    <td align="center">
      <img src="https://ui-avatars.com/api/?name=Rajat&size=100&background=FF6B35&color=fff" width="100px;" alt="Rajat"/><br />
      <sub><b>Rajat Singh</b></sub><br />
      <sub>Frontend Developer</sub><br />
      <sub>📧 rajat@example.com</sub>
    </td>
    <td align="center">
      <img src="https://ui-avatars.com/api/?name=Aditi&size=100&background=004E89&color=fff" width="100px;" alt="Aditi"/><br />
      <sub><b>Aditi</b></sub><br />
      <sub>Backend Developer</sub><br />
      <sub>📧 aditi@example.com</sub>
    </td>
    <td align="center">
      <img src="https://ui-avatars.com/api/?name=Yash&size=100&background=1A936F&color=fff" width="100px;" alt="Yash"/><br />
      <sub><b>Yash</b></sub><br />
      <sub>Database Engineer</sub><br />
      <sub>📧 yash@example.com</sub>
    </td>
  </tr>
</table>

**Contributors:** Rajat Singh, Aditi, Yash  
**Institution:** Lovely Professional University  
**Course:** Computer Science & Engineering  
**Academic Year:** 2026

---

## ✨ Features

### 🎓 For Students

- 🔐 **Secure Authentication** - Login with registration number
- 🏢 **Browse Hostels** - View all available hostels with real-time availability
- 📝 **Smart Application** - Fill detailed preferences (floor, quiet zone, study-focused)
- 🤝 **Friend Requests** - Send/receive friend requests for roommate matching
- 👥 **Group Management** - View formed groups and member details
- 📊 **Application Tracking** - Monitor application status (Pending/Allocated/Rejected)
- 🔔 **Real-time Updates** - Live notifications for friend requests and allocations

### 👨‍💼 For Administrators

- 📈 **Dashboard Analytics** - Visual statistics and charts
- 🎯 **Smart Allocation** - 8-tier priority algorithm
  - Priority 1: Group bookings with full availability
  - Priority 2: Students with accepted friend requests
  - Priority 3-5: Floor, quiet zone, study preferences
  - Priority 6-8: Partial groups and general pool
- 📋 **Application Management** - View, approve, reject applications
- 🏨 **Hostel Management** - Add, edit, delete hostel configurations
- 📊 **Reports** - Generate allocation reports and statistics

### 🎨 UI/UX Features

- 🌈 **Modern Design** - Gradient backgrounds, 3D transforms, animations
- 🎥 **Video Background** - Hero section with hostel facilities video
- 📱 **Fully Responsive** - Mobile-first design, works on all devices
- 🖼️ **Image Gallery** - High-quality Unsplash hostel images
- ⚡ **Fast Performance** - Optimized with Next.js 14
- ♿ **Accessible** - WCAG compliant UI components

---

## 🛠️ Tech Stack

### Frontend (Rajat)
- **Framework:** Next.js 14 (App Router)
- **Library:** React 18
- **Styling:** Tailwind CSS, Custom CSS
- **State Management:** React Hooks (useState, useEffect)
- **Routing:** Next.js App Router
- **HTTP Client:** Fetch API
- **Icons & UI:** Custom components

### Backend (Aditi)
- **Runtime:** Node.js 22
- **Framework:** Express.js 4
- **Middleware:** CORS, Body Parser
- **API Design:** RESTful architecture
- **Validation:** Custom validators
- **Error Handling:** Centralized error middleware

### Database (Yash)
- **Database:** MongoDB 7
- **ODM:** Mongoose 8
- **Schema Design:** Normalized data structure
- **Collections:** Hostels, Applications, Rooms, FriendRequests, Groups
- **Indexing:** Optimized queries with indexes
- **Seeding:** Automatic data population

### DevOps & Tools
- **Version Control:** Git & GitHub
- **Package Manager:** npm
- **Process Manager:** Concurrently
- **Development:** Hot reload (Next.js dev server)
- **Environment:** .env configuration

---

## 📁 Project Structure

```
Hostel-Allocation-and-Roomate-matching-Project-/
│
├── 📂 app/                          # Next.js App Router (Frontend)
│   ├── page.js                      # Home page with hero, features, gallery
│   ├── globals.css                  # Global styles and animations
│   ├── layout.js                    # Root layout with metadata
│   │
│   ├── 📂 student/                  # Student portal
│   │   ├── login/page.js            # Student login
│   │   └── dashboard/page.js        # Student dashboard (4 tabs)
│   │
│   └── 📂 admin/                    # Admin panel
│       ├── login/page.js            # Admin login
│       └── dashboard/page.js        # Admin dashboard with analytics
│
├── 📂 server/                       # Backend API (Express)
│   ├── index.js                     # Main server entry point
│   ├── config/db.js                 # MongoDB connection
│   │
│   ├── 📂 models/                   # Mongoose schemas
│   │   ├── Hostel.js                # Hostel schema
│   │   ├── Application.js           # Application schema
│   │   └── Room.js                  # Room schema
│   │
│   ├── 📂 routes/                   # API routes
│   │   ├── hostels.js               # GET /api/hostels
│   │   ├── applications.js          # POST /api/applications
│   │   ├── allocations.js           # POST /api/allocations/run
│   │   └── friendRequests.js        # Friend request CRUD
│   │
│   └── 📂 seeds/                    # Database seeders
│       └── hostelSeeds.js           # Initial hostel data
│
├── 📂 public/                       # Static assets
│   ├── 📂 images/                   # Hostel images
│   ├── 📂 videos/                   # Background videos
│   └── 📂 logos/                    # LPU SAE India logo
│
├── 📂 docs/                         # Documentation
│   ├── API.md                       # API documentation
│   ├── SETUP.md                     # Setup guide
│   ├── MODULES.md                   # Module architecture
│   ├── TESTING.md                   # Testing guide
│   ├── DEPLOYMENT.md                # Deployment instructions
│   ├── FRONTEND.md                  # Frontend documentation (Rajat)
│   ├── BACKEND.md                   # Backend documentation (Aditi)
│   └── DATABASE.md                  # Database documentation (Yash)
│
├── 📂 tests/                        # Test files
│   ├── api.test.js                  # API tests
│   └── components.test.js           # Component tests
│
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── package.json                     # Project dependencies
├── README.md                        # This file
└── LICENSE                          # MIT License

```

---

## 🏗️ Module Architecture

The project is divided into **8 core modules** for scalability and maintainability:

### Module 1: Authentication & Authorization
**Owner:** Rajat (Frontend) + Aditi (Backend)
- Student login system
- Admin login system
- Session management
- Role-based access control

### Module 2: Hostel Management
**Owner:** Yash (Database) + Aditi (Backend)
- Hostel CRUD operations
- Room availability tracking
- Capacity management
- Hostel analytics

### Module 3: Application System
**Owner:** Aditi (Backend) + Rajat (Frontend)
- Application submission
- Preference selection
- Application tracking
- Status updates

### Module 4: Friend Request System
**Owner:** Rajat (Frontend) + Aditi (Backend)
- Send friend requests
- Accept/reject requests
- Request status tracking
- Notification system

### Module 5: Group Booking
**Owner:** Aditi (Backend) + Yash (Database)
- Automatic group formation
- Group member management
- Group booking logic
- Group status tracking

### Module 6: Smart Allocation Algorithm
**Owner:** Aditi (Backend) + Yash (Database)
- 8-tier priority system
- Preference matching
- Group prioritization
- Fair allocation logic

### Module 7: Admin Dashboard
**Owner:** Rajat (Frontend) + Aditi (Backend)
- Analytics and statistics
- Application management
- Allocation controls
- Reports generation

### Module 8: UI/UX & Responsiveness
**Owner:** Rajat (Frontend)
- Responsive design
- Animations and effects
- Video backgrounds
- Image galleries
- Accessibility features

---

## 🚀 Installation

### Prerequisites

- Node.js 18+ installed
- MongoDB 6+ installed and running
- Git installed
- npm or yarn package manager

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/Hostel-Allocation-and-Roomate-matching-Project-.git
cd Hostel-Allocation-and-Roomate-matching-Project-
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://127.0.0.1:27017/hostel_db

# Server
PORT=5000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 4: Seed the Database

```bash
node server/seeds/hostelSeeds.js
```

### Step 5: Start the Development Servers

```bash
npm run dev
```

This starts both servers:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

---

## 💻 Usage

### For Students

1. **Login**
   - Go to http://localhost:3000
   - Click "Student Login"
   - Use demo credentials or register

2. **Browse Hostels**
   - View available hostels in the "Hostels" tab
   - Check room availability, amenities, pricing

3. **Apply for Room**
   - Click "Apply Now" on desired hostel
   - Fill personal details
   - Select preferences (floor, quiet zone, study-focused)
   - Optionally add friend roll numbers

4. **Manage Friends**
   - Go to "Friends" tab
   - Send friend requests by roll number
   - Accept/reject received requests

5. **View Groups**
   - Check "Groups" tab for formed groups
   - See all group members

6. **Track Applications**
   - Monitor status in "Applications" tab

### For Administrators

1. **Login**
   - Go to http://localhost:3000/admin/login
   - Enter admin credentials

2. **View Dashboard**
   - See real-time statistics
   - Monitor application counts

3. **Manage Applications**
   - Review submitted applications
   - View student preferences

4. **Run Allocation**
   - Go to "Smart Allocation" tab
   - Click "Run Allocation Algorithm"
   - Review allocation results

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Hostels
```http
GET /hostels
```
Returns all hostels with availability

#### Applications
```http
POST /applications
Body: {
  studentName, studentRollNumber, studentEmail,
  hostelId, roomType, acPreference,
  floorPreference, quietZone, studyFocused,
  friendRollNumbers[]
}
```

#### Friend Requests
```http
POST /friend-requests/send
Body: { fromStudent: {}, toStudent: {}, message }

GET /friend-requests/received/:rollNumber
GET /friend-requests/sent/:rollNumber

PATCH /friend-requests/:id/accept
PATCH /friend-requests/:id/reject
```

#### Allocations
```http
POST /allocations/run
```
Runs the smart allocation algorithm

For full API documentation, see [docs/API.md](docs/API.md)

---

## 📱 Mobile Responsiveness

### Tailwind CSS Responsive Design

The application is built with a **mobile-first approach** using Tailwind CSS utility classes:

#### Breakpoints
```css
sm:  640px  → Mobile landscape
md:  768px  → Tablet
lg:  1024px → Desktop
xl:  1280px → Large desktop
2xl: 1536px → Extra large
```

#### Responsive Components
```jsx
// Grid - 1 column mobile, 2 tablet, 3 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Text - Smaller on mobile, larger on desktop
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">

// Padding - Less on mobile, more on desktop
<div className="px-4 sm:px-6 lg:px-8 py-12 md:py-20">

// Hidden on mobile, visible on desktop
<div className="hidden md:block">

// Show only on mobile
<div className="block md:hidden">
```

#### Mobile Features
- ✅ Touch-friendly buttons (min 44x44px)
- ✅ Hamburger menu for navigation (< 768px)
- ✅ Swipeable cards
- ✅ Bottom navigation for quick access
- ✅ Optimized images (Next.js Image)
- ✅ Smooth scrolling
- ✅ Modal overlays for forms

#### Testing Mobile
```bash
# Chrome DevTools
1. Press F12
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select device: iPhone 12, iPad, Galaxy S21

# Real Device Testing
1. Get local IP: ipconfig (Windows) / ifconfig (Mac)
2. Access: http://192.168.x.x:3000
3. Test on phone/tablet
```

---

## 🚀 Vercel Deployment

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/yourusername/Hostel-Allocation-and-Roomate-matching-Project-)

### Manual Deployment Steps

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Connect to Vercel**
- Visit [Vercel Dashboard](https://vercel.com/new)
- Import your GitHub repository
- Configure environment variables:
  ```
  NEXT_PUBLIC_API_URL=https://your-backend-url.com
  MONGODB_URI=your_mongodb_connection_string
  ```

3. **Deploy**
- Click "Deploy"
- Wait 2-5 minutes
- Your site is live! 🎉

4. **Verify**
- Check logo renders: `/lpu-logo.ico`
- Test on mobile devices
- Verify all images load
- Test chatbot functionality

### Deployment Fixes
For detailed deployment troubleshooting, see [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md)

**Common Issues:**
- ❌ Logo not showing → File path case-sensitivity
- ❌ Images broken → Check `public/` folder
- ❌ Build fails → Missing dependencies
- ✅ All fixed in this project!

---

## 📸 Screenshots

### Home Page - Desktop
![Home Page](public/images/Screenshot%202026-11-01%20122358.png)

### Student Dashboard - All Tabs
![Student Dashboard](public/images/Screenshot%202026-11-01%20122549.png)

### Admin Dashboard - Analytics
![Admin Dashboard](public/images/Screenshot%202026-11-01%20122649.png)

### Smart Allocation - Algorithm
![Allocation System](public/images/Screenshot%202026-11-01%20124829.png)

### Mobile View
All pages are fully responsive and tested on:
- 📱 iPhone SE (375px)
- 📱 iPhone 12/13 (390px)
- 📱 Android phones (360px - 414px)
- 📱 iPad (768px)
- 💻 Desktop (1280px+)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Lovely Professional University** - For project support
- **SAE India Collegiate Club** - For guidance
- **Next.js Team** - For the amazing framework
- **MongoDB Team** - For the powerful database
- **Unsplash** - For high-quality images

---

## 📞 Contact & Support

- **Project Repository:** [GitHub](https://github.com/yourusername/Hostel-Allocation-and-Roomate-matching-Project-)
- **Bug Reports:** [Issues](https://github.com/yourusername/Hostel-Allocation-and-Roomate-matching-Project-/issues)
- **Email:** hostel@lpu.co.in

---

<div align="center">

**Made with ❤️ by LPU Students**

⭐ Star this repository if you find it helpful!

</div>
