import React, { useState, useEffect } from "react";
import { journeyAPI } from "../../services/api";
import Portal from "../../components/Portal";

interface JourneyItem {
	_id: string;
	year: string;
	title: string;
	description: string;
	logo?: {
		url: string;
		publicId: string;
	};
	logoAlt?: string;
	logoDescription?: string;
	displayOrder: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

interface JourneyFormData {
	year: string;
	title: string;
	description: string;
	logo: File | null;
	logoAlt: string;
	logoDescription: string;
	displayOrder: number;
}

const JourneyManagement: React.FC = () => {
	const [journeyItems, setJourneyItems] = useState<JourneyItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [editingItem, setEditingItem] = useState<JourneyItem | null>(null);
	const [formData, setFormData] = useState<JourneyFormData>({
		year: "",
		title: "",
		description: "",
		logo: null,
		logoAlt: "",
		logoDescription: "",
		displayOrder: 0,
	});

	// Load journey items
	useEffect(() => {
		fetchJourneyItems();
	}, []);

	// Cleanup function for image preview URLs to prevent memory leaks
	useEffect(() => {
		return () => {
			if (formData.logo) {
				URL.revokeObjectURL(URL.createObjectURL(formData.logo));
			}
		};
	}, [formData.logo]);

	const fetchJourneyItems = async () => {
		try {
			setLoading(true);
			const data = await journeyAPI.getAllJourneyItemsAdmin();
			setJourneyItems(data);
		} catch (error: any) {
			setError(
				error.response?.data?.error || "Error fetching journey items"
			);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate file size
		if (formData.logo) {
			const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
			if (formData.logo.size > maxSizeInBytes) {
				setError(
					`Logo image size must be less than 5MB. Your image is ${(
						formData.logo.size /
						(1024 * 1024)
					).toFixed(2)}MB.`
				);
				return;
			}
		}

		try {
			const submitData = new FormData();
			submitData.append("year", formData.year);
			submitData.append("title", formData.title);
			submitData.append("description", formData.description);
			submitData.append("logoAlt", formData.logoAlt);
			submitData.append("logoDescription", formData.logoDescription);
			submitData.append("displayOrder", formData.displayOrder.toString());

			if (formData.logo) {
				submitData.append("logo", formData.logo);
			}

			if (editingItem) {
				await journeyAPI.updateJourneyItem(editingItem._id, submitData);
			} else {
				await journeyAPI.createJourneyItem(submitData);
			}
			await fetchJourneyItems();
			resetForm();
			setError(""); // Clear any previous errors
		} catch (error: any) {
			setError(
				error.response?.data?.error || "Error saving journey item"
			);
		}
	};

	const handleEdit = (item: JourneyItem) => {
		setEditingItem(item);
		setFormData({
			year: item.year,
			title: item.title,
			description: item.description,
			logo: null, // Reset file input for editing
			logoAlt: item.logoAlt || "",
			logoDescription: item.logoDescription || "",
			displayOrder: item.displayOrder,
		});
		setShowForm(true);
	};

	const handleDelete = async (id: string) => {
		if (
			window.confirm("Are you sure you want to delete this journey item?")
		) {
			try {
				await journeyAPI.deleteJourneyItem(id);
				await fetchJourneyItems();
			} catch (error: any) {
				setError(
					error.response?.data?.error || "Error deleting journey item"
				);
			}
		}
	};

	const handleToggleStatus = async (id: string) => {
		try {
			await journeyAPI.toggleJourneyItemStatus(id);
			await fetchJourneyItems();
		} catch (error: any) {
			setError(
				error.response?.data?.error ||
					"Error updating journey item status"
			);
		}
	};

	const resetForm = () => {
		setFormData({
			year: "",
			title: "",
			description: "",
			logo: null,
			logoAlt: "",
			logoDescription: "",
			displayOrder: 0,
		});
		setEditingItem(null);
		setShowForm(false);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-16">
				<div className="relative bg-gradient-to-r from-slate-900/40 via-gray-900/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
					<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
					<div className="relative flex flex-col items-center gap-4">
						<div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
							<svg
								className="w-8 h-8 text-blue-300 animate-spin"
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
							<h3 className="text-blue-200 font-medium text-lg mb-1">
								Loading Journey Items
							</h3>
							<p className="text-gray-400 text-sm">
								Please wait while we fetch journey timeline
								data...
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
			<div className="relative bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
				<div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-blue-500/5 rounded-2xl"></div>
				<div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
							<svg
								className="w-6 h-6 text-blue-300"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div>
							<h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
								Journey Management
							</h2>
							<p className="text-gray-400 text-sm">
								Manage career timeline and professional
								milestones
							</p>
						</div>
					</div>
					<button
						onClick={() => setShowForm(true)}
						className="flex items-center gap-2 w-full sm:w-auto bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-200 px-4 py-2 rounded-lg hover:from-blue-500/30 hover:to-indigo-500/30 transition-all duration-200 backdrop-blur-sm border border-blue-500/30 text-sm sm:text-base"
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
						Add Journey Item
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

			{/* Form Modal */}
			{showForm && (
				<Portal>
					<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-2 sm:p-4 overflow-y-auto">
						<div className="relative bg-gradient-to-r from-slate-900/90 via-gray-900/90 to-slate-900/90 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/20 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-4 sm:my-8 shadow-2xl">
							<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
							<div className="relative">
								<div className="flex items-center gap-3 mb-4 sm:mb-6">
									<div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
										<svg
											className="w-6 h-6 text-blue-300"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									</div>
									<h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
										{editingItem
											? "Edit Journey Item"
											: "Add Journey Item"}
									</h3>
								</div>
								<form
									onSubmit={handleSubmit}
									className="space-y-4 sm:space-y-6"
								>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
										<div>
											<label className="flex items-center gap-2 text-gray-300 mb-3 text-sm sm:text-base font-medium">
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
														d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
												Year
											</label>
											<div className="relative">
												<input
													type="text"
													value={formData.year}
													onChange={(e) =>
														setFormData({
															...formData,
															year: e.target
																.value,
														})
													}
													className="w-full bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-white/10 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm sm:text-base"
													placeholder="e.g., 2025 or 2020-21"
													required
												/>
											</div>
										</div>
										<div>
											<label className="flex items-center gap-2 text-gray-300 mb-3 text-sm sm:text-base font-medium">
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
														d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
													/>
												</svg>
												Display Order
											</label>
											<div className="relative">
												<input
													type="number"
													value={
														formData.displayOrder
													}
													onChange={(e) =>
														setFormData({
															...formData,
															displayOrder:
																parseInt(
																	e.target
																		.value
																) || 0,
														})
													}
													className="w-full bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-white/10 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm sm:text-base"
													placeholder="0"
												/>
											</div>
										</div>
									</div>
									<div>
										<label className="flex items-center gap-2 text-gray-300 mb-3 text-sm sm:text-base font-medium">
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
											Title
										</label>
										<div className="relative">
											<input
												type="text"
												value={formData.title}
												onChange={(e) =>
													setFormData({
														...formData,
														title: e.target.value,
													})
												}
												className="w-full bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-white/10 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm sm:text-base"
												placeholder="Enter journey title"
												required
											/>
										</div>
									</div>
									<div>
										<label className="flex items-center gap-2 text-gray-300 mb-3 text-sm sm:text-base font-medium">
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
													d="M4 6h16M4 12h16M4 18h7"
												/>
											</svg>
											Description
										</label>
										<div className="relative">
											<textarea
												value={formData.description}
												onChange={(e) =>
													setFormData({
														...formData,
														description:
															e.target.value,
													})
												}
												className="w-full bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-white/10 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm sm:text-base resize-none"
												rows={4}
												placeholder="Enter journey description"
												required
											/>
										</div>
									</div>
									<div>
										<label className="flex items-center gap-2 text-gray-300 mb-3 text-sm sm:text-base font-medium">
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
													d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
												/>
											</svg>
											Logo Image {!editingItem && "*"}
										</label>
										<div className="relative">
											<input
												type="file"
												accept="image/*"
												onChange={(e) => {
													const file =
														e.target.files?.[0] ||
														null;
													if (file) {
														const maxSizeInBytes =
															5 * 1024 * 1024; // 5MB
														if (
															file.size >
															maxSizeInBytes
														) {
															setError(
																`Logo image size must be less than 5MB. Your image is ${(
																	file.size /
																	(1024 *
																		1024)
																).toFixed(
																	2
																)}MB.`
															);
															e.target.value = ""; // Reset file input
															return;
														}
														setError(""); // Clear any previous errors
													}
													setFormData({
														...formData,
														logo: file,
													});
												}}
												className="w-full bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-white/10 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-500/20 file:text-blue-200 hover:file:bg-blue-500/30"
												required={!editingItem}
											/>
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
												Upload logo image (JPG, PNG,
												GIF, WebP). Max size: 5MB
											</p>
											{editingItem && (
												<p className="text-xs text-blue-300 mt-1 flex items-center gap-1">
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
													Leave empty to keep current
													logo
												</p>
											)}
										</div>
									</div>

									{/* Image Preview */}
									{formData.logo && (
										<div>
											<label className="flex items-center gap-2 text-gray-300 mb-3 text-sm sm:text-base font-medium">
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
														d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
													/>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
													/>
												</svg>
												Preview
											</label>
											<div className="relative bg-gradient-to-r from-slate-800/30 to-gray-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-4">
												<div className="flex items-center gap-4">
													<div className="relative">
														<img
															src={URL.createObjectURL(
																formData.logo
															)}
															alt="Logo preview"
															className="w-16 h-16 object-cover rounded-xl border border-white/20"
														/>
														<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
													</div>
													<div className="text-xs sm:text-sm text-gray-300 space-y-1">
														<p className="flex items-center gap-2">
															<span className="text-blue-400 font-medium">
																Name:
															</span>
															<span>
																{
																	formData
																		.logo
																		.name
																}
															</span>
														</p>
														<p className="flex items-center gap-2">
															<span className="text-blue-400 font-medium">
																Size:
															</span>
															<span>
																{(
																	formData
																		.logo
																		.size /
																	(1024 *
																		1024)
																).toFixed(
																	2
																)}{" "}
																MB
															</span>
														</p>
														<p className="flex items-center gap-2">
															<span className="text-blue-400 font-medium">
																Type:
															</span>
															<span>
																{
																	formData
																		.logo
																		.type
																}
															</span>
														</p>
													</div>
												</div>
											</div>
										</div>
									)}

									{/* Current Logo for Edit Mode */}
									{editingItem &&
										editingItem.logo &&
										editingItem.logo.url && (
											<div>
												<label className="flex items-center gap-2 text-gray-300 mb-3 text-sm sm:text-base font-medium">
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
															d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
														/>
													</svg>
													Current Logo
												</label>
												<div className="relative bg-gradient-to-r from-slate-800/30 to-gray-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-4">
													<div className="flex items-center gap-4">
														<div className="relative">
															<img
																src={
																	editingItem
																		.logo
																		.url
																}
																alt={
																	editingItem.logoAlt ||
																	"Current logo"
																}
																className="w-16 h-16 object-cover rounded-xl border border-white/20"
															/>
															<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
														</div>
														<div className="text-xs sm:text-sm text-gray-300">
															<p className="flex items-center gap-2">
																<svg
																	className="w-3 h-3 text-yellow-400"
																	fill="none"
																	stroke="currentColor"
																	viewBox="0 0 24 24"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth={
																			2
																		}
																		d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																	/>
																</svg>
																Current logo
																will be replaced
																if you upload a
																new one
															</p>
														</div>
													</div>
												</div>
											</div>
										)}

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
										<div>
											<label className="flex items-center gap-2 text-gray-300 mb-3 text-sm sm:text-base font-medium">
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
												Logo Alt Text
											</label>
											<div className="relative">
												<input
													type="text"
													value={formData.logoAlt}
													onChange={(e) =>
														setFormData({
															...formData,
															logoAlt:
																e.target.value,
														})
													}
													className="w-full bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-white/10 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm sm:text-base"
													placeholder="Enter alt text for accessibility"
												/>
											</div>
										</div>
										<div>
											<label className="flex items-center gap-2 text-gray-300 mb-3 text-sm sm:text-base font-medium">
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
														d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
													/>
												</svg>
												Logo Description
											</label>
											<div className="relative">
												<input
													type="text"
													value={
														formData.logoDescription
													}
													onChange={(e) =>
														setFormData({
															...formData,
															logoDescription:
																e.target.value,
														})
													}
													className="w-full bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-white/10 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm sm:text-base"
													placeholder="Enter logo description"
												/>
											</div>
										</div>
									</div>
									<div className="flex flex-col sm:flex-row gap-3 pt-4">
										<button
											type="submit"
											className="flex-1 bg-gradient-to-r from-blue-500/80 to-indigo-500/80 text-white py-3 px-6 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 text-sm sm:text-base font-medium backdrop-blur-sm border border-blue-500/30 flex items-center justify-center gap-2"
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
											{editingItem
												? "Update Journey Item"
												: "Create Journey Item"}
										</button>
										<button
											type="button"
											onClick={resetForm}
											className="flex-1 bg-gradient-to-r from-gray-600/50 to-gray-700/50 text-gray-200 py-3 px-6 rounded-xl hover:from-gray-600/70 hover:to-gray-700/70 transition-all duration-200 text-sm sm:text-base font-medium backdrop-blur-sm border border-gray-500/30 flex items-center justify-center gap-2"
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

			{/* Journey Items List */}
			<div className="space-y-4">
				{journeyItems.map((item) => (
					<div
						key={item._id}
						className={`relative ${
							item.isActive
								? "bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-blue-900/20"
								: "bg-gradient-to-r from-slate-900/20 via-gray-900/20 to-slate-900/20"
						} backdrop-blur-sm rounded-2xl p-6 border ${
							item.isActive
								? "border-blue-500/30"
								: "border-white/10"
						} hover:border-white/20 transition-all duration-300`}
					>
						<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
						<div className="relative flex flex-col sm:flex-row items-start gap-6">
							<div
								className={`rounded-2xl w-16 h-16 flex items-center justify-center font-bold text-sm flex-shrink-0 backdrop-blur-sm border transition-all duration-200 ${
									item.isActive
										? "bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-200 border-blue-500/30"
										: "bg-gradient-to-br from-gray-600/20 to-gray-700/20 text-gray-300 border-gray-500/30"
								}`}
							>
								{item.year}
							</div>
							<div className="flex-1 w-full sm:w-auto">
								<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
									<h3
										className={`text-xl font-bold ${
											item.isActive
												? "bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent"
												: "text-gray-400"
										}`}
									>
										{item.title}
									</h3>
									<div className="flex gap-2">
										<button
											onClick={() => handleEdit(item)}
											className="group relative bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 p-2 rounded-lg hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-200 backdrop-blur-sm border border-blue-500/30"
											title="Edit"
										>
											<svg
												className="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
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
												handleToggleStatus(item._id)
											}
											className={`group relative p-2 rounded-lg transition-all duration-200 backdrop-blur-sm border ${
												item.isActive
													? "bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-300 hover:from-green-500/30 hover:to-green-600/30 border-green-500/30"
													: "bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-400 hover:from-gray-500/30 hover:to-gray-600/30 border-gray-500/30"
											}`}
											title={
												item.isActive
													? "Deactivate"
													: "Activate"
											}
										>
											<svg
												className="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d={
														item.isActive
															? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
															: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
													}
												/>
											</svg>
										</button>
										<button
											onClick={() =>
												handleDelete(item._id)
											}
											className="group relative bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 p-2 rounded-lg hover:from-red-500/30 hover:to-red-600/30 transition-all duration-200 backdrop-blur-sm border border-red-500/30"
											title="Delete"
										>
											<svg
												className="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
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
								<p
									className={`leading-relaxed mb-4 ${
										item.isActive
											? "text-gray-300"
											: "text-gray-500"
									}`}
								>
									{item.description}
								</p>
								{item.logo && (
									<div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-gray-400 mb-4">
										<div className="flex items-center gap-3">
											<div className="relative">
												<img
													src={item.logo.url}
													alt={item.logoAlt || "Logo"}
													className="w-10 h-10 object-cover rounded-lg border border-white/20"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
											</div>
											<span className="flex items-center gap-2">
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
														d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
												Logo attached
											</span>
										</div>
										{item.logoDescription && (
											<span className="text-gray-500">
												• {item.logoDescription}
											</span>
										)}
									</div>
								)}
								<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
									<span className="text-xs text-gray-500 flex items-center gap-2">
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
										Order: {item.displayOrder}
									</span>
									<span
										className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
											item.isActive
												? "bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-300 border-green-500/30"
												: "bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-400 border-gray-500/30"
										}`}
									>
										{item.isActive ? "Active" : "Inactive"}
									</span>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{journeyItems.length === 0 && (
				<div className="relative bg-gradient-to-r from-slate-900/30 via-gray-900/30 to-slate-900/30 backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center">
					<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
					<div className="relative space-y-6">
						<div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
							<svg
								className="w-10 h-10 text-blue-300"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div>
							<h3 className="text-xl font-bold bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent mb-2">
								No Journey Items Found
							</h3>
							<p className="text-gray-400 mb-6">
								Start building your professional timeline by
								adding your first journey milestone
							</p>
						</div>
						<button
							onClick={() => setShowForm(true)}
							className="bg-gradient-to-r from-blue-500/80 to-indigo-500/80 text-white px-6 py-3 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 font-medium backdrop-blur-sm border border-blue-500/30 flex items-center gap-2 mx-auto"
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
							Add First Journey Item
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default JourneyManagement;
