"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    adminId: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Redirect to admin dashboard for demo
    window.location.href = '/admin/dashboard';
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">L</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access the administrative panel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="adminId" className="block text-sm font-medium text-gray-700">
                Admin ID
              </label>
              <div className="mt-1">
                <input
                  id="adminId"
                  name="adminId"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Enter your admin ID"
                  value={formData.adminId}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-orange-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Admin Sign in
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Need technical support?{' '}
                <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
                  Contact IT Team
                </a>
              </p>
            </div>
          </form>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="text-xs text-gray-500 text-center">
              <p>Admin portal for authorized personnel only</p>
              <p className="mt-1">© 2026 Lovely Professional University</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-orange-600 hover:text-orange-500 font-medium">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}