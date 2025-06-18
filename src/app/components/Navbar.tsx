'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState('');

  // Sync hash state with URL on pathname change
  useEffect(() => {
    let hash = window.location.hash;
    if (hash === '#') hash = '';
    setCurrentHash(hash);
  }, [pathname]);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      let hash = window.location.hash;
      if (hash === '#') hash = '';
      setCurrentHash(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Reset hash when navigating away from root
  useEffect(() => {
    if (pathname !== '/' && currentHash !== '') setCurrentHash('');
  }, [pathname, currentHash]);

  // Refs for focus management
  const homeRef = useRef<HTMLAnchorElement>(null);
  const servicesRef = useRef<HTMLAnchorElement>(null);
  const contactRef = useRef<HTMLAnchorElement>(null);
  const portfolioRef = useRef<HTMLAnchorElement>(null);

  // Focus the active link after navigation/hash change
  useEffect(() => {
    if (isActive('/')) homeRef.current?.focus();
    else if (isActive('#services')) servicesRef.current?.focus();
    else if (isActive('#contact')) contactRef.current?.focus();
    else if (isActive('/portfolio')) portfolioRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, currentHash]);

  const baseLinkStyle =
    'text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white';

  function isActive(linkPath: string) {
    if (linkPath === '/') {
      return pathname === '/' && (currentHash === '' || currentHash === '#');
    } else if (linkPath.startsWith('#')) {
      return pathname === '/' && currentHash === linkPath;
    } else {
      return pathname === linkPath && currentHash === '';
    }
  }

  function linkClasses(path: string) {
    return isActive(path)
      ? `${baseLinkStyle} bg-gray-900 text-white`
      : `${baseLinkStyle} text-gray-300 hover:bg-gray-700 hover:text-white`;
  }

  const servicesHref = pathname === '/' ? '#services' : '/#services';
  const contactHref = pathname === '/' ? '#contact' : '/#contact';

  function toggleMenu() {
    setIsMenuOpen((open) => !open);
  }

  // Helper to handle smooth scroll for hash links on home page
  function handleHashLinkClick(hash: string) {
    if (pathname === '/') {
      const el = document.getElementById(hash.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setCurrentHash(hash);
      }
    }
  }

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md fixed top-0 left-0 right-0 z-50 w-full" aria-label="Main navigation">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center ml-auto">
          <ul className="hidden md:flex space-x-4 items-center">
            <li key="/">
              <Link href="/" className={linkClasses('/')} aria-current={isActive('/') ? 'page' : undefined} ref={homeRef}>
                Home
              </Link>
            </li>
            <li key="#services">
              {pathname === '/' ? (
                <a
                  href="#services"
                  className={linkClasses('#services')}
                  aria-current={isActive('#services') ? 'page' : undefined}
                  ref={servicesRef}
                  onClick={e => {
                    e.preventDefault();
                    handleHashLinkClick('#services');
                  }}
                >
                  Our Services
                </a>
              ) : (
                <Link href="/#services" className={linkClasses('#services')} aria-current={isActive('#services') ? 'page' : undefined} ref={servicesRef}>
                  Our Services
                </Link>
              )}
            </li>
            <li key="#contact">
              {pathname === '/' ? (
                <a
                  href="#contact"
                  className={linkClasses('#contact')}
                  aria-current={isActive('#contact') ? 'page' : undefined}
                  ref={contactRef}
                  onClick={e => {
                    e.preventDefault();
                    handleHashLinkClick('#contact');
                  }}
                >
                  Contact Us
                </a>
              ) : (
                <Link href="/#contact" className={linkClasses('#contact')} aria-current={isActive('#contact') ? 'page' : undefined} ref={contactRef}>
                  Contact Us
                </Link>
              )}
            </li>
            <li key="/portfolio">
              <Link href="/portfolio" className={linkClasses('/portfolio')} aria-current={isActive('/portfolio') ? 'page' : undefined} ref={portfolioRef}>
                Portfolio
              </Link>
            </li>
          </ul>
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
      {isMenuOpen && (
        <ul className="md:hidden flex flex-col space-y-2 mt-2 px-4">
          <li key="mobile-/">
            <Link href="/" className={`${linkClasses('/')} block`} aria-current={isActive('/') ? 'page' : undefined} onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li key="mobile-#services">
            {pathname === '/' ? (
              <a
                href="#services"
                className={`${linkClasses('#services')} block`}
                aria-current={isActive('#services') ? 'page' : undefined}
                onClick={e => {
                  e.preventDefault();
                  handleHashLinkClick('#services');
                  setIsMenuOpen(false);
                }}
              >
                Our Services
              </a>
            ) : (
              <Link href="/#services" className={`${linkClasses('#services')} block`} aria-current={isActive('#services') ? 'page' : undefined} onClick={() => setIsMenuOpen(false)}>
                Our Services
              </Link>
            )}
          </li>
          <li key="mobile-#contact">
            {pathname === '/' ? (
              <a
                href="#contact"
                className={`${linkClasses('#contact')} block`}
                aria-current={isActive('#contact') ? 'page' : undefined}
                onClick={e => {
                  e.preventDefault();
                  handleHashLinkClick('#contact');
                  setIsMenuOpen(false);
                }}
              >
                Contact Us
              </a>
            ) : (
              <Link href="/#contact" className={`${linkClasses('#contact')} block`} aria-current={isActive('#contact') ? 'page' : undefined} onClick={() => setIsMenuOpen(false)}>
                Contact Us
              </Link>
            )}
          </li>
          <li key="mobile-/portfolio">
            <Link href="/portfolio" className={`${linkClasses('/portfolio')} block`} aria-current={isActive('/portfolio') ? 'page' : undefined} onClick={() => setIsMenuOpen(false)}>
              Portfolio
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
