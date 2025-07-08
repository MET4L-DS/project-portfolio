import React, { useState, useEffect } from "react";
import { achievementsAPI } from "../../services/api";
import Portal from "../../components/Portal";

interface AchievementItem {
	name: string;
	description?: string;
	displayOrder?: number;
}

interface Achievement {
	_id: string;
	title: string;
	icon: string;
	category: string;
	items: AchievementItem[];
	displayOrder: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

interface AchievementFormData {
	title: string;
	icon: string;
	category: string;
	items: AchievementItem[];
	displayOrder: number;
}

const AchievementManagement: React.FC = () => {
	const [achievements, setAchievements] = useState<Achievement[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [editingAchievement, setEditingAchievement] =
		useState<Achievement | null>(null);
	const [formData, setFormData] = useState<AchievementFormData>({
		title: "",
		icon: "",
		category: "Event Organizer",
		items: [],
		displayOrder: 0,
	});

	const categories = [
		"Event Organizer",
		"Production Leadership",
		"Special Projects",
		"Media Ventures",
		"Awards",
		"Other",
	];

	const commonIcons = [
		"🏆",
		"🎬",
		"🌟",
		"📱",
		"🎯",
		"🎪",
		"🏅",
		"⭐",
		"🎨",
		"🎭",
		"🎤",
		"📸",
	];

	// Load achievements
	useEffect(() => {
		fetchAchievements();
	}, []);

	const fetchAchievements = async () => {
		try {
			setLoading(true);
			const data = await achievementsAPI.getAllAchievementsAdmin();
			setAchievements(data);
		} catch (error: any) {
			setError(
				error.response?.data?.error || "Error fetching achievements"
			);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (editingAchievement) {
				await achievementsAPI.updateAchievement(
					editingAchievement._id,
					formData
				);
			} else {
				await achievementsAPI.createAchievement(formData);
			}
			await fetchAchievements();
			resetForm();
		} catch (error: any) {
			setError(error.response?.data?.error || "Error saving achievement");
		}
	};

	const handleEdit = (achievement: Achievement) => {
		setEditingAchievement(achievement);
		setFormData({
			title: achievement.title,
			icon: achievement.icon,
			category: achievement.category,
			items: achievement.items,
			displayOrder: achievement.displayOrder,
		});
		setShowForm(true);
	};

	const handleDelete = async (id: string) => {
		if (
			window.confirm("Are you sure you want to delete this achievement?")
		) {
			try {
				await achievementsAPI.deleteAchievement(id);
				await fetchAchievements();
			} catch (error: any) {
				setError(
					error.response?.data?.error || "Error deleting achievement"
				);
			}
		}
	};

	const handleToggleStatus = async (id: string) => {
		try {
			await achievementsAPI.toggleAchievementStatus(id);
			await fetchAchievements();
		} catch (error: any) {
			setError(
				error.response?.data?.error ||
					"Error updating achievement status"
			);
		}
	};

	const addItem = () => {
		setFormData({
			...formData,
			items: [
				...formData.items,
				{
					name: "",
					description: "",
					displayOrder: formData.items.length,
				},
			],
		});
	};

	const removeItem = (index: number) => {
		setFormData({
			...formData,
			items: formData.items.filter((_, i) => i !== index),
		});
	};

	const updateItem = (
		index: number,
		field: keyof AchievementItem,
		value: string | number
	) => {
		const updatedItems = [...formData.items];
		updatedItems[index] = { ...updatedItems[index], [field]: value };
		setFormData({ ...formData, items: updatedItems });
	};

	const resetForm = () => {
		setFormData({
			title: "",
			icon: "",
			category: "Event Organizer",
			items: [],
			displayOrder: 0,
		});
		setEditingAchievement(null);
		setShowForm(false);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-16">
				<div className="relative bg-gradient-to-r from-slate-900/40 via-gray-900/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
					<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
					<div className="relative flex flex-col items-center gap-4">
						<div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
							<svg
								className="w-8 h-8 text-amber-300 animate-spin"
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
							<h3 className="text-amber-200 font-medium text-lg mb-1">
								Loading Achievements
							</h3>
							<p className="text-gray-400 text-sm">
								Please wait while we fetch achievement data...
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
			<div className="relative bg-gradient-to-r from-amber-900/30 via-yellow-900/30 to-amber-900/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
				<div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-yellow-500/5 to-amber-500/5 rounded-2xl"></div>
				<div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
							<svg
								className="w-6 h-6 text-amber-300"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
								/>
							</svg>
						</div>
						<div>
							<h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent">
								Achievement Management
							</h2>
							<p className="text-gray-400 text-sm">
								Manage awards, recognitions and accomplishments
							</p>
						</div>
					</div>
					<button
						onClick={() => setShowForm(true)}
						className="flex items-center gap-2 w-full sm:w-auto bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-200 px-4 py-2 rounded-lg hover:from-amber-500/30 hover:to-yellow-500/30 transition-all duration-200 backdrop-blur-sm border border-amber-500/30 text-sm sm:text-base"
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
						Add Achievement
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
						<div className="relative bg-gradient-to-r from-slate-900/90 via-gray-900/90 to-slate-900/90 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/20 w-full max-w-3xl my-4 sm:my-8 shadow-2xl">
							<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
							<div className="relative">
								<div className="flex items-center gap-3 mb-4 sm:mb-6">
									<div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
										<svg
											className="w-6 h-6 text-amber-300"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
											/>
										</svg>
									</div>
									<h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent">
										{editingAchievement
											? "Edit Achievement"
											: "Add Achievement"}
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
													className="w-4 h-4 text-amber-400"
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
															title: e.target
																.value,
														})
													}
													className="w-full bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 text-sm sm:text-base"
													placeholder="Enter achievement title"
													required
												/>
											</div>
										</div>
										<div>
											<label className="flex items-center gap-2 text-gray-300 mb-3 text-sm sm:text-base font-medium">
												<svg
													className="w-4 h-4 text-amber-400"
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
													className="w-full bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
													placeholder="0"
												/>
											</div>
										</div>
									</div>

