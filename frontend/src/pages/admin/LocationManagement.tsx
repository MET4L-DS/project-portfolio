import React, { useState, useEffect } from "react";
import { locationsAPI } from "../../services/api";
import Portal from "../../components/Portal";

interface Location {
	_id: string;
	name: string;
	address: string;
	icon: string;
	displayOrder: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

interface LocationFormData {
	name: string;
	address: string;
	icon: string;
	displayOrder: number;
}

const LocationManagement: React.FC = () => {
	const [locations, setLocations] = useState<Location[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [editingLocation, setEditingLocation] = useState<Location | null>(
		null
	);
	const [formData, setFormData] = useState<LocationFormData>({
		name: "",
		address: "",
		icon: "📍",
		displayOrder: 0,
	});

	// Load locations
	useEffect(() => {
		fetchLocations();
	}, []);

	const fetchLocations = async () => {
		try {
			setLoading(true);
			const data = await locationsAPI.getAllLocationsAdmin();
			setLocations(data);
		} catch (error: any) {
			setError(error.response?.data?.error || "Error fetching locations");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (editingLocation) {
				await locationsAPI.updateLocation(
					editingLocation._id,
					formData
				);
			} else {
				await locationsAPI.createLocation(formData);
			}
			await fetchLocations();
			resetForm();
		} catch (error: any) {
			setError(error.response?.data?.error || "Error saving location");
		}
	};

	const handleEdit = (location: Location) => {
		setEditingLocation(location);
		setFormData({
			name: location.name,
			address: location.address,
			icon: location.icon,
			displayOrder: location.displayOrder,
		});
		setShowForm(true);
	};

	const handleDelete = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this location?")) {
			try {
				await locationsAPI.deleteLocation(id);
				await fetchLocations();
			} catch (error: any) {
				setError(
					error.response?.data?.error || "Error deleting location"
				);
			}
		}
	};

	const handleToggleStatus = async (id: string) => {
		try {
			await locationsAPI.toggleLocationStatus(id);
			await fetchLocations();
		} catch (error: any) {
			setError(
				error.response?.data?.error || "Error updating location status"
			);
		}
	};

