import React, { useState, useEffect } from "react";
import { servicesAPI } from "../../services/api";
import Portal from "../../components/Portal";
import GalleryManagement from "./GalleryManagement";

interface Service {
	_id: string;
	title: string;
	icon: string;
	description?: string;
	items?: Array<{
		name: string;
		description?: string;
		displayOrder?: number;
	}>;
	category: string;
	displayOrder: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

interface ServiceFormData {
	title: string;
	icon: string;
	description: string;
	items: Array<{
		name: string;
		description: string;
		displayOrder: number;
	}>;
	category: string;
	displayOrder: number;
}

const ServiceManagement: React.FC = () => {
	const [services, setServices] = useState<Service[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [editingService, setEditingService] = useState<Service | null>(null);
	const [filterCategory, setFilterCategory] = useState<string>("All");
	const [activeTab, setActiveTab] = useState<"services" | "gallery">(
		"services"
	);

	const [formData, setFormData] = useState<ServiceFormData>({
		title: "",
		icon: "",
		description: "",
		items: [],
		category: "Our Services",
		displayOrder: 0,
	});

	const categories = ["All", "Our Services", "Why Choose Us"];

	useEffect(() => {
		fetchServices();
	}, []);

	const fetchServices = async () => {
		try {
			setLoading(true);
			const data = await servicesAPI.getAllServicesAdmin();
			setServices(data);
			setError(null);
		} catch (err) {
			console.error("Error fetching services:", err);
			setError("Failed to fetch services");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const serviceData = {
				...formData,
				items: formData.items.filter((item) => item.name.trim() !== ""),
			};

			if (editingService) {
				await servicesAPI.updateService(
					editingService._id,
					serviceData
				);
			} else {
				await servicesAPI.createService(serviceData);
			}

			await fetchServices();
			resetForm();
			setError(null);
		} catch (err: any) {
			console.error("Error saving service:", err);
			setError(err.response?.data?.error || "Failed to save service");
		}
	};

	const handleEdit = (service: Service) => {
		setEditingService(service);
		setFormData({
			title: service.title,
			icon: service.icon,
			description: service.description || "",
			items: (service.items || []).map((item) => ({
				name: item.name,
				description: item.description || "",
				displayOrder: item.displayOrder || 0,
			})),
			category: service.category,
			displayOrder: service.displayOrder,
		});
		setShowForm(true);
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm("Are you sure you want to delete this service?")) {
			return;
		}

		try {
			await servicesAPI.deleteService(id);
			await fetchServices();
			setError(null);
		} catch (err: any) {
			console.error("Error deleting service:", err);
			setError(err.response?.data?.error || "Failed to delete service");
		}
	};

	const handleToggleStatus = async (id: string) => {
		try {
			await servicesAPI.toggleServiceStatus(id);
			await fetchServices();
			setError(null);
		} catch (err: any) {
			console.error("Error toggling service status:", err);
			setError(
				err.response?.data?.error || "Failed to toggle service status"
			);
		}
	};

	const resetForm = () => {
		setFormData({
			title: "",
			icon: "",
			description: "",
			items: [],
			category: "Our Services",
			displayOrder: 0,
		});
		setEditingService(null);
		setShowForm(false);
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

	const updateItem = (
		index: number,
		field: string,
		value: string | number
	) => {
		const updatedItems = [...formData.items];
		updatedItems[index] = { ...updatedItems[index], [field]: value };
		setFormData({ ...formData, items: updatedItems });
	};

	const removeItem = (index: number) => {
		const updatedItems = formData.items.filter((_, i) => i !== index);
		setFormData({ ...formData, items: updatedItems });
	};

	const filteredServices =
		filterCategory === "All"
			? services
			: services.filter((service) => service.category === filterCategory);

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
					Service Management
				</h3>
			</div>

			{/* Tab Navigation */}
			<div className="flex gap-2 sm:gap-4 border-b border-gray-700 overflow-x-auto">
				<button
					onClick={() => setActiveTab("services")}
					className={`px-3 sm:px-4 py-2 font-semibold border-b-2 transition-colors whitespace-nowrap text-sm sm:text-base ${
						activeTab === "services"
							? "border-yellow-400 text-yellow-400"
							: "border-transparent text-gray-400 hover:text-white"
					}`}
				>
					Services
				</button>
				<button
					onClick={() => setActiveTab("gallery")}
					className={`px-3 sm:px-4 py-2 font-semibold border-b-2 transition-colors whitespace-nowrap text-sm sm:text-base ${
						activeTab === "gallery"
							? "border-yellow-400 text-yellow-400"
							: "border-transparent text-gray-400 hover:text-white"
					}`}
				>
					Gallery
				</button>
			</div>

			{/* Services Tab Content */}
			{activeTab === "services" && (
				<div className="space-y-4 sm:space-y-6">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
						<button
							onClick={() => setShowForm(true)}
							className="w-full sm:w-auto bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors text-sm sm:text-base"
						>
							Add New Service
						</button>
					</div>

					{error && (
						<div className="bg-red-500/20 border border-red-500 text-red-300 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm sm:text-base">
							{error}
						</div>
					)}

					{/* Filter */}
					<div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
						<label className="text-gray-300 font-medium text-sm sm:text-base">
							Filter by Category:
						</label>
						<select
							value={filterCategory}
							onChange={(e) => setFilterCategory(e.target.value)}
							className="w-full sm:w-auto bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
						>
							{categories.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>
					</div>

					{/* Services List */}
					<div className="grid gap-4 sm:gap-6">
						{filteredServices.map((service) => (
							<div
								key={service._id}
								className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6"
							>
								<div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 mb-4">
									<div className="flex items-center gap-3">
										<span className="text-xl sm:text-2xl">
											{service.icon}
										</span>
										<div>
											<h4 className="text-lg sm:text-xl font-bold text-white">
												{service.title}
											</h4>
											<span className="text-xs sm:text-sm text-gray-400">
												{service.category}
											</span>
										</div>
									</div>
									<div className="flex flex-wrap gap-2 w-full sm:w-auto">
										<button
											onClick={() =>
												handleToggleStatus(service._id)
											}
											className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 ${
												service.isActive
													? "bg-green-600 text-white hover:bg-green-700"
													: "bg-gray-600 text-gray-300 hover:bg-gray-500"
											}`}
										>
											{service.isActive
												? "Active"
												: "Inactive"}
										</button>
										<button
											onClick={() => handleEdit(service)}
											className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-blue-700 transition-all duration-200 hover:scale-105"
										>
											Edit
										</button>
										<button
											onClick={() =>
												handleDelete(service._id)
											}
											className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-700 transition-all duration-200 hover:scale-105"
										>
											Delete
										</button>
									</div>
								</div>

								{service.description && (
									<p className="text-gray-300 mb-3 text-sm sm:text-base">
										{service.description}
									</p>
								)}

								{service.items && service.items.length > 0 && (
									<div>
										<h5 className="text-xs sm:text-sm font-medium text-gray-400 mb-2">
											Items:
										</h5>
										<ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
											{service.items.map(
												(item, index) => (
													<li key={index}>
														{item.name}
													</li>
												)
											)}
										</ul>
									</div>
								)}

								<div className="mt-3 text-xs text-gray-500">
									Display Order: {service.displayOrder} |
									Created:{" "}
									{new Date(
										service.createdAt
									).toLocaleDateString()}
								</div>
							</div>
						))}
					</div>

					{filteredServices.length === 0 && (
						<div className="text-center py-6 sm:py-8 text-gray-400 text-sm sm:text-base">
							No services found for the selected category.
						</div>
					)}

					{/* Form Modal */}
					{showForm && (
						<Portal>
							<div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-2 sm:p-4 z-50 overflow-y-auto">
								<div className="bg-gray-800 rounded-lg p-4 sm:p-6 max-w-2xl w-full my-4 sm:my-8">
									<div className="flex justify-between items-center mb-4 sm:mb-6">
										<h3 className="text-lg sm:text-xl font-bold text-white">
											{editingService
												? "Edit Service"
												: "Add New Service"}
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
										<div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
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
															title: e.target
																.value,
														})
													}
													className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
													required
												/>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-300 mb-2">
													Icon (Emoji) *
												</label>
												<input
													type="text"
													value={formData.icon}
													onChange={(e) =>
														setFormData({
															...formData,
															icon: e.target
																.value,
														})
													}
													className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
													placeholder="🎈"
													required
												/>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
											<div>
												<label className="block text-sm font-medium text-gray-300 mb-2">
													Category *
												</label>
												<select
													value={formData.category}
													onChange={(e) =>
														setFormData({
															...formData,
															category:
																e.target.value,
														})
													}
													className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
													required
												>
													<option value="Our Services">
														Our Services
													</option>
													<option value="Why Choose Us">
														Why Choose Us
													</option>
												</select>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-300 mb-2">
													Display Order
												</label>
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
													className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
												/>
											</div>
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
														description:
															e.target.value,
													})
												}
												rows={3}
												className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base resize-none"
												placeholder="Optional description for the service..."
											/>
										</div>

										{/* Items Section */}
										<div>
											<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3">
												<label className="block text-sm font-medium text-gray-300">
													Service Items (Optional)
												</label>
												<button
													type="button"
													onClick={addItem}
													className="w-full sm:w-auto bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
												>
													Add Item
												</button>
											</div>

											{formData.items.map(
												(item, index) => (
													<div
														key={index}
														className="flex flex-col sm:flex-row gap-2 mb-2"
													>
														<input
															type="text"
															value={item.name}
															onChange={(e) =>
																updateItem(
																	index,
																	"name",
																	e.target
																		.value
																)
															}
															placeholder="Item name"
															className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
														/>
														<input
															type="number"
															value={
																item.displayOrder
															}
															onChange={(e) =>
																updateItem(
																	index,
																	"displayOrder",
																	parseInt(
																		e.target
																			.value
																	) || 0
																)
															}
															placeholder="Order"
															className="w-full sm:w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
														/>
														<button
															type="button"
															onClick={() =>
																removeItem(
																	index
																)
															}
															className="w-full sm:w-auto bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors"
														>
															×
														</button>
													</div>
												)
											)}
										</div>

										<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
											<button
												type="submit"
												className="flex-1 bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors text-sm sm:text-base"
											>
												{editingService
													? "Update Service"
													: "Create Service"}
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
				</div>
			)}

			{/* Gallery Tab Content */}
			{activeTab === "gallery" && (
				<GalleryManagement category="Services" />
			)}
		</div>
	);
};

export default ServiceManagement;
