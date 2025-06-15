'use client';

import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr'; // Import SWR and mutate
import { Ticket } from '@/lib/schema'; 
import toast from 'react-hot-toast'; // Added import

interface AdminTicket extends Ticket {
  userName?: string | null; 
  userEmail?: string | null;
}

// Define a fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch data');
  }
  const data = await res.json();
  return data.tickets || []; // Ensure we return an array
};

const formatDate = (dateString: string | Date | undefined | null): string => {
  if (!dateString) return 'N/A';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }; 
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const TicketStatusOptions: Ticket['status'][] = ['open', 'in_progress', 'resolved', 'closed'];

// Helper functions for badge classes
const getPriorityClass = (priority: Ticket['priority'] | null | undefined): string => {
  if (priority === 'high') return 'bg-red-100 text-red-800';
  if (priority === 'medium') return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800'; // Default for low or others
};

const getStatusClass = (status: Ticket['status'] | null | undefined): string => {
  if (status === 'open') return 'bg-blue-100 text-blue-800';
  if (status === 'in_progress') return 'bg-purple-100 text-purple-800';
  if (status === 'resolved') return 'bg-gray-200 text-gray-800';
  if (status === 'closed') return 'bg-gray-300 text-gray-900';
  return 'bg-green-100 text-green-800'; // Default for others
};

export default function AdminTicketsList() {
  // SWR hook for data fetching
  const { data: tickets, error: fetchError, isLoading: isLoadingTickets, mutate: mutateTickets } = useSWR<AdminTicket[]>('/api/tickets', fetcher, {
    refreshInterval: 30000, // Re-fetch every 30 seconds
    revalidateOnFocus: true, // Re-fetch when window gains focus
  });

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [updatingStatus, setUpdatingStatus] = useState<Record<number, boolean>>({});

  const handleUpdateStatus = async (ticketId: number, newStatus: Ticket['status']) => {
    setUpdatingStatus(prev => ({ ...prev, [ticketId]: true }));
    try {
      const res = await fetch(`/api/tickets/${ticketId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update status');
      }
      // Optimistically update the local data and revalidate
      mutateTickets(
        (currentTickets) => 
          (currentTickets || []).map(ticket => 
            ticket.id === ticketId ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString() } : ticket
          ),
        false // do not revalidate yet, we will do it after the optimistic update
      );
      // Revalidate the data from the server to ensure consistency
      mutateTickets();
      toast.success('Ticket status updated successfully!'); // Added success toast

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error(`Error updating ticket ${ticketId}:`, errorMessage);
      toast.error(`Failed to update status: ${errorMessage}`); // Added error toast
      // Optionally, revert optimistic update here if needed by re-fetching
      // mutateTickets(); 
    }
    setUpdatingStatus(prev => ({ ...prev, [ticketId]: false }));
  };

  const filteredTickets = tickets
    ?.filter(ticket => filterStatus === 'all' || ticket.status === filterStatus)
    .filter(ticket => filterPriority === 'all' || ticket.priority === filterPriority)
    .filter(ticket => 
      !searchTerm || 
      ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.serviceType?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []; // Ensure filteredTickets is always an array

  if (isLoadingTickets && !tickets) {
    return <p className="text-center text-gray-500 py-8" aria-live="polite">Loading tickets...</p>;
  }

  if (fetchError) {
    return <p className="text-center text-red-500 bg-red-100 p-4 rounded-md" role="alert">Error loading tickets: {fetchError.message}</p>;
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6" id="admin-tickets-heading">Manage All Service Tickets</h2>

      <fieldset className="mb-6 border border-gray-300 p-4 rounded-md">
        <legend className="text-lg font-medium text-gray-700 px-2">Filter Tickets</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end pt-2">
          <div>
            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">Search Tickets</label>
            <input 
              type="text"
              id="searchTerm"
              aria-label="Search tickets by keyword, user, or email"
              placeholder="Keyword, user, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700">Filter by Status</label>
            <select 
              id="filterStatus" 
              aria-label="Filter tickets by status"
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">All Statuses</option>
              {TicketStatusOptions.map(status => (
                <option key={status} value={status}>{status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="filterPriority" className="block text-sm font-medium text-gray-700">Filter by Priority</label>
            <select 
              id="filterPriority" 
              aria-label="Filter tickets by priority"
              value={filterPriority} 
              onChange={(e) => setFilterPriority(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </fieldset>

      {filteredTickets.length === 0 && !isLoadingTickets ? (
        <p className="text-gray-600 text-center py-4" aria-live="polite">No tickets match the current filters.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200" aria-labelledby="admin-tickets-heading">
            <caption className="sr-only">All Service Tickets - View and Manage</caption>
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className={`${updatingStatus[ticket.id] ? 'opacity-50 transition-opacity duration-300' : ''} hover:bg-gray-50`}>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="font-medium text-gray-900">{ticket.userName || 'N/A'}</div>
                    <div>{ticket.userEmail || 'N/A'}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                    {ticket.serviceType?.replace('_', ' ')}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-pre-wrap text-sm text-gray-500 max-w-xs break-words">
                    {ticket.description}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityClass(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                     <select 
                        value={ticket.status || ''}
                        onChange={(e) => handleUpdateStatus(ticket.id, e.target.value as Ticket['status'])}
                        disabled={updatingStatus[ticket.id]}
                        aria-label={`Update status for ticket ${ticket.id}`}
                        className={`w-full p-1.5 border rounded-md shadow-sm text-xs focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${getStatusClass(ticket.status)} ${updatingStatus[ticket.id] ? 'cursor-not-allowed' : ''}`}
                      >
                        {TicketStatusOptions.map(statusOpt => (
                          <option key={statusOpt} value={statusOpt} className="bg-white text-black">
                            {statusOpt.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(ticket.createdAt)}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(ticket.updatedAt)}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      onClick={() => handleUpdateStatus(ticket.id, ticket.status === 'open' ? 'in_progress' : 'open')} // Example action
                      disabled={updatingStatus[ticket.id]}
                      className="text-indigo-600 hover:text-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                      aria-label={`Quick toggle status for ticket ${ticket.id}`}
                    >
                      Toggle Status (Dev)
                    </button>
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
