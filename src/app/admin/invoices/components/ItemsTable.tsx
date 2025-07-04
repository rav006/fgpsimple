import React from 'react';
import type { Item } from '../types';

interface ItemsTableProps {
  items: Item[];
  newItemRef: React.RefObject<HTMLInputElement | null>;
  onItemChange: (index: number, field: keyof Item, value: string | number) => void;
  onRateBlur: (index: number, value: string) => void;
  onDeleteItem: (index: number) => void;
  onAddItem: () => void;
}

const ItemsTable: React.FC<ItemsTableProps> = ({ items, newItemRef, onItemChange, onRateBlur, onDeleteItem, onAddItem }) => {
  return (
    <div className="mt-8">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-600 bg-gray-900">
            <th className="p-2 text-left">Item</th>
            <th className="p-2 text-right">Quantity</th>
            <th className="p-2 text-right">Rate</th>
            <th className="p-2 text-right">Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="group">
              <td className="p-2">
                <input
                  ref={index === items.length - 1 ? newItemRef : null}
                  type="text"
                  aria-label="Item"
                  value={item.item}
                  onChange={(e) => onItemChange(index, 'item', e.target.value)}
                  className="bg-gray-700 p-2 w-full"
                />
              </td>
              <td className="p-2 text-right">
                <input
                  type="number"
                  aria-label="Quantity"
                  value={item.quantity}
                  onChange={(e) => onItemChange(index, 'quantity', parseFloat(e.target.value))}
                  className="bg-gray-700 p-2 w-20 text-right"
                />
              </td>
              <td className="p-2 text-right">
                <div className="flex items-center bg-gray-700 rounded w-32 border border-gray-600">
                  <span className="p-2 border-r border-gray-500">£</span>
                  <input
                    type="number"
                    aria-label="Rate"
                    value={item.rate}
                    onChange={(e) => onItemChange(index, 'rate', e.target.value)}
                    onBlur={(e) => onRateBlur(index, e.target.value)}
                    className="bg-transparent p-2 w-full text-right"
                  />
                </div>
              </td>
              <td className="p-2 text-right">
                <input
                  type="text"
                  aria-label="Amount"
                  value={`£${(item.quantity * (parseFloat(item.rate) || 0)).toFixed(2)}`}
                  className="bg-gray-700 p-2 w-24 text-right"
                  disabled
                />
              </td>
              <td className="p-2 text-center">
                <button onClick={() => onDeleteItem(index)} className="text-red-500 font-bold p-2 invisible group-hover:visible">
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onAddItem} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">+ Line Item</button>
    </div>
  );
};

export default ItemsTable;
