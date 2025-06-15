'use client';

import { useSession, SessionContextValue } from 'next-auth/react'; // Modified import
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar'; // Assuming you want the main navbar here too
import useSWR from 'swr'; // Added SWR import
import { Session } from 'next-auth'; // Added import for Session type

// Placeholder components for different roles
function CustomerDashboard({ session }: { session: Session }) { // Changed session type from any to Session
  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800" id="customer-dashboard-heading">Customer Dashboard</h2>
      <p className="mb-8 text-lg text-gray-700">Welcome back, <span className="font-semibold">{session.user?.name || 'Customer'}</span>!</p>
      <div className="space-y-4 md:space-y-0 md:flex md:space-x-4">
        <Link 
          href="/dashboard/tickets/new" 
          className="block md:inline-block text-center w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:-translate-y-0.5"
        >
          Create New Service Ticket
        </Link>
        <Link 
          href="/dashboard/tickets" 
          className="block md:inline-block text-center w-full md:w-auto bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:-translate-y-0.5"
        >
          View My Tickets
        </Link>
        {/* More customer-specific content here */}
      </div>
    </div>
  );
}

function AdminDashboard({ session }: { session: Session }) { // Changed session type from any to Session
  // Basic fetcher for SWR
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch stats');
    }
    return res.json();
  };

  const { data: stats, error, isLoading } = useSWR('/api/admin/stats', fetcher, {
    refreshInterval: 60000, // Refresh stats every 60 seconds
  });

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800" id="admin-dashboard-heading">Admin Dashboard</h2>
      <p className="mb-8 text-lg text-gray-700">Welcome, Admin <span className="font-semibold">{session.user?.name || 'Admin'}</span>!</p>
      
      {isLoading && <p className='text-center text-gray-500 py-4' aria-live="polite">Loading statistics...</p>}
      {error && <p className='text-center text-red-500 bg-red-100 p-3 rounded-md' role="alert">Error loading statistics: {error.message}</p>}

      {stats && (
        <>
          <section aria-labelledby="stats-heading">
            <h3 id="stats-heading" className="sr-only">Key Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
                <h4 className="text-xl font-semibold">Total Tickets</h4>
                <p className="text-4xl font-bold mt-2">{stats.totalTickets ?? 'N/A'}</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 rounded-lg shadow-lg text-white">
                <h4 className="text-xl font-semibold">Open Tickets</h4>
                <p className="text-4xl font-bold mt-2">{stats.openTickets ?? 'N/A'}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
                <h4 className="text-xl font-semibold">In Progress Tickets</h4>
                <p className="text-4xl font-bold mt-2">{stats.inProgressTickets ?? 'N/A'}</p>
              </div>
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 rounded-lg shadow-lg text-white">
                <h4 className="text-xl font-semibold">Resolved Tickets</h4>
                <p className="text-4xl font-bold mt-2">{stats.resolvedTickets ?? 'N/A'}</p>
              </div>
              <div className="bg-gradient-to-r from-slate-500 to-slate-600 p-6 rounded-lg shadow-lg text-white">
                <h4 className="text-xl font-semibold">Closed Tickets</h4>
                <p className="text-4xl font-bold mt-2">{stats.closedTickets ?? 'N/A'}</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white">
                <h4 className="text-xl font-semibold">Quote Requests</h4>
                <p className="text-4xl font-bold mt-2">{stats.totalQuoteRequests ?? 'N/A'}</p>
              </div>
            </div>
          </section>

          {/* Quick Links/Actions Section */}
          <section aria-labelledby="quick-actions-heading">
            <h3 id="quick-actions-heading" className="text-2xl font-semibold text-gray-700 mb-4">Quick Actions</h3>
            <div className="space-y-4 md:space-y-0 md:flex md:space-x-4">
              <Link 
                href="/admin/tickets" 
                className="block md:inline-block text-center w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:-translate-y-0.5"
              >
                Manage All Tickets
              </Link>
              <Link 
                href="/admin/quotes" // Assuming this page will be created
                className="block md:inline-block text-center w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:-translate-y-0.5"
              >
                Manage Quote Requests
              </Link>
              <Link 
                href="/admin/users" 
                className="block md:inline-block text-center w-full md:w-auto bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:-translate-y-0.5"
              >
                Manage Users
              </Link>
              {/* Add more admin-specific links as needed */}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession() as { data: Session | null; status: SessionContextValue["status"] }; // Type assertion for session
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; 
    if (!session) {
      router.push('/login?callbackUrl=/dashboard'); 
    }
  }, [session, status, router]);

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <Navbar /> {/* Show navbar even on loading/redirect screen */}
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-gray-700" aria-live="polite">Loading Dashboard...</p>
          {/* You can add a spinner icon here */}
        </div>
        <footer className="w-full py-4 text-center text-sm text-gray-500">
          Fentiman Green Ltd &copy; {new Date().getFullYear()}
        </footer>
      </div>
    );
  }

  const userRole = session.user?.role;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8" aria-labelledby={userRole === 'admin' ? "admin-dashboard-heading" : "customer-dashboard-heading"}>
        {userRole === 'admin' ? (
          <AdminDashboard session={session} />
        ) : (
          <CustomerDashboard session={session} />
        )}
      </main>
      <footer className="w-full py-4 text-center text-sm text-gray-500 bg-gray-200 border-t border-gray-300">
        Fentiman Green Ltd &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
