import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eventsAPI } from "../../services/api";

interface Event {
	_id?: string;
	title: string;
	category: string;
	eventDate: string;
	year?: string; // Keep for backward compatibility
	location: string;
	description: string;
	importance: string;
	image?: {
		url: string;
		publicId: string;
	};
	gallery?: {
		url: string;
		publicId: string;
	}[];
	isActive: boolean;
}

const EventForm: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isEditing = !!id;

	const [event, setEvent] = useState<Event>({
		title: "",
		category: "Fashion Show",
		eventDate: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD for input[type="date"]
		location: "",
		description: "",
		importance: "low",
		isActive: true,
	});

	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string>("");
	const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
	const [existingGallery, setExistingGallery] = useState<
		{ url: string; publicId: string }[]
	>([]);
	const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const categories = [
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

			// Convert eventDate to YYYY-MM-DD format for date input
			const eventDate = response.eventDate
				? new Date(response.eventDate).toISOString().split("T")[0]
				: new Date().toISOString().split("T")[0];

			setEvent({
				...response,
				eventDate,
			});
			setImagePreview(response.image?.url || "");
			// Load existing gallery images
			if (response.gallery) {
				setExistingGallery(response.gallery);
			}
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
			const maxSizeInMB = 5;
			const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // 5MB in bytes

			// Check file size
			if (file.size > maxSizeInBytes) {
				setError(
					`Main image size must be less than ${maxSizeInMB}MB. Your image is ${(
						file.size /
						(1024 * 1024)
					).toFixed(2)}MB.`
				);
				// Reset the file input
				e.target.value = "";
				return;
			}

			// Clear any previous errors
			setError("");
			setImageFile(file);

			// Create preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (files.length > 0) {
			const maxSizeInMB = 5;
			const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // 5MB in bytes

			// Check each file size
			const oversizedFiles = files.filter(
				(file) => file.size > maxSizeInBytes
			);
			if (oversizedFiles.length > 0) {
				const fileNames = oversizedFiles
					.map(
						(file) =>
							`${file.name} (${(
								file.size /
								(1024 * 1024)
							).toFixed(2)}MB)`
					)
					.join(", ");
				setError(
					`Gallery images must be less than ${maxSizeInMB}MB. These files are too large: ${fileNames}`
				);
				// Reset the file input
				e.target.value = "";
				return;
			}

			// Clear any previous errors
			setError("");
			setGalleryFiles((prev) => [...prev, ...files]);

			// Create previews for new files
			files.forEach((file) => {
				const reader = new FileReader();
				reader.onloadend = () => {
					setNewGalleryPreviews((prev) => [
						...prev,
						reader.result as string,
					]);
				};
				reader.readAsDataURL(file);
			});
		}
	};

	const removeExistingGalleryImage = (index: number) => {
		setExistingGallery((prev) => prev.filter((_, i) => i !== index));
	};

	const removeNewGalleryImage = (index: number) => {
		setNewGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
		setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const formData = new FormData();
			formData.append("title", event.title);
			formData.append("category", event.category);
			formData.append("eventDate", event.eventDate);
			formData.append("location", event.location);
			formData.append("description", event.description);
			formData.append("importance", event.importance);
			formData.append("isActive", String(event.isActive));

			if (imageFile) {
				formData.append("image", imageFile);
			}

			// Add new gallery files
			galleryFiles.forEach((file) => {
				formData.append(`gallery`, file);
			});

			// For editing, send existing gallery data to preserve
			if (isEditing && existingGallery.length > 0) {
				formData.append(
					"existingGallery",
					JSON.stringify(existingGallery)
				);
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
				<div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-lg rounded-xl p-6 border border-yellow-400/30 mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-white mb-2">
								{isEditing ? "Edit Event" : "Create New Event"}
							</h1>
							<p className="text-gray-300">
								{isEditing
									? "Update event details and manage gallery"
									: "Add a new event to showcase your work"}
							</p>
						</div>
						<div className="hidden sm:flex items-center justify-center w-16 h-16 bg-yellow-400/20 rounded-lg">
							<svg
								className="w-8 h-8 text-yellow-400"
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
					</div>
				</div>

				{/* Error Message */}
				{error && (
					<div className="mb-6 bg-red-900/50 border border-red-500 rounded-xl p-4 backdrop-blur-lg">
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

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
						<h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
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
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
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
									className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
									placeholder="Enter event title"
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
									className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
								>
									{categories.map((category) => (
										<option key={category} value={category}>
											{category}
										</option>
									))}
								</select>
							</div>

							{/* Event Date */}
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Event Date *
								</label>
								<input
									type="date"
									name="eventDate"
									value={event.eventDate}
									onChange={handleInputChange}
									required
									className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
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
									className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
									placeholder="Enter event location"
								/>
							</div>

							{/* Importance */}
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Importance *
								</label>
								<select
									name="importance"
									value={event.importance}
									onChange={handleInputChange}
									required
									className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
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
									className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 resize-none"
									placeholder="Enter event description"
								/>
							</div>

							{/* Active Status */}
							<div className="md:col-span-2">
								<label className="flex items-center gap-3 cursor-pointer">
									<input
										type="checkbox"
										name="isActive"
										checked={event.isActive}
										onChange={handleInputChange}
										className="w-5 h-5 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400 focus:ring-2"
									/>
									<span className="text-sm font-medium text-gray-300">
										Active (visible on the website)
									</span>
								</label>
							</div>
						</div>
					</div>

					{/* Image Upload */}
					<div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
						<h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
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
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							Main Event Image
						</h2>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Upload Image {!isEditing && "*"}
								</label>
								<div className="relative">
									<input
										type="file"
										accept="image/*"
										onChange={handleImageChange}
										required={!isEditing}
										className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-400 file:text-black hover:file:bg-yellow-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
									/>
								</div>
								<p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
									<svg
										className="w-3 h-3"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									Maximum file size: 5MB. Supported formats:
									JPG, PNG, GIF, WebP
								</p>
							</div>

							{/* Image Preview */}
							{imagePreview && (
								<div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
									<p className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
										<svg
											className="w-4 h-4 text-yellow-400"
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
										Image Preview
									</p>
									<img
										src={imagePreview}
										alt="Event preview"
										className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-600 shadow-lg"
									/>
								</div>
							)}
						</div>
					</div>

					{/* Gallery Upload */}
					<div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
						<h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
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
									d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
								/>
							</svg>
							Event Gallery (Optional)
						</h2>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Upload Gallery Images
								</label>
								<div className="relative">
									<input
										type="file"
										accept="image/*"
										multiple
										onChange={handleGalleryChange}
										className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-400 file:text-black hover:file:bg-yellow-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
									/>
								</div>
								<div className="mt-2 space-y-1">
									<p className="text-xs text-gray-400 flex items-center gap-1">
										<svg
											className="w-3 h-3"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										Maximum file size per image: 5MB.
										Supported formats: JPG, PNG, GIF, WebP
									</p>
									<p className="text-sm text-gray-300 flex items-center gap-1">
										<svg
											className="w-3 h-3 text-yellow-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
											/>
										</svg>
										You can select multiple images for the
										gallery
									</p>
								</div>
							</div>

							{/* Gallery Preview */}
							{(existingGallery.length > 0 ||
								newGalleryPreviews.length > 0) && (
								<div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
									<p className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
										<svg
											className="w-4 h-4 text-yellow-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
											/>
										</svg>
										Gallery Preview (
										{existingGallery.length +
											newGalleryPreviews.length}{" "}
										images)
									</p>
									<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
										{/* Existing Gallery Images */}
										{existingGallery.map((image, index) => (
											<div
												key={`existing-${index}`}
												className="relative group"
											>
												<img
													src={image.url}
													alt={`Existing Gallery ${
														index + 1
													}`}
													className="w-full h-32 object-cover rounded-lg border border-gray-600"
												/>
												<button
													type="button"
													onClick={() =>
														removeExistingGalleryImage(
															index
														)
													}
													className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
												>
													×
												</button>
												<div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
													Existing
												</div>
											</div>
										))}

										{/* New Gallery Images */}
										{newGalleryPreviews.map(
											(preview, index) => (
												<div
													key={`new-${index}`}
													className="relative"
												>
													<img
														src={preview}
														alt={`New Gallery ${
															index + 1
														}`}
														className="w-full h-32 object-cover rounded-lg border border-gray-600"
													/>
													<button
														type="button"
														onClick={() =>
															removeNewGalleryImage(
																index
															)
														}
														className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
													>
														×
													</button>
													<div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
														New
													</div>
												</div>
											)
										)}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Actions */}
					<div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
						<div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
							<button
								type="button"
								onClick={() => navigate("/admin/dashboard")}
								className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 flex items-center justify-center gap-2"
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
										d="M10 19l-7-7m0 0l7-7m-7 7h18"
									/>
								</svg>
								Cancel
							</button>
							<button
								type="submit"
								disabled={loading}
								className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
							>
								{loading ? (
									<>
										<svg
											className="animate-spin w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 4.354a7.646 7.646 0 100 15.292 7.646 7.646 0 000-15.292zm0 0V1m0 3.354a7.646 7.646 0 100 15.292 7.646 7.646 0 000-15.292z"
											/>
										</svg>
										Saving...
									</>
								) : (
									<>
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
												d="M5 13l4 4L19 7"
											/>
										</svg>
										{isEditing
											? "Update Event"
											: "Create Event"}
									</>
								)}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EventForm;
