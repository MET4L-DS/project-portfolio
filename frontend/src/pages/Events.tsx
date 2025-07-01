import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { eventsAPI } from "../services/api";

interface Event {
	_id: string;
	title: string;
	category: string;
	year: string;
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

	const categories = [
		"All",
		"Beauty Pageant",
		"Cultural Festival",
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

	// Sort events by importance and year
	const sortedEvents = [...events].sort((a, b) => {
		if (a.importance !== b.importance) {
			return a.importance === "high" ? -1 : 1;
		}
		return b.year.localeCompare(a.year);
	});

	return (
		<div className="min-h-screen bg-gray-900 py-20">
			<div className="max-w-7xl mx-auto px-8">
				{/* Header */}
				<div className="text-center mb-16">
					<h1 className="text-5xl font-bold text-white mb-4">
						My{" "}
						<span className="text-yellow-400 font-bold">
							Event Portfolio
						</span>
					</h1>
					<p className="text-xl text-gray-300 max-w-3xl mx-auto">
						From beauty pageants to cultural festivals, witness the
						spectacular events that have shaped Northeast India's
						entertainment landscape
					</p>
				</div>
				{/* Error Message */}
				{error && (
					<div className="mb-6 bg-red-900/50 border border-red-600 rounded-lg p-4">
						<p className="text-red-300">{error}</p>
					</div>
				)}
				{/* Category Filter */}
				<div className="flex justify-center mb-12">
					<div className="flex flex-wrap gap-2 justify-center">
						{categories.map((category) => (
							<button
								key={category}
								onClick={() => setActiveCategory(category)}
								className={`px-4 py-2 rounded-full border-2 border-yellow-400 font-semibold transition-all text-sm ${
									activeCategory === category
										? "bg-yellow-400 text-black"
										: "text-yellow-400 hover:bg-yellow-400 hover:text-black"
								}`}
							>
								{category}
							</button>
						))}
					</div>
				</div>{" "}
				{/* Loading State */}
				{loading ? (
					<div className="text-center py-12">
						<div className="text-gray-400 text-lg">
							Loading events...
						</div>
					</div>
				) : (
					<>
						{/* Photo Gallery */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
							{sortedEvents.map((event) => (
								<div
									key={event._id}
									className="group relative overflow-hidden rounded-2xl transition-transform duration-300 hover:scale-105 cursor-pointer"
									onClick={() => handleEventClick(event)}
								>
									<img
										src={event.image.url}
										alt={event.title}
										className="w-full h-full p-2 object-cover rounded-2xl"
									/>
									<div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
									<div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
										<div className="relative z-10">
											<div className="flex justify-between items-start mb-2">
												<span className="inline-block bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
													{event.category}
												</span>
												{event.importance ===
													"high" && (
													<span className="inline-block bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
														Featured
													</span>
												)}
											</div>
											<h3 className="text-xl font-bold mb-1 text-white drop-shadow-lg">
												{event.title}
											</h3>
											<div className="text-sm text-gray-200 mb-2 drop-shadow-md">
												{event.year} • {event.location}
											</div>
											<p className="text-gray-100 text-sm drop-shadow-md mb-3">
												{event.description}
											</p>
											<div className="flex items-center text-yellow-400 text-sm font-semibold">
												<span>
													View Details & Gallery
												</span>
												<svg
													className="w-4 h-4 ml-2"
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
		</div>
	);
}

export default Events;
