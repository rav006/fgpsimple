'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname(); // Get current path
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const linkClasses = (path: string) => 
    `hover:text-gray-300 text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white ${
      // Adjusted active state logic for section links on homepage
      (pathname === '/' && typeof window !== 'undefined' && window.location.hash === path) || pathname === path 
        ? 'bg-gray-900 text-white' 
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  const servicesHref = pathname === '/' ? '#services' : '/#services';
  const contactHref = pathname === '/' ? '#contact' : '/#contact';

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md fixed top-0 left-0 right-0 z-50 w-full" aria-label="Main navigation">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center ml-auto"> {/* Adjusted to ml-auto to push menu to the right if brand link is removed */}
          {/* Desktop menu: always visible and aligned right */}
          <ul className="hidden md:flex space-x-4 items-center">
            <li>
              <Link href="/" className={linkClasses("/")} aria-current={pathname === "/" ? "page" : undefined}>
                Home
              </Link>
            </li>
            <li>
              <Link href={servicesHref} className={linkClasses("#services")}>
                Our Services
              </Link>
            </li>
            <li>
              <Link href={contactHref} className={linkClasses("#contact")}>
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/portfolio" className={linkClasses("/portfolio")} aria-current={pathname === "/portfolio" ? "page" : undefined}>
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
            <Link href="/" className={`${linkClasses("/")} block`} aria-current={pathname === "/" ? "page" : undefined} onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link href={servicesHref} className={`${linkClasses("#services")} block`} onClick={() => setIsMenuOpen(false)}>
              Our Services
            </Link>
          </li>
          <li>
            <Link href={contactHref} className={`${linkClasses("#contact")} block`} onClick={() => setIsMenuOpen(false)}>
              Contact Us
            </Link>
          </li>
          <li>
            <Link href="/portfolio" className={`${linkClasses("/portfolio")} block`} aria-current={pathname === "/portfolio" ? "page" : undefined} onClick={() => setIsMenuOpen(false)}>
              Portfolio
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
