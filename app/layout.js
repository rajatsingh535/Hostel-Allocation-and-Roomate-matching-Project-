import './globals.css'

export const metadata = {
  title: 'LPU Hostel Portal - Accommodation at Lovely Professional University',
  description: 'Book your hostel accommodation at LPU. Modern facilities, 24/7 security, and world-class amenities for students.',
  icons: {
    icon: '/logos/lpu-logo.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Inter font loaded via CSS @import in globals.css */}
      <body className="antialiased bg-white text-stone-900">{children}</body>
    </html>
  )
}
