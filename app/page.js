"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [stats, setStats] = useState({
    totalHostels: 12,
    totalRooms: 1080,
    totalBeds: 4320,
    occupancy: 85
  });
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch hostels data
    fetch("http://localhost:5000/api/hostels")
      .then(res => res.json())
      .then(data => {
        setHostels(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <img src="/lpu-logo.ico" alt="LPU" className="h-10 w-10" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">LPU Hostel Portal</h1>
                <p className="text-xs text-gray-500">Lovely Professional University</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-sm font-medium text-gray-700 hover:text-orange-600 transition">About</a>
              <a href="#hostels" className="text-sm font-medium text-gray-700 hover:text-orange-600 transition">Hostels</a>
              <a href="#facilities" className="text-sm font-medium text-gray-700 hover:text-orange-600 transition">Facilities</a>
              <a href="#contact" className="text-sm font-medium text-gray-700 hover:text-orange-600 transition">Contact</a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/student/login" className="px-4 py-2 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition">
                Student Login
              </Link>
              <Link href="/admin/login" className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-6">
                <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
                Admissions Open 2026
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Welcome to LPU <br />
                <span className="text-orange-600">Hostel Accommodation</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Experience world-class hostel facilities with modern amenities, 24/7 security, 
                and a vibrant campus life. Book your accommodation today!
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/student/login" className="px-8 py-4 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition shadow-lg hover:shadow-xl">
                  Apply Now →
                </Link>
                <Link href="#hostels" className="px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition border-2 border-gray-200">
                  View Hostels
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-orange-600 mb-2">{stats.totalHostels}+</div>
                <div className="text-sm text-gray-600 font-medium">Hostel Blocks</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-orange-600 mb-2">{stats.totalRooms}+</div>
                <div className="text-sm text-gray-600 font-medium">Total Rooms</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-orange-600 mb-2">{stats.totalBeds}+</div>
                <div className="text-sm text-gray-600 font-medium">Bed Capacity</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-orange-600 mb-2">{stats.occupancy}%</div>
                <div className="text-sm text-gray-600 font-medium">Occupancy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About LPU Hostels</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Lovely Professional University provides world-class hostel accommodation with modern facilities, 
              ensuring a comfortable and safe living experience for students.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100">
              <div className="w-12 h-12 bg-orange-600 text-white rounded-xl flex items-center justify-center text-2xl mb-4">
                🏢
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Modern Infrastructure</h3>
              <p className="text-gray-600">
                State-of-the-art hostel buildings with lifts, power backup, and modern amenities for comfortable living.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center text-2xl mb-4">
                🛡️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Security</h3>
              <p className="text-gray-600">
                Round-the-clock security with CCTV surveillance, biometric access, and trained security personnel.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100">
              <div className="w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center text-2xl mb-4">
                🍽️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Dining</h3>
              <p className="text-gray-600">
                Hygienic mess facilities serving nutritious multi-cuisine meals prepared by professional chefs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Hostels */}
      <section id="hostels" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Available Hostels</h2>
            <p className="text-lg text-gray-600">Choose from our wide range of hostel accommodations</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-4">Loading hostels...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hostels.slice(0, 6).map((hostel) => (
                <div key={hostel._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group">
                  <div className="relative h-48 bg-gradient-to-br from-orange-200 to-orange-300">
                    <img 
                      src={hostel.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"} 
                      alt={hostel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-700">
                      {hostel.gender}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{hostel.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{hostel.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-orange-600">₹{hostel.pricing?.double?.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Per Semester</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">{hostel.availableRooms} / {hostel.totalRooms}</div>
                        <div className="text-xs text-gray-500">Rooms Available</div>
                      </div>
                    </div>

                    <Link href="/student/login" className="block w-full py-3 bg-orange-600 text-white text-center rounded-lg font-semibold hover:bg-orange-700 transition">
                      Apply Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/student/login" className="inline-block px-8 py-4 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-50 transition border-2 border-orange-600">
              View All Hostels →
            </Link>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section id="facilities" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">World-Class Facilities</h2>
            <p className="text-lg text-gray-600">Everything you need for a comfortable campus life</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "📶", title: "High-Speed WiFi", desc: "Unlimited internet access 24/7" },
              { icon: "🏋️", title: "Gymnasium", desc: "Fully equipped fitness centers" },
              { icon: "📚", title: "Study Rooms", desc: "Quiet spaces for focused study" },
              { icon: "🧺", title: "Laundry Service", desc: "Professional washing & ironing" },
              { icon: "⚕️", title: "Medical Facility", desc: "24/7 medical assistance" },
              { icon: "🎮", title: "Recreation Room", desc: "Indoor games and entertainment" },
              { icon: "🚿", title: "Hot Water", desc: "24-hour hot water supply" },
              { icon: "🅿️", title: "Parking", desc: "Secure vehicle parking space" }
            ].map((facility, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition">
                <div className="text-4xl mb-4">{facility.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{facility.title}</h3>
                <p className="text-sm text-gray-600">{facility.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Room Types */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Room Options</h2>
            <p className="text-lg text-gray-600">Choose the perfect accommodation for your needs</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { type: "Single", beds: "1 Bed", price: "₹50,000", features: ["Private Room", "Study Table", "Attached Bath"] },
              { type: "Double", beds: "2 Beds", price: "₹35,000", features: ["Shared Room", "Study Tables", "Common Bath"] },
              { type: "Triple", beds: "3 Beds", price: "₹25,000", features: ["Shared Room", "Study Space", "Common Bath"] },
              { type: "Quad", beds: "4 Beds", price: "₹20,000", features: ["Shared Room", "Study Area", "Common Bath"] }
            ].map((room, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition border-2 border-transparent hover:border-orange-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{room.type}</h3>
                <div className="text-sm text-gray-500 mb-4">{room.beds}</div>
                <div className="text-3xl font-bold text-orange-600 mb-6">{room.price}<span className="text-sm text-gray-500">/sem</span></div>
                <ul className="space-y-2 mb-6">
                  {room.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-600">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/student/login" className="block w-full py-3 bg-orange-600 text-white text-center rounded-lg font-semibold hover:bg-orange-700 transition">
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Students Say</h2>
            <p className="text-lg text-gray-600">Hear from our happy residents</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Priya Sharma", course: "B.Tech CSE", rating: 5, text: "The hostel facilities are excellent! Clean rooms, good food, and friendly staff. Highly recommended!" },
              { name: "Rahul Kumar", course: "BBA", rating: 5, text: "Safe and secure environment with all modern amenities. The wifi is super fast for online classes." },
              { name: "Anjali Verma", course: "B.Sc IT", rating: 4, text: "Great campus life! The recreation facilities and study rooms make it feel like a second home." }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100 shadow-lg">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.course}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-gray-300 mb-8">
                Have questions about hostel accommodation? Our team is here to help you 24/7.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                    📞
                  </div>
                  <div>
                    <div className="font-semibold">Phone</div>
                    <div className="text-gray-300">+91-1824-404404</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                    ✉️
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-gray-300">hostel@lpu.co.in</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                    📍
                  </div>
                  <div>
                    <div className="font-semibold">Address</div>
                    <div className="text-gray-300">Phagwara, Punjab 144411</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">Quick Inquiry</h3>
              <form className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
                <textarea 
                  rows={4}
                  placeholder="Your Message" 
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 resize-none"
                />
                <button className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">LPU Hostel Portal</h3>
              <p className="text-sm">
                Providing world-class accommodation facilities for students at Lovely Professional University.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-orange-600 transition">About Us</a></li>
                <li><a href="#hostels" className="hover:text-orange-600 transition">Hostels</a></li>
                <li><a href="#facilities" className="hover:text-orange-600 transition">Facilities</a></li>
                <li><a href="#contact" className="hover:text-orange-600 transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Student Portal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/student/login" className="hover:text-orange-600 transition">Student Login</Link></li>
                <li><Link href="/student/dashboard" className="hover:text-orange-600 transition">Dashboard</Link></li>
                <li><a href="#" className="hover:text-orange-600 transition">Apply Online</a></li>
                <li><a href="#" className="hover:text-orange-600 transition">FAQs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition">
                  f
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition">
                  𝕏
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition">
                  in
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Lovely Professional University. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
