"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import LpuLogo from "./components/LpuLogo";
import HostelAiBot from "./components/HostelAiBot";
import {
  BuildingIcon,
  BedIcon,
  UsersIcon,
  ShieldIcon,
  ScaleIcon,
  WindIcon,
  FileTextIcon,
  WifiIcon,
  UtensilsIcon,
  ActivityIcon,
  SearchIcon,
  CheckIcon,
  ChevronRightIcon,
} from "./components/Icons";

// ── 12 Official LPU Hostel Blocks (With Real LPU Building & Room Photos) ──
const INITIAL_HOSTELS = [
  {
    _id: "h1",
    code: "BH-1",
    name: "Boys Hostel 1",
    genderAllowed: "Male",
    campusLocation: "West Residential Zone (Boys Enclave)",
    totalBeds: 360,
    availableBeds: 84,
    floors: 9,
    acAvailable: true,
    roomTypes: ["Double", "Triple", "Quad"],
    imageUrl: "/images/lpu/boys-hostel.webp",
    roomImageUrl: "/images/lpu/boys-hostel-room.webp",
  },
  {
    _id: "h2",
    code: "BH-2",
    name: "Boys Hostel 2",
    genderAllowed: "Male",
    campusLocation: "West Residential Zone (Boys Enclave)",
    totalBeds: 360,
    availableBeds: 42,
    floors: 9,
    acAvailable: true,
    roomTypes: ["Single", "Double"],
    imageUrl: "/images/lpu/hero-banner.webp",
    roomImageUrl: "/images/lpu/apartments-room-1.webp",
  },
  {
    _id: "h3",
    code: "BH-3",
    name: "Boys Hostel 3",
    genderAllowed: "Male",
    campusLocation: "North Residential Quadrant",
    totalBeds: 400,
    availableBeds: 110,
    floors: 10,
    acAvailable: false,
    roomTypes: ["Triple", "Quad"],
    imageUrl: "/images/lpu/slide-3-hostels.webp",
    roomImageUrl: "/images/lpu/standard-room-1.webp",
  },
  {
    _id: "h4",
    code: "BH-4",
    name: "Boys Hostel 4",
    genderAllowed: "Male",
    campusLocation: "West Residential Zone (Boys Enclave)",
    totalBeds: 380,
    availableBeds: 65,
    floors: 9,
    acAvailable: true,
    roomTypes: ["Single", "Double", "Quad"],
    imageUrl: "/images/lpu/hero-banner.webp",
    roomImageUrl: "/images/lpu/boys-hostel-room.webp",
  },
  {
    _id: "h5",
    code: "BH-5",
    name: "Boys Hostel 5",
    genderAllowed: "Male",
    campusLocation: "West Residential Zone (Boys Enclave)",
    totalBeds: 360,
    availableBeds: 92,
    floors: 9,
    acAvailable: true,
    roomTypes: ["Double", "Triple"],
    imageUrl: "/images/lpu/boys-hostel.webp",
    roomImageUrl: "/images/lpu/standard-room-2.webp",
  },
  {
    _id: "h6",
    code: "BH-6",
    name: "Boys Hostel 6",
    genderAllowed: "Male",
    campusLocation: "North Residential Quadrant",
    totalBeds: 360,
    availableBeds: 78,
    floors: 9,
    acAvailable: false,
    roomTypes: ["Triple", "Quad"],
    imageUrl: "/images/lpu/slide-3-hostels.webp",
    roomImageUrl: "/images/lpu/apartments-room-2.webp",
  },
  {
    _id: "h7",
    code: "BH-7",
    name: "Boys Hostel 7",
    genderAllowed: "Male",
    campusLocation: "West Residential Zone (Boys Enclave)",
    totalBeds: 380,
    availableBeds: 50,
    floors: 9,
    acAvailable: true,
    roomTypes: ["Single", "Double"],
    imageUrl: "/images/lpu/boys-hostel.webp",
    roomImageUrl: "/images/lpu/standard-room-3.webp",
  },
  {
    _id: "h8",
    code: "BH-8",
    name: "Boys Hostel 8",
    genderAllowed: "Male",
    campusLocation: "North Residential Quadrant",
    totalBeds: 360,
    availableBeds: 115,
    floors: 9,
    acAvailable: false,
    roomTypes: ["Double", "Triple"],
    imageUrl: "/images/lpu/hero-banner.webp",
    roomImageUrl: "/images/lpu/standard-room-1.webp",
  },
  {
    _id: "h9",
    code: "BH-9",
    name: "Boys Hostel 9",
    genderAllowed: "Male",
    campusLocation: "Central Residential Hub",
    totalBeds: 420,
    availableBeds: 80,
    floors: 10,
    acAvailable: true,
    roomTypes: ["Double", "Quad"],
    imageUrl: "/images/lpu/slide-3-hostels.webp",
    roomImageUrl: "/images/lpu/apartments-room-3.webp",
  },
  {
    _id: "h10",
    code: "GH-1",
    name: "Girls Hostel 1",
    genderAllowed: "Female",
    campusLocation: "East Residential Quadrant (Girls Enclave)",
    totalBeds: 360,
    availableBeds: 60,
    floors: 9,
    acAvailable: true,
    roomTypes: ["Single", "Double"],
    imageUrl: "/images/lpu/girls-hostel.webp",
    roomImageUrl: "/images/lpu/girls-hostel-room.webp",
  },
  {
    _id: "h11",
    code: "GH-2",
    name: "Girls Hostel 2",
    genderAllowed: "Female",
    campusLocation: "East Residential Quadrant (Girls Enclave)",
    totalBeds: 380,
    availableBeds: 74,
    floors: 9,
    acAvailable: true,
    roomTypes: ["Double", "Triple"],
    imageUrl: "/images/lpu/girls-hostel.webp",
    roomImageUrl: "/images/lpu/slide-1-apartments.webp",
  },
  {
    _id: "h12",
    code: "GH-3",
    name: "Girls Hostel 3",
    genderAllowed: "Female",
    campusLocation: "East Residential Quadrant (Girls Enclave)",
    totalBeds: 400,
    availableBeds: 95,
    floors: 10,
    acAvailable: true,
    roomTypes: ["Triple", "Quad"],
    imageUrl: "/images/lpu/girls-hostel.webp",
    roomImageUrl: "/images/lpu/girls-hostel-room.webp",
  },
];

