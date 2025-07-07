import React, { useState, useEffect } from "react";
import { journeyAPI } from "../../services/api";
import Portal from "../../components/Portal";

interface JourneyItem {
	_id: string;
	year: string;
	title: string;
	description: string;
	logo?: string;
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
	logo: string;
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
		logo: "",
		logoAlt: "",
		logoDescription: "",
		displayOrder: 0,
	});

	// Load journey items
	useEffect(() => {
		fetchJourneyItems();
	}, []);

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
		try {
			if (editingItem) {
				await journeyAPI.updateJourneyItem(editingItem._id, formData);
			} else {
				await journeyAPI.createJourneyItem(formData);
			}
			await fetchJourneyItems();
			resetForm();
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
			logo: item.logo || "",
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
			logo: "",
			logoAlt: "",
			logoDescription: "",
			displayOrder: 0,
		});
		setEditingItem(null);
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
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
				<h2 className="text-xl sm:text-2xl font-bold text-white">
					Journey Management
				</h2>
				<button
					onClick={() => setShowForm(true)}
					className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors text-sm sm:text-base"
				>
					Add Journey Item
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
						<div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-4 sm:my-8">
							<h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
								{editingItem
									? "Edit Journey Item"
									: "Add Journey Item"}
							</h3>
							<form
								onSubmit={handleSubmit}
								className="space-y-3 sm:space-y-4"
							>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
									<div>
										<label className="block text-gray-300 mb-2 text-sm sm:text-base">
											Year
										</label>
										<input
											type="text"
											value={formData.year}
											onChange={(e) =>
												setFormData({
													...formData,
													year: e.target.value,
												})
											}
											className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none text-sm sm:text-base"
											placeholder="e.g., 2025 or 2020-21"
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
											className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none text-sm sm:text-base"
										/>
									</div>
								</div>
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
										className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none text-sm sm:text-base resize-none"
										rows={3}
										required
									/>
								</div>
								<div>
									<label className="block text-gray-300 mb-2 text-sm sm:text-base">
										Logo Path (Optional)
									</label>
									<input
										type="text"
										value={formData.logo}
										onChange={(e) =>
											setFormData({
												...formData,
												logo: e.target.value,
											})
										}
										className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none text-sm sm:text-base"
										placeholder="e.g., ./logo/company_logo.jpg"
									/>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
									<div>
										<label className="block text-gray-300 mb-2 text-sm sm:text-base">
											Logo Alt Text
										</label>
										<input
											type="text"
											value={formData.logoAlt}
											onChange={(e) =>
												setFormData({
													...formData,
													logoAlt: e.target.value,
												})
											}
											className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none text-sm sm:text-base"
										/>
									</div>
									<div>
										<label className="block text-gray-300 mb-2 text-sm sm:text-base">
											Logo Description
										</label>
										<input
											type="text"
											value={formData.logoDescription}
											onChange={(e) =>
												setFormData({
													...formData,
													logoDescription:
														e.target.value,
												})
											}
											className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none text-sm sm:text-base"
										/>
									</div>
								</div>
								<div className="flex flex-col sm:flex-row gap-3 pt-2">
									<button
										type="submit"
										className="flex-1 bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-400 transition-colors text-sm sm:text-base font-medium"
									>
										{editingItem ? "Update" : "Create"}
									</button>
									<button
										type="button"
										onClick={resetForm}
										className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-500 transition-colors text-sm sm:text-base font-medium"
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				</Portal>
			)}

			{/* Journey Items List */}
			<div className="space-y-3 sm:space-y-4">
				{journeyItems.map((item) => (
					<div
						key={item._id}
						className={`p-4 sm:p-6 rounded-xl border ${
							item.isActive
								? "bg-gray-800 border-gray-700"
								: "bg-gray-800/50 border-gray-600"
						}`}
					>
						<div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
							<div
								className={`rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 ${
									item.isActive
										? "bg-yellow-400 text-black"
										: "bg-gray-600 text-gray-300"
								}`}
							>
								{item.year}
							</div>
							<div className="flex-1 w-full sm:w-auto">
								<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3">
									<h3
										className={`text-lg sm:text-xl font-bold ${
											item.isActive
												? "text-yellow-400"
												: "text-gray-400"
										}`}
									>
										{item.title}
									</h3>
									<div className="flex gap-2 sm:gap-3">
										<button
											onClick={() => handleEdit(item)}
											className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/20 p-2 sm:p-1 rounded-md transition-all duration-200 transform hover:scale-110 text-base sm:text-sm"
											title="Edit"
										>
											✏️
										</button>
										<button
											onClick={() =>
												handleToggleStatus(item._id)
											}
											className={`p-2 sm:p-1 rounded-md transition-all duration-200 transform hover:scale-110 text-base sm:text-sm ${
												item.isActive
													? "text-green-400 hover:text-green-300 hover:bg-green-400/20"
													: "text-gray-400 hover:text-gray-300 hover:bg-gray-400/20"
											}`}
											title={
												item.isActive
													? "Deactivate"
													: "Activate"
											}
										>
											{item.isActive ? "👁️" : "👁️‍🗨️"}
										</button>
										<button
											onClick={() =>
												handleDelete(item._id)
											}
											className="text-red-400 hover:text-red-300 hover:bg-red-400/20 p-2 sm:p-1 rounded-md transition-all duration-200 transform hover:scale-110 text-base sm:text-sm"
											title="Delete"
										>
											🗑️
										</button>
									</div>
								</div>
								<p
									className={`leading-relaxed mb-3 text-sm sm:text-base ${
										item.isActive
											? "text-gray-300"
											: "text-gray-500"
									}`}
								>
									{item.description}
								</p>
								{item.logo && (
									<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-gray-400 mb-3">
										<span>📸 Logo: {item.logo}</span>
										{item.logoDescription && (
											<span>
												{window.innerWidth >= 640
													? "•"
													: ""}{" "}
												{item.logoDescription}
											</span>
										)}
									</div>
								)}
								<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 text-xs">
									<span className="text-gray-500">
										Order: {item.displayOrder}
									</span>
									<span
										className={`px-2 py-1 rounded text-center sm:text-left ${
											item.isActive
												? "bg-green-500/20 text-green-400"
												: "bg-gray-500/20 text-gray-400"
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
				<div className="text-center py-8 sm:py-12">
					<p className="text-gray-400 text-base sm:text-lg mb-3 sm:mb-4">
						No journey items found
					</p>
					<button
						onClick={() => setShowForm(true)}
						className="bg-yellow-500 text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-yellow-400 transition-colors text-sm sm:text-base"
					>
						Add First Journey Item
					</button>
				</div>
			)}
		</div>
	);
};

export default JourneyManagement;
