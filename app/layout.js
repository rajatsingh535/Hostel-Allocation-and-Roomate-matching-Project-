import './globals.css'

export const metadata = {
  title: 'LPU Hostel Portal',
  description: 'Hostel Room Allocation & Roommate Matching System for Lovely Professional University',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}