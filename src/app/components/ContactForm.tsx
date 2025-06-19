'use client';

import { useState, useEffect, type FormEvent } from 'react';
import toast from 'react-hot-toast'; // Import toast
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import Head from 'next/head';

const RECAPTCHA_SITE_KEY: string = (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as unknown as string) || (typeof window !== 'undefined' ? ((window as unknown) as { NEXT_PUBLIC_RECAPTCHA_SITE_KEY?: string }).NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '' : '');

declare global {
  interface Window {
    grecaptcha: {
      execute(siteKey: string, options: { action: string }): Promise<string>;
    };
  }
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load reCAPTCHA v3 script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
      // Get the reCAPTCHA v3 token
      const token = await window.grecaptcha.execute(
        RECAPTCHA_SITE_KEY,
        { action: 'submit' }
      );
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, isQuoteRequest: true, recaptchaToken: token }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || 'Your message has been sent successfully!', { id: toastId });
        setFormData({ name: '', email: '', phone: '', message: '' });
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
    <>
      <Head>
        <title>Contact Us | Fentiman Green Ltd</title>
        <meta name="description" content="Contact Fentiman Green Ltd for building maintenance, cleaning, and landscaping services. Get in touch for a quote or more information." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://fentimangreen.co.uk/#contact" />
        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content="Contact Us | Fentiman Green Ltd" />
        <meta property="og:description" content="Contact Fentiman Green Ltd for building maintenance, cleaning, and landscaping services. Get in touch for a quote or more information." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fentimangreen.co.uk/#contact" />
        <meta property="og:image" content="https://fentimangreen.co.uk/your-logo.png" />
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | Fentiman Green Ltd" />
        <meta name="twitter:description" content="Contact Fentiman Green Ltd for building maintenance, cleaning, and landscaping services. Get in touch for a quote or more information." />
        <meta name="twitter:image" content="https://fentimangreen.co.uk/your-logo.png" />
      </Head>
      <section className="w-full py-12 md:py-16 lg:py-20 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Contact Us</h2>
          <p className="text-gray-600 mb-8 text-center md:text-lg">
            We’d love to hear from you! Please fill out the form below and our team will get back to you as soon as possible.
          </p>
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center gap-2 justify-center text-gray-700">
              <FontAwesomeIcon icon={faEnvelope} className="text-blue-600" />
              <span>info@fentimangreen.com</span>
            </div>
            <div className="flex items-center gap-2 justify-center text-gray-700">
              <FontAwesomeIcon icon={faPhone} className="text-green-600" />
              <span>01234 567890</span>
            </div>
          </div>
          <form
            className="bg-gray-50 rounded-xl shadow-md p-6 flex flex-col gap-4"
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <div>
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                aria-required="true" // Added aria-required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                aria-required="true" // Added aria-required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-700 font-semibold mb-1">
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Phone Number"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 font-semibold mb-1">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                aria-required="true" // Added aria-required
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-vertical"
                placeholder="How can we help you?"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
