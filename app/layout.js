import './globals.css'

export const metadata = {
  title: 'LPU Hostel Portal',
  description: 'Hostel Room Allocation & Roommate Matching System for Lovely Professional University',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Inter font loaded via CSS @import in globals.css */}
      <body className="antialiased bg-white text-stone-900">{children}</body>
    </html>
  )
}