	const resetForm = () => {
		setFormData({
			name: "",
			address: "",
			icon: "📍",
			displayOrder: 0,
		});
		setEditingLocation(null);
		setShowForm(false);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-16">
				<div className="relative bg-gradient-to-r from-slate-900/40 via-gray-900/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
					<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
					<div className="relative flex flex-col items-center gap-4">
						<div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
							<svg
								className="w-8 h-8 text-emerald-300 animate-spin"
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
							<h3 className="text-emerald-200 font-medium text-lg mb-1">
								Loading Locations
							</h3>
							<p className="text-gray-400 text-sm">
								Please wait while we fetch location data...
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
			<div className="relative bg-gradient-to-r from-emerald-900/30 via-green-900/30 to-teal-900/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
				<div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-teal-500/5 rounded-2xl"></div>
				<div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
							<svg
								className="w-6 h-6 text-emerald-300"
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
						</div>
						<div>
							<h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-200 to-green-200 bg-clip-text text-transparent">
								Location Management
							</h2>
							<p className="text-gray-400 text-sm">
								Manage school training centers and locations
							</p>
						</div>
					</div>
					<button
						onClick={() => setShowForm(true)}
						className="flex items-center gap-2 w-full sm:w-auto bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-200 px-4 py-2 rounded-lg hover:from-emerald-500/30 hover:to-green-500/30 transition-all duration-200 backdrop-blur-sm border border-emerald-500/30 text-sm sm:text-base"
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
						Add New Location
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
					<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
						<div className="relative bg-gradient-to-r from-slate-900/90 via-gray-900/90 to-slate-900/90 backdrop-blur-sm rounded-2xl w-full max-w-md my-8 border border-white/10">
							<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
							<div className="relative p-6">
								{/* Modal Header */}
								<div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10">
											<svg
												className="w-5 h-5 text-emerald-300"
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
										</div>
										<h3 className="text-xl font-bold bg-gradient-to-r from-emerald-200 to-green-200 bg-clip-text text-transparent">
											{editingLocation
												? "Edit Location"
												: "Add New Location"}
										</h3>
									</div>
									<button
										onClick={resetForm}
										className="w-8 h-8 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg flex items-center justify-center text-red-300 hover:from-red-500/30 hover:to-red-600/30 transition-all duration-200 backdrop-blur-sm border border-red-500/30"
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
									className="space-y-4"
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
											Name
										</label>
										<input
											type="text"
											value={formData.name}
											onChange={(e) =>
												setFormData({
													...formData,
													name: e.target.value,
												})
											}
											className="w-full px-4 py-3 bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
											placeholder="Enter location name"
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
													d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
												/>
											</svg>
											Address
										</label>
										<textarea
											value={formData.address}
											onChange={(e) =>
												setFormData({
													...formData,
													address: e.target.value,
												})
											}
											className="w-full px-4 py-3 bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 resize-none"
											rows={3}
											placeholder="Enter full address"
											required
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
													d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-4-8V3m0 3L8 9l4 4 4-4V6z"
												/>
											</svg>
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
											className="w-full px-4 py-3 bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
											placeholder="e.g., 📍"
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
											className="w-full px-4 py-3 bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
											placeholder="0"
										/>
									</div>
									<div className="flex gap-3 pt-4">
										<button
											type="submit"
											className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-200 py-3 rounded-xl hover:from-emerald-500/30 hover:to-green-500/30 transition-all duration-200 backdrop-blur-sm border border-emerald-500/30 font-medium"
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
											{editingLocation
												? "Update"
												: "Create"}
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

			{/* Locations List */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{locations.map((location) => (
					<div
						key={location._id}
						className={`group relative transition-all duration-300 hover:scale-[1.02] ${
							location.isActive
								? "bg-gradient-to-r from-emerald-900/20 via-green-900/20 to-teal-900/20"
								: "bg-gradient-to-r from-slate-900/20 via-gray-900/20 to-slate-900/20"
						} backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-emerald-500/5`}
					>
						<div
							className={`absolute inset-0 rounded-2xl ${
								location.isActive
									? "bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-teal-500/5"
									: "bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5"
							}`}
						></div>

						<div className="relative">
							{/* Header */}
							<div className="flex items-start justify-between mb-4">
								<div className="flex items-center gap-3">
									<div
										className={`w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10 ${
											location.isActive
												? "bg-gradient-to-br from-emerald-500/20 to-green-500/20"
												: "bg-gradient-to-br from-slate-500/20 to-gray-500/20"
										}`}
									>
										<span className="text-xl">
											{location.icon || "📍"}
										</span>
									</div>
									<div>
										<h3
											className={`font-bold text-lg ${
												location.isActive
													? "text-emerald-100"
													: "text-gray-400"
											}`}
										>
											{location.name}
										</h3>
										<p className="text-sm text-gray-500 flex items-center gap-1">
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
											Order: {location.displayOrder}
										</p>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
									<button
										onClick={() => handleEdit(location)}
										className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-600/20 text-blue-300 rounded-lg hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-200 backdrop-blur-sm border border-blue-500/30 flex items-center justify-center"
										title="Edit Location"
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
											handleToggleStatus(location._id)
										}
										className={`w-8 h-8 rounded-lg transition-all duration-200 backdrop-blur-sm border flex items-center justify-center ${
											location.isActive
												? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30 hover:from-amber-500/30 hover:to-orange-500/30"
												: "bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30 hover:from-green-500/30 hover:to-emerald-500/30"
										}`}
										title={
											location.isActive
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
											{location.isActive ? (
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
											handleDelete(location._id)
										}
										className="w-8 h-8 bg-gradient-to-br from-red-500/20 to-red-600/20 text-red-300 rounded-lg hover:from-red-500/30 hover:to-red-600/30 transition-all duration-200 backdrop-blur-sm border border-red-500/30 flex items-center justify-center"
										title="Delete Location"
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

							{/* Address */}
							<div className="mb-4">
								<p
									className={`text-sm leading-relaxed ${
										location.isActive
											? "text-gray-300"
											: "text-gray-500"
									}`}
								>
									{location.address}
								</p>
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
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
									{new Date(
										location.createdAt
									).toLocaleDateString()}
								</div>
								<span
									className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
										location.isActive
											? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30"
											: "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/30"
									}`}
								>
									{location.isActive ? "Active" : "Inactive"}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>

			{locations.length === 0 && (
				<div className="flex items-center justify-center py-16">
					<div className="relative bg-gradient-to-r from-slate-900/40 via-gray-900/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center max-w-md">
						<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
						<div className="relative">
							<div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/10">
								<svg
									className="w-10 h-10 text-emerald-300"
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
							</div>
							<h3 className="text-xl font-bold text-gray-200 mb-2">
								No Locations Found
							</h3>
							<p className="text-gray-400 mb-6 leading-relaxed">
								Get started by adding your first training center
								location.
							</p>
							<button
								onClick={() => setShowForm(true)}
								className="flex items-center gap-2 mx-auto bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-200 px-6 py-3 rounded-xl hover:from-emerald-500/30 hover:to-green-500/30 transition-all duration-200 backdrop-blur-sm border border-emerald-500/30 font-medium"
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
								Add First Location
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default LocationManagement;
