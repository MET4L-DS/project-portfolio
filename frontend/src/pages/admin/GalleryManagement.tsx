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
			<div className="flex items-center justify-center py-16">
				<div className="relative bg-gradient-to-r from-slate-900/40 via-gray-900/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
					<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
					<div className="relative flex flex-col items-center gap-4">
						<div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
							<svg
								className="w-8 h-8 text-cyan-300 animate-spin"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
						</div>
						<div className="text-center">
							<h3 className="text-cyan-200 font-medium text-lg mb-1">
								Loading Gallery
							</h3>
							<p className="text-gray-400 text-sm">
								Please wait while we fetch gallery images...
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="relative bg-gradient-to-r from-cyan-900/30 via-blue-900/30 to-indigo-900/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
				<div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-indigo-500/5 rounded-2xl"></div>
				<div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
							<svg
								className="w-6 h-6 text-cyan-300"
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
						</div>
						<div>
							<h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
								{category} Gallery Management
							</h3>
							<p className="text-gray-400 text-sm">
								Manage {category.toLowerCase()} gallery images
								and media
							</p>
						</div>
					</div>
					<button
						onClick={() => setShowForm(true)}
						className="flex items-center gap-2 w-full sm:w-auto bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 px-4 py-2 rounded-lg hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-200 backdrop-blur-sm border border-cyan-500/30 text-sm sm:text-base font-semibold"
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
								d="M12 4v16m8-8H4"
							/>
						</svg>
						Add New Image
					</button>
				</div>
			</div>

			{error && (
				<div className="relative bg-gradient-to-r from-red-900/20 via-red-800/20 to-red-900/20 backdrop-blur-sm rounded-xl p-4 border border-red-500/30">
					<div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-red-400/5 to-red-500/5 rounded-xl"></div>
					<div className="relative flex items-center gap-3">
						<div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-red-500/30">
							<svg
								className="w-5 h-5 text-red-300"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z"
								/>
							</svg>
						</div>
						<div>
							<h3 className="text-red-300 font-medium">Error</h3>
							<p className="text-red-200 text-sm">{error}</p>
						</div>
					</div>
				</div>
			)}

			{/* Gallery Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{images.map((image) => (
					<div
						key={image._id}
						className={`group relative transition-all duration-300 hover:scale-[1.02] ${
							image.isActive
								? "bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-indigo-900/20"
								: "bg-gradient-to-r from-slate-900/20 via-gray-900/20 to-slate-900/20"
						} backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-cyan-500/5`}
					>
						<div
							className={`absolute inset-0 rounded-2xl ${
								image.isActive
									? "bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-indigo-500/5"
									: "bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5"
							}`}
						></div>

						<div className="relative">
							{/* Image Section */}
							<div className="relative group/image">
								<img
									src={image.image.url}
									alt={image.title}
									className="w-full h-48 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
									onClick={() =>
										setSelectedImage(image.image.url)
									}
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-all duration-300 flex items-end p-4">
									<div className="text-white text-sm">
										<p className="font-medium mb-1">
											Click to view full size
										</p>
										{image.description && (
											<p className="text-gray-300 text-xs line-clamp-2">
												{image.description}
											</p>
										)}
									</div>
								</div>

								{/* Status Badge */}
								<div className="absolute top-3 left-3">
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
											image.isActive
												? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30"
												: "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/30"
										}`}
									>
										{image.isActive ? "Active" : "Inactive"}
									</span>
								</div>

								{/* Action Buttons */}
								<div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
									<button
										onClick={() => handleEdit(image)}
										className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-600/20 text-blue-300 rounded-lg hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-200 backdrop-blur-sm border border-blue-500/30 flex items-center justify-center"
										title="Edit Image"
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
									</button>
									<button
										onClick={() =>
											handleToggleStatus(image._id)
										}
										className={`w-8 h-8 rounded-lg transition-all duration-200 backdrop-blur-sm border flex items-center justify-center ${
											image.isActive
												? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30 hover:from-amber-500/30 hover:to-orange-500/30"
												: "bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30 hover:from-green-500/30 hover:to-emerald-500/30"
										}`}
										title={
											image.isActive
												? "Deactivate"
												: "Activate"
										}
									>
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											{image.isActive ? (
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
												/>
											) : (
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											)}
										</svg>
									</button>
									<button
										onClick={() => handleDelete(image._id)}
										className="w-8 h-8 bg-gradient-to-br from-red-500/20 to-red-600/20 text-red-300 rounded-lg hover:from-red-500/30 hover:to-red-600/30 transition-all duration-200 backdrop-blur-sm border border-red-500/30 flex items-center justify-center"
										title="Delete Image"
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
									</button>
								</div>
							</div>

							{/* Content Section */}
							<div className="p-4">
								<div className="flex justify-between items-start mb-3">
									<h4
										className={`font-bold text-lg ${
											image.isActive
												? "text-cyan-100"
												: "text-gray-400"
										}`}
									>
										{image.title}
									</h4>
								</div>

								{image.description && (
									<p
										className={`text-sm mb-3 line-clamp-2 ${
											image.isActive
												? "text-gray-300"
												: "text-gray-500"
										}`}
									>
										{image.description}
									</p>
								)}

								{/* Footer */}
								<div className="flex items-center justify-between pt-3 border-t border-white/5">
									<div className="flex items-center gap-2 text-xs text-gray-500">
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
												d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
											/>
										</svg>
										Order: {image.displayOrder}
									</div>
									<div className="flex items-center gap-2 text-xs text-gray-500">
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
												d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
										{new Date(
											image.createdAt
										).toLocaleDateString()}
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{images.length === 0 && (
				<div className="flex items-center justify-center py-16">
					<div className="relative bg-gradient-to-r from-slate-900/40 via-gray-900/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center max-w-md">
						<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
						<div className="relative">
							<div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/10">
								<svg
									className="w-10 h-10 text-cyan-300"
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
							</div>
							<h3 className="text-xl font-bold text-gray-200 mb-2">
								No Gallery Images Found
							</h3>
							<p className="text-gray-400 mb-6 leading-relaxed">
								Get started by adding your first{" "}
								{category.toLowerCase()} gallery image.
							</p>
							<button
								onClick={() => setShowForm(true)}
								className="flex items-center gap-2 mx-auto bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 px-6 py-3 rounded-xl hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-200 backdrop-blur-sm border border-cyan-500/30 font-medium"
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
										d="M12 4v16m8-8H4"
									/>
								</svg>
								Add First Image
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Form Modal */}
			{showForm && (
				<Portal>
					<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
						<div className="relative bg-gradient-to-r from-slate-900/90 via-gray-900/90 to-slate-900/90 backdrop-blur-sm rounded-2xl w-full max-w-lg my-8 border border-white/10">
							<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
							<div className="relative p-6">
								{/* Modal Header */}
								<div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10">
											<svg
												className="w-5 h-5 text-cyan-300"
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
										</div>
										<h3 className="text-lg sm:text-xl font-bold text-white">
											{editingImage
												? "Edit Image"
												: "Add New Image"}
										</h3>
									</div>
									<button
										onClick={resetForm}
										className="w-8 h-8 bg-gradient-to-br from-gray-600/20 to-gray-700/20 text-gray-400 rounded-lg hover:from-gray-600/30 hover:to-gray-700/30 transition-all duration-200 backdrop-blur-sm border border-gray-600/30 flex items-center justify-center"
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
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								</div>

								<form
									onSubmit={handleSubmit}
									className="space-y-6"
								>
									<div>
										<label className="text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
											<svg
												className="w-4 h-4 text-blue-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
												/>
											</svg>
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
											className="w-full px-4 py-3 bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200"
											placeholder="Enter image title"
											required
										/>
									</div>

									<div>
										<label className="text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
											<svg
												className="w-4 h-4 text-green-400"
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
											className="w-full px-4 py-3 bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 resize-none"
											placeholder="Optional description shown on hover..."
										/>
									</div>

									<div>
										<label className="text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
											<svg
												className="w-4 h-4 text-orange-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
												/>
											</svg>
											Display Order
										</label>
										<input
											type="number"
											value={formData.displayOrder}
											onChange={(e) =>
												setFormData({
													...formData,
													displayOrder:
														parseInt(
															e.target.value
														) || 0,
												})
											}
											className="w-full px-4 py-3 bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200"
											placeholder="0"
										/>
									</div>

									<div>
										<label className="text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
											<svg
												className="w-4 h-4 text-purple-400"
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
											Image {!editingImage && "*"}
										</label>
										<input
											type="file"
											accept="image/*"
											onChange={handleImageChange}
											className="w-full px-4 py-3 bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl text-white file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-cyan-500/20 file:text-cyan-200 hover:file:bg-cyan-500/30 file:transition-all file:duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200"
											required={!editingImage}
										/>
										<div className="mt-2 space-y-1">
											<p className="text-xs text-gray-500">
												Maximum file size: 5MB.
												Supported formats: JPG, PNG,
												GIF, WebP
											</p>
											{editingImage && (
												<p className="text-xs text-gray-400">
													Leave empty to keep current
													image
												</p>
											)}
										</div>
									</div>

									{/* Image Preview */}
									{formData.image && (
										<div className="space-y-3">
											<label className="text-gray-300 text-sm font-medium flex items-center gap-2">
												<svg
													className="w-4 h-4 text-emerald-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
													/>
												</svg>
												Preview
											</label>
											<div className="relative bg-gradient-to-r from-slate-800/30 to-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
												<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-xl"></div>
												<div className="relative flex flex-col sm:flex-row items-start gap-4">
													<img
														src={URL.createObjectURL(
															formData.image
														)}
														alt="Preview"
														className="w-20 h-20 object-cover rounded-lg border border-white/10"
													/>
													<div className="flex-1 text-sm text-gray-300 space-y-1">
														<p>
															<span className="text-gray-400">
																Name:
															</span>{" "}
															{
																formData.image
																	.name
															}
														</p>
														<p>
															<span className="text-gray-400">
																Size:
															</span>{" "}
															{(
																formData.image
																	.size /
																(1024 * 1024)
															).toFixed(2)}{" "}
															MB
														</p>
														<p>
															<span className="text-gray-400">
																Type:
															</span>{" "}
															{
																formData.image
																	.type
															}
														</p>
														<div className="mt-2">
															<span
																className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
																	formData
																		.image
																		.size <=
																	5 *
																		1024 *
																		1024
																		? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30"
																		: "bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border border-red-500/30"
																} backdrop-blur-sm`}
															>
																{formData.image
																	.size <=
																5 * 1024 * 1024
																	? "✓ Valid size"
																	: "⚠ Too large"}
															</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									)}

									<div className="flex gap-3 pt-4">
										<button
											type="submit"
											className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 py-3 rounded-xl hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-200 backdrop-blur-sm border border-cyan-500/30 font-semibold"
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
													d="M5 13l4 4L19 7"
												/>
											</svg>
											{editingImage
												? "Update Image"
												: "Add Image"}
										</button>
										<button
											type="button"
											onClick={resetForm}
											className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600/20 to-gray-700/20 text-gray-300 py-3 rounded-xl hover:from-gray-600/30 hover:to-gray-700/30 transition-all duration-200 backdrop-blur-sm border border-gray-600/30 font-medium"
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
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
											Cancel
										</button>
									</div>
								</form>
							</div>
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
