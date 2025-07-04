'use client';

import { useState, useEffect } from 'react';
import InvoiceTemplate from './InvoiceTemplate';
import type { Invoice } from '@/lib/schema';

export default function ManageInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/invoices');
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      const data = await response.json();
      setInvoices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSaveInvoice = async (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'status'>) => {
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        throw new Error('Failed to save invoice');
      }

      setIsPanelOpen(false);
      fetchInvoices(); // Refresh the invoice list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 dark:bg-gray-900 rounded-lg relative">
      {isPanelOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      )}
      <div className={`fixed top-0 right-0 h-full w-full max-w-4xl bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <InvoiceTemplate onSave={handleSaveInvoice} onClose={() => setIsPanelOpen(false)} />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Invoices</h1>
        <button onClick={() => setIsPanelOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create New Invoice
        </button>
      </div>

      {loading && <p>Loading invoices...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
            <thead>
              <tr className="w-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Invoice #</th>
                <th className="py-3 px-6 text-left">Customer</th>
                <th className="py-3 px-6 text-right">Total</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{invoice.invoiceNumber}</td>
                    <td className="py-3 px-6 text-left">{invoice.customerName}</td>
                    <td className="py-3 px-6 text-right">£{parseFloat(invoice.total).toFixed(2)}</td>
                    <td className="py-3 px-6 text-center">
                      <span
                        className={`py-1 px-3 rounded-full text-xs ${{
                          pending: 'bg-yellow-200 text-yellow-800',
                          paid: 'bg-green-200 text-green-800',
                          overdue: 'bg-red-200 text-red-800',
                        }[invoice.status.toLowerCase()] || 'bg-gray-200 text-gray-800'}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">{new Date(invoice.createdAt!).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-3 px-6">No invoices found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
