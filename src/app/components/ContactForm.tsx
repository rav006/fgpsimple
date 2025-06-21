"use client";

import { useState, useEffect, type FormEvent } from "react";
import toast from "react-hot-toast";
import Head from "next/head";

const RECAPTCHA_SITE_KEY: string =
  (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as unknown as string) ||
  (typeof window !== "undefined"
    ? (window as unknown as { NEXT_PUBLIC_RECAPTCHA_SITE_KEY?: string })
        .NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""
    : "");

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
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load reCAPTCHA v3 script
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Sending your message...");
    try {
      // Get the reCAPTCHA v3 token
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
        action: "submit",
      });
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          isQuoteRequest: true,
          recaptchaToken: token,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(
          result.message || "Your message has been sent successfully!",
          { id: toastId },
        );
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.error(result.message || "An error occurred. Please try again.", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.", {
        id: toastId,
      });
      console.error("Contact form submission error:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Head>
        <title>Contact Us | Fentiman Green Ltd</title>
        <meta
          name="description"
          content="Contact Fentiman Green Ltd for building maintenance, cleaning, and landscaping services. Get in touch for a quote or more information."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://fentimangreen.co.uk/#contact" />
        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content="Contact Us | Fentiman Green Ltd" />
        <meta
          property="og:description"
          content="Contact Fentiman Green Ltd for building maintenance, cleaning, and landscaping services. Get in touch for a quote or more information."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://fentimangreen.co.uk/#contact"
        />
        <meta
          property="og:image"
          content="https://fentimangreen.co.uk/your-logo.png"
        />
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | Fentiman Green Ltd" />
        <meta
          name="twitter:description"
          content="Contact Fentiman Green Ltd for building maintenance, cleaning, and landscaping services. Get in touch for a quote or more information."
        />
        <meta
          name="twitter:image"
          content="https://fentimangreen.co.uk/your-logo.png"
        />
      </Head>
      <section className="w-full py-12 md:py-20 bg-gradient-to-br from-blue-50 via-white to-green-50 border-t border-gray-200">
        <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Contact Details Sidebar */}
          <div className="md:w-1/2 bg-gradient-to-br from-blue-100 via-white to-green-100 p-6 md:p-8 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center md:text-left w-full">
              Contact Us
            </h2>
            <p className="text-gray-700 mb-6 text-center md:text-left w-full text-base md:text-lg">
              Have a question or need a quote? Reach out and our team will get
              back to you promptly.
            </p>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-green-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0-1.243 1.007-2.25 2.25-2.25h2.086c.51 0 .998.195 1.366.547l1.32 1.32a2.25 2.25 0 01.547 1.366v2.086a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75zM17.25 17.25a2.25 2.25 0 002.25-2.25v-2.086a2.25 2.25 0 00-.547-1.366l-1.32-1.32a2.25 2.25 0 00-1.366-.547h-2.086a2.25 2.25 0 00-2.25 2.25v2.086a2.25 2.25 0 002.25 2.25h2.086z"
                  />
                </svg>
                <a
                  href="tel:07846586664"
                  className="text-base md:text-lg font-semibold text-gray-800 hover:text-green-700 break-all"
                >
                  07846586664
                </a>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-blue-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75m19.5 0v.243a2.25 2.25 0 01-.659 1.591l-7.091 7.091a2.25 2.25 0 01-3.182 0L2.909 8.584A2.25 2.25 0 012.25 6.993V6.75"
                  />
                </svg>
                <a
                  href="mailto:info@fentimangreen.com"
                  className="text-base md:text-lg font-semibold text-gray-800 hover:text-blue-700 break-all"
                >
                  info@fentimangreen.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-pink-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21c-4.418 0-8-4.03-8-9.001C4 7.03 7.582 3 12 3s8 4.03 8 8.999C20 16.97 16.418 21 12 21zm0-9.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                  />
                </svg>
                <span className="text-base md:text-lg font-semibold text-gray-800">
                  Vauxhall, London SW8 1PX
                </span>
              </div>
            </div>
          </div>
          {/* Contact Form */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
            <form
              className="bg-gray-50 rounded-xl shadow-md p-4 sm:p-6 flex flex-col gap-4"
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">
                Send us a message
              </h3>
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-semibold mb-1"
                >
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
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base sm:text-lg"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-semibold mb-1"
                >
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
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base sm:text-lg"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-gray-700 font-semibold mb-1"
                >
                  Phone Number (Optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base sm:text-lg"
                  placeholder="Phone Number"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-semibold mb-1"
                >
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
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-vertical text-base sm:text-lg"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-2 disabled:opacity-50 text-base sm:text-lg"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
