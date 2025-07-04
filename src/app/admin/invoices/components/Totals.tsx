import React from 'react';
import type { InvoiceFormData } from '../types';

interface TotalsProps {
  subtotal: number;
  taxValue: number;
  taxType: 'percentage' | 'fixed';
  discountValue: number;
  discountType: 'percentage' | 'fixed';
  shipping: number;
  total: number;
  amountPaid: string;
  balanceDue: number;
  showDiscount: boolean;
  showShipping: boolean;
  onInputChange: <K extends keyof InvoiceFormData>(field: K, value: InvoiceFormData[K]) => void;
  onAmountPaidBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const Totals: React.FC<TotalsProps> = ({ 
  subtotal, 
  taxValue, 
  taxType, 
  discountValue, 
  discountType, 
  shipping, 
  total, 
  amountPaid, 
  balanceDue, 
  showDiscount, 
  showShipping, 
  onInputChange, 
  onAmountPaidBlur 
}) => {
  return (
    <div className="mt-8 pt-4 border-t border-gray-600 space-y-2">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>{`£${subtotal.toFixed(2)}`}</span>
      </div>
      <div className="flex justify-between items-center">
        <span>Tax</span>
        <div className="flex items-center bg-gray-700 rounded border border-gray-600">
            <button
              onClick={() => onInputChange('taxType', 'fixed')}
              className={`p-2 rounded-l ${taxType === 'fixed' ? 'bg-blue-500' : 'bg-gray-600'}`}
            >
              £
            </button>
          <input
            type="number"
            aria-label="Tax value"
            className="bg-transparent p-2 w-16 text-right"
            value={taxValue}
            onChange={(e) => onInputChange('taxValue', parseFloat(e.target.value) || 0)}
          />
          <button
            onClick={() => onInputChange('taxType', 'percentage')}
            className={`p-2 rounded-r ${taxType === 'percentage' ? 'bg-blue-500' : 'bg-gray-600'}`}
          >
            %
          </button>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          {!showDiscount && <button onClick={() => onInputChange('showDiscount', true)} className="border border-gray-600 px-4 py-2 text-sm">+ Discount</button>}
          {!showShipping && <button onClick={() => onInputChange('showShipping', true)} className="border border-gray-600 px-4 py-2 text-sm">+ Shipping</button>}
        </div>
        {showDiscount && (
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <div className="flex items-center">
              <div className="flex items-center bg-gray-700 rounded border border-gray-600">
                  <button
                      onClick={() => onInputChange('discountType', 'fixed')}
                      className={`p-2 rounded-l ${discountType === 'fixed' ? 'bg-blue-500' : 'bg-gray-600'}`}
                  >
                      £
                  </button>
                  <input
                  type="number"
                  aria-label="Discount value"
                  value={discountValue}
                  onChange={(e) => onInputChange('discountValue', parseFloat(e.target.value) || 0)}
                  className="bg-transparent p-2 w-24 text-right"
                  />
                  <button
                      onClick={() => onInputChange('discountType', 'percentage')}
                      className={`p-2 rounded-r ${discountType === 'percentage' ? 'bg-blue-500' : 'bg-gray-600'}`}
                  >
                      %
                  </button>
              </div>
              <button onClick={() => { onInputChange('showDiscount', false); onInputChange('discountValue', 0); }} className="text-red-500 font-bold p-1 ml-1">X</button>
            </div>
          </div>
        )}
        {showShipping && (
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <div className="flex items-center bg-gray-700 rounded border border-gray-600">
              <span className="p-2 border-r border-gray-500">£</span>
              <input
                type="number"
                aria-label="Shipping"
                value={shipping}
                onChange={(e) => onInputChange('shipping', parseFloat(e.target.value) || 0)}
                className="bg-transparent p-2 w-24 text-right"
              />
               <button onClick={() => { onInputChange('showShipping', false); onInputChange('shipping', 0); }} className="text-red-500 font-bold p-1">X</button>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>{`£${total.toFixed(2)}`}</span>
      </div>
      <div className="flex justify-between items-center">
        <span>Amount Paid</span>
        <div className="flex items-center bg-gray-700 rounded w-32 border border-gray-600">
          <span className="p-2 border-r border-gray-500">£</span>
          <input
            type="number"
            aria-label="Amount Paid"
            value={amountPaid}
            onChange={(e) => onInputChange('amountPaid', e.target.value)}
            onBlur={onAmountPaidBlur}
            className="bg-transparent p-2 w-full text-right"
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span>Balance Due</span>
        <div className="flex items-center bg-gray-700 rounded w-32 border border-gray-600">
          <span className="p-2 border-r border-gray-500">£</span>
          <input
            type="text"
            aria-label="Balance Due"
            value={`${balanceDue.toFixed(2)}`}
            className="bg-transparent p-2 w-full text-right"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default Totals;
