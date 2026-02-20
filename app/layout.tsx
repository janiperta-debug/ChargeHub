import type React from "react"
import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google"
import "./globals.css"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "Voltteri - Yksi sovellus. Kaikki lataukset.",
  description: "Voltteri yhdistaa kaikki latausverkostot, reitit ja tilastot yhteen sovellukseen.",
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#080c10",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fi" className={`${plusJakarta.variable} ${dmSans.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