// ── Campus Facilities (100% Real Official LPU Photos) ──
const CAMPUS_FACILITIES = [
  {
    title: "Boys Residential Towers (BH 1–9)",
    code: "Recommended for Boys",
    desc: "9 multi-storey residential blocks with high-speed elevators, reading rooms, indoor gymnasiums, and sports arenas.",
    badge: "Boys Hostels (BH)",
    tag: "9 Blocks Configured",
    image: "/images/lpu/boys-hostel.webp",
  },
  {
    title: "Girls Residential Complexes (GH 1–3)",
    code: "Recommended for Girls",
    desc: "Gated residential enclave with multi-tier biometric access, round-the-clock female wardens, in-house salon, and cafeteria.",
    badge: "Girls Hostels (GH)",
    tag: "Dedicated Security",
    image: "/images/lpu/girls-hostel.webp",
  },
  {
    title: "Climate-Controlled AC Suites & Rooms",
    code: "Single to Quad",
    desc: "Equipped with split inverter cooling units, 24/7 dedicated heavy-load diesel power backup, wooden beds, and study stations.",
    badge: "AC & Standard Rooms",
    tag: "Continuous Backup",
    image: "/images/lpu/boys-hostel-room.webp",
  },
  {
    title: "Central Hostel Dining & Mess",
    code: "Mess 1 to 4",
    desc: "FSSAI-certified hygienic campus dining serving 4 balanced meals daily with dedicated pure vegetarian, Jain, and South Indian counters.",
    badge: "Dining & Mess",
    tag: "4 Meals Daily",
    image: "/images/lpu/hostel-mess.webp",
  },
  {
    title: "Shanti Devi Mittal Indoor Sports Complex",
    code: "Gym & Stadium",
    desc: "Olympic-size swimming pool, multi-station indoor gymnasiums, badminton courts, basketball courts, and fitness arenas.",
    badge: "Sports Complex",
    tag: "Indoor & Outdoor",
    image: "/images/lpu/indoor-sports-complex.webp",
  },
  {
    title: "Central Library & Quiet Study Spaces",
    code: "Swami Vivekananda Library",
    desc: "Multi-storey central library and academic lounges with high-speed fiber connectivity, power charging docks, and late-night access.",
    badge: "Central Library",
    tag: "High-Speed Wi-Fi",
    image: "/images/lpu/slide-2-library.webp",
  },
];

