"use client";
import { useState, useRef, useEffect } from "react";

const KNOWLEDGE_BASE = [
  {
    keywords: ["how", "allocation", "work", "process", "allotment", "system", "rule"],
    answer:
      "Hostel room allocation at LPU follows a transparent, merit-driven policy:\n\n" +
      "1. Priority is determined by academic CGPA (higher CGPA gets first preference) combined with early application timestamps.\n" +
      "2. You submit your preferences for Hostel Block (BH 1-9 / GH 1-3) and Room Type (Single, Double, 3-Seater, 4-Seater, AC or Non-AC).\n" +
      "3. The engine automatically locks the best matching available room and issues a Digital Allotment Slip instantly upon release.",
  },
  {
    keywords: ["friend", "roommate", "group", "pair", "partner", "book together"],
    answer:
      "Yes! You can book and stay together with friends using our Mutual Roommate Matching feature:\n\n" +
      "• On the Student Application form, select 'Book with Friends'.\n" +
      "• Enter your friend's official University Registration Number (Roll No).\n" +
      "• Important: Your friend must also list your Registration Number in their application.\n" +
      "• Once mutual requests are verified, our algorithm assigns you into the exact same room configuration.",
  },
  {
    keywords: ["timing", "gate", "curfew", "in-out", "entry", "exit", "rules"],
    answer:
      "LPU Residential Campus Timing & Security Policies:\n\n" +
      "• Regular Hostel Entry Gate Closing: 8:00 PM for standard days (extended to 9:30 PM with library pass during exams).\n" +
      "• Biometric Face/Fingerprint verification is mandatory at all block turnstiles.\n" +
      "• Night-out or home leaves must be applied via the digital OMS portal 24 hours in advance and require parental OTP approval.",
  },
  {
    keywords: ["ac", "non-ac", "difference", "cooling", "power", "air condition"],
    answer:
      "AC vs. Non-AC Room Configurations:\n\n" +
      "• AC Rooms: Equipped with 5-star split air conditioning units, 24/7 dedicated heavy-load diesel power backup, and remote temperature regulation.\n" +
      "• Non-AC Rooms: Designed with expansive cross-ventilation windows, dual high-efficiency ceiling fans, and standard power backup for lights and laptop charging stations.\n" +
      "• Both types include identical ergonomic study tables, steel wardrobes, and premium mattresses.",
  },
  {
    keywords: ["bh", "gh", "blocks", "boys", "girls", "where", "location"],
    answer:
      "LPU Residential Blocks Overview:\n\n" +
      "• Boys Hostels (BH 1 to BH 9): 9 state-of-the-art towers situated in the western campus residential quadrant with indoor gyms, basketball courts, and multi-cuisine mess.\n" +
      "• Girls Hostels (GH 1 to GH 3): 3 modern towers located in the secured eastern residential zone, featuring in-house beauty salons, indoor recreation halls, round-the-clock female wardens, and exclusive dining centers.",
  },
  {
    keywords: ["merit", "cgpa", "grade", "percentage", "priority"],
    answer:
      "Merit-Based Allocation Priority:\n\n" +
      "• Tier 1: Students with CGPA 9.0+ have priority selection for Single Rooms and AC Double Suites.\n" +
      "• Tier 2: CGPA 7.5 to 8.99 allocated based on combination of preference order and application submission time.\n" +
      "• Tier 3: General allocation across all remaining configurations.\n" +
      "• Special priority is granted to PwD and students with verified medical requirements for ground-floor accessible units.",
  },
  {
    keywords: ["food", "mess", "dining", "meal", "diet", "veg", "jain"],
    answer:
      "Campus Dining & Mess Facilities:\n\n" +
      "• 4 wholesome meals served daily: Wholesome Breakfast, Nutritious Lunch, Evening High-Tea with Snacks, and Dinner.\n" +
      "• Strictly separate pure vegetarian, Jain food, and North/South Indian regional cuisine counters.\n" +
      "• Managed under strict ISO & FSSAI certified hygiene benchmarks. Night canteens operate until 1:00 AM during mid-term and end-term exams.",
  },
  {
    keywords: ["check-in", "bring", "items", "documents", "slip", "reporting"],
    answer:
      "Check-in Day Checklist:\n\n" +
      "1. Digital Hostel Allotment Slip (downloaded from the portal).\n" +
      "2. University Student ID Card or Admission Letter.\n" +
      "3. Government Photo ID (Aadhaar / Passport).\n" +
      "4. Personal bedding and daily essentials (pillows, bedsheets, personal lock).\n" +
      "• Report directly to your allocated block's reception counter on the check-in date to collect your smart room key card.",
  },
  {
    keywords: ["warden", "help", "emergency", "contact", "phone", "email", "support"],
    answer:
      "Hostel Help Desk & Emergency Support:\n\n" +
      "• Central Hostel Office: Block 30, Ground Floor\n" +
      "• Helpline: +91 1824 517000 (Available 24/7)\n" +
      "• Support Email: hostel@lpu.co.in\n" +
      "• University Hospital Ambulance: Ext. 222 (24/7 on-campus ambulance and resident medical officer).",
  },
];

