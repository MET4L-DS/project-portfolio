import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { eventsAPI } from "../services/api";
import CandidateRegistration from "../components/CandidateRegistration";
import { CandidateRegistrationSuccess } from "../components/CandidateRegistrationSuccess";

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

function Events() {
	const navigate = useNavigate();
	const [activeCategory, setActiveCategory] = useState("All");
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [selectedEventForRegistration, setSelectedEventForRegistration] =
		useState<Event | null>(null);
	const [showCandidateRegistration, setShowCandidateRegistration] =
		useState(false);
	const [showRegistrationSuccess, setShowRegistrationSuccess] =
		useState(false);
	const [registrationFormNo, setRegistrationFormNo] = useState<string | null>(
		null
	);

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
		return new Date(eventDate) > new Date();
	};

	const categories = [
		"All",
		"Fashion Show",
		"City Festival",
		"Cultural Event",
		"Talent Hunt",
	];

	useEffect(() => {
		fetchEvents();
	}, [activeCategory]);

	const fetchEvents = async () => {
		try {
			setLoading(true);
			const params =
				activeCategory !== "All" ? { category: activeCategory } : {};
			const response = await eventsAPI.getEvents(params);
			setEvents(response.events);
		} catch (err) {
			setError("Failed to load events");
			console.error("Fetch events error:", err);
			// Fallback to static data if API fails
			setEvents([]);
		} finally {
			setLoading(false);
		}
	};

	const handleEventClick = (event: Event) => {
		navigate(`/events/${event._id}`);
	};

	const handleApplyForEvent = (event: Event, e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent navigation to event detail
		setSelectedEventForRegistration(event);
		setShowCandidateRegistration(true);
	};

	const handleCloseRegistration = () => {
		setShowCandidateRegistration(false);
		setSelectedEventForRegistration(null);
	};

	const handleRegistrationSuccess = (formNo: string) => {
		setRegistrationFormNo(formNo);
		setShowCandidateRegistration(false);
		setShowRegistrationSuccess(true);
	};

	const handleCloseSuccess = () => {
		setShowRegistrationSuccess(false);
		setRegistrationFormNo(null);
		setSelectedEventForRegistration(null);
	};

	// Sort events by importance and date
	const sortedEvents = [...events].sort((a, b) => {
		if (a.importance !== b.importance) {
			return a.importance === "high" ? -1 : 1;
		}
		// Sort by eventDate (newest first)
		const dateA = new Date(a.eventDate);
		const dateB = new Date(b.eventDate);
		return dateB.getTime() - dateA.getTime();
	});

	return (
		<div className="min-h-screen bg-gray-900 py-12 sm:py-16 lg:py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-12 sm:mb-16">
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
						My{" "}
						<span className="text-yellow-400 font-bold">
							Event Portfolio
						</span>
					</h1>
					<p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-4">
						From fashion shows to cultural events, witness the
						spectacular events that have shaped Northeast India's
						entertainment landscape
					</p>
				</div>
				{/* Error Message */}
				{error && (
					<div className="mb-4 sm:mb-6 bg-red-900/50 border border-red-600 rounded-lg p-3 sm:p-4 mx-4 sm:mx-0">
						<p className="text-red-300 text-sm sm:text-base">
							{error}
						</p>
					</div>
				)}
				{/* Category Filter */}
				<div className="flex justify-center mb-8 sm:mb-12">
					<div className="flex flex-wrap gap-2 justify-center px-4">
						{categories.map((category) => (
							<button
								key={category}
								onClick={() => setActiveCategory(category)}
								className={`px-3 sm:px-4 py-2 rounded-full border-2 border-yellow-400 font-semibold transition-all text-xs sm:text-sm ${
									activeCategory === category
										? "bg-yellow-400 text-black"
										: "text-yellow-400 hover:bg-yellow-400 hover:text-black"
								}`}
							>
								{category}
							</button>
						))}
					</div>
				</div>
				{/* Loading State */}
				{loading ? (
					<div className="text-center py-8 sm:py-12">
						<div className="text-gray-400 text-base sm:text-lg">
							Loading events...
						</div>
					</div>
				) : (
					<>
						{/* Photo Gallery */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 px-4 sm:px-0">
							{sortedEvents.map((event) => (
								<div
									key={event._id}
									className="group relative overflow-hidden rounded-2xl transition-transform duration-300 hover:scale-105 cursor-pointer"
									onClick={() => handleEventClick(event)}
								>
									<img
										src={event.image.url}
										alt={event.title}
										className="w-full h-48 sm:h-56 lg:h-64 p-2 object-cover rounded-2xl"
									/>
									<div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
									<div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
										<div className="relative z-10">
											<div className="flex justify-between items-start mb-2">
												<span className="inline-block bg-yellow-400 text-black px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
													{event.category}
												</span>
												{event.importance ===
													"high" && (
													<span className="inline-block bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
														Featured
													</span>
												)}
											</div>
											<h3 className="text-lg sm:text-xl font-bold mb-1 text-white drop-shadow-lg">
												{event.title}
											</h3>
											<div className="text-xs sm:text-sm text-gray-200 mb-2 drop-shadow-md">
												{formatEventDate(
													event.eventDate
												)}{" "}
												• {event.location}
											</div>
											<p className="text-gray-100 text-xs sm:text-sm drop-shadow-md mb-3">
												{event.description}
											</p>
											<div className="flex items-center justify-between">
												<div className="flex items-center text-yellow-400 text-xs sm:text-sm font-semibold">
													<span>
														View Details & Gallery
													</span>
													<svg
														className="w-3 h-3 sm:w-4 sm:h-4 ml-2"
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
												</div>
												{isEventUpcoming(
													event.eventDate
												) && (
													<button
														onClick={(e) =>
															handleApplyForEvent(
																event,
																e
															)
														}
														className="bg-green-500 hover:bg-green-400 text-white px-3 py-1 rounded-full text-xs font-semibold transition-colors shadow-lg"
													>
														Apply Now
													</button>
												)}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>

						{/* No Events Message */}
						{sortedEvents.length === 0 && (
							<div className="text-center py-12">
								<p className="text-gray-400 text-lg">
									No events found for this category
								</p>
							</div>
						)}
					</>
				)}
				{/* Call to Action */}
				<div className="text-center mt-16">
					<h3 className="text-3xl font-bold text-white mb-4">
						Ready to create your next big event?
					</h3>
					<p className="text-gray-300 mb-8 text-lg">
						Let's collaborate to bring your vision to life with
						Sankalp Entertainment
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button className="bg-gradient-to-r from-yellow-400 to-red-500 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg">
							Book Consultation
						</button>
						<a
							href="https://aamarxopun.com"
							target="_blank"
							rel="noopener noreferrer"
							className="border-2 border-green-400 text-green-400 px-8 py-4 rounded-lg font-semibold hover:bg-green-400 hover:text-black transition-all transform hover:scale-105"
						>
							Visit AAMAR XOPUN
						</a>
					</div>
				</div>
			</div>

			{/* Candidate Registration Modal */}
			{showCandidateRegistration && selectedEventForRegistration && (
				<CandidateRegistration
					eventId={selectedEventForRegistration._id}
					eventName={selectedEventForRegistration.title}
					onClose={handleCloseRegistration}
					onSuccess={handleRegistrationSuccess}
				/>
			)}

			{/* Registration Success Message */}
			{showRegistrationSuccess && registrationFormNo && (
				<CandidateRegistrationSuccess
					formNo={registrationFormNo}
					onClose={handleCloseSuccess}
				/>
			)}
		</div>
	);
}

export default Events;
