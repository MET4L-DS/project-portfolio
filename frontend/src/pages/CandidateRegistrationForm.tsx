import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { eventsAPI } from "../services/api";
import CandidateRegistration from "../components/CandidateRegistration";
import { CandidateRegistrationSuccess } from "../components/CandidateRegistrationSuccess";

interface Event {
	_id: string;
	title: string;
	category: string;
	eventDate: string;
	location: string;
	image: {
		url: string;
		publicId: string;
	};
	description: string;
	importance: string;
	isActive: boolean;
}

const CandidateRegistrationForm: React.FC = () => {
	const { eventId } = useParams<{ eventId: string }>();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const [event, setEvent] = useState<Event | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [showRegistrationSuccess, setShowRegistrationSuccess] =
		useState(false);
	const [registrationFormNo, setRegistrationFormNo] = useState<string | null>(
		null
	);

	// Get event name from URL params if available
	const eventNameFromParams = searchParams.get("eventName");

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

	useEffect(() => {
		if (eventId) {
			fetchEvent(eventId);
		}
	}, [eventId]);

	const fetchEvent = async (id: string) => {
		try {
			setLoading(true);
			const response = await eventsAPI.getEvent(id);
			setEvent(response);
		} catch (err) {
			setError("Failed to load event details");
			console.error("Fetch event error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleRegistrationSuccess = (formNo: string) => {
		setRegistrationFormNo(formNo);
		setShowRegistrationSuccess(true);
	};

	const handleCloseSuccess = () => {
		setShowRegistrationSuccess(false);
		setRegistrationFormNo(null);
		navigate("/events");
	};

	const handleGoBack = () => {
		navigate(-1);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
				{/* Animated Background Elements */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
					<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/15 to-pink-600/15 rounded-full blur-3xl animate-pulse delay-500"></div>
				</div>

				<div className="relative z-10 flex items-center justify-center min-h-screen">
					<div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 text-center">
						<div className="animate-spin w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
						<div className="text-white text-xl">
							Loading event details...
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error || !event) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
				{/* Animated Background Elements */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
					<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/15 to-pink-600/15 rounded-full blur-3xl animate-pulse delay-500"></div>
				</div>

				<div className="relative z-10 flex items-center justify-center min-h-screen">
					<div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 text-center max-w-md w-full mx-4">
						<div className="text-red-400 text-xl mb-4">
							{error || "Event not found"}
						</div>
						<div className="space-y-4">
							<button
								onClick={handleGoBack}
								className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-6 py-3 rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-300 transition-all duration-300"
							>
								Go Back
							</button>
							<button
								onClick={() => navigate("/events")}
								className="w-full border-2 border-yellow-400 text-yellow-400 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-300"
							>
								View All Events
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Check if event registration is still open
	if (!isEventUpcoming(event.eventDate)) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
				{/* Animated Background Elements */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
					<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/15 to-pink-600/15 rounded-full blur-3xl animate-pulse delay-500"></div>
				</div>

				<div className="relative z-10 flex items-center justify-center min-h-screen">
					<div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 text-center max-w-md w-full mx-4">
						<div className="mb-6">
							<div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-400/30">
								<svg
									className="w-8 h-8 text-orange-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
									/>
								</svg>
							</div>
							<h2 className="text-2xl font-bold text-white mb-2">
								Registration Closed
							</h2>
							<p className="text-gray-300 mb-4">
								Registration for <strong>{event.title}</strong>{" "}
								is no longer available.
							</p>
							<p className="text-gray-400 text-sm">
								This event took place on{" "}
								{formatEventDate(event.eventDate)}.
							</p>
						</div>
						<div className="space-y-4">
							<button
								onClick={() => navigate(`/events/${event._id}`)}
								className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-6 py-3 rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-300 transition-all duration-300"
							>
								View Event Details
							</button>
							<button
								onClick={() => navigate("/events")}
								className="w-full border-2 border-yellow-400 text-yellow-400 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-300"
							>
								View Upcoming Events
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
			{/* Animated Background Elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/15 to-pink-600/15 rounded-full blur-3xl animate-pulse delay-500"></div>
				<div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-teal-600/10 rounded-full blur-2xl animate-pulse delay-700"></div>
				<div className="absolute bottom-20 right-1/4 w-72 h-72 bg-gradient-to-br from-rose-400/10 to-pink-600/10 rounded-full blur-2xl animate-pulse delay-300"></div>
			</div>

			{/* Header */}
			<div className="relative z-10 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-2xl">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button
								onClick={handleGoBack}
								className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
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
										d="M15 19l-7-7 7-7"
									/>
								</svg>
								<span>Back</span>
							</button>
							<div className="w-px h-6 bg-white/20"></div>
							<h1 className="text-2xl font-bold bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
								Event Registration
							</h1>
						</div>
						<div className="text-right">
							<p className="text-white/80 text-sm">
								Registering for
							</p>
							<p className="text-white font-semibold">
								{event.title}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Event Info Banner */}
			<div className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center gap-6">
						<img
							src={event.image.url}
							alt={event.title}
							className="w-20 h-20 rounded-xl object-cover border-2 border-white/20"
						/>
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-2">
								<span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
									{event.category}
								</span>
								{event.importance === "high" && (
									<span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
										Featured Event
									</span>
								)}
							</div>
							<h2 className="text-xl font-bold text-white mb-1">
								{event.title}
							</h2>
							<div className="flex items-center gap-4 text-gray-300 text-sm">
								<div className="flex items-center gap-1">
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
									<span>
										{formatEventDate(event.eventDate)}
									</span>
								</div>
								<div className="flex items-center gap-1">
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
									<span>{event.location}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Registration Form */}
			<div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{!showRegistrationSuccess ? (
					<CandidateRegistration
						eventId={eventId!}
						eventName={eventNameFromParams || event.title}
						onClose={() => navigate(-1)}
						onSuccess={handleRegistrationSuccess}
					/>
				) : (
					<CandidateRegistrationSuccess
						formNo={registrationFormNo!}
						onClose={handleCloseSuccess}
					/>
				)}
			</div>
		</div>
	);
};

export default CandidateRegistrationForm;
