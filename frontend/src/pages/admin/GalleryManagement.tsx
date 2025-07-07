import React, { useState, useEffect } from "react";
import { galleryAPI } from "../../services/api";
import Portal from "../../components/Portal";

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
	createdAt: string;
	updatedAt: string;
}

interface GalleryFormData {
	title: string;
	description: string;
	category: string;
	displayOrder: number;
	image: File | null;
}

interface GalleryManagementProps {
	category: "Services" | "School";
}

const GalleryManagement: React.FC<GalleryManagementProps> = ({ category }) => {
	const [images, setImages] = useState<GalleryImage[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	const [formData, setFormData] = useState<GalleryFormData>({
		title: "",
		description: "",
		category: category,
		displayOrder: 0,
		image: null,
	});

	useEffect(() => {
		fetchImages();
	}, [category]);

	// Cleanup function for image preview URLs to prevent memory leaks
	useEffect(() => {
		return () => {
			if (formData.image) {
				URL.revokeObjectURL(URL.createObjectURL(formData.image));
			}
		};
	}, [formData.image]);

	const fetchImages = async () => {
		try {
			setLoading(true);
			const data = await galleryAPI.getAllGalleryImagesAdmin(category);
			setImages(data);
			setError(null);
		} catch (err) {
			console.error("Error fetching gallery images:", err);
			setError("Failed to fetch gallery images");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.image && !editingImage) {
			setError("Please select an image");
			return;
		}

		// Check image size before submission
		if (formData.image) {
			const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
			if (formData.image.size > maxSizeInBytes) {
				setError(
					`Image size must be less than 5MB. Your image is ${(
						formData.image.size /
						(1024 * 1024)
					).toFixed(2)}MB.`
				);
				return;
			}
		}

		try {
			const submitData = new FormData();
			submitData.append("title", formData.title);
			submitData.append("description", formData.description);
			submitData.append("category", formData.category);
			submitData.append("displayOrder", formData.displayOrder.toString());

			if (formData.image) {
				submitData.append("image", formData.image);
			}

			if (editingImage) {
				await galleryAPI.updateGalleryImage(
					editingImage._id,
					submitData
				);
			} else {
				await galleryAPI.createGalleryImage(submitData);
			}

			await fetchImages();
			resetForm();
			setError(null);
		} catch (err: any) {
			console.error("Error saving gallery image:", err);
			setError(
				err.response?.data?.error || "Failed to save gallery image"
			);
		}
	};

	const handleEdit = (image: GalleryImage) => {
		setEditingImage(image);
		setFormData({
			title: image.title,
			description: image.description || "",
			category: image.category,
			displayOrder: image.displayOrder,
			image: null,
		});
		setShowForm(true);
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm("Are you sure you want to delete this image?")) {
			return;
		}

		try {
			await galleryAPI.deleteGalleryImage(id);
			await fetchImages();
			setError(null);
		} catch (err: any) {
			console.error("Error deleting gallery image:", err);
			setError(
				err.response?.data?.error || "Failed to delete gallery image"
			);
		}
	};

	const handleToggleStatus = async (id: string) => {
		try {
			await galleryAPI.toggleGalleryImageStatus(id);
			await fetchImages();
			setError(null);
		} catch (err: any) {
			console.error("Error toggling gallery image status:", err);
			setError(
				err.response?.data?.error ||
					"Failed to toggle gallery image status"
			);
		}
	};

	const resetForm = () => {
		setFormData({
			title: "",
			description: "",
			category: category,
			displayOrder: 0,
			image: null,
		});
		setEditingImage(null);
		setShowForm(false);
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			const maxSizeInMB = 5;
			const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // 5MB in bytes

			// Check file size
			if (file.size > maxSizeInBytes) {
				setError(
					`Image size must be less than ${maxSizeInMB}MB. Your image is ${(
						file.size /
						(1024 * 1024)
					).toFixed(2)}MB.`
				);
				// Reset the file input
				e.target.value = "";
				return;
			}

			// Clear any previous errors
			setError(null);
			setFormData({ ...formData, image: file });
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
			</div>
		);
	}

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
				<h3 className="text-xl sm:text-2xl font-bold text-white">
					{category} Gallery Management
				</h3>
				<button
					onClick={() => setShowForm(true)}
					className="w-full sm:w-auto bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors text-sm sm:text-base"
				>
					Add New Image
				</button>
			</div>

			{error && (
				<div className="bg-red-500/20 border border-red-500 text-red-300 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm sm:text-base">
					{error}
				</div>
			)}

			{/* Gallery Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
				{images.map((image) => (
					<div
						key={image._id}
						className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden"
					>
						<div className="relative group">
							<img
								src={image.image.url}
								alt={image.title}
								className="w-full h-40 sm:h-48 object-cover cursor-pointer"
								onClick={() =>
									setSelectedImage(image.image.url)
								}
							/>
							<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
								<span className="text-white text-xs sm:text-sm text-center px-2">
									{image.description ||
										"Click to view full size"}
								</span>
							</div>
						</div>

						<div className="p-3 sm:p-4">
							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-2">
								<h4 className="text-white font-bold text-sm sm:text-base">
									{image.title}
								</h4>
								<div className="flex gap-2">
									<button
										onClick={() =>
											handleToggleStatus(image._id)
										}
										className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 hover:scale-105 ${
											image.isActive
												? "bg-green-600 text-white hover:bg-green-700"
												: "bg-gray-600 text-gray-300 hover:bg-gray-500"
										}`}
									>
										{image.isActive ? "Active" : "Inactive"}
									</button>
								</div>
							</div>

							{image.description && (
								<p className="text-gray-300 text-xs sm:text-sm mb-3">
									{image.description}
								</p>
							)}

							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
								<span className="text-xs text-gray-500">
									Order: {image.displayOrder}
								</span>
								<div className="flex gap-2">
									<button
										onClick={() => handleEdit(image)}
										className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-blue-700 transition-all duration-200 hover:scale-105"
									>
										Edit
									</button>
									<button
										onClick={() => handleDelete(image._id)}
										className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-700 transition-all duration-200 hover:scale-105"
									>
										Delete
									</button>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{images.length === 0 && (
				<div className="text-center py-6 sm:py-8 text-gray-400 text-sm sm:text-base">
					No gallery images found. Add some images to get started.
				</div>
			)}

			{/* Form Modal */}
			{showForm && (
				<Portal>
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-2 sm:p-4 z-50 overflow-y-auto">
						<div className="bg-gray-800 rounded-lg p-4 sm:p-6 max-w-md w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-4 sm:my-8">
							<div className="flex justify-between items-center mb-4 sm:mb-6">
								<h3 className="text-lg sm:text-xl font-bold text-white">
									{editingImage
										? "Edit Image"
										: "Add New Image"}
								</h3>
								<button
									onClick={resetForm}
									className="text-gray-400 hover:text-white text-xl sm:text-2xl"
								>
									×
								</button>
							</div>

							<form
								onSubmit={handleSubmit}
								className="space-y-3 sm:space-y-4"
							>
								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Title *
									</label>
									<input
										type="text"
										value={formData.title}
										onChange={(e) =>
											setFormData({
												...formData,
												title: e.target.value,
											})
										}
										className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Description
									</label>
									<textarea
										value={formData.description}
										onChange={(e) =>
											setFormData({
												...formData,
												description: e.target.value,
											})
										}
										rows={3}
										className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base resize-none"
										placeholder="Optional description shown on hover..."
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Display Order
									</label>
									<input
										type="number"
										value={formData.displayOrder}
										onChange={(e) =>
											setFormData({
												...formData,
												displayOrder:
													parseInt(e.target.value) ||
													0,
											})
										}
										className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Image {!editingImage && "*"}
									</label>
									<input
										type="file"
										accept="image/*"
										onChange={handleImageChange}
										className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
										required={!editingImage}
									/>
									<p className="text-xs text-gray-500 mt-1">
										Maximum file size: 5MB. Supported
										formats: JPG, PNG, GIF, WebP
									</p>
									{editingImage && (
										<p className="text-xs sm:text-sm text-gray-400 mt-1">
											Leave empty to keep current image
										</p>
									)}
								</div>

								{/* Image Preview */}
								{formData.image && (
									<div className="space-y-2">
										<label className="block text-sm font-medium text-gray-300">
											Preview
										</label>
										<div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-3 bg-gray-700 rounded-lg">
											<img
												src={URL.createObjectURL(
													formData.image
												)}
												alt="Preview"
												className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
											/>
											<div className="flex-1 text-xs sm:text-sm text-gray-300">
												<p>
													<strong>Name:</strong>{" "}
													{formData.image.name}
												</p>
												<p>
													<strong>Size:</strong>{" "}
													{(
														formData.image.size /
														(1024 * 1024)
													).toFixed(2)}{" "}
													MB
												</p>
												<p>
													<strong>Type:</strong>{" "}
													{formData.image.type}
												</p>
												<div className="mt-2">
													<div
														className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
															formData.image
																.size <=
															10 * 1024 * 1024
																? "bg-green-600 text-white"
																: "bg-red-600 text-white"
														}`}
													>
														{formData.image.size <=
														10 * 1024 * 1024
															? "✓ Valid size"
															: "⚠ Too large"}
													</div>
												</div>
											</div>
										</div>
									</div>
								)}

								<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
									<button
										type="submit"
										className="flex-1 bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors text-sm sm:text-base"
									>
										{editingImage
											? "Update Image"
											: "Add Image"}
									</button>
									<button
										type="button"
										onClick={resetForm}
										className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors text-sm sm:text-base"
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				</Portal>
			)}

			{/* Image Modal */}
			{selectedImage && (
				<Portal>
					<div className="fixed inset-0 bg-black bg-opacity-90 flex items-start justify-center p-2 sm:p-4 z-50 overflow-y-auto">
						<div className="relative max-w-4xl max-h-[95vh] sm:max-h-[90vh] my-4 sm:my-8">
							<img
								src={selectedImage}
								alt="Gallery Image"
								className="max-w-full max-h-full object-contain rounded-lg"
							/>
							<button
								onClick={() => setSelectedImage(null)}
								className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-xl font-bold hover:bg-opacity-70 transition-colors"
							>
								×
							</button>
						</div>
					</div>
				</Portal>
			)}
		</div>
	);
};

export default GalleryManagement;
