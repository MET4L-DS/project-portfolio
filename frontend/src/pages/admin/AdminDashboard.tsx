import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { eventsAPI } from "../../services/api";
import MagazineManagement from "./MagazineManagement";

interface Event {
	_id: string;
	title: string;
	category: string;
	year: string;
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

const AdminDashboard: React.FC = () => {
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [activeTab, setActiveTab] = useState<"events" | "magazines">(
		"events"
	);
	const [filter, setFilter] = useState({
		category: "All",
		importance: "",
	});

	const { user, logout } = useAuth();

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
		"Beauty Pageant",
		"Cultural Festival",
		"Fashion Show",
		"City Festival",
		"Cultural Event",
		"Talent Hunt",
	];

	return (
		<div className="min-h-screen bg-gray-900">
			{/* Header */}
			<div className="bg-gray-800 shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-6">
						<div>
							<h1 className="text-3xl font-bold text-white">
								Content Management System
							</h1>
							<p className="text-gray-400">
								Welcome, {user?.username}
							</p>
						</div>
						<div className="flex space-x-4">
							{activeTab === "events" ? (
								<Link
									to="/admin/events/new"
									className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
								>
									Add New Event
								</Link>
							) : null}
							<button
								onClick={logout}
								className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
							>
								Logout
							</button>
						</div>
					</div>

					{/* Tab Navigation */}
					<div className="border-b border-gray-700">
						<nav className="-mb-px flex space-x-8">
							<button
								onClick={() => setActiveTab("events")}
								className={`py-2 px-1 border-b-2 font-medium text-sm ${
									activeTab === "events"
										? "border-yellow-400 text-yellow-400"
										: "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
								}`}
							>
								Events Management
							</button>
							<button
								onClick={() => setActiveTab("magazines")}
								className={`py-2 px-1 border-b-2 font-medium text-sm ${
									activeTab === "magazines"
										? "border-yellow-400 text-yellow-400"
										: "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
								}`}
							>
								Magazine Management
							</button>
						</nav>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{activeTab === "events" ? (
					<>
						{/* Filters */}
						<div className="mb-8 flex flex-wrap gap-4">
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
									className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
									className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
								>
									<option value="">All</option>
									<option value="high">High</option>
									<option value="low">Low</option>
								</select>
							</div>
						</div>

						{/* Error Message */}
						{error && (
							<div className="mb-6 bg-red-900/50 border border-red-600 rounded-lg p-4">
								<p className="text-red-300">{error}</p>
							</div>
						)}

						{/* Events Grid */}
						{loading ? (
							<div className="text-center py-12">
								<div className="text-gray-400">
									Loading events...
								</div>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{events.map((event) => (
									<div
										key={event._id}
										className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg border-2 ${
											event.isActive
												? "border-green-600"
												: "border-red-600"
										}`}
									>
										<div className="relative">
											<img
												src={event.image.url}
												alt={event.title}
												className="w-full h-48 object-cover"
											/>
											<div className="absolute top-2 right-2 flex gap-2">
												<span
													className={`px-2 py-1 text-xs font-semibold rounded ${
														event.importance ===
														"high"
															? "bg-red-600 text-white"
															: "bg-gray-600 text-gray-300"
													}`}
												>
													{event.importance}
												</span>
												<span
													className={`px-2 py-1 text-xs font-semibold rounded ${
														event.isActive
															? "bg-green-600 text-white"
															: "bg-red-600 text-white"
													}`}
												>
													{event.isActive
														? "Active"
														: "Inactive"}
												</span>
											</div>
										</div>
										<div className="p-4">
											<div className="flex justify-between items-start mb-2">
												<span className="bg-yellow-400 text-black px-2 py-1 rounded text-sm font-semibold">
													{event.category}
												</span>
											</div>
											<h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
												{event.title}
											</h3>
											<p className="text-gray-400 text-sm mb-2">
												{event.year} • {event.location}
											</p>
											<p className="text-gray-300 text-sm mb-4 line-clamp-3">
												{event.description}
											</p>
											<div className="flex justify-between items-center">
												<div className="flex space-x-2">
													<Link
														to={`/admin/events/${event._id}/edit`}
														className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
													>
														Edit
													</Link>
													<button
														onClick={() =>
															handleToggleActive(
																event
															)
														}
														className={`px-3 py-1 rounded text-sm transition-colors ${
															event.isActive
																? "bg-orange-600 text-white hover:bg-orange-700"
																: "bg-green-600 text-white hover:bg-green-700"
														}`}
													>
														{event.isActive
															? "Deactivate"
															: "Activate"}
													</button>
												</div>
												<button
													onClick={() =>
														handleDelete(event._id)
													}
													className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
												>
													Delete
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						)}

						{events.length === 0 && !loading && (
							<div className="text-center py-12">
								<p className="text-gray-400 text-lg">
									No events found
								</p>
								<Link
									to="/admin/events/new"
									className="inline-block mt-4 bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
								>
									Create Your First Event
								</Link>
							</div>
						)}
					</>
				) : (
					<MagazineManagement />
				)}
			</div>
		</div>
	);
};

export default AdminDashboard;
