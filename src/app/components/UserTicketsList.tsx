'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Ticket } from '@/lib/schema'; // Assuming Ticket type is exported from schema

// Helper function to format date strings
const formatDate = (dateString: string | Date) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }; 
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function UserTicketsList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/tickets'); // GET request to our API
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch tickets');
        }
        const data = await res.json();
        setTickets(data.tickets || []);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
        console.error("Fetch tickets error:", err);
      }
      setLoading(false);
    };

    fetchTickets();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 py-8" aria-live="polite">Loading your tickets...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 bg-red-100 p-4 rounded-md" role="alert">Error: {error}</p>;
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700" id="user-tickets-heading">My Service Tickets</h2>
        <Link href="/dashboard/tickets/new" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out">
          Create New Ticket
        </Link>
      </div>

      {tickets.length === 0 ? (
        <p className="text-gray-600" aria-live="polite">You have not created any tickets yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200" aria-labelledby="user-tickets-heading">
            <caption className="sr-only">A list of your service tickets, including service type, description, priority, status, and creation date.</caption>
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Type
                </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                    {ticket.serviceType?.replace('_', ' ')}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-pre-wrap text-sm text-gray-500 max-w-xs truncate">
                    {ticket.description}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${ticket.priority === 'high' ? 'bg-red-100 text-red-800' : 
                        ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}
                    `}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${ticket.status === 'open' ? 'bg-blue-100 text-blue-800' : 
                        ticket.status === 'in_progress' ? 'bg-purple-100 text-purple-800' : 
                        ticket.status === 'resolved' ? 'bg-gray-100 text-gray-800' : 
                        'bg-green-100 text-green-800'}
                    `}>
                      {ticket.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(ticket.createdAt!)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
