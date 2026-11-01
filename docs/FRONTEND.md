# 📱 Frontend Documentation

**Module Owner:** Rajat Singh  
**Tech Stack:** Next.js 14, React 18, Tailwind CSS

---

## 🎯 Overview

The frontend is built with Next.js 14 using the App Router, providing a modern, responsive, and performant user interface for both students and administrators.

## 🏗️ Architecture

### Pages Structure

```
app/
├── page.js                 # Landing page
├── layout.js               # Root layout
├── globals.css             # Global styles
├── student/
│   ├── login/page.js       # Student login
│   └── dashboard/page.js   # Student dashboard
└── admin/
    ├── login/page.js       # Admin login
    └── dashboard/page.js   # Admin dashboard
```

## 🎨 Design System

### Color Palette
```css
:root {
  --primary: #FF6B35;           /* Orange */
  --primary-dark: #E55527;
  --primary-soft: #FFF4F1;
  --bg-alt: #F8F9FA;
  --border: #E5E7EB;
  --success: #10B981;
  --error: #EF4444;
}
```

### Typography
- **Headings:** Inter, Bold/Black
- **Body:** Inter, Regular
- **Monospace:** SF Mono, Monaco

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 📋 Components

### 1. Home Page (Landing)

**Features:**
- Video background hero section
- Interactive features showcase
- Student testimonials
- Live stats counter
- Campus gallery with zoom effects
- Call-to-action buttons

**Key Code:**
```jsx
// Video Background Hero
<video autoPlay loop muted playsInline>
  <source src="/videos/lpu_hostel_facilities_face_free.mp4" type="video/mp4" />
</video>
```

### 2. Student Dashboard

**Tabs:**
1. **Hostels Tab**
   - Browse available hostels
   - Real-time availability
   - Apply for rooms

2. **Applications Tab**
   - View submitted applications
   - Track status
   - Application history

3. **Friends Tab**
   - Send friend requests
   - Accept/reject requests
   - View sent requests

4. **Groups Tab**
   - View formed groups
   - See group members
   - Group status

**State Management:**
```jsx
const [activeTab, setActiveTab] = useState("hostels");
const [hostels, setHostels] = useState([]);
const [myApplications, setMyApplications] = useState([]);
const [friendRequests, setFriendRequests] = useState({ received: [], sent: [] });
const [myGroups, setMyGroups] = useState([]);
```

### 3. Admin Dashboard

**Features:**
- Real-time analytics
- Application management
- Smart allocation controls
- Visual statistics

**Tabs:**
1. Applications
2. Analytics
3. Smart Allocation

## 🎭 Animations

### CSS Animations
```css
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes glow-border {
  0%, 100% { box-shadow: 0 0 5px rgba(255, 107, 53, 0.3); }
  50% { box-shadow: 0 0 20px rgba(255, 107, 53, 0.6); }
}

@keyframes float-particle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
```

### Usage
```jsx
<div className="card-glow animate-stagger-fade">
  {/* Content */}
</div>
```

## 🔌 API Integration

### Fetch Hostels
```javascript
useEffect(() => {
  fetch("http://localhost:5000/api/hostels")
    .then(res => res.json())
    .then(data => setHostels(data.data || []));
}, []);
```

### Submit Application
```javascript
const handleBook = async (e) => {
  e.preventDefault();
  const response = await fetch("http://localhost:5000/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingForm)
  });
  const data = await response.json();
  // Handle response
};
```

### Friend Requests
```javascript
const sendFriendRequest = async (e) => {
  e.preventDefault();
  await fetch("http://localhost:5000/api/friend-requests/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fromStudent: { /* data */ },
      toStudent: { /* data */ },
      message: friendRequestForm.message
    })
  });
};
```

## 📱 Responsive Design

### Mobile-First Approach

```jsx
// Responsive Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {hostels.map(hostel => (
    <HostelCard key={hostel._id} hostel={hostel} />
  ))}
</div>

// Responsive Navigation
<nav className="flex flex-col md:flex-row items-center gap-4">
  {/* Nav items */}
</nav>
```

### Tailwind Responsive Classes
```css
/* Mobile */
px-4 py-2 text-sm

/* Tablet */
md:px-6 md:py-3 md:text-base

/* Desktop */
lg:px-8 lg:py-4 lg:text-lg
```

## ♿ Accessibility

### ARIA Labels
```jsx
<button aria-label="Send friend request">
  Send Request
</button>

<input 
  aria-required="true"
  aria-invalid={error ? "true" : "false"}
/>
```

### Keyboard Navigation
```jsx
<div 
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  {/* Content */}
</div>
```

## 🎯 Performance Optimization

### Image Optimization
```jsx
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/images/hostel.jpg"
  alt="Hostel"
  width={800}
  height={600}
  priority
/>
```

### Lazy Loading
```jsx
// Lazy load heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>
});
```

### Code Splitting
Next.js automatically splits code by route, reducing initial bundle size.

## 🧪 Testing

### Component Testing
```javascript
// Example test
test('renders hostel card', () => {
  render(<HostelCard hostel={mockHostel} />);
  expect(screen.getByText(mockHostel.name)).toBeInTheDocument();
});
```

## 🐛 Debugging

### Console Logs
```javascript
console.log("Hostels fetched:", hostels);
console.error("Application submission failed:", error);
```

### React DevTools
- Inspect component tree
- View state and props
- Profile performance

## 📝 Coding Standards

### File Naming
- Components: PascalCase (HostelCard.jsx)
- Pages: lowercase (page.js)
- Utilities: camelCase (formatDate.js)

### Component Structure
```jsx
"use client";
import { useState, useEffect } from "react";

export default function ComponentName() {
  // State
  const [data, setData] = useState([]);
  
  // Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // Handlers
  const handleAction = () => {
    // Logic
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

## 🚀 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Static Export
```bash
npm run build
npm run export
```

---

## 📞 Support

For frontend issues, contact: **Rajat Singh**  
Email: rajat@example.com

---

**Last Updated:** November 2026  
**Version:** 1.0.0