									<div>
										<label className="flex items-center gap-2 text-gray-300 mb-3 font-medium">
											<svg
												className="w-4 h-4 text-amber-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
											Icon
										</label>
										<div className="relative">
											<input
												type="text"
												value={formData.icon}
												onChange={(e) =>
													setFormData({
														...formData,
														icon: e.target.value,
													})
												}
												className="w-full bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
												placeholder="e.g., 🏆"
												required
											/>
										</div>
										<div className="mt-4">
											<p className="text-xs sm:text-sm text-gray-400 mb-3 font-medium">
												Quick select popular icons:
											</p>
											<div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
												{commonIcons.map(
													(icon, index) => (
														<button
															key={index}
															type="button"
															onClick={() =>
																setFormData({
																	...formData,
																	icon,
																})
															}
															className="relative group text-lg sm:text-xl p-3 bg-gradient-to-br from-slate-700/50 to-gray-700/50 hover:from-amber-500/20 hover:to-yellow-500/20 rounded-xl border border-white/10 hover:border-amber-500/30 transition-all duration-200 backdrop-blur-sm"
														>
															<span className="relative z-10">
																{icon}
															</span>
															<div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-yellow-500/0 group-hover:from-amber-500/10 group-hover:to-yellow-500/10 rounded-xl transition-all duration-200"></div>
														</button>
													)
												)}
											</div>
										</div>
									</div>

									<div>
										<label className="flex items-center gap-2 text-gray-300 mb-3 font-medium">
											<svg
												className="w-4 h-4 text-amber-400"
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
											Category
										</label>
										<div className="relative">
											<select
												value={formData.category}
												onChange={(e) =>
													setFormData({
														...formData,
														category:
															e.target.value,
													})
												}
												className="w-full bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 appearance-none cursor-pointer"
												required
											>
												{categories.map((cat) => (
													<option
														key={cat}
														value={cat}
														className="bg-gray-800"
													>
														{cat}
													</option>
												))}
											</select>
											<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
												<svg
													className="w-5 h-5 text-gray-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											</div>
										</div>
									</div>

									<div>
										<div className="flex justify-between items-center mb-4">
											<label className="flex items-center gap-2 text-gray-300 font-medium">
												<svg
													className="w-4 h-4 text-amber-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
													/>
												</svg>
												Achievement Items
											</label>
											<button
												type="button"
												onClick={addItem}
												className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 px-4 py-2 rounded-lg hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-200 backdrop-blur-sm border border-green-500/30 text-sm font-medium"
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
												Add Item
											</button>
										</div>
										<div className="space-y-3 max-h-60 overflow-y-auto">
											{formData.items.map(
												(item, index) => (
													<div
														key={index}
														className="relative bg-gradient-to-r from-slate-800/40 to-gray-800/40 backdrop-blur-sm p-4 rounded-xl border border-white/10"
													>
														<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 to-gray-500/5 rounded-xl"></div>
														<div className="relative flex gap-3 items-start">
															<div className="flex-1 space-y-3">
																<input
																	type="text"
																	value={
																		item.name
																	}
																	onChange={(
																		e
																	) =>
																		updateItem(
																			index,
																			"name",
																			e
																				.target
																				.value
																		)
																	}
																	placeholder="Achievement name"
																	className="w-full bg-gradient-to-r from-slate-700/50 to-gray-700/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 text-sm"
																	required
																/>
																<input
																	type="text"
																	value={
																		item.description ||
																		""
																	}
																	onChange={(
																		e
																	) =>
																		updateItem(
																			index,
																			"description",
																			e
																				.target
																				.value
																		)
																	}
																	placeholder="Description (optional)"
																	className="w-full bg-gradient-to-r from-slate-700/50 to-gray-700/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 text-sm"
																/>
															</div>
															<button
																type="button"
																onClick={() =>
																	removeItem(
																		index
																	)
																}
																className="w-8 h-8 bg-gradient-to-br from-red-500/20 to-red-600/20 text-red-300 rounded-lg hover:from-red-500/30 hover:to-red-600/30 transition-all duration-200 backdrop-blur-sm border border-red-500/30 flex items-center justify-center"
																title="Remove Item"
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
																		strokeWidth={
																			2
																		}
																		d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
																	/>
																</svg>
															</button>
														</div>
													</div>
												)
											)}
										</div>
									</div>

