import Head from "next/head";
import Navbar from "@/app/components/Navbar";
import Image from "next/image"; // Import next/image

// Updated portfolio items with local images
const portfolioItems = [
  {
    id: "fence-painting",
    title: "Fence Painting & Repair",
    description:
      "Professional fence painting and repair services to enhance your garden\'s look and longevity.",
    imageUrl:
      "/portfolio-assets/garden-landscaping/Fence painting and fix.jpeg",
    category: "Fencing & Painting",
    type: "image", // Added type
  },
  {
    id: "garden-after",
    title: "Garden Transformation (After)",
    description:
      "The stunning result of a complete garden makeover, showcasing a vibrant and well-organized space.",
    imageUrl: "/portfolio-assets/garden-landscaping/Garden - After.jpeg",
    category: "Landscaping",
    type: "image", // Added type
  },
  {
    id: "garden-accessories",
    title: "Garden Accessory Installation",
    description:
      "Expert installation of various garden accessories to complement your outdoor living area.",
    imageUrl:
      "/portfolio-assets/garden-landscaping/Garden accessory installations.jpeg",
    category: "Garden Features",
    type: "image", // Added type
  },
  {
    id: "garden-before",
    title: "Garden Transformation (before)",
    description:
      "The garden space prior to our renovation and landscaping work.",
    imageUrl: "/portfolio-assets/garden-landscaping/Garden before.jpeg",
    category: "Landscaping",
    type: "image", // Added type
  },
  {
    id: "shed-after",
    title: "Shed Renovation (after)",
    description:
      "A fully renovated shed, transformed into a functional and attractive garden structure.",
    imageUrl:
      "/portfolio-assets/garden-landscaping/Shed renovation - after.jpeg",
    category: "Structures & Renovation",
    type: "image", // Added type
  },
  {
    id: "shed-before",
    title: "Shed Renovation (Before)",
    description:
      "The shed in its original condition before our expert renovation.",
    imageUrl:
      "/portfolio-assets/garden-landscaping/Shed renovation - before.jpeg",
    category: "Structures & Renovation",
    type: "image", // Added type
  },
  {
    id: "fencing-video",
    title: "Fencing Project Showcase",
    description: "A video showcasing our fencing installation and repair work.",
    videoUrl: "/portfolio-assets/garden-landscaping/Fencing.mp4",
    category: "Fencing",
    type: "video", // Added type
  },
  {
    id: "garden-overgrowth-video",
    title: "Garden Overgrowth Clearance",
    description:
      "Watch how we tackle and clear an overgrown garden, transforming it into a manageable space.",
    videoUrl: "/portfolio-assets/garden-landscaping/Garden Overgrowth.mp4",
    category: "Landscaping & Clearance",
    type: "video", // Added type
  },
  {
    id: "electrical-fuse-box-after",
    title: "Electrical Fuse Box (After)",
    description:
      "The upgraded and organized electrical fuse box after our professional service.",
    imageUrl: "/portfolio-assets/electrical/Electrical fuse box - After.jpeg",
    category: "Electrical",
    type: "image",
  },
  {
    id: "electrical-fuse-box-before",
    title: "Electrical Fuse Box (Before)",
    description:
      "The original condition of the electrical fuse box before our improvements.",
    imageUrl: "/portfolio-assets/electrical/Electrical fuse box - Before.jpeg",
    category: "Electrical",
    type: "image",
  },
];

