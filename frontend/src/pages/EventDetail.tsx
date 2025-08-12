import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { eventsAPI } from "../services/api";

interface Event {
	_id: string;
	title: string;
	category: string;
	eventDate: string;
	year?: string; // Keep for backward compatibility
	location: string;
	image: {
		url: string;
		publicId: string;
	};
	gallery?: {
		url: string;
		publicId: string;
	}[];
	description: string;
	importance: string;
	isActive: boolean;
}

function EventDetail() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [event, setEvent] = useState<Event | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [selectedGalleryImage, setSelectedGalleryImage] = useState<
		string | null
	>(null);
	const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);

	// Helper function to format date
	const formatEventDate = (eventDate: string) => {
		const date = new Date(eventDate);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	// Helper function to check if event is upcoming
	const isEventUpcoming = (eventDate: string) => {
		return new Date(eventDate) >= new Date();
	};

	useEffect(() => {
		if (id) {
			fetchEvent(id);
		}
	}, [id]);

	const fetchEvent = async (eventId: string) => {
		try {
			setLoading(true);
			const response = await eventsAPI.getEvent(eventId);
			setEvent(response);

			// Fetch related events (same category, excluding current event)
			try {
				const relatedResponse = await eventsAPI.getEvents({
					category: response.category,
				});
				const related = relatedResponse.events
					.filter((e: Event) => e._id !== eventId)
					.slice(0, 3);
				setRelatedEvents(related);
			} catch (relatedErr) {
				console.error("Failed to fetch related events:", relatedErr);
			}
		} catch (err) {
			setError("Failed to load event details");
			console.error("Fetch event error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleGalleryImageClick = (imageUrl: string) => {
		console.log("Gallery image clicked:", imageUrl);
		setSelectedGalleryImage(imageUrl);
	};

	const handleCloseGalleryModal = () => {
		setSelectedGalleryImage(null);
	};

	const handleApplyForEvent = () => {
		navigate(
			`/events/${id}/register?eventName=${encodeURIComponent(
				event!.title
			)}`
		);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center">
				<div className="text-white text-xl">
					Loading event details...
				</div>
			</div>
		);
	}

	if (error || !event) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-400 text-xl mb-4">
						{error || "Event not found"}
					</div>
					<button
						onClick={() => navigate("/events")}
						className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
					>
						Back to Events
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-900">
			{/* Breadcrumb Navigation */}
			<div className="bg-gray-800 border-b border-gray-700">
				<div className="max-w-7xl mx-auto px-8 py-4">
					<nav className="flex items-center space-x-2 text-sm">
						<button
							onClick={() => navigate("/")}
							className="text-gray-400 hover:text-white transition-colors"
						>
							Home
						</button>
						<svg
							className="w-4 h-4 text-gray-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
						<button
							onClick={() => navigate("/events")}
							className="text-gray-400 hover:text-white transition-colors"
						>
							Events
						</button>
						<svg
							className="w-4 h-4 text-gray-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
						<span className="text-yellow-400 font-medium">
							{event.title}
						</span>
					</nav>
				</div>
			</div>

			{/* Hero Section */}
			<div className="relative h-96 overflow-hidden">
				<img
					src={event.image.url}
					alt={event.title}
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-black/60 flex items-center">
					<div className="max-w-7xl mx-auto px-8 w-full">
						<button
							onClick={() => navigate("/events")}
							className="mb-6 flex items-center text-gray-300 hover:text-white transition-colors"
						>
							<svg
								className="w-5 h-5 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
							Back to Events
						</button>

						<div className="flex items-start justify-between">
							<div>
								<div className="flex items-center gap-4 mb-4">
									<span className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-semibold">
										{event.category}
									</span>
									{event.importance === "high" && (
										<span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
											Featured Event
										</span>
									)}
								</div>

								<h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
									{event.title}
								</h1>

								<div className="flex items-center gap-6 text-gray-200 text-lg">
									<div className="flex items-center gap-2">
										<svg
											className="w-5 h-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
										<span>
											{formatEventDate(event.eventDate)}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<svg
											className="w-5 h-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
										<span>{event.location}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Content Section */}
			<div className="max-w-7xl mx-auto px-8 py-16">
				{/* Call to Action - Apply Button */}
				{isEventUpcoming(event.eventDate) && (
					<div className="mb-16 text-center">
						<div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/20">
							<h3 className="text-2xl font-bold text-white mb-4">
								Interested in This Event?
							</h3>
							<p className="text-gray-300 mb-6 text-lg max-w-2xl mx-auto">
								Apply now to participate in {event.title} and be
								part of this spectacular event experience.
							</p>
							<button
								onClick={handleApplyForEvent}
								className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-400 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 mx-auto"
							>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
									/>
								</svg>
								Apply for Event
							</button>
						</div>
					</div>
				)}

				{/* Event Description */}
				<div className="mb-16">
					<h2 className="text-3xl font-bold text-white mb-6">
						About This Event
					</h2>
					<p className="text-gray-300 text-lg leading-relaxed max-w-4xl">
						{event.description}
					</p>
				</div>

				{/* Photo Gallery */}
				<div>
					<h2 className="text-3xl font-bold text-white mb-8">
						Event Gallery
					</h2>

					{event.gallery && event.gallery.length > 0 ? (
						<>
							{/* Gallery Stats */}
							<div className="mb-6 text-gray-400">
								<p>
									{event.gallery.length + 1} photos from this
									event
								</p>
							</div>

							{/* Main Gallery Grid */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{/* Main Event Image - Takes up 2x2 grid on larger screens */}
								<div className="col-span-2 row-span-2">
									<img
										src={event.image.url}
										alt={event.title}
										className="w-full h-full object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
										onClick={() =>
											handleGalleryImageClick(
												event.image.url
											)
										}
									/>
								</div>

								{/* Gallery Images */}
								{event.gallery
									.slice(0, 6)
									.map((image, index) => (
										<div
											key={index}
											className="group relative cursor-pointer h-32 md:h-40 overflow-hidden rounded-xl"
											onClick={() =>
												handleGalleryImageClick(
													image.url
												)
											}
										>
											<img
												src={image.url}
												alt={`${
													event.title
												} - Gallery ${index + 1}`}
												className="w-full h-full object-cover hover:opacity-90 transition-all duration-300 group-hover:scale-105 shadow-lg"
											/>
											<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
										</div>
									))}

								{/* Show more indicator if there are more than 6 images */}
								{event.gallery && event.gallery.length > 6 && (
									<div
										className="bg-gray-800 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors"
										onClick={() =>
											handleGalleryImageClick(
												event.gallery![6].url
											)
										}
									>
										<div className="text-center text-white">
											<div className="text-2xl font-bold">
												+{event.gallery.length - 6}
											</div>
											<div className="text-sm">More</div>
										</div>
									</div>
								)}
							</div>
						</>
					) : (
						<div className="text-center py-16 bg-gray-800 rounded-xl">
							<div className="text-gray-400 mb-4">
								<svg
									className="w-16 h-16 mx-auto mb-4 opacity-50"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1}
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-300 mb-2">
								More Photos Coming Soon
							</h3>
							<p className="text-gray-400">
								We're working on adding more gallery images for
								this event.
							</p>
						</div>
					)}
				</div>

				{/* Related Events */}
				{relatedEvents.length > 0 && (
					<div className="mt-20">
						<h2 className="text-3xl font-bold text-white mb-8">
							More {event.category} Events
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{relatedEvents.map((relatedEvent) => (
								<div
									key={relatedEvent._id}
									className="group relative overflow-hidden rounded-xl cursor-pointer transition-transform duration-300 hover:scale-105"
									onClick={() =>
										navigate(`/events/${relatedEvent._id}`)
									}
								>
									<img
										src={relatedEvent.image.url}
										alt={relatedEvent.title}
										className="w-full h-48 object-cover"
									/>
									<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
										<div className="p-4 w-full">
											<h3 className="text-white font-bold text-lg mb-1">
												{relatedEvent.title}
											</h3>
											<p className="text-gray-300 text-sm">
												{formatEventDate(
													relatedEvent.eventDate
												)}{" "}
												• {relatedEvent.location}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Call to Action */}
				<div className="mt-20 text-center bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-12">
					<h3 className="text-3xl font-bold text-white mb-4">
						{isEventUpcoming(event.eventDate)
							? "Need More Information?"
							: "Event Details"}
					</h3>
					<p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
						{isEventUpcoming(event.eventDate)
							? `Have questions about ${event.title}? Book a consultation to learn more or explore other exciting events.`
							: `This event took place on ${formatEventDate(
									event.eventDate
							  )}. Explore more upcoming events or book a consultation for your next event.`}
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button
							onClick={() => navigate("/contact")}
							className="border-2 border-green-400 text-green-400 px-8 py-4 rounded-lg font-semibold hover:bg-green-400 hover:text-black transition-all transform hover:scale-105"
						>
							Book Consultation
						</button>
						<button
							onClick={() => navigate("/events")}
							className="border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 hover:text-black transition-all transform hover:scale-105"
						>
							View More Events
						</button>
					</div>
				</div>
			</div>

			{/* Gallery Image Modal */}
			{selectedGalleryImage && (
				<div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="relative max-w-7xl max-h-[90vh]">
						<img
							src={selectedGalleryImage}
							alt="Gallery Image"
							className="max-w-full max-h-full object-contain rounded-lg"
						/>
						<button
							onClick={handleCloseGalleryModal}
							className="absolute top-4 right-4 bg-black/50 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold hover:bg-black/70 transition-colors"
						>
							×
						</button>

						{/* Navigation hints */}
						<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
							Click image to close
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default EventDetail;
