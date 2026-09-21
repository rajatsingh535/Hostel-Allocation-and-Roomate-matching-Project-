# LPU Hostel Room Allocation & Roommate Matching System

A modern, clean web application for managing hostel room allocation and roommate matching at Lovely Professional University with LPU's signature orange theme.

##  Project Structure

### **Hostels Configuration**
- **Boys Hostels**: BH1 to BH9 (9 hostels)
- **Girls Hostels**: GH1 to GH3 (3 hostels)
- **Total**: 12 hostels with 9 floors each
- **Room Types**: AC and Non-AC rooms available
- **Capacity**: 4 students per room, 10 rooms per floor

### **Technology Stack**
- **Frontend**: Next.js 14 with React 18, Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with in-memory server for development
- **Design**: Clean LPU orange theme (#FF6B35)

##  Features

### **Student Portal**
- **Dashboard**: Overview of current allocation and roommate status
- **Hostel Browser**: View all BH1-9 and GH1-3 hostels with filtering
- **Room Allocation**: Apply for rooms with AC/Non-AC preferences
- **Roommate Matching**: Advanced algorithm to find compatible roommates
- **Application Tracking**: Monitor application status in real-time

### **Admin Portal**
- **Dashboard**: System statistics and recent activities
- **Hostel Management**: Manage all 12 hostels (BH1-9, GH1-3)
- **Room Management**: Control room allocations and availability
- **Student Management**: View and manage student records
- **Application Review**: Process and approve applications
- **Reports**: Generate occupancy and allocation reports

##  Design Features

- **LPU Orange Theme**: Consistent branding with #FF6B35 orange accent
- **Clean UI**: Modern, minimalist design with excellent UX
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Accessibility**: WCAG compliant design patterns
- **Modern Icons**: Lucide React icons throughout

##  Database Schema

### **Hostels**
- 12 hostels total (BH1-BH9, GH1-GH3)
- 9 floors per hostel
- Gender-specific allocation
- Comprehensive amenities tracking

### **Rooms**
- 1080 total rooms (90 per hostel)
- AC/Non-AC room types
- 4-bed capacity per room
- Floor-wise organization

### **Students**
- Complete student profiles
- Academic information (CGPA, Department, Year)
- Roommate preferences and compatibility

### **Applications**
- Multi-preference system
- Status tracking workflow
- Special accommodation requests

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start
```bash
# Install dependencies
npm install

# Seed database with sample data
npm run seed

# Run development servers
npm run dev
```

### Manual Setup
```bash
# Backend (Terminal 1)
cd server
node index.js

# Frontend (Terminal 2) 
npx next dev -p 3001
```

##  Access Points

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health
- **Hostels API**: http://localhost:5000/api/hostels

##  User Interfaces

### **Landing Page**
- Clean hero section with LPU branding
- Feature highlights and hostel overview
- Quick access to student/admin portals

### **Student Dashboard**
- Current allocation status
- Roommate information
- Application tracking
- Quick action buttons

### **Admin Dashboard** 
- System-wide statistics
- Recent applications
- Hostel occupancy rates
- Management shortcuts

### **Hostel Browser**
- Grid view of all hostels
- Gender-based filtering
- Real-time occupancy data
- AC/Non-AC room breakdown

##  Technical Highlights

- **Modern Stack**: Latest Next.js 14 with App Router
- **Type Safety**: Mongoose schemas for data validation
- **Performance**: Optimized MongoDB queries and React rendering
- **Scalability**: Modular component architecture
- **Security**: Input validation and sanitization
- **SEO Friendly**: Server-side rendering with Next.js

##  System Statistics

- **Total Hostels**: 12 (BH1-9: Boys, GH1-3: Girls)
- **Total Rooms**: 1,080 rooms
- **Total Capacity**: 4,320 students
- **AC Rooms**: 540 rooms
- **Non-AC Rooms**: 540 rooms
- **Floors per Hostel**: 9 floors
- **Rooms per Floor**: 10 rooms

##  Key Features

### **Smart Allocation**
- Preference-based room assignment
- Gender-specific hostel allocation
- AC/Non-AC room preferences
- Special accommodation support

### **Roommate Matching**
- Compatibility algorithm
- Lifestyle preference matching
- Study habits consideration
- Interest-based pairing

### **Admin Controls**
- Real-time occupancy monitoring
- Application workflow management
- Student record maintenance
- System reporting and analytics

##  Future Enhancements

- **Mobile App**: React Native companion app
- **Payment Integration**: Online fee payment system
- **Notifications**: Real-time updates and alerts
- **Chat System**: In-app student communication
- **Analytics Dashboard**: Advanced reporting and insights

---

**Built for Lovely Professional University**  
*Modern Hostel Management System with Clean Design*