export const metadata = {
  title: "Portfolio | Fentiman Green Ltd",
  description:
    "See our portfolio of building maintenance, cleaning, and landscaping projects in London.",
  openGraph: {
    title: "Portfolio | Fentiman Green Ltd",
    description:
      "See our portfolio of building maintenance, cleaning, and landscaping projects in London.",
    url: "https://fentimangreen.co.uk/portfolio",
    images: [
      {
        url: "/portfolio-assets/garden-landscaping/Garden - After.jpeg",
        width: 1200,
        height: 630,
        alt: "Fentiman Green Ltd garden landscaping",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Fentiman Green Ltd",
    description:
      "See our portfolio of building maintenance, cleaning, and landscaping projects in London.",
  },
  other: {
    'script[type="application/ld+json"]': `{
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Portfolio | Fentiman Green Ltd",
      "description": "See our portfolio of building maintenance, cleaning, and landscaping projects in London.",
      "url": "https://fentimangreen.co.uk/portfolio"
    }`,
  },
};

export default function PortfolioPage() {
  const portfolioJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Our Portfolio | Fentiman Green Ltd",
    description:
      "Discover a selection of our completed projects, showcasing our commitment to quality and excellence in building maintenance, cleaning, and specialized services.",
    url: "https://fentimangreen.co.uk/portfolio",
    mainEntity: [
      {
        "@type": "CreativeWork",
        name: "Fence Painting & Repair",
        description:
          "Professional fence painting and repair services to enhance your garden's look and longevity.",
        image:
          "https://fentimangreen.co.uk/portfolio-assets/garden-landscaping/Fence painting and fix.jpeg",
        url: "https://fentimangreen.co.uk/portfolio",
      },
      {
        "@type": "CreativeWork",
        name: "Garden Transformation (After)",
        description:
          "The stunning result of a complete garden makeover, showcasing a vibrant and well-organized space.",
        image:
          "https://fentimangreen.co.uk/portfolio-assets/garden-landscaping/Garden - After.jpeg",
        url: "https://fentimangreen.co.uk/portfolio",
      },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://fentimangreen.co.uk/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Portfolio",
        item: "https://fentimangreen.co.uk/portfolio",
      },
    ],
  };

  return (
    <>
      <Head>
        <title>Our Portfolio | Fentiman Green Ltd</title>
        <meta
          name="description"
          content="Discover a selection of our completed projects, showcasing our commitment to quality and excellence in building maintenance, cleaning, and specialized services."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://fentimangreen.co.uk/portfolio" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(portfolioJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd),
          }}
        />
        {/* Open Graph tags for social sharing */}
        <meta
          property="og:title"
          content="Our Portfolio | Fentiman Green Ltd"
        />
        <meta
          property="og:description"
          content="Discover a selection of our completed projects, showcasing our commitment to quality and excellence in building maintenance, cleaning, and specialized services."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://fentimangreen.co.uk/portfolio"
        />
        <meta
          property="og:image"
          content="https://fentimangreen.co.uk/portfolio-assets/garden-landscaping/Garden - After.jpeg"
        />
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Our Portfolio | Fentiman Green Ltd"
        />
        <meta
          name="twitter:description"
          content="Discover a selection of our completed projects, showcasing our commitment to quality and excellence in building maintenance, cleaning, and specialized services."
        />
        <meta
          name="twitter:image"
          content="https://fentimangreen.co.uk/portfolio-assets/garden-landscaping/Garden - After.jpeg"
        />
      </Head>
      <main className="flex min-h-screen flex-col items-center pt-20 bg-gray-100 overflow-x-hidden">
        {/* pt-20 for fixed navbar, bg-gray-100 for page background */}
        <Navbar />
        <section className="w-full py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-2 sm:px-4 md:px-6">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tighter text-center text-gray-800 mb-8 sm:mb-12">
              Our Portfolio
            </h1>
            <p className="mt-2 mb-8 sm:mt-4 sm:mb-12 max-w-[800px] mx-auto text-gray-600 text-base sm:text-lg md:text-xl text-center">
              Discover a selection of our completed projects, showcasing our
              commitment to quality and excellence in building maintenance,
              cleaning, and specialized services.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {portfolioItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-2xl min-h-[350px] sm:min-h-[400px]"
                >
                  <div className="relative w-full h-48 sm:h-56 md:h-64">
                    {item.type === "image" && item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={`Image for ${item.title}`}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="w-full h-full rounded-t-xl"
                      />
                    )}
                    {item.type === "video" && item.videoUrl && (
                      <video
                        src={item.videoUrl}
                        controls
                        className="w-full h-full object-cover rounded-t-xl"
                        aria-label={`Video for ${item.title}`}
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>

                  <div className="p-4 sm:p-6 flex flex-col flex-grow">
                    <span className="text-xs sm:text-sm font-semibold text-indigo-600 mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 text-xs sm:text-sm flex-grow mb-2 sm:mb-4">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <footer className="w-full py-6 sm:py-8 bg-gray-800 text-white text-center mt-auto text-xs sm:text-base">
          <p>
            &copy; {new Date().getFullYear()} Fentiman Green Ltd. All rights
            reserved.
          </p>
        </footer>
      </main>
    </>
  );
}
