import AdminQuotesList from '@/app/components/AdminQuotesList';
import Navbar from '@/app/components/Navbar'; // Or a specific AdminNavbar if you have one
import { Suspense } from 'react';

export default function AdminQuotesPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8" aria-labelledby="admin-quotes-page-heading">
        <Suspense fallback={<p className="text-center text-lg text-gray-600" aria-live="polite">Loading quotes page...</p>}>
          {/* The h1 is for the page, AdminQuotesList has its own h2 */}
          <h1 id="admin-quotes-page-heading" className="sr-only">Admin Quote Requests Page</h1>
          <AdminQuotesList />
        </Suspense>
      </main>
      {/* You can add a Footer component here if needed */}
    </>
  );
}
