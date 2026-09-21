import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">LPU Hostel Portal</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/student/login" className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md font-medium transition-colors">
                Student Login
              </Link>
              <Link href="/admin/login" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium transition-colors">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            LPU Hostel Room Allocation
            <span className="block text-orange-500 mt-2">& Roommate Matching</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Modern, efficient hostel allocation system for Lovely Professional University students. 
            Find your perfect room and compatible roommates with our smart matching algorithm.
          </p>
          <div className="flex justify-center space-x-4 flex-wrap gap-4">
            <Link href="/student/dashboard" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
              Student Portal
            </Link>
            <Link href="/admin/dashboard" className="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-gray-200 hover:border-orange-500 hover:text-orange-500 shadow-lg transform hover:scale-105 transition-all duration-300">
              Admin Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Hostel Management Solution
            </h2>
            <p className="text-gray-600 text-lg">Everything you need for seamless hostel allocation</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Smart Room Allocation</h3>
              <p className="text-gray-600">Intelligent allocation system for BH1-9 and GH1-3 hostels with AC/Non-AC options</p>
            </div>

            <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Roommate Matching</h3>
              <p className="text-gray-600">Advanced compatibility algorithm to find perfect roommates based on preferences</p>
            </div>

            <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-green-200 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Admin Dashboard</h3>
              <p className="text-gray-600">Comprehensive admin panel for managing hostels, rooms, and student allocations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Hostels */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Hostels</h2>
            <p className="text-gray-600">Choose from our premium hostel facilities</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Boys Hostels */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">BH</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900">Boys Hostels</h3>
                  <p className="text-gray-600">BH1 to BH9</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[1,2,3,4,5,6,7,8,9].map(num => (
                  <div key={num} className="bg-blue-50 text-blue-700 text-center py-2 rounded-lg font-semibold">
                    BH{num}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <p>• 9 floors per hostel</p>
                <p>• AC & Non-AC rooms available</p>
                <p>• Modern facilities & amenities</p>
              </div>
            </div>

            {/* Girls Hostels */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <span className="text-pink-600 font-bold">GH</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900">Girls Hostels</h3>
                  <p className="text-gray-600">GH1 to GH3</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[1,2,3].map(num => (
                  <div key={num} className="bg-pink-50 text-pink-700 text-center py-2 rounded-lg font-semibold">
                    GH{num}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <p>• 9 floors per hostel</p>
                <p>• AC & Non-AC rooms available</p>
                <p>• Secure & comfortable environment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Perfect Room?</h2>
          <p className="text-white opacity-90 text-lg mb-8">Join thousands of LPU students who have found their ideal accommodation</p>
          <div className="flex justify-center space-x-4 flex-wrap gap-4">
            <Link href="/student/login" className="bg-white text-orange-500 px-8 py-3 rounded-lg text-lg font-semibold hover:shadow-xl transition">
              Student Login
            </Link>
            <Link href="/admin/login" className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-orange-500 transition">
              Admin Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <span className="ml-2 text-lg font-bold">LPU Hostel Portal</span>
              </div>
              <p className="text-gray-400">Modern hostel allocation system for LPU students</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/student/login" className="hover:text-white transition-colors">Student Login</Link></li>
                <li><Link href="/admin/login" className="hover:text-white transition-colors">Admin Login</Link></li>
                <li><Link href="/student/dashboard" className="hover:text-white transition-colors">Student Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hostels</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Boys Hostels (BH1-9)</li>
                <li>Girls Hostels (GH1-3)</li>
                <li>AC & Non-AC Rooms</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Lovely Professional University</li>
                <li>Phagwara, Punjab</li>
                <li>hostel@lpu.co.in</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 LPU Hostel Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}