									<div className="flex gap-3 pt-4">
										<button
											type="submit"
											className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-200 py-3 rounded-xl hover:from-amber-500/30 hover:to-yellow-500/30 transition-all duration-200 backdrop-blur-sm border border-amber-500/30 font-medium"
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
											{editingAchievement
												? "Update Achievement"
												: "Create Achievement"}
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

			{/* Achievements Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{achievements.map((achievement) => (
					<div
						key={achievement._id}
						className={`group relative transition-all duration-300 hover:scale-[1.02] ${
							achievement.isActive
								? "bg-gradient-to-r from-amber-900/20 via-yellow-900/20 to-amber-900/20"
								: "bg-gradient-to-r from-slate-900/20 via-gray-900/20 to-slate-900/20"
						} backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-amber-500/5`}
					>
						<div
							className={`absolute inset-0 rounded-2xl ${
								achievement.isActive
									? "bg-gradient-to-r from-amber-500/5 via-yellow-500/5 to-amber-500/5"
									: "bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5"
							}`}
						></div>

						<div className="relative">
							{/* Header */}
							<div className="flex justify-between items-start mb-4">
								<div className="flex items-center gap-3">
									<div
										className={`w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10 ${
											achievement.isActive
												? "bg-gradient-to-br from-amber-500/20 to-yellow-500/20"
												: "bg-gradient-to-br from-slate-500/20 to-gray-500/20"
										}`}
									>
										<span className="text-2xl">
											{achievement.icon}
										</span>
									</div>
									<div>
										<h3
											className={`font-bold ${
												achievement.isActive
													? "text-amber-100"
													: "text-gray-400"
											}`}
										>
											{achievement.title}
										</h3>
										<p className="text-sm text-gray-400 flex items-center gap-1">
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
													d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
												/>
											</svg>
											{achievement.category}
										</p>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
									<button
										onClick={() => handleEdit(achievement)}
										className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-600/20 text-blue-300 rounded-lg hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-200 backdrop-blur-sm border border-blue-500/30 flex items-center justify-center"
										title="Edit Achievement"
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
											handleToggleStatus(achievement._id)
										}
										className={`w-8 h-8 rounded-lg transition-all duration-200 backdrop-blur-sm border flex items-center justify-center ${
											achievement.isActive
												? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30 hover:from-amber-500/30 hover:to-orange-500/30"
												: "bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30 hover:from-green-500/30 hover:to-emerald-500/30"
										}`}
										title={
											achievement.isActive
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
											{achievement.isActive ? (
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
										onClick={() =>
											handleDelete(achievement._id)
										}
										className="w-8 h-8 bg-gradient-to-br from-red-500/20 to-red-600/20 text-red-300 rounded-lg hover:from-red-500/30 hover:to-red-600/30 transition-all duration-200 backdrop-blur-sm border border-red-500/30 flex items-center justify-center"
										title="Delete Achievement"
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

							{/* Achievement Items */}
							<div className="space-y-2 mb-4">
								{achievement.items.map((item, index) => (
									<div
										key={index}
										className={`flex items-start gap-2 ${
											achievement.isActive
												? "text-gray-300"
												: "text-gray-500"
										}`}
									>
										<div className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0"></div>
										<div className="flex-1">
											<span className="text-sm font-medium">
												{item.name}
											</span>
											{item.description && (
												<p className="text-xs text-gray-500 mt-1">
													{item.description}
												</p>
											)}
										</div>
									</div>
								))}
							</div>

							{/* Footer */}
							<div className="flex items-center justify-between pt-4 border-t border-white/5">
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
									Order: {achievement.displayOrder}
								</div>
								<span
									className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
										achievement.isActive
											? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30"
											: "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/30"
									}`}
								>
									{achievement.isActive
										? "Active"
										: "Inactive"}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>

			{achievements.length === 0 && (
				<div className="flex items-center justify-center py-16">
					<div className="relative bg-gradient-to-r from-slate-900/40 via-gray-900/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center max-w-md">
						<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
						<div className="relative">
							<div className="w-20 h-20 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10 mx-auto mb-6">
								<svg
									className="w-10 h-10 text-amber-300"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent mb-2">
								No Achievements Yet
							</h3>
							<p className="text-gray-400 mb-6">
								Start building your achievement portfolio by
								adding your first accomplishment
							</p>
							<button
								onClick={() => setShowForm(true)}
								className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-200 px-6 py-3 rounded-xl hover:from-amber-500/30 hover:to-yellow-500/30 transition-all duration-200 backdrop-blur-sm border border-amber-500/30 font-medium mx-auto"
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
								Add First Achievement
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AchievementManagement;