// ── Complete Real LPU Campus & Hostel Photo Gallery (24 Authentic Photos from lpu.in) ──
const LPU_REAL_GALLERY = [
  {
    title: "LPU Boys Hostel Towers (BH Enclave)",
    category: "hostels",
    tag: "Boys Hostel (BH)",
    location: "West Residential Zone, LPU",
    image: "/images/lpu/boys-hostel.webp",
  },
  {
    title: "LPU Girls Hostel 2 (GH-2 Building)",
    category: "hostels",
    tag: "Girls Hostel (GH)",
    location: "East Girls Residential Enclave, LPU",
    image: "/images/lpu/girls-hostel.webp",
  },
  {
    title: "Aerial View of Boys Hostel 4 & Residential Zone",
    category: "hostels",
    tag: "Residential Complex",
    location: "BH-4 Residential Quadrant, LPU",
    image: "/images/lpu/hero-banner.webp",
  },
  {
    title: "Boys Hostel AC 4-Seater Room Interior",
    category: "rooms",
    tag: "BH Room Interior",
    location: "Boys Hostel AC Suite, LPU",
    image: "/images/lpu/boys-hostel-room.webp",
  },
  {
    title: "Girls Hostel AC Room & Study Desks",
    category: "rooms",
    tag: "GH Room Interior",
    location: "Girls Hostel Residential Wing, LPU",
    image: "/images/lpu/girls-hostel-room.webp",
  },
  {
    title: "LPU Apartment-Style Student Housing",
    category: "rooms",
    tag: "Residential Apartments",
    location: "Apartment Block, LPU",
    image: "/images/lpu/slide-1-apartments.webp",
  },
  {
    title: "Standard Hostel Room with Wooden Wardrobes",
    category: "rooms",
    tag: "Standard Seater",
    location: "Standard Hostel Block, LPU",
    image: "/images/lpu/standard-room-1.webp",
  },
  {
    title: "4-Seater Hostel Room with Individual Study Stations",
    category: "rooms",
    tag: "Quad Room",
    location: "Residential Wing, LPU",
    image: "/images/lpu/standard-room-2.webp",
  },
  {
    title: "Double Seater Room Configuration",
    category: "rooms",
    tag: "Double Seater",
    location: "Hostel Wing, LPU",
    image: "/images/lpu/standard-room-3.webp",
  },
  {
    title: "Premium Suite with Attached Kitchenette",
    category: "rooms",
    tag: "Apartment Suite",
    location: "Executive Apartments, LPU",
    image: "/images/lpu/apartments-room-1.webp",
  },
  {
    title: "Modern AC Studio Room Interior",
    category: "rooms",
    tag: "Studio Apartment",
    location: "Residential Apartments, LPU",
    image: "/images/lpu/apartments-room-2.webp",
  },
  {
    title: "Multi-Bed Apartment Suite with Wardrobes",
    category: "rooms",
    tag: "Premium Quad",
    location: "Residential Block, LPU",
    image: "/images/lpu/apartments-room-3.webp",
  },
  {
    title: "Hostel Central Mess & South Indian Food Counter",
    category: "dining",
    tag: "Hostel Mess",
    location: "Central Dining Hall, LPU",
    image: "/images/lpu/hostel-mess.webp",
  },
  {
    title: "Students Dining at Hostel Mess Commons",
    category: "dining",
    tag: "Mess Dining Hall",
    location: "Boys Hostel Mess, LPU",
    image: "/images/lpu/mess-details.webp",
  },
  {
    title: "Girls Hostel Hygienic Dining Hall",
    category: "dining",
    tag: "GH Mess Hall",
    location: "Girls Hostel Dining, LPU",
    image: "/images/lpu/slide-7-mess.webp",
  },
  {
    title: "LPU Uni-Mall (Shopping & WHSmith Store)",
    category: "dining",
    tag: "Uni-Mall",
    location: "Central Campus Mall, LPU",
    image: "/images/lpu/uni-mall.webp",
  },
  {
    title: "In-House Mechanized Hostel Laundry Facility",
    category: "dining",
    tag: "Laundry Service",
    location: "Residential Laundry Unit, LPU",
    image: "/images/lpu/laundry-service.webp",
  },
  {
    title: "Campus Food Kiosks & Refreshment Stalls",
    category: "dining",
    tag: "Food Courts",
    location: "Campus Food Street, LPU",
    image: "/images/lpu/diverse-cuisines.jpg",
  },
  {
    title: "Shanti Devi Mittal Indoor Sports Complex",
    category: "sports",
    tag: "Sports Complex",
    location: "Indoor Stadium, LPU",
    image: "/images/lpu/indoor-sports-complex.webp",
  },
  {
    title: "LPU Olympic-Size Indoor Swimming Pool",
    category: "sports",
    tag: "Aquatics Arena",
    location: "Indoor Sports Complex, LPU",
    image: "/images/lpu/slide-5-stadium.webp",
  },
  {
    title: "Multi-Station Campus Fitness & Cardio Gym",
    category: "sports",
    tag: "Fitness Center",
    location: "Residential Gym Wing, LPU",
    image: "/images/lpu/fitness-center.webp",
  },
  {
    title: "Indoor Badminton Arena",
    category: "sports",
    tag: "Badminton Courts",
    location: "Indoor Stadium, LPU",
    image: "/images/lpu/badminton.webp",
  },
  {
    title: "24x7 Central Library & Reading Hall",
    category: "sports",
    tag: "Central Library",
    location: "Academic Block, LPU",
    image: "/images/lpu/slide-2-library.webp",
  },
  {
    title: "LPU Main Emblem & NAAC A++ Green Roundabout",
    category: "campus",
    tag: "LPU Main Campus",
    location: "Jalandhar-Delhi G.T. Road, Phagwara",
    image: "/images/lpu/green-campus.webp",
  },
  {
    title: "LPU Academic & Administrative Boulevard",
    category: "campus",
    tag: "Campus Aerial",
    location: "Main Academic Spine, LPU",
    image: "/images/lpu/campus-aerial.webp",
  },
  {
    title: "LPU Uni-Hospital & 24/7 Ambulance Fleet",
    category: "campus",
    tag: "Uni-Hospital",
    location: "Campus Health Centre, LPU",
    image: "/images/lpu/unihospital.webp",
  },
  {
    title: "Biometric Turnstile Entry Gates at Hostels",
    category: "campus",
    tag: "Biometric Security",
    location: "Hostel Entry Gate, LPU",
    image: "/images/lpu/turnstile-gates.jpg",
  },
  {
    title: "Dedicated Campus Security & Patrol Force",
    category: "campus",
    tag: "24/7 Security",
    location: "LPU Campus Security",
    image: "/images/lpu/lpu-security.jpg",
  },
  {
    title: "Baldev Raj Mittal Unipolis Amphitheatre",
    category: "campus",
    tag: "Unipolis",
    location: "Central Plaza, LPU",
    image: "/images/lpu/architectural-marvels.webp",
  },
  {
    title: "Shanti Devi Mittal Auditorium",
    category: "campus",
    tag: "Main Auditorium",
    location: "LPU Campus",
    image: "/images/lpu/shanti-devi-auditorium.webp",
  },
];

// ── Amenity tab data (With Real LPU Photos) ──
const AMENITY_TABS = {
  rooms: [
    {
      title: "Split Climate Control & AC Suites",
      desc: "Energy-efficient split air conditioners with scheduled university maintenance and 24/7 heavy-load power backup.",
      image: "/images/lpu/boys-hostel-room.webp",
    },
    {
      title: "Ergonomic Study Station & Almirah",
      desc: "Dedicated wooden study desk, ergonomic chair, personal steel almirah, bookshelf, and orthopedic mattress.",
      image: "/images/lpu/girls-hostel-room.webp",
    },
    {
      title: "In-House Mechanized Laundry",
      desc: "On-campus mechanized laundry and pressing facility inside the residential zone with scheduled collection.",
      image: "/images/lpu/laundry-service.webp",
    },
  ],
  dining: [
    {
      title: "4 Balanced Daily Mess Meals",
      desc: "Fresh breakfast, hot lunch, evening high-tea with snacks, and wholesome dinner planned by certified nutritionists.",
      image: "/images/lpu/mess-details.webp",
    },
    {
      title: "Separate Pure Veg, Jain & Regional Counters",
      desc: "Dedicated Pure Vegetarian, Jain, and North/South Indian cuisine counters across all BH and GH mess halls.",
      image: "/images/lpu/hostel-mess.webp",
    },
    {
      title: "Uni-Mall & Campus Food Courts",
      desc: "Multi-storey campus Uni-Mall, department stores, and food kiosks open across the residential campus.",
      image: "/images/lpu/uni-mall.webp",
    },
  ],
  sports: [
    {
      title: "Indoor Multi-Station Gyms",
      desc: "Modern fitness equipment, cardio treadmills, and weight training stations inside the residential complex.",
      image: "/images/lpu/fitness-center.webp",
    },
    {
      title: "Badminton & Indoor Sports Complex",
      desc: "Synthetic indoor badminton courts, basketball arenas, and squash courts at Shanti Devi Mittal Sports Complex.",
      image: "/images/lpu/badminton.webp",
    },
    {
      title: "Olympic Swimming Pool & Yoga",
      desc: "All-weather Olympic-size indoor swimming pool and open morning yoga sessions at Unipolis.",
      image: "/images/lpu/slide-5-stadium.webp",
    },
  ],
  safety: [
    {
      title: "Biometric Turnstile Entry Gates",
      desc: "Automated turnstile gates with biometric and ID card verification at all BH and GH hostel entry points.",
      image: "/images/lpu/turnstile-gates.jpg",
    },
    {
      title: "24/7 On-Campus Uni-Hospital",
      desc: "Full-fledged on-campus Uni-Hospital with resident doctors, round-the-clock pharmacy, and emergency ambulances.",
      image: "/images/lpu/unihospital.webp",
    },
    {
      title: "Dedicated Campus Security & Wardens",
      desc: "Trained ex-servicemen security force, 24/7 CCTV surveillance, and resident wardens across all blocks.",
      image: "/images/lpu/lpu-security.jpg",
    },
  ],
};

