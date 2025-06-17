'use client';

import Navbar from '@/app/components/Navbar';
import Image from 'next/image'; // Import next/image

// Updated portfolio items with local images
const portfolioItems = [
	{
		id: 'fence-painting',
		title: 'Fence Painting & Repair',
		description:
			"Professional fence painting and repair services to enhance your garden\'s look and longevity.",
		imageUrl:
			'/portfolio-assets/garden-landscaping/Fence painting and fix.jpeg',
		category: 'Fencing & Painting',
		type: 'image', // Added type
	},
	{
		id: 'garden-after',
		title: 'Garden Transformation (After)',
		description:
			'The stunning result of a complete garden makeover, showcasing a vibrant and well-organized space.',
		imageUrl: '/portfolio-assets/garden-landscaping/Garden - After.jpeg',
		category: 'Landscaping',
		type: 'image', // Added type
	},
	{
		id: 'garden-accessories',
		title: 'Garden Accessory Installation',
		description:
			'Expert installation of various garden accessories to complement your outdoor living area.',
		imageUrl:
			'/portfolio-assets/garden-landscaping/Garden accessory installations.jpeg',
		category: 'Garden Features',
		type: 'image', // Added type
	},
	{
		id: 'garden-before',
		title: 'Garden Transformation (Before)',
		description:
			'The garden space prior to our renovation and landscaping work.',
		imageUrl: '/portfolio-assets/garden-landscaping/Garden before.jpeg',
		category: 'Landscaping',
		type: 'image', // Added type
	},
	{
		id: 'shed-after',
		title: 'Shed Renovation (After)',
		description:
			'A fully renovated shed, transformed into a functional and attractive garden structure.',
		imageUrl:
			'/portfolio-assets/garden-landscaping/Shed renovation - after.jpeg',
		category: 'Structures & Renovation',
		type: 'image', // Added type
	},
	{
		id: 'shed-before',
		title: 'Shed Renovation (Before)',
		description:
			'The shed in its original condition before our expert renovation.',
		imageUrl:
			'/portfolio-assets/garden-landscaping/Shed renovation - before.jpeg',
		category: 'Structures & Renovation',
		type: 'image', // Added type
	},
	{
		id: 'fencing-video',
		title: 'Fencing Project Showcase',
		description: 'A video showcasing our fencing installation and repair work.',
		videoUrl: '/portfolio-assets/garden-landscaping/Fencing.mp4',
		category: 'Fencing',
		type: 'video', // Added type
	},
	{
		id: 'garden-overgrowth-video',
		title: 'Garden Overgrowth Clearance',
		description:
			'Watch how we tackle and clear an overgrown garden, transforming it into a manageable space.',
		videoUrl: '/portfolio-assets/garden-landscaping/Garden Overgrowth.mp4',
		category: 'Landscaping & Clearance',
		type: 'video', // Added type
	},
];

export default function PortfolioPage() {
	return (
		<main className="flex min-h-screen flex-col items-center pt-20 bg-gray-100">
			{/* pt-20 for fixed navbar, bg-gray-100 for page background */}
			<Navbar />
			<section className="w-full py-12 md:py-16 lg:py-20">
				<div className="container mx-auto px-4 md:px-6">
					<h1 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl text-gray-800 mb-12">
						Our Portfolio
					</h1>
					<p className="mt-4 mb-12 max-w-[800px] mx-auto text-gray-600 md:text-xl text-center">
						Discover a selection of our completed projects, showcasing our
						commitment to quality and excellence in building maintenance, cleaning,
						and specialized services.
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{portfolioItems.map((item) => (
							<div
								key={item.id}
								className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-2xl"
							>
								<div className="relative w-full h-56">
									{item.type === 'image' && item.imageUrl && (
										<Image
											src={item.imageUrl}
											alt={`Image for ${item.title}`}
											layout="fill"
											objectFit="cover"
											className="w-full h-full"
										/>
									)}
									{item.type === 'video' && item.videoUrl && (
										<video
											src={item.videoUrl}
											controls
											className="w-full h-full object-cover"
											aria-label={`Video for ${item.title}`}
										>
											Your browser does not support the video tag.
										</video>
									)}
								</div>

								<div className="p-6 flex flex-col flex-grow">
									<span className="text-sm font-semibold text-indigo-600 mb-1">
										{item.category}
									</span>
									<h3 className="text-xl font-bold text-gray-900 mb-3">
										{item.title}
									</h3>
									<p className="text-gray-700 text-sm flex-grow mb-4">
										{item.description}
									</p>
									<a
										href="#"
										// Replace with actual link to project details if available
										className="mt-auto inline-block text-indigo-600 hover:text-indigo-800 font-semibold group"
									>
										View Project Details
										<span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
											&rarr;
										</span>
									</a>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
			<footer className="w-full py-8 bg-gray-800 text-white text-center mt-auto">
				<p>
					&copy; {new Date().getFullYear()} Fentiman Green Ltd. All rights
					reserved.
				</p>
			</footer>
		</main>
	);
}
