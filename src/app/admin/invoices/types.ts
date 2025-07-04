import type { Dayjs } from 'dayjs';

export type Item = {
  item: string;
  quantity: number;
  rate: string;
};

export type InvoiceFormData = {
  invoiceNumber: string;
  businessAddress: string;
  billTo: string;
  shipTo: string;
  invoiceDate: Dayjs | null;
  dueDate: Dayjs | null;
  paymentTerms: string;
  poNumber: string;
  notes: string;
  terms: string;
  items: Item[];
  taxValue: number;
  taxType: 'percentage' | 'fixed';
  amountPaid: string;
  discountValue: number;
  discountType: 'percentage' | 'fixed';
  showDiscount: boolean;
  shipping: number;
  showShipping: boolean;
};
