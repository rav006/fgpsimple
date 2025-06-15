import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "./components/AuthProvider"; // Import AuthProvider
import { Toaster } from 'react-hot-toast'; // Import Toaster

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
  viewport: "width=device-width, initial-scale=1", // Added viewport meta tag
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider> {/* Wrap children with AuthProvider */}
          <Toaster position="bottom-right" toastOptions={{ duration: 5000 }} /> {/* Add Toaster here */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
