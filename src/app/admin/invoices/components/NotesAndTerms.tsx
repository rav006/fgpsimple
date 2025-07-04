import React from 'react';

interface NotesAndTermsProps {
  notes: string;
  terms: string;
  onNotesChange: (value: string) => void;
  onTermsChange: (value: string) => void;
}

const NotesAndTerms: React.FC<NotesAndTermsProps> = ({ notes, terms, onNotesChange, onTermsChange }) => {
  return (
    <div className="grid grid-cols-2 gap-8 mt-8">
      <div>
        <label htmlFor="notes" className="font-bold mb-2 sr-only">Notes</label>
        <textarea
          id="notes"
          aria-label="Notes"
          className="bg-gray-700 p-4 w-full h-40 resize-none border border-gray-600"
          placeholder="Notes - any relevant information not covered elsewhere"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="terms" className="font-bold mb-2 sr-only">Terms</label>
        <textarea
          id="terms"
          aria-label="Terms"
          className="bg-gray-700 p-4 w-full h-40 resize-none border border-gray-600"
          placeholder="Terms and conditions - late fees, payment methods, delivery schedule"
          value={terms}
          onChange={(e) => onTermsChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default NotesAndTerms;
