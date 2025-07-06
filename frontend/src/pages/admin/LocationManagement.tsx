import React, { useState, useEffect } from "react";
import { locationsAPI } from "../../services/api";

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
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-white">
					Location Management
				</h2>
				<button
					onClick={() => setShowForm(true)}
					className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
				>
					Add New Location
				</button>
			</div>

			{error && (
				<div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
					{error}
				</div>
			)}

			{/* Form Modal */}
			{showForm && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-gray-800 p-6 rounded-xl border border-gray-700 w-full max-w-md">
						<h3 className="text-xl font-bold text-white mb-4">
							{editingLocation
								? "Edit Location"
								: "Add New Location"}
						</h3>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-gray-300 mb-2">
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
									className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
									required
								/>
							</div>
							<div>
								<label className="block text-gray-300 mb-2">
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
									className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
									rows={3}
									required
								/>
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
									placeholder="e.g., 📍"
								/>
							</div>
							<div>
								<label className="block text-gray-300 mb-2">
									Display Order
								</label>
								<input
									type="number"
									value={formData.displayOrder}
									onChange={(e) =>
										setFormData({
											...formData,
											displayOrder:
												parseInt(e.target.value) || 0,
										})
									}
									className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
								/>
							</div>
							<div className="flex gap-3">
								<button
									type="submit"
									className="flex-1 bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-400 transition-colors"
								>
									{editingLocation ? "Update" : "Create"}
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
			)}

			{/* Locations List */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{locations.map((location) => (
					<div
						key={location._id}
						className={`p-6 rounded-xl border ${
							location.isActive
								? "bg-gray-800 border-gray-700"
								: "bg-gray-800/50 border-gray-600"
						}`}
					>
						<div className="flex items-start justify-between mb-4">
							<div className="flex items-center gap-3">
								<span className="text-2xl">
									{location.icon}
								</span>
								<div>
									<h3
										className={`font-bold ${
											location.isActive
												? "text-white"
												: "text-gray-400"
										}`}
									>
										{location.name}
									</h3>
									<p className="text-sm text-gray-400">
										Order: {location.displayOrder}
									</p>
								</div>
							</div>
							<div className="flex gap-2">
								<button
									onClick={() => handleEdit(location)}
									className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/20 p-1 rounded-md transition-all duration-200 transform hover:scale-110"
									title="Edit"
								>
									✏️
								</button>
								<button
									onClick={() =>
										handleToggleStatus(location._id)
									}
									className={`p-1 rounded-md transition-all duration-200 transform hover:scale-110 ${
										location.isActive
											? "text-green-400 hover:text-green-300 hover:bg-green-400/20"
											: "text-gray-400 hover:text-gray-300 hover:bg-gray-400/20"
									}`}
									title={
										location.isActive
											? "Deactivate"
											: "Activate"
									}
								>
									{location.isActive ? "👁️" : "👁️‍🗨️"}
								</button>
								<button
									onClick={() => handleDelete(location._id)}
									className="text-red-400 hover:text-red-300 hover:bg-red-400/20 p-1 rounded-md transition-all duration-200 transform hover:scale-110"
									title="Delete"
								>
									🗑️
								</button>
							</div>
						</div>
						<p
							className={`text-sm ${
								location.isActive
									? "text-gray-300"
									: "text-gray-500"
							}`}
						>
							{location.address}
						</p>
						<div className="mt-4 flex justify-between text-xs text-gray-500">
							<span>
								Created:{" "}
								{new Date(
									location.createdAt
								).toLocaleDateString()}
							</span>
							<span
								className={`px-2 py-1 rounded ${
									location.isActive
										? "bg-green-500/20 text-green-400"
										: "bg-gray-500/20 text-gray-400"
								}`}
							>
								{location.isActive ? "Active" : "Inactive"}
							</span>
						</div>
					</div>
				))}
			</div>

			{locations.length === 0 && (
				<div className="text-center py-12">
					<p className="text-gray-400 text-lg">No locations found</p>
					<button
						onClick={() => setShowForm(true)}
						className="mt-4 bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors"
					>
						Add First Location
					</button>
				</div>
			)}
		</div>
	);
};

export default LocationManagement;
