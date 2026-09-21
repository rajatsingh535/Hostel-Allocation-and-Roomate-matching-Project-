"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function StudentDashboard() {
  const [studentData] = useState({
    name: "Rajat Singh",
    regNo: "12345678",
    email: "rajat.singh@lpu.co.in",
    phone: "+91 9876543210",
    course: "B.Tech CSE",
    year: "3rd Year",
    currentRoom: null,
    applicationStatus: "pending",
    preferences: {
      hostelType: "AC",
      roomType: "Single",
      floor: "Ground Floor"
    }
  });

  const [applications] = useState([
    {
      id: 1,
      hostelCode: "BH5",
      roomType: "AC Single",
      appliedDate: "2024-09-15",
      status: "pending",
      priority: 1
    },
    {
      id: 2,
      hostelCode: "BH3",
      roomType: "AC Double",
      appliedDate: "2024-09-15",
      status: "pending",
      priority: 2
    }
  ]);

  const [roommateRequests] = useState([
    {
      id: 1,
      name: "Arjun Sharma",
      regNo: "12345679",
      course: "B.Tech CSE",
      preferences: ["Study-friendly", "Non-smoker", "Early sleeper"],
      compatibility: 85,
      status: "pending"
    },
    {
      id: 2,
      name: "Vikram Kumar",
      regNo: "12345680",
      course: "B.Tech IT",
      preferences: ["Music lover", "Gym enthusiast", "Social"],
      compatibility: 72,
      status: "pending"
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCompatibilityColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">LPU Student Portal</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {studentData.name}</span>
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Manage your hostel applications and roommate requests</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profile</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-gray-900 font-semibold">{studentData.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Registration No.</label>
                  <p className="text-gray-900 font-semibold">{studentData.regNo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{studentData.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Course</label>
                  <p className="text-gray-900">{studentData.course}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Year</label>
                  <p className="text-gray-900">{studentData.year}</p>
                </div>
              </div>
            </div>

            {/* Current Room Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Room Status</h2>
              {studentData.currentRoom ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-green-600 font-semibold">Room Allocated</p>
                  <p className="text-gray-900 font-bold text-lg">{studentData.currentRoom}</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-yellow-600 font-semibold">No Room Allocated</p>
                  <p className="text-gray-600 text-sm">Apply for a hostel room</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/student/dashboard" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-4 rounded-lg text-center font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  My Profile
                </Link>
                <Link href="/admin/dashboard" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-lg text-center font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Admin View
                </Link>
              </div>
            </div>

            {/* Applications */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">My Applications</h2>
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{app.hostelCode} - {app.roomType}</h3>
                          <p className="text-sm text-gray-600">Applied on {app.appliedDate}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Priority: {app.priority}</span>
                        <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600">No applications yet</p>
                  <Link href="/student/dashboard" className="text-orange-500 hover:text-orange-600 font-medium">
                    View Dashboard
                  </Link>
                </div>
              )}
            </div>

            {/* Roommate Requests */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Roommate Requests</h2>
              {roommateRequests.length > 0 ? (
                <div className="space-y-4">
                  {roommateRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{request.name}</h3>
                          <p className="text-sm text-gray-600">{request.regNo} • {request.course}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCompatibilityColor(request.compatibility)}`}>
                          {request.compatibility}% Match
                        </span>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">Preferences:</p>
                        <div className="flex flex-wrap gap-1">
                          {request.preferences.map((pref, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {pref}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          Accept
                        </button>
                        <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          Decline
                        </button>
                        <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-gray-600">No roommate requests</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}