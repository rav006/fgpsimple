import type { Metadata, Viewport } from "next"; // Import Viewport
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"; // Import Toaster
import Provider from "@/app/components/SessionProvider";
import Navbar from "./components/Navbar";

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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <Navbar />
          <main className="pt-16">
            <Toaster position="bottom-right" toastOptions={{ duration: 5000 }} />
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}
