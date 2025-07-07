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
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
			</div>
		);
	}

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
				<h2 className="text-xl sm:text-2xl font-bold text-white">
					Achievement Management
				</h2>
				<button
					onClick={() => setShowForm(true)}
					className="w-full sm:w-auto bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors text-sm sm:text-base"
				>
					Add Achievement
				</button>
			</div>

			{error && (
				<div className="bg-red-500/20 border border-red-500 text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base">
					{error}
				</div>
			)}

			{/* Form Modal */}
			{showForm && (
				<Portal>
					<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-2 sm:p-4 overflow-y-auto">
						<div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 w-full max-w-3xl my-4 sm:my-8">
							<h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
								{editingAchievement
									? "Edit Achievement"
									: "Add Achievement"}
							</h3>
							<form
								onSubmit={handleSubmit}
								className="space-y-3 sm:space-y-4"
							>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
									<div>
										<label className="block text-gray-300 mb-2 text-sm sm:text-base">
											Title
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
											className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none text-sm sm:text-base"
											required
										/>
									</div>
									<div>
										<label className="block text-gray-300 mb-2 text-sm sm:text-base">
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
											className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
										/>
									</div>
								</div>

								<div>
									<label className="block text-gray-300 mb-2">
										Icon
									</label>
									<input
										type="text"
										value={formData.icon}
										onChange={(e) =>
											setFormData({
												...formData,
												icon: e.target.value,
											})
										}
										className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
										placeholder="e.g., 🏆"
										required
									/>
									<div className="mt-2">
										<p className="text-xs sm:text-sm text-gray-400 mb-2">
											Quick select:
										</p>
										<div className="grid grid-cols-6 sm:grid-cols-8 gap-1 sm:gap-2">
											{commonIcons.map((icon, index) => (
												<button
													key={index}
													type="button"
													onClick={() =>
														setFormData({
															...formData,
															icon,
														})
													}
													className="text-lg sm:text-xl p-1.5 sm:p-2 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 hover:border-yellow-400 transition-colors"
												>
													{icon}
												</button>
											))}
										</div>
									</div>
								</div>

								<div>
									<label className="block text-gray-300 mb-2">
										Category
									</label>
									<select
										value={formData.category}
										onChange={(e) =>
											setFormData({
												...formData,
												category: e.target.value,
											})
										}
										className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
										required
									>
										{categories.map((cat) => (
											<option key={cat} value={cat}>
												{cat}
											</option>
										))}
									</select>
								</div>

								<div>
									<div className="flex justify-between items-center mb-3">
										<label className="block text-gray-300">
											Achievement Items
										</label>
										<button
											type="button"
											onClick={addItem}
											className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-400 transition-colors"
										>
											Add Item
										</button>
									</div>
									<div className="space-y-3 max-h-60 overflow-y-auto">
										{formData.items.map((item, index) => (
											<div
												key={index}
												className="flex gap-3 items-start bg-gray-700/50 p-3 rounded-lg"
											>
												<div className="flex-1">
													<input
														type="text"
														value={item.name}
														onChange={(e) =>
															updateItem(
																index,
																"name",
																e.target.value
															)
														}
														placeholder="Achievement name"
														className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-yellow-400 focus:outline-none mb-2"
														required
													/>
													<input
														type="text"
														value={
															item.description ||
															""
														}
														onChange={(e) =>
															updateItem(
																index,
																"description",
																e.target.value
															)
														}
														placeholder="Description (optional)"
														className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-yellow-400 focus:outline-none"
													/>
												</div>
												<button
													type="button"
													onClick={() =>
														removeItem(index)
													}
													className="text-red-400 hover:text-red-300 p-2"
												>
													🗑️
												</button>
											</div>
										))}
									</div>
								</div>

								<div className="flex gap-3">
									<button
										type="submit"
										className="flex-1 bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-400 transition-colors"
									>
										{editingAchievement
											? "Update"
											: "Create"}
									</button>
									<button
										type="button"
										onClick={resetForm}
										className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-500 transition-colors"
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				</Portal>
			)}

			{/* Achievements Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{achievements.map((achievement) => (
					<div
						key={achievement._id}
						className={`p-6 rounded-xl border ${
							achievement.isActive
								? "bg-gray-800 border-gray-700"
								: "bg-gray-800/50 border-gray-600"
						}`}
					>
						<div className="flex justify-between items-start mb-4">
							<div className="flex items-center gap-3">
								<span className="text-2xl">
									{achievement.icon}
								</span>
								<div>
									<h3
										className={`font-bold ${
											achievement.isActive
												? "text-yellow-400"
												: "text-gray-400"
										}`}
									>
										{achievement.title}
									</h3>
									<p className="text-sm text-gray-400">
										{achievement.category}
									</p>
								</div>
							</div>
							<div className="flex gap-2">
								<button
									onClick={() => handleEdit(achievement)}
									className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/20 p-1 rounded-md transition-all duration-200 transform hover:scale-110"
									title="Edit"
								>
									✏️
								</button>
								<button
									onClick={() =>
										handleToggleStatus(achievement._id)
									}
									className={`p-1 rounded-md transition-all duration-200 transform hover:scale-110 ${
										achievement.isActive
											? "text-green-400 hover:text-green-300 hover:bg-green-400/20"
											: "text-gray-400 hover:text-gray-300 hover:bg-gray-400/20"
									}`}
									title={
										achievement.isActive
											? "Deactivate"
											: "Activate"
									}
								>
									{achievement.isActive ? "👁️" : "👁️‍🗨️"}
								</button>
								<button
									onClick={() =>
										handleDelete(achievement._id)
									}
									className="text-red-400 hover:text-red-300 hover:bg-red-400/20 p-1 rounded-md transition-all duration-200 transform hover:scale-110"
									title="Delete"
								>
									🗑️
								</button>
							</div>
						</div>

						<div className="space-y-2">
							{achievement.items.map((item, index) => (
								<div
									key={index}
									className={`flex items-center ${
										achievement.isActive
											? "text-gray-300"
											: "text-gray-500"
									}`}
								>
									<span className="text-yellow-400 mr-2">
										•
									</span>
									<span className="text-sm">{item.name}</span>
								</div>
							))}
						</div>

						<div className="mt-4 flex justify-between text-xs">
							<span className="text-gray-500">
								Order: {achievement.displayOrder}
							</span>
							<span
								className={`px-2 py-1 rounded ${
									achievement.isActive
										? "bg-green-500/20 text-green-400"
										: "bg-gray-500/20 text-gray-400"
								}`}
							>
								{achievement.isActive ? "Active" : "Inactive"}
							</span>
						</div>
					</div>
				))}
			</div>

			{achievements.length === 0 && (
				<div className="text-center py-12">
					<p className="text-gray-400 text-lg">
						No achievements found
					</p>
					<button
						onClick={() => setShowForm(true)}
						className="mt-4 bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors"
					>
						Add First Achievement
					</button>
				</div>
			)}
		</div>
	);
};

export default AchievementManagement;
