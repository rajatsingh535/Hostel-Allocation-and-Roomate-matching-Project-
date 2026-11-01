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
              <Image 
                src="/lpu-logo.ico" 
                alt="LPU" 
                width={40}
                height={40}
                className="object-contain"
                priority
              />
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
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Modern Infrastructure</h3>
              <p className="text-gray-600">
                State-of-the-art hostel buildings with lifts, power backup, and modern amenities for comfortable living.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Security</h3>
              <p className="text-gray-600">
                Round-the-clock security with CCTV surveillance, biometric access, and trained security personnel.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition">
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
                <div key={hostel._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition border border-gray-200">
                  <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                    <div className="text-6xl font-bold text-white opacity-20">{hostel.code}</div>
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-700">
                      {hostel.genderAllowed}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{hostel.name}</h3>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold">
                        {hostel.code}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{hostel.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Availability</span>
                        <span className="font-semibold text-gray-900">
                          {hostel.availableRooms} / {hostel.totalRooms} Rooms
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(hostel.availableRooms / hostel.totalRooms) * 100}%` }}
                        ></div>
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
              { title: "High-Speed WiFi", desc: "Unlimited internet access 24/7" },
              { title: "Gymnasium", desc: "Fully equipped fitness centers" },
              { title: "Study Rooms", desc: "Quiet spaces for focused study" },
              { title: "Laundry Service", desc: "Professional washing & ironing" },
              { title: "Medical Facility", desc: "24/7 medical assistance" },
              { title: "Recreation Room", desc: "Indoor games and entertainment" },
              { title: "Hot Water", desc: "24-hour hot water supply" },
              { title: "Parking", desc: "Secure vehicle parking space" }
            ].map((facility, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition">
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
              { type: "Single", beds: "1 Bed", features: ["Private Room", "Study Table", "Attached Bath", "Wardrobe"] },
              { type: "Double", beds: "2 Beds", features: ["Shared Room", "Study Tables", "Common Bath", "Wardrobes"] },
              { type: "Triple", beds: "3 Beds", features: ["Shared Room", "Study Space", "Common Bath", "Storage"] },
              { type: "Quad", beds: "4 Beds", features: ["Shared Room", "Study Area", "Common Bath", "Storage"] }
            ].map((room, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition border border-gray-200 hover:border-orange-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{room.type}</h3>
                <div className="text-sm text-gray-500 mb-6">{room.beds}</div>
                <ul className="space-y-2 mb-6">
                  {room.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-orange-600 font-bold">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/student/login" className="block w-full py-3 bg-orange-600 text-white text-center rounded-lg font-semibold hover:bg-orange-700 transition">
                  Apply Now
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
              { name: "Priya Sharma", course: "B.Tech CSE", text: "The hostel facilities are excellent! Clean rooms, good food, and friendly staff. Highly recommended!" },
              { name: "Rahul Kumar", course: "BBA", text: "Safe and secure environment with all modern amenities. The wifi is super fast for online classes." },
              { name: "Anjali Verma", course: "B.Sc IT", text: "Great campus life! The recreation facilities and study rooms make it feel like a second home." }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition">
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
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

      {/* AI Chatbot */}
      <ChatBot />

    </div>
  );
}

// AI Chatbot Component
function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! 👋 I\'m here to help you with hostel-related queries. Ask me anything!' }
  ]);
  const [input, setInput] = useState('');

  const faqs = {
    'fees': 'Hostel fees vary by room type: Single (₹50,000), Double (₹35,000), Triple (₹25,000), Quad (₹20,000) per semester.',
    'booking': 'To book a hostel, login to your student account, browse available hostels, and submit an application with your preferences.',
    'facilities': 'LPU hostels offer WiFi, gym, laundry, mess, study rooms, medical facility, and 24/7 security.',
    'security': 'We have CCTV surveillance, biometric access, trained guards, and 24/7 monitoring for your safety.',
    'food': 'Our mess serves hygienic multi-cuisine meals (North Indian, South Indian, Chinese) prepared by professional chefs.',
    'room': 'Rooms include bed, study table, chair, wardrobe, and fan. AC rooms have split ACs with power backup.',
    'apply': 'Login to student portal → Browse Hostels → Select preferred hostel → Fill application form → Submit.',
    'allocation': 'Allocation is based on CGPA, preferences, application time, and friend group bookings.',
    'contact': 'Call +91-1824-404404 or email hostel@lpu.co.in for assistance.'
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = { type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    
    // Simple keyword matching
    const lowercaseInput = input.toLowerCase();
    let response = '';
    
    for (const [key, value] of Object.entries(faqs)) {
      if (lowercaseInput.includes(key)) {
        response = value;
        break;
      }
    }
    
    if (!response) {
      if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
        response = 'Hello! How can I help you today? You can ask about fees, booking, facilities, or any hostel-related query.';
      } else {
        response = 'I can help you with: Fees, Booking Process, Facilities, Security, Food, Room Types, Application, Allocation Process, and Contact Information. What would you like to know?';
      }
    }
    
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 500);
    
    setInput('');
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-orange-600 text-white rounded-full shadow-2xl hover:bg-orange-700 transition flex items-center justify-center text-2xl z-50"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-orange-600 text-white p-4 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
                🤖
              </div>
              <div>
                <h3 className="font-bold">LPU Hostel Assistant</h3>
                <p className="text-xs opacity-90">Online - Ready to help!</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.type === 'user' 
                    ? 'bg-orange-600 text-white rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
