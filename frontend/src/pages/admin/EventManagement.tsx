import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { eventsAPI } from "../../services/api";

interface Event {
	_id: string;
	title: string;
	category: string;
	eventDate: string;
	year?: string; // Keep for backward compatibility
	location: string;
	description: string;
	importance: string;
	image: {
		url: string;
		publicId: string;
	};
	isActive: boolean;
	createdAt: string;
}

const EventManagement: React.FC = () => {
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [filter, setFilter] = useState({
		category: "All",
		importance: "",
	});

	// Helper function to format date
	const formatEventDate = (eventDate: string) => {
		const date = new Date(eventDate);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	useEffect(() => {
		fetchEvents();
	}, [filter]);

	const fetchEvents = async () => {
		try {
			setLoading(true);
			const params = {
				...(filter.category !== "All" && { category: filter.category }),
				...(filter.importance && { importance: filter.importance }),
			};
			const response = await eventsAPI.getAdminEvents(params);
			setEvents(response.events);
		} catch (err) {
			setError("Failed to fetch events");
			console.error("Fetch events error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm("Are you sure you want to delete this event?")) {
			return;
		}

		try {
			await eventsAPI.deleteEvent(id);
			setEvents(events.filter((event) => event._id !== id));
		} catch (err) {
			setError("Failed to delete event");
			console.error("Delete event error:", err);
		}
	};

	const handleToggleActive = async (event: Event) => {
		try {
			const formData = new FormData();
			formData.append("isActive", String(!event.isActive));

			await eventsAPI.updateEvent(event._id, formData);
			setEvents(
				events.map((e) =>
					e._id === event._id ? { ...e, isActive: !e.isActive } : e
				)
			);
		} catch (err) {
			setError("Failed to update event status");
			console.error("Toggle active error:", err);
		}
	};

	const categories = [
		"All",
		"Fashion Show",
		"City Festival",
		"Cultural Event",
		"Talent Hunt",
	];

	// Calculate statistics
	const stats = {
		total: events.length,
		active: events.filter((e) => e.isActive).length,
		inactive: events.filter((e) => !e.isActive).length,
		highPriority: events.filter((e) => e.importance === "high").length,
	};

	return (
		<div className="space-y-6">
			{/* Header Section */}
			<div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-lg rounded-xl p-6 border border-yellow-400/30">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
					<div>
						<h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
							Event Management
						</h3>
						<p className="text-gray-300 text-sm sm:text-base">
							Manage your events, track performance, and create
							memorable experiences
						</p>
					</div>
					<Link
						to="/admin/events/new"
						className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-6 py-3 rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 text-center"
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
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						Add New Event
					</Link>
				</div>
			</div>

			{/* Filters */}
			<div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
				<h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
					<svg
						className="w-5 h-5 text-yellow-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
						/>
					</svg>
					Filter Events
				</h4>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Category
						</label>
						<select
							value={filter.category}
							onChange={(e) =>
								setFilter({
									...filter,
									category: e.target.value,
								})
							}
							className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
						>
							{categories.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Importance
						</label>
						<select
							value={filter.importance}
							onChange={(e) =>
								setFilter({
									...filter,
									importance: e.target.value,
								})
							}
							className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
						>
							<option value="">All</option>
							<option value="high">High</option>
							<option value="low">Low</option>
						</select>
					</div>
				</div>
			</div>

			{/* Statistics */}
			{!loading && events.length > 0 && (
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
					<div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 backdrop-blur-lg rounded-xl p-4 border border-blue-500/30">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
								<svg
									className="w-5 h-5 text-blue-400"
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
							</div>
							<div>
								<p className="text-2xl font-bold text-white">
									{stats.total}
								</p>
								<p className="text-blue-300 text-sm font-medium">
									Total Events
								</p>
							</div>
						</div>
					</div>
					<div className="bg-gradient-to-br from-green-600/20 to-green-700/20 backdrop-blur-lg rounded-xl p-4 border border-green-500/30">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
								<svg
									className="w-5 h-5 text-green-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<div>
								<p className="text-2xl font-bold text-white">
									{stats.active}
								</p>
								<p className="text-green-300 text-sm font-medium">
									Active Events
								</p>
							</div>
						</div>
					</div>
					<div className="bg-gradient-to-br from-red-600/20 to-red-700/20 backdrop-blur-lg rounded-xl p-4 border border-red-500/30">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
								<svg
									className="w-5 h-5 text-red-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
									/>
								</svg>
							</div>
							<div>
								<p className="text-2xl font-bold text-white">
									{stats.inactive}
								</p>
								<p className="text-red-300 text-sm font-medium">
									Inactive Events
								</p>
							</div>
						</div>
					</div>
					<div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-lg rounded-xl p-4 border border-yellow-500/30">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
								<svg
									className="w-5 h-5 text-yellow-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
									/>
								</svg>
							</div>
							<div>
								<p className="text-2xl font-bold text-white">
									{stats.highPriority}
								</p>
								<p className="text-yellow-300 text-sm font-medium">
									High Priority
								</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Error Message */}
			{error && (
				<div className="bg-red-900/50 border border-red-500 rounded-xl p-4 backdrop-blur-lg">
					<div className="flex items-center gap-3">
						<svg
							className="w-5 h-5 text-red-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<p className="text-red-300 font-medium">{error}</p>
					</div>
				</div>
			)}

			{/* Events Grid */}
			{loading ? (
				<div className="text-center py-16">
					<div className="inline-flex items-center gap-4">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
						<span className="text-gray-300 text-lg">
							Loading events...
						</span>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{events.map((event) => (
						<div
							key={event._id}
							className={`bg-gray-800/50 backdrop-blur-lg rounded-xl overflow-hidden shadow-xl border-2 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl ${
								event.isActive
									? "border-green-500/50 hover:border-green-400"
									: "border-red-500/50 hover:border-red-400"
							}`}
						>
							<div className="relative group">
								<img
									src={event.image.url}
									alt={event.title}
									className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
								<div className="absolute top-3 right-3 flex flex-col gap-2">
									<span
										className={`px-3 py-1 text-xs font-bold rounded-full backdrop-blur-lg ${
											event.importance === "high"
												? "bg-red-500/80 text-white"
												: "bg-gray-600/80 text-gray-200"
										}`}
									>
										{event.importance.toUpperCase()}
									</span>
									<span
										className={`px-3 py-1 text-xs font-bold rounded-full backdrop-blur-lg ${
											event.isActive
												? "bg-green-500/80 text-white"
												: "bg-red-500/80 text-white"
										}`}
									>
										{event.isActive ? "ACTIVE" : "INACTIVE"}
									</span>
								</div>
								<div className="absolute bottom-3 left-3">
									<span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
										{event.category}
									</span>
								</div>
							</div>
							<div className="p-5">
								<h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-yellow-400 transition-colors">
									{event.title}
								</h3>
								<div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
									<svg
										className="w-4 h-4"
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
									{formatEventDate(event.eventDate)}
								</div>
								<div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
									<svg
										className="w-4 h-4"
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
									{event.location}
								</div>
								<p className="text-gray-300 text-sm mb-6 line-clamp-3">
									{event.description}
								</p>
								<div className="flex flex-col gap-3">
									<div className="flex gap-2">
										<Link
											to={`/admin/events/${event._id}/edit`}
											className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center flex items-center justify-center gap-2"
										>
											<svg
												className="w-4 h-4"
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
											Edit
										</Link>
										<button
											onClick={() =>
												handleToggleActive(event)
											}
											className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
												event.isActive
													? "bg-orange-600 text-white hover:bg-orange-700"
													: "bg-green-600 text-white hover:bg-green-700"
											}`}
										>
											{event.isActive ? (
												<svg
													className="w-4 h-4"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.697 6.697m3.181 3.181l-1.06-1.06M15.121 14.121L12 17.243m3.121-3.122l1.879 1.879M15.121 14.121l1.06 1.06"
													/>
												</svg>
											) : (
												<svg
													className="w-4 h-4"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
													/>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
													/>
												</svg>
											)}
											{event.isActive ? "Hide" : "Show"}
										</button>
									</div>
									<button
										onClick={() => handleDelete(event._id)}
										className="w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
									>
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
										Delete Event
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{events.length === 0 && !loading && (
				<div className="text-center py-16">
					<div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 max-w-md mx-auto border border-gray-700">
						<div className="w-20 h-20 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
							<svg
								className="w-10 h-10 text-yellow-400"
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
						</div>
						<h3 className="text-xl font-bold text-white mb-3">
							No Events Found
						</h3>
						<p className="text-gray-400 text-base mb-6">
							Start creating amazing events to showcase your work
							and engage with your audience.
						</p>
						<Link
							to="/admin/events/new"
							className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-6 py-3 rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 transform hover:scale-105"
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
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
							Create Your First Event
						</Link>
					</div>
				</div>
			)}
		</div>
	);
};

export default EventManagement;
