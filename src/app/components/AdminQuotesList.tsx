'use client';

import useSWR from 'swr';
import { ContactInquiry } from '@/lib/schema'; // Assuming ContactInquiry type is exported

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch quotes');
  }
  const data = await res.json();
  return data.quotes || [];
};

const formatDate = (dateString: string | Date | undefined | null): string => {
  if (!dateString) return 'N/A';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function AdminQuotesList() {
  const { data: quotes, error, isLoading } = useSWR<ContactInquiry[]>('/api/admin/quotes', fetcher, {
    refreshInterval: 60000, // Refresh every 60 seconds
  });

  if (isLoading) {
    return <p className="text-center text-gray-500 py-8" aria-live="polite">Loading quote requests...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 bg-red-100 p-4 rounded-md" role="alert">Error: {error.message}</p>;
  }

  if (!quotes || quotes.length === 0) {
    return <p className="text-center text-gray-600 py-8" aria-live="polite">No quote requests found.</p>;
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6" id="admin-quotes-heading">Manage Quote Requests</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200" aria-labelledby="admin-quotes-heading">
          <caption className="sr-only">A list of submitted contact inquiries for quotes, including name, email, phone, message, and submission date.</caption>
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
              {/* Add actions column if needed, e.g., mark as contacted, delete */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quotes.map((quote) => (
              <tr key={quote.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{quote.name}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <a href={`mailto:${quote.email}`} className="text-indigo-600 hover:text-indigo-800">{quote.email}</a>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{quote.phone || 'N/A'}</td>
                <td className="px-4 py-4 whitespace-pre-wrap text-sm text-gray-500 max-w-md break-words">{quote.message}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(quote.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
