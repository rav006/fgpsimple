import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import AdminTicketsList from "@/app/components/AdminTicketsList";

export default async function AdminManageTicketsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== 'admin') {
    // If not admin, or not logged in, redirect to login or dashboard
    // For simplicity, redirecting to dashboard, which will then redirect to login if not authenticated.
    redirect("/dashboard"); 
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-grow py-10" aria-labelledby="admin-tickets-page-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* The h1 is for the page itself, the h2 inside AdminTicketsList is for the component's section */}
          <h1 id="admin-tickets-page-heading" className="sr-only">Admin Ticket Management Page</h1> 
          <AdminTicketsList />
        </div>
      </main>
      <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
        <p>&copy; {new Date().getFullYear()} Fentiman Green Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}
