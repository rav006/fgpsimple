'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { UserForAdminList } from '@/app/api/admin/users/route'; // Import the interface
import Navbar from '@/app/components/Navbar';
import toast from 'react-hot-toast';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch users');
  }
  return res.json();
};

const formatDate = (dateString: string | Date | undefined | null): string => {
  if (!dateString) return 'N/A';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset to first page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/admin/users?page=${page}&limit=10&search=${debouncedSearchTerm}`,
    fetcher,
    { keepPreviousData: true }
  );

  const users: UserForAdminList[] = data?.users || [];
  const totalPages = data?.totalPages || 1;

  const handleRoleChange = async (userId: number, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    const originalUsers = [...users]; // For optimistic update rollback

    // Optimistic UI Update
    mutate(
      {
        ...data,
        users: users.map(u => u.id === userId ? { ...u, role: newRole } : u),
      },
      false // Don't revalidate yet
    );

    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update role');
      }
      toast.success(`User role updated to ${newRole}`);
      mutate(); // Revalidate data from server
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
      // Rollback optimistic update
      mutate({ ...data, users: originalUsers }, false);
    }
  };

  if (error) return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-grow py-10 container mx-auto px-4">
        <p className="text-center text-red-500 bg-red-100 p-4 rounded-md" role="alert">Error loading users: {error.message}</p>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-grow py-10" aria-labelledby="admin-users-page-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 id="admin-users-page-heading" className="text-3xl font-bold text-gray-800 mb-8">User Management</h1>
          
          <div className="mb-6">
            <label htmlFor="searchUsers" className="sr-only">Search Users</label>
            <input
              id="searchUsers"
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {isLoading && !data ? (
            <p className="text-center text-gray-500 py-8" aria-live="polite">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-center text-gray-600 py-8" aria-live="polite">No users found.</p>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200" aria-labelledby="admin-users-page-heading">
                  <caption className="sr-only">List of users with options to change their roles.</caption>
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleRoleChange(user.id, user.role!)}
                            className={`px-3 py-1.5 text-xs rounded-md transition-colors 
                              ${user.role === 'admin' 
                                ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                                : 'bg-sky-500 hover:bg-sky-600 text-white'}
                              focus:outline-none focus:ring-2 focus:ring-offset-2 
                              ${user.role === 'admin' ? 'focus:ring-yellow-400' : 'focus:ring-sky-400'}
                            `}
                            aria-label={`Change role for ${user.name || user.email}. Current role: ${user.role}. Action: Make ${user.role === 'admin' ? 'customer' : 'admin'}.`}
                          >
                            Make {user.role === 'admin' ? 'Customer' : 'Admin'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <nav className="mt-6 flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-0" aria-label="Pagination">
                  <div className="flex flex-1 justify-between sm:justify-end">
                    <button
                      onClick={() => setPage(prev => Math.max(1, prev - 1))}
                      disabled={page === 1 || isLoading}
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="mx-4 self-center text-sm text-gray-600">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={page === totalPages || isLoading}
                      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </nav>
              )}
            </>
          )}
        </div>
      </main>
      <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
        <p>&copy; {new Date().getFullYear()} Fentiman Green Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}
