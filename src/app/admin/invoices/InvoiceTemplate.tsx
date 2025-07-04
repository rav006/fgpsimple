'use client';

import React from 'react';
import type { Invoice } from '@/lib/schema';
import { useInvoiceForm } from './useInvoiceForm';
import InvoiceHeader from './components/InvoiceHeader';
import AddressFields from './components/AddressFields';
import ItemsTable from './components/ItemsTable';
import NotesAndTerms from './components/NotesAndTerms';
import InvoiceDetails from './components/InvoiceDetails';
import Totals from './components/Totals';

interface InvoiceTemplateProps {
  onSave: (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'status'>) => void;
  onClose: () => void;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ onSave, onClose }) => {
  const {
    formData,
    newItemRef,
    handleInputChange,
    handleAddItem,
    handleDeleteItem,
    handleItemChange,
    handleRateBlur,
    handleAmountPaidBlur,
    calculations,
    handleSave,
  } = useInvoiceForm(onSave);

  const { subtotal, total, balanceDue } = calculations;

  return (
    <div className="bg-gray-800 text-white p-8 h-full flex flex-col">
      <div className="flex-grow overflow-y-auto pr-4">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Side */}
          <div className="col-span-8">
            <InvoiceHeader 
              businessAddress={formData.businessAddress}
              onBusinessAddressChange={(value) => handleInputChange('businessAddress', value)}
            />
            <AddressFields
              billTo={formData.billTo}
              shipTo={formData.shipTo}
              onBillToChange={(value) => handleInputChange('billTo', value)}
              onShipToChange={(value) => handleInputChange('shipTo', value)}
            />
            <ItemsTable
              items={formData.items}
              newItemRef={newItemRef}
              onItemChange={handleItemChange}
              onRateBlur={handleRateBlur}
              onDeleteItem={handleDeleteItem}
              onAddItem={handleAddItem}
            />
            <NotesAndTerms
              notes={formData.notes}
              terms={formData.terms}
              onNotesChange={(value) => handleInputChange('notes', value)}
              onTermsChange={(value) => handleInputChange('terms', value)}
            />
          </div>

          {/* Right Side */}
          <div className="col-span-4">
            <InvoiceDetails
              invoiceNumber={formData.invoiceNumber}
              invoiceDate={formData.invoiceDate}
              dueDate={formData.dueDate}
              paymentTerms={formData.paymentTerms}
              poNumber={formData.poNumber}
              onInputChange={handleInputChange}
            />
            <Totals
              subtotal={subtotal}
              taxValue={formData.taxValue}
              taxType={formData.taxType}
              discountValue={formData.discountValue}
              discountType={formData.discountType}
              shipping={formData.shipping}
              total={total}
              amountPaid={formData.amountPaid}
              balanceDue={balanceDue}
              showDiscount={formData.showDiscount}
              showShipping={formData.showShipping}
              onInputChange={handleInputChange}
              onAmountPaidBlur={handleAmountPaidBlur}
            />
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 p-4 bg-gray-900 flex justify-end space-x-4">
        <button onClick={onClose} className="text-white px-4 py-2 rounded hover:bg-gray-700">Cancel</button>
        <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
