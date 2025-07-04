import React from 'react';

interface InvoiceHeaderProps {
  businessAddress: string;
  onBusinessAddressChange: (value: string) => void;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ businessAddress, onBusinessAddressChange }) => {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <div className="bg-gray-700 h-32 w-48 mb-4 flex items-center justify-center">
          + Add Your Logo
        </div>
        <label htmlFor="business-address" className="font-bold mb-2 sr-only">Business Address</label>
        <textarea
          id="business-address"
          aria-label="Business Address"
          className="bg-gray-700 p-4 w-full h-40 resize-none border border-gray-600"
          placeholder="Bill From"
          value={businessAddress}
          onChange={(e) => onBusinessAddressChange(e.target.value)}
        />
      </div>
      <div>
        <h1 className="text-4xl font-bold text-right mb-4">INVOICE</h1>
      </div>
    </div>
  );
};

export default InvoiceHeader;
