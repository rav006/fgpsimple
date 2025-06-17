'use client';

import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast'; // Import toast

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  isQuoteRequest: boolean;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    isQuoteRequest: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const toastId = toast.loading('Sending your message...');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || 'Your message has been sent successfully!', { id: toastId });
        setFormData({ name: '', email: '', phone: '', message: '', isQuoteRequest: false });
      } else {
        toast.error(result.message || 'An error occurred. Please try again.', { id: toastId });
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.', { id: toastId });
      console.error("Contact form submission error:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="mx-auto w-full max-w-lg p-6 bg-white rounded-lg shadow-xl space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Contact Us</h2>
        <p className="text-gray-600 mt-2">
          We&apos;re here to help. Reach out to us via the form below, or contact us directly:
        </p>
        <p className="text-gray-700 font-semibold mt-4">
          Phone: <a href="tel:07846586664" className="text-indigo-600 hover:text-indigo-800">07846 586 664</a>
        </p>
        <p className="text-gray-600 mt-1">
          We are based in Vauxhall, London
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-2xl font-semibold text-gray-800 text-center">Send us a Message</h3>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            aria-required="true" // Added aria-required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            aria-required="true" // Added aria-required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            id="message"
            rows={4}
            required
            aria-required="true" // Added aria-required
            value={formData.message}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex items-center">
          <input
            id="isQuoteRequest"
            name="isQuoteRequest"
            type="checkbox"
            checked={formData.isQuoteRequest}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="isQuoteRequest" className="ml-2 block text-sm text-gray-900">
            Request a formal quote
          </label>
        </div>
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  );
}