const QUICK_QUESTIONS = [
  "How does allocation work?",
  "How can I book with friends?",
  "What are the gate & entry timings?",
  "Difference between AC and Non-AC?",
  "BH vs GH block facilities",
  "Check-in checklist & documents",
];

export default function HostelAiBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hello! I am the LPU Hostel AI Assistant. How can I help you today with room allocation, friend matching, or residential block facilities?",
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const findAnswer = (query) => {
    const q = query.toLowerCase().trim();
    let bestMatch = null;
    let highestScore = 0;

    for (const item of KNOWLEDGE_BASE) {
      let score = 0;
      for (const kw of item.keywords) {
        if (q.includes(kw)) {
          score += 2;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item.answer;
      }
    }

    if (bestMatch && highestScore > 0) {
      return bestMatch;
    }

    return (
      "I understand you are asking about: \"" +
      query +
      "\".\n\n" +
      "For general queries:\n" +
      "• Allocations are processed on CGPA merit and submission timestamp.\n" +
      "• Friend bookings require mutual roll number registration.\n" +
      "• You can view real-time availability in the Available Hostels section above.\n\n" +
      "For official requests or special accommodations, please contact the Chief Warden Helpdesk at hostel@lpu.co.in or +91 1824 517000."
    );
  };

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const responseText = findAnswer(query);
      const botMsg = {
        sender: "bot",
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Bot Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[92vw] sm:w-[420px] h-[550px] bg-white border border-stone-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-white shadow-inner">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
                  <rect x="3" y="8" width="18" height="12" rx="4"/>
                  <path d="M7 13h.01M17 13h.01"/>
                  <path d="M10 17h4"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">LPU Hostel AI Assistant</h3>
                <div className="flex items-center gap-1.5 text-[11px] text-white/90">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online · Session 2026-27</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([{ sender: "bot", text: "Conversation cleared. How else can I assist you?", time: "Just now" }])}
                title="Clear Chat"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-xs"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Window"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Questions Strip */}
          <div className="bg-stone-50 border-b border-stone-200 px-3 py-2 overflow-x-auto flex gap-1.5 scrollbar-thin">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap text-[11px] font-medium px-2.5 py-1 rounded-full bg-white border border-stone-200 text-stone-700 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all flex-shrink-0 shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50/50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-[13px] leading-relaxed whitespace-pre-line shadow-2xs ${
                    m.sender === "user"
                      ? "bg-[var(--primary)] text-white rounded-br-xs"
                      : "bg-white text-stone-800 border border-stone-200 rounded-bl-xs"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-stone-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-2xl px-3 py-2 w-16">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about allocation, roommates, facilities..."
              className="flex-1 bg-stone-100 border border-stone-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[var(--primary)] focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center hover:bg-[var(--primary-dark)] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex-shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white px-4 py-3.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 font-semibold text-sm"
        aria-label="Toggle LPU Hostel AI Assistant"
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
            <rect x="3" y="8" width="18" height="12" rx="4"/>
            <path d="M7 13h.01M17 13h.01"/>
            <path d="M10 17h4"/>
          </svg>
        </div>
        <span className="hidden sm:inline">Ask AI Assistant</span>
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300" />
        </span>
      </button>
    </div>
  );
}
