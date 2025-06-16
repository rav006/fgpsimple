'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation'; // Import usePathname
import { useState } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const pathname = usePathname(); // Get current path
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const linkClasses = (path: string) => 
    `hover:text-gray-300 text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white ${
      pathname === path ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  const buttonClasses = "hover:text-gray-300 text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md" aria-label="Main navigation">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white rounded-md">
          Fentiman Green Ltd
        </Link>
        <div className="flex items-center">
          {/* Desktop menu: always visible and aligned right */}
          <ul className="hidden md:flex space-x-4 items-center ml-auto">
            <li>
              <Link href="/" className={linkClasses("/")} aria-current={pathname === "/" ? "page" : undefined}>
                Home
              </Link>
            </li>
            <li>
              <Link href="#services" className="hover:text-gray-300">
                Our Services
              </Link>
            </li>
            <li>
              <Link href="#contact" className="hover:text-gray-300">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/portfolio" className="hover:text-gray-300">
                Portfolio
              </Link>
            </li>
          </ul>
          {/* Hamburger for mobile */}
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white md:hidden ml-4"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile menu: only visible when open */}
      {isMenuOpen && (
        <ul className="md:hidden flex flex-col space-y-2 mt-2 px-4">
          <li>
            <Link href="/" className="hover:text-gray-300 block">
              Home
            </Link>
          </li>
          <li>
            <Link href="#services" className="hover:text-gray-300 block">
              Our Services
            </Link>
          </li>
          <li>
            <Link href="#contact" className="hover:text-gray-300 block">
              Contact Us
            </Link>
          </li>
          <li>
            <Link href="/portfolio" className="hover:text-gray-300 block">
              Portfolio
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
