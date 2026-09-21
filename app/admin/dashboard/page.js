"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 3250,
    totalRooms: 4320,
    occupiedRooms: 2890,
    availableRooms: 1430,
    pendingApplications: 45,
    totalHostels: 12,
    boysHostels: 9,
    girlsHostels: 3
  });

  const [recentApplications] = useState([
    {
      id: 1,
      studentName: "Rajat Singh",
      regNo: "12345678",
      hostel: "BH5",
      roomType: "AC Single",
      appliedDate: "2024-09-18",
      status: "pending"
    },
    {
      id: 2,
      studentName: "Priya Sharma",
      regNo: "12345679",
      hostel: "GH2",
      roomType: "Non-AC Double",
      appliedDate: "2024-09-18",
      status: "pending"
    },
    {
      id: 3,
      studentName: "Arjun Kumar",
      regNo: "12345680",
      hostel: "BH3",
      roomType: "AC Double",
      appliedDate: "2024-09-17",
      status: "approved"
    },
    {
      id: 4,
      studentName: "Sneha Patel",
      regNo: "12345681",
      hostel: "GH1",
      roomType: "AC Single",
      appliedDate: "2024-09-17",
      status: "pending"
    }
  ]);

  const [hostelStats] = useState([
    { code: "BH1", occupancy: 85, total: 360, available: 54 },
    { code: "BH2", occupancy: 92, total: 360, available: 29 },
    { code: "BH3", occupancy: 78, total: 360, available: 79 },
    { code: "BH4", occupancy: 88, total: 360, available: 43 },
    { code: "BH5", occupancy: 95, total: 360, available: 18 },
    { code: "GH1", occupancy: 89, total: 360, available: 40 },
    { code: "GH2", occupancy: 82, total: 360, available: 65 },
    { code: "GH3", occupancy: 91, total: 360, available: 32 }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getOccupancyColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
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
                <span className="ml-3 text-xl font-bold text-gray-900">LPU Admin Portal</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, Admin</span>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage hostel allocations, applications, and system overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Available Rooms</p>
                <p className="text-3xl font-bold text-gray-900">{stats.availableRooms.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Pending Applications</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingApplications}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Total Hostels</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalHostels}</p>
                <p className="text-xs text-gray-600">BH1-9, GH1-3</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/dashboard" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-lg text-center font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm">Dashboard</span>
            </Link>
            <Link href="/student/dashboard" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-lg text-center font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-sm">Student View</span>
            </Link>
            <Link href="/admin/login" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-4 rounded-lg text-center font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span className="text-sm">Admin Settings</span>
            </Link>
            <Link href="/" className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-4 rounded-lg text-center font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm">Home</span>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
              <Link href="/admin/dashboard" className="text-orange-500 hover:text-orange-600 font-medium text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div key={app.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{app.studentName}</h3>
                      <p className="text-sm text-gray-600">{app.regNo} • {app.hostel}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{app.roomType}</span>
                    <span className="text-xs text-gray-500">{app.appliedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hostel Occupancy */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Hostel Occupancy</h2>
            <div className="space-y-3">
              {hostelStats.map((hostel) => (
                <div key={hostel.code} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">{hostel.code}</h3>
                    <p className="text-sm text-gray-600">{hostel.available} available rooms</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getOccupancyColor(hostel.occupancy)}`}>
                      {hostel.occupancy}%
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.floor(hostel.total * hostel.occupancy / 100)}/{hostel.total}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Room Utilization</h3>
              <p className="text-2xl font-bold text-blue-600">{Math.round((stats.occupiedRooms / stats.totalRooms) * 100)}%</p>
              <p className="text-sm text-gray-600">{stats.occupiedRooms} / {stats.totalRooms} rooms</p>
            </div>

            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Active Hostels</h3>
              <p className="text-2xl font-bold text-green-600">{stats.totalHostels}/12</p>
              <p className="text-sm text-gray-600">All hostels operational</p>
            </div>

            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Processing Time</h3>
              <p className="text-2xl font-bold text-orange-600">2.5</p>
              <p className="text-sm text-gray-600">days avg. processing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}