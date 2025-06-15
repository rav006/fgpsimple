'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation'; // Import usePathname

export default function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const pathname = usePathname(); // Get current path

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
        <ul className="space-x-4 flex items-center" aria-live="polite"> {/* Changed div to ul, added aria-live */}
          <li>
            <Link href="/" className={linkClasses("/")} aria-current={pathname === "/" ? "page" : undefined}>
              Home
            </Link>
          </li>
          {isLoading ? (
            <li> {/* Standard li for loading text */}
              <span className="text-sm">Loading...</span>
            </li>
          ) : session ? (
            <>
              <li>
                <Link href="/dashboard" className={linkClasses("/dashboard")} aria-current={pathname === "/dashboard" ? "page" : undefined}>
                  Dashboard
                </Link>
              </li>
              <li>
                <button
                  onClick={() => signOut()} // Temporarily remove callbackUrl
                  className={buttonClasses}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login" className={linkClasses("/login")} aria-current={pathname === "/login" ? "page" : undefined}>
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className={linkClasses("/register")} aria-current={pathname === "/register" ? "page" : undefined}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
