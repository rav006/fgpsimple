import { useState, useRef, useEffect, useMemo } from 'react';
import { InvoiceFormData, Item } from './types';
import type { Invoice } from '@/lib/schema';

export const useInvoiceForm = (onSave: (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'status'>) => void) => {
  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceNumber: 'INV-001',
    businessAddress: '',
    billTo: '',
    shipTo: '',
    invoiceDate: null,
    dueDate: null,
    paymentTerms: '',
    poNumber: '',
    notes: '',
    terms: '',
    items: [],
    taxValue: 20,
    taxType: 'percentage',
    amountPaid: '0.00',
    discountValue: 0,
    discountType: 'fixed',
    showDiscount: false,
    shipping: 0,
    showShipping: false,
  });

  const newItemRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newItemRef.current) {
      newItemRef.current.focus();
    }
  }, [formData.items.length]);

  const handleInputChange = <K extends keyof InvoiceFormData>(field: K, value: InvoiceFormData[K]) => {
    setFormData((prev: InvoiceFormData) => ({ ...prev, [field]: value }));
  };

  const handleAddItem = () => {
    handleInputChange('items', [...formData.items, { item: '', quantity: 1, rate: '0.00' }]);
  };

  const handleDeleteItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    handleInputChange('items', newItems);
  };

  const handleItemChange = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    handleInputChange('items', newItems);
  };

  const handleRateBlur = (index: number, value: string) => {
    const parsedValue = parseFloat(value);
    const formattedValue = isNaN(parsedValue) ? '0.00' : parsedValue.toFixed(2);
    handleItemChange(index, 'rate', formattedValue);
  };

  const handleAmountPaidBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const formattedValue = isNaN(value) ? '0.00' : value.toFixed(2);
    handleInputChange('amountPaid', formattedValue);
  };

  const calculations = useMemo(() => {
    const subtotal = formData.items.reduce((acc: number, item: Item) => acc + (item.quantity || 0) * (parseFloat(item.rate) || 0), 0);
    const taxAmount = formData.taxType === 'percentage' ? (subtotal * formData.taxValue) / 100 : formData.taxValue;
    const discountAmount = formData.discountType === 'percentage' ? (subtotal * formData.discountValue) / 100 : formData.discountValue;
    const total = subtotal + taxAmount - discountAmount + formData.shipping;
    const balanceDue = total - parseFloat(formData.amountPaid);
    return { subtotal, taxAmount, discountAmount, total, balanceDue };
  }, [formData]);

  const handleSave = () => {
    const customerName = formData.billTo.split('\n')[0] || 'N/A';
    const { subtotal, total, balanceDue } = calculations;

    const invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'status'> = {
      invoiceNumber: formData.invoiceNumber,
      customerName,
      businessAddress: formData.businessAddress,
      billTo: formData.billTo,
      shipTo: formData.shipTo,
      invoiceDate: formData.invoiceDate ? formData.invoiceDate.toDate() : null,
      dueDate: formData.dueDate ? formData.dueDate.toDate() : null,
      paymentTerms: formData.paymentTerms,
      poNumber: formData.poNumber,
      notes: formData.notes,
      terms: formData.terms,
      items: formData.items,
      subtotal: subtotal.toFixed(2),
      taxValue: formData.taxValue.toString(),
      taxType: formData.taxType,
      discountValue: formData.discountValue.toString(),
      discountType: formData.discountType,
      shipping: formData.shipping.toString(),
      total: total.toFixed(2),
      amountPaid: formData.amountPaid,
      balanceDue: balanceDue.toFixed(2),
    };
    onSave(invoiceData);
  };

  return {
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
  };
};
