import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { Dayjs } from 'dayjs';
import type { InvoiceFormData } from '../types';

interface InvoiceDetailsProps {
  invoiceNumber: string;
  invoiceDate: Dayjs | null;
  dueDate: Dayjs | null;
  paymentTerms: string;
  poNumber: string;
  onInputChange: <K extends keyof InvoiceFormData>(field: K, value: InvoiceFormData[K]) => void;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ 
  invoiceNumber, 
  invoiceDate, 
  dueDate, 
  paymentTerms, 
  poNumber, 
  onInputChange 
}) => {
  return (
    <div className="col-span-4">
      <div className="flex justify-end">
        <div className="flex items-center bg-gray-700 rounded border border-gray-600">
          <span className="p-2 border-r border-gray-500">#</span>
          <input 
            type="text" 
            aria-label="Invoice Number" 
            className="bg-transparent p-2 w-48" 
            value={invoiceNumber}
            onChange={(e) => onInputChange('invoiceNumber', e.target.value)}
          />
        </div>
      </div>

      <div className="mt-8 space-y-2">
        <div className="flex items-center justify-end">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker 
                label="Invoice Date" 
                value={invoiceDate}
                onChange={(newValue) => onInputChange('invoiceDate', newValue)}
                sx={{ '& .MuiInputBase-root': { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }, '& .MuiSvgIcon-root': { color: 'white' }, '& .MuiInputLabel-root': { color: 'white' } }} />
          </LocalizationProvider>
        </div>
        <div className="flex items-center justify-end">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker 
                label="Due Date" 
                value={dueDate}
                onChange={(newValue) => onInputChange('dueDate', newValue)}
                sx={{ '& .MuiInputBase-root': { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }, '& .MuiSvgIcon-root': { color: 'white' }, '& .MuiInputLabel-root': { color: 'white' } }} />
          </LocalizationProvider>
        </div>
        <label className="flex items-center justify-between">
          <span>Payment Terms</span>
          <input 
            type="text" 
            aria-label="Payment Terms" 
            className="bg-gray-700 p-2 w-48" 
            value={paymentTerms}
            onChange={(e) => onInputChange('paymentTerms', e.target.value)}
           />
        </label>
        <label className="flex items-center justify-between">
          <span>PO Number</span>
          <input 
            type="text" 
            aria-label="PO Number" 
            className="bg-gray-700 p-2 w-48" 
            value={poNumber}
            onChange={(e) => onInputChange('poNumber', e.target.value)}
          />
        </label>
      </div>
    </div>
  );
};

export default InvoiceDetails;
