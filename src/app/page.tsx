import Head from 'next/head';
import Navbar from "./components/Navbar";
import ContactForm from "./components/ContactForm"; // Import ContactForm
import Quote from './components/Quote';
import Reviews from './components/Reviews'; // Import Reviews component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTools, 
  faSprayCanSparkles, 
  faWrench, 
  faSeedling, 
  faSun, // Using faSun as a placeholder for window cleaning
  faStar,
  IconDefinition // Import IconDefinition for typing
} from '@fortawesome/free-solid-svg-icons';

// Define service data with FontAwesome icon definitions
interface Service {
  id: string;
  title: string;
  description: string;
  icon: IconDefinition; // Changed type from string to IconDefinition
  bgColor: string;
  textColor: string;
  iconBgColor: string;
}

const services: Service[] = [
  {
    id: "building_maintenance",
    title: "Comprehensive Building Maintenance",
    description: "Keep your property in top condition with our full range of maintenance services. We cover everything from routine inspections and preventative care to urgent repairs, ensuring your building\'s longevity and safety. Our team handles plumbing, electrical, HVAC systems, structural repairs, and more.",
    icon: faTools, // Updated to FontAwesome icon
    bgColor: "bg-sky-100",
    textColor: "text-sky-700",
    iconBgColor: "bg-sky-200",
  },
  {
    id: "general_cleaning",
    title: "Professional Cleaning Services",
    description: "Pristine environments for commercial and residential spaces. We offer tailored cleaning schedules, including daily, weekly, or one-off deep cleans. Our services cover office cleaning, communal area upkeep, and specialized sanitation to ensure a healthy and welcoming atmosphere.",
    icon: faSprayCanSparkles, // Updated to FontAwesome icon
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
    iconBgColor: "bg-emerald-200",
  },
  {
    id: "repair_services",
    title: "Reliable Repair Solutions",
    description: "Fast and efficient repair services for all your building needs. From minor fixes to major system overhauls, our skilled technicians are equipped to handle a wide array of repair tasks, minimizing downtime and restoring full functionality to your property promptly.",
    icon: faWrench, // Updated to FontAwesome icon
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
    iconBgColor: "bg-amber-200",
  },
  {
    id: "gardening_landscaping",
    title: "Gardening & Landscaping",
    description: "Enhance your property\'s curb appeal with our professional gardening and landscaping services. We offer lawn care, planting, hedge trimming, seasonal clean-ups, and landscape design to create and maintain beautiful, thriving outdoor spaces.",
    icon: faSeedling, // Updated to FontAwesome icon
    bgColor: "bg-lime-100",
    textColor: "text-lime-700",
    iconBgColor: "bg-lime-200",
  },
  {
    id: "window_cleaning",
    title: "Sparkling Window Cleaning",
    description: "Crystal-clear windows for an unobstructed view and a brighter interior. We provide professional window cleaning for all types of buildings, including high-rise, commercial, and residential properties, using safe and effective methods for a streak-free shine.",
    icon: faSun, // Updated to FontAwesome icon (placeholder)
    bgColor: "bg-cyan-100",
    textColor: "text-cyan-700",
    iconBgColor: "bg-cyan-200",
  },
  {
    id: "specialized_services",
    title: "Other Specialized Services",
    description: "Have a unique requirement? We offer a range of other specialized services tailored to your needs, including pest control, waste management, and customized maintenance plans. Contact us to discuss how we can assist you.",
    icon: faStar, // Updated to FontAwesome icon
    bgColor: "bg-slate-100",
    textColor: "text-slate-700",
    iconBgColor: "bg-slate-200",
  },
];

