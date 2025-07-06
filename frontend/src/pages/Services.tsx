import { useState, useEffect } from "react";
import { servicesAPI, galleryAPI } from "../services/api";

interface Service {
	_id: string;
	title: string;
	icon: string;
	description?: string;
	items?: Array<{
		name: string;
		description?: string;
		displayOrder?: number;
	}>;
	category: string;
	displayOrder: number;
	isActive: boolean;
}

interface GalleryImage {
	_id: string;
	title: string;
	description?: string;
	image: {
		url: string;
		publicId: string;
	};
	category: string;
	displayOrder: number;
	isActive: boolean;
}

function Services() {
	const [services, setServices] = useState<Service[]>([]);
	const [whyChooseUs, setWhyChooseUs] = useState<Service[]>([]);
	const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
	const [selectedGalleryImage, setSelectedGalleryImage] = useState<
		string | null
	>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchServices();
	}, []);

	const fetchServices = async () => {
		try {
			setLoading(true);
			setError(null);

			// Fetch "Our Services" category
			const servicesResponse = await servicesAPI.getAllServices(
				"Our Services"
			);

			// Fetch "Why Choose Us" category
			const whyChooseResponse = await servicesAPI.getAllServices(
				"Why Choose Us"
			);

			// Fetch Services gallery images
			const galleryResponse = await galleryAPI.getAllGalleryImages(
				"Services"
			);

			// The API returns the services array directly, not wrapped in a services property
			setServices(servicesResponse || []);
			setWhyChooseUs(whyChooseResponse || []);
			setGalleryImages(galleryResponse || []);
		} catch (err) {
			console.error("Error fetching services:", err);
			setError("Failed to load services. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-900 py-20">
			<div className="max-w-7xl mx-auto px-8">
				{/* Hero Section */}
				<div className="text-center mb-20">
					<div className="mb-8">
						<div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 p-6 rounded-xl border border-purple-400/40 shadow-xl flex flex-col items-center max-w-xs mx-auto">
							<img
								src="./logo/sankalp_logo.jpg"
								alt="Sankalp Advertisement and Services"
								className="w-full object-cover rounded-lg shadow-lg mb-3"
							/>
						</div>
					</div>
					<h1 className="text-5xl font-bold text-white mb-6">
						<span className="text-yellow-400 font-bold">
							SANKALP
						</span>{" "}
						– Turning Your Dreams into{" "}
						<span className="text-green-300">
							Unforgettable Moments
						</span>
					</h1>
					<p className="text-2xl text-purple-300 mb-8 italic font-semibold">
						"Your Dream, Our Responsibility"
					</p>
				</div>

				{/* About Us */}
				<div className="mb-20">
					<h2 className="text-4xl font-bold text-center text-white mb-12">
						About{" "}
						<span className="text-yellow-400 font-bold">Us</span>
					</h2>
					<div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
						<p className="text-gray-300 text-lg leading-relaxed">
							At{" "}
							<span className="text-yellow-400 font-semibold">
								Sankalp Advertisement and Services
							</span>
							, we believe that every celebration tells a story.
							Founded on the promise that your vision is our
							mission, we blend creativity, precision, and passion
							to craft events that leave a lasting impression.
							From intimate baby showers to grand corporate galas,
							our end-to-end event-management expertise ensures
							that you get to enjoy every moment—while we handle
							all the details.
						</p>
					</div>
				</div>

				{/* Loading State */}
				{loading && (
					<div className="text-center py-12">
						<div className="text-gray-400 text-lg">
							Loading services...
						</div>
					</div>
				)}

				{/* Error State */}
				{error && (
					<div className="mb-8 bg-red-900/50 border border-red-600 rounded-lg p-4">
						<p className="text-red-300">{error}</p>
					</div>
				)}

				{/* Our Services */}
				{!loading && !error && (
					<div className="mb-20">
						<h2 className="text-4xl font-bold text-center text-white mb-12">
							Our{" "}
							<span className="text-yellow-400 font-bold">
								Services
							</span>
						</h2>
						{services.length > 0 ? (
							<>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
									{services.map((service, index) => (
										<div
											key={service._id || index}
											className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
										>
											<div className="text-5xl mb-4">
												{service.icon}
											</div>
											<h3 className="text-2xl font-bold text-yellow-400 mb-4">
												{service.title}
											</h3>
											{service.description && (
												<p className="text-gray-300 text-lg">
													{service.description}
												</p>
											)}
											{service.items &&
												service.items.length > 0 && (
													<ul className="text-gray-300 text-lg space-y-2">
														{service.items.map(
															(
																item,
																itemIndex
															) => (
																<li
																	key={
																		itemIndex
																	}
																	className="flex items-center"
																>
																	<span className="text-green-400 mr-2">
																		•
																	</span>
																	{typeof item ===
																	"string"
																		? item
																		: item.name}
																</li>
															)
														)}
													</ul>
												)}
										</div>
									))}
								</div>
								<div className="bg-green-500/20 border border-green-500 rounded-lg p-6 text-center">
									<p className="text-green-300 text-lg">
										Each service comes with{" "}
										<span className="text-white font-semibold">
											custom-designed décor
										</span>
										,{" "}
										<span className="text-white font-semibold">
											on-site setup and teardown
										</span>
										, and a{" "}
										<span className="text-white font-semibold">
											dedicated event manager
										</span>{" "}
										to make sure your vision comes to life
										perfectly.
									</p>
								</div>
							</>
						) : (
							<div className="text-center py-12">
								<p className="text-gray-400 text-lg">
									No services available at the moment.
								</p>
							</div>
						)}
					</div>
				)}

				{/* Why Choose Sankalp */}
				{!loading && !error && (
					<div className="mb-20">
						<h2 className="text-4xl font-bold text-center text-white mb-12">
							Why Choose{" "}
							<span className="text-yellow-400 font-bold">
								Sankalp
							</span>
							?
						</h2>
						{whyChooseUs.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								{whyChooseUs.map((reason, index) => (
									<div
										key={reason._id || index}
										className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
									>
										<div className="text-5xl mb-4">
											{reason.icon}
										</div>
										<h3 className="text-2xl font-bold text-yellow-400 mb-4">
											{reason.title}
										</h3>
										<p className="text-gray-300 text-lg">
											{reason.description}
										</p>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-12">
								<p className="text-gray-400 text-lg">
									No information available at the moment.
								</p>
							</div>
						)}
					</div>
				)}

				{/* Gallery Section */}
				{galleryImages.length > 0 && (
					<div className="mb-20">
						<h2 className="text-4xl font-bold text-center text-white mb-12">
							Our{" "}
							<span className="text-yellow-400 font-bold">
								Gallery
							</span>
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{galleryImages.map((image) => (
								<div
									key={image._id}
									className="group relative overflow-hidden rounded-2xl cursor-pointer transition-transform duration-300 hover:scale-105"
									onClick={() =>
										setSelectedGalleryImage(image.image.url)
									}
								>
									<img
										src={image.image.url}
										alt={image.title}
										className="w-full h-64 object-cover rounded-2xl"
									/>
									<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
										<div className="text-center text-white p-4">
											<h3 className="text-xl font-bold mb-2">
												{image.title}
											</h3>
											{image.description && (
												<p className="text-gray-200 text-sm">
													{image.description}
												</p>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Call to Action */}
				<div className="text-center">
					<h3 className="text-3xl font-bold text-white mb-4">
						Ready to Make Your Event Unforgettable?
					</h3>
					<p className="text-gray-300 mb-8 text-lg">
						Let's bring your vision to life with our expert event
						management services
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="/contact"
							className="bg-gradient-to-r from-yellow-400 to-red-500 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
						>
							Contact Us Today
						</a>
					</div>
				</div>
			</div>

			{/* Gallery Image Modal */}
			{selectedGalleryImage && (
				<div
					className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
					onClick={() => setSelectedGalleryImage(null)}
				>
					<div className="relative max-w-7xl max-h-[90vh]">
						<img
							src={selectedGalleryImage}
							alt="Gallery Image"
							className="max-w-full max-h-full object-contain rounded-lg"
							onClick={(e) => e.stopPropagation()}
						/>
						<button
							onClick={() => setSelectedGalleryImage(null)}
							className="absolute top-4 right-4 bg-black/50 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold hover:bg-black/70 transition-colors"
						>
							×
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default Services;