// ── FAQ data ──
const FAQS = [
  {
    q: "How does the system recommend BH to boys and GH to girls during login?",
    a: "During Student Login, the portal asks whether you are Male (Boy) or Female (Girl). If you select Male, the system automatically recommends and filters Boys Hostels (BH-1 to BH-9). If you select Female, the system automatically recommends and filters Girls Hostels (GH-1 to GH-3).",
  },
  {
    q: "How does the hostel allocation policy operate?",
    a: "Allocations are computed dynamically based on a student's gender-eligible hostel preference list (BH for Boys, GH for Girls), verified CGPA merit score, and timestamp of application.",
  },
  {
    q: "Can I choose my specific roommate or friend group?",
    a: "Yes! In the student portal, select 'Group Booking (With Friends)' and specify your preferred roommate's university registration number. When both students enter matching registration numbers, our algorithm places you in the same room.",
  },
  {
    q: "What is the difference between AC and Non-AC room configurations?",
    a: "AC rooms are equipped with split/window air conditioners, remote climate control regulation, and dedicated heavy-load power backup. Non-AC rooms provide energy-efficient ceiling fans and wide cross-ventilation windows.",
  },
  {
    q: "What accommodations are provided for medical or PwD students?",
    a: "Ground-floor accessible rooms equipped with ramp accessibility, elevator access, wider door frames, and attached barrier-free washrooms are prioritized for PwD applicants.",
  },
  {
    q: "Can I submit multiple hostel preferences?",
    a: "Yes. Male students can choose across Boys Hostels (BH-1 to BH-9) and female students can choose across Girls Hostels (GH-1 to GH-3) in order of preference.",
  },
];

// ── Policy Features ──
const FEATURES = [
  {
    icon: UsersIcon,
    title: "Smart Gender-Based BH / GH Recommender",
    desc: "Asks student gender at login and automatically recommends Boys Hostels (BH-1 to BH-9) to boys and Girls Hostels (GH-1 to GH-3) to girls.",
  },
  {
    icon: ScaleIcon,
    title: "Merit-Based Allocation Engine",
    desc: "Transparent room allotment computed directly from academic CGPA and verified application timestamps.",
  },
  {
    icon: UsersIcon,
    title: "Mutual Roommate Matcher",
    desc: "Pair with compatible study partners and friends using mutual university registration numbers.",
  },
  {
    icon: WindIcon,
    title: "Flexible AC & Seater Options",
    desc: "Select single, double, triple, or quad-sharing configurations with guaranteed power backup.",
  },
  {
    icon: ShieldIcon,
    title: "Biometric Turnstile Safety",
    desc: "24/7 campus security, automated turnstile gates, and dedicated resident hostel wardens.",
  },
  {
    icon: WifiIcon,
    title: "High-Speed University Fiber",
    desc: "Uncapped high-speed university Wi-Fi network throughout all residential towers and study halls.",
  },
];

