import React from 'react';

interface AddressFieldsProps {
  billTo: string;
  shipTo: string;
  onBillToChange: (value: string) => void;
  onShipToChange: (value: string) => void;
}

const AddressFields: React.FC<AddressFieldsProps> = ({ billTo, shipTo, onBillToChange, onShipToChange }) => {
  return (
    <div className="grid grid-cols-2 gap-8 mt-8">
      <div>
        <label htmlFor="bill-to" className="font-bold mb-2 sr-only">Bill To</label>
        <textarea
          id="bill-to"
          aria-label="Bill To"
          className="bg-gray-700 p-4 w-full h-40 resize-none border border-gray-600"
          placeholder="Bill To"
          value={billTo}
          onChange={(e) => onBillToChange(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="ship-to" className="font-bold mb-2 sr-only">Ship To</label>
        <textarea
          id="ship-to"
          aria-label="Ship To"
          className="bg-gray-700 p-4 w-full h-40 resize-none border border-gray-600"
          placeholder="Ship To (Optional)"
          value={shipTo}
          onChange={(e) => onShipToChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default AddressFields;