export default function Home() {
  const businessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Fentiman Green Ltd",
    "image": "https://fentimangreen.co.uk/your-logo.png",
    "@id": "https://fentimangreen.co.uk/",
    "url": "https://fentimangreen.co.uk/",
    "telephone": "01234 567890",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Your Street Address",
      "addressLocality": "Your City",
      "postalCode": "Your Postal Code",
      "addressCountry": "GB"
    },
    "description": "Fentiman Green Ltd provides comprehensive building maintenance, cleaning, and landscaping services in the UK.",
    "priceRange": "££",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "01234 567890",
      "contactType": "customer service",
      "areaServed": "GB"
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://fentimangreen.co.uk/"
      }
    ]
  };

  return (
    <>
      <Head>
        <title>Fentiman Green Ltd | Building Maintenance & Cleaning Services</title>
        <meta name="description" content="Fentiman Green Ltd provides comprehensive building maintenance, cleaning, and landscaping services in the UK. Get a quote today!" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://fentimangreen.co.uk/" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content="Fentiman Green Ltd | Building Maintenance & Cleaning Services" />
        <meta property="og:description" content="Fentiman Green Ltd provides comprehensive building maintenance, cleaning, and landscaping services in the UK. Get a quote today!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fentimangreen.co.uk/" />
        <meta property="og:image" content="https://fentimangreen.co.uk/your-logo.png" />
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fentiman Green Ltd | Building Maintenance & Cleaning Services" />
        <meta name="twitter:description" content="Fentiman Green Ltd provides comprehensive building maintenance, cleaning, and landscaping services in the UK. Get a quote today!" />
        <meta name="twitter:image" content="https://fentimangreen.co.uk/your-logo.png" />
      </Head>
      <main className="flex min-h-screen flex-col items-center pt-20"> {/* Added pt-20 for fixed navbar offset */}
        <Navbar />
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
              Fentiman Green Ltd
            </h1>
            <p className="mt-4 max-w-[700px] mx-auto text-gray-200 md:text-xl">
              Your trusted partner for comprehensive building maintenance and pristine
              cleaning services. We ensure your property is always at its best.
            </p>
            <div className="mt-8">
              <a
                href="#contact"
                className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-green-600 shadow transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
              >
                Get a Quote
              </a>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <Quote text="The only way to do great work is to love what you do." author="Steve Jobs" />
          </div>
        </section>

        {/* Services Overview Section - Placeholder */}
        <section
          id="services"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-50" // Changed background for better card contrast
          aria-labelledby="services-heading" // Add aria-labelledby
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 
              id="services-heading" // Add id for aria-labelledby
              className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl text-gray-800"
            >
              Our Services
            </h2>
            <p className="mt-4 mb-12 max-w-[800px] mx-auto text-gray-600 md:text-xl text-center">
              Fentiman Green Ltd offers a comprehensive suite of maintenance and cleaning services designed to keep your property operating smoothly and looking its best. Explore our offerings below.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div 
                  key={service.id} 
                  className={`flex flex-col ${service.bgColor} p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300`}
                  role="region" // Add role="region"
                  aria-labelledby={`service-title-${service.id}`} // Add aria-labelledby for the card
                >
                  <div className="flex items-center mb-4">
                    {service.icon && (
                      <div className={`p-3 rounded-full ${service.iconBgColor} mr-4 flex items-center justify-center w-12 h-12`}> {/* Ensured fixed size for icon container */}
                        <FontAwesomeIcon 
                          icon={service.icon} 
                          className={`${service.textColor} text-2xl`} 
                          aria-hidden="true" // Add aria-hidden
                        />
                      </div>
                    )}
                    <h3 
                      id={`service-title-${service.id}`} // Add id for card's aria-labelledby
                      className={`text-2xl font-semibold ${service.textColor}`}
                    >
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-gray-700 flex-grow">
                    {service.description}
                  </p>
                  {/* Optional: Add a 'Learn More' button if dedicated service pages exist 
                  {service.detailsLink && (
                    <a 
                      href={service.detailsLink} 
                      className={`mt-4 inline-block ${service.textColor} hover:underline font-medium`}
                    >
                      Learn More &rarr;
                    </a>
                  )}
                  */}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section - Placeholder */}
        <section
          id="contact"
          className="w-full py-12 md:py-24 lg:py-32 border-t bg-gray-50"
          aria-labelledby="contact-heading" // Add aria-labelledby
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 
              id="contact-heading" // Add id for aria-labelledby
              className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl text-gray-800"
            >
              Get in Touch
            </h2>
            <p className="mt-4 mb-12 max-w-[700px] mx-auto text-gray-600 md:text-xl text-center">
              Have a question or need a quote? Fill out the form below, and our team will get back to you as soon as possible.
            </p>
            <ContactForm /> {/* Replace placeholder with ContactForm component */}
          </div>
        </section>

        {/* Reviews Section - Added for user reviews */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 border-t">
          <div className="container mx-auto px-4 md:px-6">
            <Reviews />
          </div>
        </section>

        {/* Footer - Placeholder */}
        <footer className="w-full py-8 bg-gray-800 text-white text-center">
          <p>&copy; {new Date().getFullYear()} Fentiman Green Ltd. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
