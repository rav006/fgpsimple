import type { Metadata, Viewport } from "next"; // Import Viewport
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"; // Import Toaster

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fentiman Green Ltd", // Updated title
  description: "Building Maintenance and Cleaning Services", // Updated description
  metadataBase: new URL("https://fentimangreen.co.uk"),
  // viewport: "width=device-width, initial-scale=1", // Moved to viewport export
};

// Add viewport export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Detect route for dark mode logic
  const isHome = typeof window !== "undefined" && window.location.pathname === "/";
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${!isHome ? 'bg-gray-900 text-white' : ''}`}
      >
        <Toaster position="bottom-right" toastOptions={{ duration: 5000 }} />{" "}
        {/* Add Toaster here */}
        {children}
      </body>
    </html>
  );
}
