'use client';
import InvoiceForm from './components/InvoiceForm';
import './index.css';

function InvoicePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl">
        <InvoiceForm />
      </div>
    </div>
  );
}

export default InvoicePage;