function getRealHostelImages(h, idx = 0) {
  const isFemale = h.genderAllowed === "Female" || (h.code && h.code.startsWith("GH"));
  if (isFemale) {
    const ghRooms = [
      "/images/lpu/girls-hostel-room.webp",
      "/images/lpu/slide-1-apartments.webp",
      "/images/lpu/girls-hostel-room.webp",
    ];
    return {
      imageUrl:
        h.imageUrl && h.imageUrl.startsWith("/images/lpu/")
          ? h.imageUrl
          : "/images/lpu/girls-hostel.webp",
      roomImageUrl: h.roomImageUrl || ghRooms[idx % ghRooms.length],
    };
  }
  const bhBuildings = [
    "/images/lpu/boys-hostel.webp",
    "/images/lpu/hero-banner.webp",
    "/images/lpu/slide-3-hostels.webp",
  ];
  const bhRooms = [
    "/images/lpu/boys-hostel-room.webp",
    "/images/lpu/apartments-room-1.webp",
    "/images/lpu/standard-room-1.webp",
    "/images/lpu/standard-room-2.webp",
    "/images/lpu/standard-room-3.webp",
    "/images/lpu/apartments-room-2.webp",
    "/images/lpu/apartments-room-3.webp",
  ];
  return {
    imageUrl:
      h.imageUrl && h.imageUrl.startsWith("/images/lpu/")
        ? h.imageUrl
        : bhBuildings[idx % bhBuildings.length],
    roomImageUrl: h.roomImageUrl || bhRooms[idx % bhRooms.length],
  };
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

  const [stats, setStats] = useState({
    totalHostels: 12,
    totalRooms: 1080,
    totalBeds: 4320,
    totalApplications: 148,
  });

  const [hostels, setHostels] = useState(INITIAL_HOSTELS);
  const [filterGender, setFilterGender] = useState("All");
  const [filterAcOnly, setFilterAcOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeAmenityTab, setActiveAmenityTab] = useState("rooms");
  const [galleryCategory, setGalleryCategory] = useState("all");
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  // Per-card toggle between Building Exterior and Room Interior photo
  const [cardViewMode, setCardViewMode] = useState({});

  useEffect(() => {
    setHeroLoaded(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch live stats & hostels with graceful fallback
  useEffect(() => {
    fetch("http://localhost:5000/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) setStats(d.data);
      })
      .catch(() => {});

    fetch("http://localhost:5000/api/hostels")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data) && d.data.length > 0) {
          setHostels(d.data);
        }
      })
      .catch(() => {});
  }, []);

  const filteredHostels = hostels.filter((h) => {
    const matchesGender = filterGender === "All" ? true : h.genderAllowed === filterGender;
    const matchesAc = filterAcOnly ? h.acAvailable : true;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      h.name?.toLowerCase().includes(q) ||
      h.code?.toLowerCase().includes(q) ||
      h.campusLocation?.toLowerCase().includes(q);
    return matchesGender && matchesAc && matchesSearch;
  });

  const filteredGallery =
    galleryCategory === "all"
      ? LPU_REAL_GALLERY
      : LPU_REAL_GALLERY.filter((item) => item.category === galleryCategory);

  return (
    <div className="min-h-screen bg-white text-stone-900 selection:bg-[var(--primary)] selection:text-white">
      {/* ══════════════════════════════════════════
          STICKY NAVBAR
          ══════════════════════════════════════════ */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200"
            : "bg-white border-b border-stone-200"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <LpuLogo size={42} showText={true} subtitle="Hostel Allocation Portal" />
            </Link>
            <img
              src="/images/lpu/naac-logo.webp"
              alt="NAAC A++ Grade"
              className="hidden sm:block h-6 object-contain border-l border-stone-200 pl-3"
            />
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-semibold text-stone-600">
            <a href="#hostels" className="hover:text-[var(--primary)] transition-colors">
              Hostel Blocks (BH &amp; GH)
            </a>
            <a href="#gallery" className="hover:text-[var(--primary)] transition-colors">
              Real LPU Photos
            </a>
            <a href="#facilities" className="hover:text-[var(--primary)] transition-colors">
              Campus Facilities
            </a>
            <a href="#amenities" className="hover:text-[var(--primary)] transition-colors">
              Amenities
            </a>
            <a href="#faqs" className="hover:text-[var(--primary)] transition-colors">
              FAQs
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/student/login"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-bold text-sm shadow-sm transition-all"
            >
              <span>Student Login</span>
              <ChevronRightIcon className="w-4 h-4" />
            </Link>
            <Link
              href="/admin/login"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-stone-300 hover:border-stone-400 text-stone-700 font-semibold text-sm transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full">
        {/* ══════════════════════════════════════════
            HERO SECTION (With Real LPU Campus & Hostel Photos)
            ══════════════════════════════════════════ */}
        <section className="relative w-full pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-orange-50/50 via-white to-stone-50/60 border-b border-stone-200">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.12),transparent_70%)] pointer-events-none" />

          <div
            className={`relative z-10 w-full max-w-7xl mx-auto transition-all duration-700 ${
              heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="text-center max-w-4xl mx-auto">
              {/* Status Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-stone-800 text-xs font-semibold mb-5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
                <span>Official LPU Residential Portal · Session 2026-27</span>
                <span className="bg-white px-2 py-0.5 rounded-full text-[10px] text-[var(--primary-dark)] font-bold">
                  BH for Boys · GH for Girls
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.1] mb-5">
                LPU Hostel Allocation &amp;{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)]">
                  Smart BH / GH Recommender
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Explore authentic photos of <strong className="text-stone-900">Lovely Professional University</strong> residential blocks, rooms, mess, and sports complexes. At student login, select{" "}
                <strong className="text-stone-900">Male</strong> or <strong className="text-stone-900">Female</strong> and our system automatically recommends{" "}
                <strong className="text-[var(--primary-dark)]">BH (Boys Hostels 1–9)</strong> to boys and{" "}
                <strong className="text-[var(--primary-dark)]">GH (Girls Hostels 1–3)</strong> to girls.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3.5 mb-12">
                <Link
                  href="/student/login"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
                >
                  <span>Student Login (Select Male / Female)</span>
                  <ChevronRightIcon className="w-5 h-5" />
                </Link>
                <a
                  href="#hostels"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-stone-300 hover:border-stone-400 text-stone-800 font-semibold text-sm sm:text-base shadow-2xs hover:bg-stone-50 transition-all"
                >
                  <BuildingIcon className="w-5 h-5 text-[var(--primary)]" />
                  <span>Explore 12 Hostels (BH &amp; GH)</span>
                </a>
                <a
                  href="#gallery"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-stone-300 hover:border-stone-400 text-stone-800 font-semibold text-sm sm:text-base shadow-2xs hover:bg-stone-50 transition-all"
                >
                  <span>View 30+ Real LPU Photos</span>
                </a>
              </div>
            </div>

            {/* ── Real LPU Residential & Campus Hero Photo Showcase ── */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10">
              {/* Main Panoramic LPU Boys Hostel & Campus Photo */}
              <div
                onClick={() =>
                  setLightboxPhoto({
                    title: "LPU Residential Complex & Boys Hostel 4 (BH-4)",
                    location: "Lovely Professional University, Phagwara",
                    tag: "Official LPU Residential Enclave",
                    image: "/images/lpu/hero-banner.webp",
                  })
                }
                className="md:col-span-7 relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-stone-200 shadow-sm group cursor-pointer"
              >
                <img
                  src="/images/lpu/hero-banner.webp"
                  alt="Lovely Professional University Residential Hostels Aerial View"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[var(--primary)] text-white text-xs font-bold shadow-sm">
                    Official LPU Residential Zone
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-semibold">
                    Click to Enlarge
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl sm:text-2xl font-black leading-tight">
                    A City Within A Campus — LPU Hostel Enclave
                  </h3>
                  <p className="text-xs sm:text-sm text-white/85 mt-1">
                    Real aerial view of Lovely Professional University residential towers (BH-4 &amp; Boys Hostel Zone) accommodating 25,000+ on-campus students.
                  </p>
                </div>
              </div>

              {/* Right 2x2 Grid of Real LPU Boys Hostel, Girls Hostel, Campus & Rooms */}
              <div className="md:col-span-5 grid grid-cols-2 gap-4">
                {[
                  {
                    title: "Boys Hostels (BH-1 to BH-9)",
                    sub: "Recommended for Male Students",
                    image: "/images/lpu/boys-hostel.webp",
                    badge: "BH Wing",
                  },
                  {
                    title: "Girls Hostels (GH-1 to GH-3)",
                    sub: "Recommended for Female Students",
                    image: "/images/lpu/girls-hostel.webp",
                    badge: "GH Wing",
                  },
                  {
                    title: "LPU Main Campus Emblem",
                    sub: "NAAC A++ Accredited University",
                    image: "/images/lpu/green-campus.webp",
                    badge: "LPU Campus",
                  },
                  {
                    title: "Real AC Hostel Rooms",
                    sub: "Furnished Study Desks & Beds",
                    image: "/images/lpu/boys-hostel-room.webp",
                    badge: "Room Interior",
                  },
                ].map((card, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      setLightboxPhoto({
                        title: card.title,
                        location: card.sub,
                        tag: card.badge,
                        image: card.image,
                      })
                    }
                    className="relative h-44 rounded-2xl overflow-hidden border border-stone-200 shadow-sm group cursor-pointer"
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold">
                      {card.badge}
                    </span>
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <div className="text-xs sm:text-sm font-black leading-tight">{card.title}</div>
                      <div className="text-[10px] text-white/80 mt-0.5">{card.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                {
                  icon: BuildingIcon,
                  value: `${stats.totalHostels || 12} Towers`,
                  label: "Official LPU Blocks",
                  detail: "BH 1-9 (Boys) & GH 1-3 (Girls)",
                },
                {
                  icon: BedIcon,
                  value: `${(stats.totalBeds || 4320).toLocaleString()}+`,
                  label: "Total Bed Capacity",
                  detail: "Single to Quad Sharing",
                },
                {
                  icon: UsersIcon,
                  value: "BH / GH Auto",
                  label: "Gender Recommendation",
                  detail: "Boys → BH · Girls → GH",
                },
                {
                  icon: ScaleIcon,
                  value: "CGPA Merit",
                  label: "Allocation Engine",
                  detail: "100% Policy Compliant",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white border border-stone-200 rounded-2xl p-5 text-left shadow-2xs hover:border-[var(--primary)] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[var(--primary)] mb-3 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs font-bold text-stone-700 mt-1">{stat.label}</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">{stat.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            HOSTEL CARDS GRID (All 12 Blocks with Real LPU Building & Room Photos)
            ══════════════════════════════════════════ */}
        <section id="hostels" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-1">
                Official LPU Residential Blocks · Real Photos
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                Boys Hostels (BH 1–9) &amp; Girls Hostels (GH 1–3)
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
                Toggle between real LPU building exterior and room interior photos on every block card. Boys are recommended BH-1 to BH-9 and Girls are recommended GH-1 to GH-3.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search block (e.g. BH-1, GH-2)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[var(--primary)] transition-all"
                />
              </div>

              <div className="inline-flex p-1 rounded-xl bg-stone-100 border border-stone-200">
                {["All", "Male", "Female"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterGender(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      filterGender === tab
                        ? "bg-[var(--primary)] text-white shadow-2xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {tab === "All"
                      ? "All (12)"
                      : tab === "Male"
                      ? "Boys (BH 1–9)"
                      : "Girls (GH 1–3)"}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setFilterAcOnly(!filterAcOnly)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  filterAcOnly
                    ? "bg-orange-50 border-[var(--primary)] text-[var(--primary-dark)]"
                    : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
                }`}
              >
                {filterAcOnly ? "✓ AC Only" : "+ AC Only"}
              </button>
            </div>
          </div>

          {/* Hostels Grid with Real LPU Building & Room Interior Photos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHostels.map((h, idx) => {
              const totalBeds = h.totalBeds || h.totalCapacity || 360;
              const availBeds = h.availableBeds || h.availableCapacity || 80;
              const occPercent = Math.min(100, Math.round(((totalBeds - availBeds) / totalBeds) * 100));
              const isFemale = h.genderAllowed === "Female" || (h.code && h.code.startsWith("GH"));
              const realImgs = getRealHostelImages(h, idx);
              const cardKey = h._id || h.code;
              const showingRoom = cardViewMode[cardKey] === "room";
              const activeImg = showingRoom ? realImgs.roomImageUrl : realImgs.imageUrl;

              return (
                <div
                  key={cardKey}
                  className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg hover:border-orange-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Real LPU Photo Header with Building / Room Toggle */}
                    <div className="relative h-52 w-full overflow-hidden bg-stone-100">
                      <img
                        src={activeImg}
                        alt={`${h.code} - ${h.name}`}
                        onClick={() =>
                          setLightboxPhoto({
                            title: `${h.code} — ${h.name} (${showingRoom ? "Room Interior" : "Hostel Building"})`,
                            location: h.campusLocation || "Lovely Professional University",
                            tag: isFemale ? "Recommended for Girls (GH)" : "Recommended for Boys (BH)",
                            image: activeImg,
                          })
                        }
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/95 text-xs font-black text-[var(--primary-dark)] shadow-xs">
                          <BuildingIcon className="w-3.5 h-3.5 text-[var(--primary)]" />
                          <span>{h.code}</span>
                        </span>
                        <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-[var(--primary)] text-white shadow-xs">
                          {isFemale ? "★ Recommended for Girls (GH)" : "★ Recommended for Boys (BH)"}
                        </span>
                      </div>

                      {/* Bottom Photo Switcher (Hostel Exterior vs Room Interior) */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                        <div className="inline-flex p-0.5 rounded-lg bg-black/65 backdrop-blur-xs border border-white/20">
                          <button
                            type="button"
                            onClick={() =>
                              setCardViewMode((prev) => ({ ...prev, [cardKey]: "building" }))
                            }
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                              !showingRoom
                                ? "bg-[var(--primary)] text-white"
                                : "text-white/80 hover:text-white"
                            }`}
                          >
                            Hostel Photo
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setCardViewMode((prev) => ({ ...prev, [cardKey]: "room" }))
                            }
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                              showingRoom
                                ? "bg-[var(--primary)] text-white"
                                : "text-white/80 hover:text-white"
                            }`}
                          >
                            Room Interior
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setLightboxPhoto({
                              title: `${h.code} — ${h.name}`,
                              location: h.campusLocation || "Lovely Professional University",
                              tag: isFemale ? "Girls Hostel (GH)" : "Boys Hostel (BH)",
                              image: activeImg,
                            })
                          }
                          className="text-[10px] font-bold text-white bg-black/60 hover:bg-black/80 px-2.5 py-1 rounded-lg border border-white/20"
                        >
                          Zoom ⤢
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <h3 className="text-lg font-black text-stone-900 leading-tight mb-1">
                        {h.name ? h.name.replace(/\s*\([^)]*\)/g, "") : h.code}
                      </h3>
                      <p className="text-xs text-stone-500 mb-4">
                        {h.campusLocation || "Main LPU Residential Campus"}
                      </p>

                      {/* Quick Specs */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700">
                          {h.floors || 9} Floors
                        </span>
                        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700">
                          Biometric Turnstile
                        </span>
                        {h.acAvailable !== false && (
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-orange-50 text-[var(--primary-dark)] border border-orange-200">
                            AC &amp; Non-AC
                          </span>
                        )}
                      </div>

                      {/* Vacancy Progress */}
                      <div className="mb-5">
                        <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                          <span className="text-stone-500">Live Vacancy Status</span>
                          <span className="text-emerald-600 font-bold">{availBeds} Beds Vacant</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-400 to-[var(--primary)] rounded-full transition-all duration-500"
                            style={{ width: `${occPercent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-stone-400 mt-1 font-medium">
                          <span>{occPercent}% Occupied</span>
                          <span>{totalBeds} Total Beds</span>
                        </div>
                      </div>

                      {/* Room Configurations Available */}
                      <div className="mb-5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                          Supported Room Types
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(h.roomTypes || ["Double", "Triple", "Quad"]).map((type, i) => (
                            <span
                              key={i}
                              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200 text-stone-700"
                            >
                              {type} Seater
                            </span>
                          ))}
                          <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200 text-stone-700">
                            Wi-Fi &amp; Mess
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link
                        href="/student/login"
                        className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs font-bold transition-all shadow-2xs"
                      >
                        <span>
                          Login as {isFemale ? "Female" : "Male"} to Book {h.code}
                        </span>
                        <ChevronRightIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            COMPLETE REAL LPU PHOTO GALLERY (30 Authentic LPU Photos)
            ══════════════════════════════════════════ */}
        <section
          id="gallery"
          className="w-full py-16 px-4 sm:px-6 lg:px-8 border-t border-b border-stone-200 bg-stone-50/70"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-1">
                  100% Authentic LPU Campus &amp; Residential Photography
                </p>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                  Official LPU Hostels, Rooms &amp; Campus Photo Gallery
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
                  Verified photographs directly from Lovely Professional University (Phagwara, Punjab) showcasing Boys Hostels (BH), Girls Hostels (GH), rooms, dining halls, Uni-Mall, Uni-Hospital, and sports arenas.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: `All LPU Photos (${LPU_REAL_GALLERY.length})` },
                  { id: "hostels", label: "Hostel Towers (BH & GH)" },
                  { id: "rooms", label: "Hostel Rooms & Suites" },
                  { id: "dining", label: "Mess, Mall & Laundry" },
                  { id: "sports", label: "Sports, Gym & Library" },
                  { id: "campus", label: "Campus, Security & Hospital" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setGalleryCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      galleryCategory === cat.id
                        ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-2xs"
                        : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredGallery.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxPhoto(item)}
                  className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-orange-300 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold shadow-xs">
                      {item.tag}
                    </span>
                    <span className="absolute bottom-2 right-2.5 text-[10px] font-bold text-white/90 bg-black/50 px-2 py-0.5 rounded-md">
                      View Photo
                    </span>
                  </div>
                  <div className="p-3.5">
                    <h4 className="font-bold text-stone-900 text-xs sm:text-sm leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">{item.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CAMPUS FACILITIES (With Real LPU Photos)
            ══════════════════════════════════════════ */}
        <section id="facilities" className="w-full py-16 px-4 sm:px-6 lg:px-8 border-b border-stone-200 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-1">
                  Campus Living Architecture
                </p>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                  LPU Residential Infrastructure
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md">
                Modern university living designed with safety, comfort, academic focus, and balanced nutrition.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {CAMPUS_FACILITIES.map((facility, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-orange-200 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div
                      onClick={() =>
                        setLightboxPhoto({
                          title: facility.title,
                          location: "Lovely Professional University Campus",
                          tag: facility.badge,
                          image: facility.image,
                        })
                      }
                      className="relative h-48 w-full overflow-hidden cursor-pointer"
                    >
                      <img
                        src={facility.image}
                        alt={facility.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--primary)] text-white shadow-xs">
                          {facility.badge}
                        </span>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/95 text-stone-800">
                          {facility.code}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-bold text-lg text-stone-900 mb-2">{facility.title}</h3>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{facility.desc}</p>
                    </div>
                  </div>

                  <div className="px-6 pb-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-500">
                    <span className="inline-flex items-center gap-1.5 text-stone-700">
                      <CheckIcon className="w-3.5 h-3.5 text-[var(--primary)]" />
                      {facility.tag}
                    </span>
                    <span className="text-[var(--primary)] font-bold">Verified LPU Spec</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            POLICY FEATURES SECTION
            ══════════════════════════════════════════ */}
        <section id="policy" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-stone-50 border-b border-stone-200">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-1">
                Policy-Driven Engine
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                Transparent Allocation Architecture
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Automated algorithmic allocation for Lovely Professional University to ensure 100% fair, gender-compliant (BH for Boys, GH for Girls), and merit-driven allotments.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs hover:border-[var(--primary)] transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[var(--primary)] mb-4 group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-base mb-2 group-hover:text-[var(--primary)] transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CAMPUS LIVING / AMENITIES TABS (With Real LPU Photos)
            ══════════════════════════════════════════ */}
        <section id="amenities" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-10 shadow-2xs">
            <div className="text-center max-w-xl mx-auto mb-8">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-1">
                Residential Standards
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                Campus Living &amp; Infrastructure
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                Real facilities across all 12 residential towers at Lovely Professional University.
              </p>
            </div>

            {/* Tab Controls */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {[
                { id: "rooms", label: "Rooms & Laundry", icon: BedIcon },
                { id: "dining", label: "Dining & Uni-Mall", icon: UtensilsIcon },
                { id: "sports", label: "Fitness & Stadium", icon: ActivityIcon },
                { id: "safety", label: "Security & Uni-Hospital", icon: ShieldIcon },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveAmenityTab(t.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                    activeAmenityTab === t.id
                      ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-2xs"
                      : "bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content Cards with Real LPU Photos */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {(AMENITY_TABS[activeAmenityTab] || []).map((item, i) => (
                <div
                  key={i}
                  className="bg-stone-50 rounded-xl overflow-hidden border border-stone-200 flex flex-col justify-between group"
                >
                  <div>
                    <div
                      onClick={() =>
                        setLightboxPhoto({
                          title: item.title,
                          location: "Lovely Professional University",
                          tag: "LPU Residential Amenity",
                          image: item.image,
                        })
                      }
                      className="relative h-44 w-full overflow-hidden cursor-pointer"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-stone-900 text-sm mb-2">{item.title}</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="px-5 pb-4 pt-3 border-t border-stone-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-[var(--primary-dark)]">
                    <CheckIcon className="w-3.5 h-3.5" />
                    <span>Included in LPU Residence</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FAQ ACCORDION
            ══════════════════════════════════════════ */}
        <section id="faqs" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-stone-50 border-t border-stone-200">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-1">
                Common Queries
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                Frequently Asked Questions
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                Official guidance on gender-based BH/GH recommendation, merit priority, and roommate pairing.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-stone-200 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-orange-50/50 transition-colors"
                  >
                    <span className="font-bold text-stone-800 text-sm sm:text-base">{faq.q}</span>
                    <span
                      className="text-stone-400 font-bold text-lg flex-shrink-0 transition-transform duration-200"
                      style={{ transform: activeFaq === idx ? "rotate(45deg)" : "rotate(0)" }}
                    >
                      +
                    </span>
                  </button>
                  {activeFaq === idx && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CALL TO ACTION BANNER
            ══════════════════════════════════════════ */}
        <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="bg-gradient-to-r from-orange-500 to-[var(--primary-dark)] text-white rounded-3xl p-8 sm:p-14 shadow-lg">
            <h2 className="text-2xl sm:text-4xl font-black mb-3">
              Ready to Book Your Recommended BH or GH Hostel?
            </h2>
            <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto mb-8 leading-relaxed font-normal">
              Sign in to the Student Portal, select Male (for BH-1 to BH-9) or Female (for GH-1 to GH-3), and get instant hostel recommendations tailored for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/student/login"
                className="px-8 py-3.5 rounded-xl bg-white text-[var(--primary-dark)] font-bold text-sm shadow-md hover:bg-stone-50 transition-all"
              >
                Student Login (Male → BH / Female → GH)
              </Link>
              <Link
                href="/admin/login"
                className="px-7 py-3.5 rounded-xl bg-black/20 hover:bg-black/30 text-white font-semibold text-sm border border-white/20 transition-all"
              >
                Warden Administration
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ══════════════════════════════════════════
          LIGHTBOX MODAL FOR REAL LPU PHOTOS
          ══════════════════════════════════════════ */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-black flex items-center justify-center max-h-[75vh] overflow-hidden">
              <img
                src={lightboxPhoto.image}
                alt={lightboxPhoto.title}
                className="w-full max-h-[75vh] object-contain"
              />
              <button
                type="button"
                onClick={() => setLightboxPhoto(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white font-bold flex items-center justify-center text-base"
              >
                ✕
              </button>
            </div>
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange-50 text-[var(--primary-dark)] border border-orange-200 text-[11px] font-bold mb-1">
                  {lightboxPhoto.tag}
                </span>
                <h3 className="text-lg font-black text-stone-900">{lightboxPhoto.title}</h3>
                <p className="text-xs text-stone-500">{lightboxPhoto.location}</p>
              </div>
              <Link
                href="/student/login"
                className="btn-primary text-xs px-5 py-2.5 rounded-xl whitespace-nowrap"
              >
                Apply for Hostel →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════ */}
      <footer className="w-full bg-stone-900 text-stone-400 border-t border-stone-800 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3">
            <LpuLogo size={38} showText={true} subtitle="Residential Portal" />
            <p className="text-xs text-stone-400 leading-relaxed pt-2">
              Automated hostel allocation, gender-based BH/GH recommendation, and roommate matching system for Lovely Professional University.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/student/login" className="hover:text-white transition-colors">
                  Student Login (Male / Female)
                </Link>
              </li>
              <li>
                <Link href="/student/dashboard" className="hover:text-white transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-white transition-colors">
                  Admin Login
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-white transition-colors">
                  Warden Command Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Campus Residences</h4>
            <ul className="space-y-2 text-xs">
              <li>Boys Hostels: BH-1 to BH-9 (Recommended for Boys)</li>
              <li>Girls Hostels: GH-1 to GH-3 (Recommended for Girls)</li>
              <li>Room Configs: Single, Double, Triple, Quad</li>
              <li>Split AC &amp; Standard Non-AC Suites</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Help Desk</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Lovely Professional University
              <br />
              Jalandhar-Delhi G.T. Road, Phagwara, Punjab 144411
              <br />
              Email:{" "}
              <a href="mailto:hostel@lpu.co.in" className="text-orange-400 hover:underline">
                hostel@lpu.co.in
              </a>
              <br />
              Helpline: +91 1824 517000
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 Lovely Professional University. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-stone-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-stone-300 cursor-pointer transition-colors">Hostel Regulations</span>
            <span className="hover:text-stone-300 cursor-pointer transition-colors">Terms of Accommodation</span>
          </div>
        </div>
      </footer>

      <HostelAiBot />
    </div>
  );
}
