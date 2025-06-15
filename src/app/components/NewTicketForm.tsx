'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast'; // Import toast

export default function NewTicketForm() {
  const [serviceType, setServiceType] = useState('cleaning');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false); // Added for disabling form
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error('Description cannot be empty.');
      return;
    }
    setIsSubmitting(true);
    const toastId = toast.loading('Submitting your ticket...');

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceType,
          description,
          priority,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Failed to create ticket. Please try again.', { id: toastId });
      } else {
        toast.success('Ticket created successfully! Redirecting...', { id: toastId });
        setDescription('');
        setServiceType('cleaning');
        setPriority('medium');
        setTimeout(() => router.push('/dashboard/tickets'), 2000);
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.', { id: toastId });
      console.error('Ticket creation error:', err);
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Create New Service Ticket</h2>

      <div>
        <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">
          Service Type
        </label>
        <select
          id="serviceType"
          name="serviceType"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          disabled={isSubmitting} // Disable during submission
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="cleaning">Cleaning</option>
          <option value="maintenance">Maintenance</option>
          <option value="repair">Repair</option>
          <option value="gardening">Gardening</option>
          <option value="window_cleaning">Window Cleaning</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting} // Disable during submission
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Please describe the issue or service required."
          required
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          disabled={isSubmitting} // Disable during submission
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting} // Disable during submission
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </div>
    </form>
  );
}
