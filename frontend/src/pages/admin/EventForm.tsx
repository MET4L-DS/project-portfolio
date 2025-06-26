import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eventsAPI } from "../../services/api";

interface Event {
	_id?: string;
	title: string;
	category: string;
	year: string;
	location: string;
	description: string;
	importance: string;
	image?: {
		url: string;
		publicId: string;
	};
	isActive: boolean;
}

const EventForm: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isEditing = !!id;

	const [event, setEvent] = useState<Event>({
		title: "",
		category: "Beauty Pageant",
		year: new Date().getFullYear().toString(),
		location: "",
		description: "",
		importance: "low",
		isActive: true,
	});

	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const categories = [
		"Beauty Pageant",
		"Cultural Festival",
		"Fashion Show",
		"City Festival",
		"Cultural Event",
		"Talent Hunt",
	];

	useEffect(() => {
		if (isEditing && id) {
			fetchEvent(id);
		}
	}, [id, isEditing]);

	const fetchEvent = async (eventId: string) => {
		try {
			setLoading(true);
			const response = await eventsAPI.getEvent(eventId);
			setEvent(response);
			setImagePreview(response.image?.url || "");
		} catch (err) {
			setError("Failed to fetch event details");
			console.error("Fetch event error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value, type } = e.target;

		if (type === "checkbox") {
			const target = e.target as HTMLInputElement;
			setEvent({ ...event, [name]: target.checked });
		} else {
			setEvent({ ...event, [name]: value });
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);

			// Create preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const formData = new FormData();
			formData.append("title", event.title);
			formData.append("category", event.category);
			formData.append("year", event.year);
			formData.append("location", event.location);
			formData.append("description", event.description);
			formData.append("importance", event.importance);
			formData.append("isActive", String(event.isActive));

			if (imageFile) {
				formData.append("image", imageFile);
			}

			if (isEditing && id) {
				await eventsAPI.updateEvent(id, formData);
			} else {
				await eventsAPI.createEvent(formData);
			}

			navigate("/admin/dashboard");
		} catch (err: any) {
			console.error("Save event error:", err);

			// Handle different types of errors
			if (err.response?.data?.error) {
				setError(err.response.data.error);
				if (err.response.data.details) {
					setError((prev) => `${prev}: ${err.response.data.details}`);
				}
			} else if (err.message) {
				setError(err.message);
			} else {
				setError("Failed to save event");
			}
		} finally {
			setLoading(false);
		}
	};

	if (loading && isEditing) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center">
				<div className="text-white">Loading event details...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-900 py-8">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white">
						{isEditing ? "Edit Event" : "Create New Event"}
					</h1>
					<p className="text-gray-400 mt-2">
						{isEditing
							? "Update event details"
							: "Add a new event to the portfolio"}
					</p>
				</div>

				{/* Error Message */}
				{error && (
					<div className="mb-6 bg-red-900/50 border border-red-600 rounded-lg p-4">
						<p className="text-red-300">{error}</p>
					</div>
				)}

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="bg-gray-800 rounded-lg p-6">
						<h2 className="text-xl font-semibold text-white mb-4">
							Event Details
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Title */}
							<div className="md:col-span-2">
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Title *
								</label>
								<input
									type="text"
									name="title"
									value={event.title}
									onChange={handleInputChange}
									required
									className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
									placeholder="Event title"
								/>
							</div>

							{/* Category */}
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Category *
								</label>
								<select
									name="category"
									value={event.category}
									onChange={handleInputChange}
									required
									className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
								>
									{categories.map((category) => (
										<option key={category} value={category}>
											{category}
										</option>
									))}
								</select>
							</div>

							{/* Year */}
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Year *
								</label>
								<input
									type="text"
									name="year"
									value={event.year}
									onChange={handleInputChange}
									required
									className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
									placeholder="e.g., 2024 or Jan 2024"
								/>
							</div>

							{/* Location */}
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Location *
								</label>
								<input
									type="text"
									name="location"
									value={event.location}
									onChange={handleInputChange}
									required
									className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
									placeholder="Event location"
								/>
							</div>

							{/* Importance */}
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Importance
								</label>
								<select
									name="importance"
									value={event.importance}
									onChange={handleInputChange}
									className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
								>
									<option value="low">Low</option>
									<option value="high">High</option>
								</select>
							</div>

							{/* Description */}
							<div className="md:col-span-2">
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Description *
								</label>
								<textarea
									name="description"
									value={event.description}
									onChange={handleInputChange}
									required
									rows={4}
									className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
									placeholder="Event description"
								/>
							</div>

							{/* Active Status */}
							<div className="md:col-span-2">
								<label className="flex items-center">
									<input
										type="checkbox"
										name="isActive"
										checked={event.isActive}
										onChange={handleInputChange}
										className="sr-only"
									/>
									<div
										className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
											event.isActive
												? "bg-yellow-400"
												: "bg-gray-600"
										}`}
									>
										<span
											className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
												event.isActive
													? "translate-x-6"
													: "translate-x-1"
											}`}
										/>
									</div>
									<span className="ml-3 text-sm font-medium text-gray-300">
										Active (visible on website)
									</span>
								</label>
							</div>
						</div>
					</div>

					{/* Image Upload */}
					<div className="bg-gray-800 rounded-lg p-6">
						<h2 className="text-xl font-semibold text-white mb-4">
							Event Image
						</h2>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Upload Image {!isEditing && "*"}
								</label>
								<input
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									required={!isEditing}
									className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-400 file:text-black hover:file:bg-yellow-300"
								/>
							</div>

							{/* Image Preview */}
							{imagePreview && (
								<div>
									<p className="text-sm font-medium text-gray-300 mb-2">
										Preview:
									</p>
									<img
										src={imagePreview}
										alt="Preview"
										className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-600"
									/>
								</div>
							)}
						</div>
					</div>

					{/* Actions */}
					<div className="flex justify-between">
						<button
							type="button"
							onClick={() => navigate("/admin/dashboard")}
							className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{loading
								? "Saving..."
								: isEditing
								? "Update Event"
								: "Create Event"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EventForm;
