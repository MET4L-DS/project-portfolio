import React, { useState, useEffect } from "react";
import { magazineAPI } from "../../services/api";
import MagazineForm from "./MagazineForm";

interface Magazine {
	_id: string;
	title: string;
	year: number;
	month: string;
	description: string;
	pdfUrl: string;
	coverImageUrl?: string;
	isActive: boolean;
	views: number;
	downloadCount: number;
	createdAt: string;
	updatedAt: string;
}

const MagazineManagement: React.FC = () => {
	const [magazines, setMagazines] = useState<Magazine[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [editingMagazine, setEditingMagazine] = useState<Magazine | null>(
		null
	);
	const [filters, setFilters] = useState({
		search: "",
		year: "",
		isActive: "",
	});
	const [pagination, setPagination] = useState({
		current: 1,
		total: 1,
		hasNext: false,
		hasPrev: false,
	});

	const fetchMagazines = async (page = 1) => {
		try {
			setLoading(true);
			const params: any = { page, limit: 10 };

			if (filters.search) params.search = filters.search;
			if (filters.year) params.year = parseInt(filters.year);
			if (filters.isActive) params.isActive = filters.isActive === "true";

			const response = await magazineAPI.getAdminMagazines(params);
			setMagazines(response.magazines);
			setPagination(response.pagination);
			setError(null);
		} catch (err: any) {
			console.error("Error fetching magazines:", err);
			setError(err.response?.data?.error || "Failed to fetch magazines");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMagazines();
	}, [filters]);

	const handleCreate = () => {
		setEditingMagazine(null);
		setShowForm(true);
	};

	const handleEdit = (magazine: Magazine) => {
		setEditingMagazine(magazine);
		setShowForm(true);
	};

	const handleDelete = async (id: string, title: string) => {
		if (
			!confirm(
				`Are you sure you want to delete "${title}"? This action cannot be undone.`
			)
		) {
			return;
		}

		try {
			await magazineAPI.deleteMagazine(id);
			fetchMagazines(pagination.current);
		} catch (err: any) {
			console.error("Error deleting magazine:", err);
			setError(err.response?.data?.error || "Failed to delete magazine");
		}
	};

	const handleToggleActive = async (id: string) => {
		try {
			await magazineAPI.toggleActive(id);
			fetchMagazines(pagination.current);
		} catch (err: any) {
			console.error("Error toggling magazine status:", err);
			setError(
				err.response?.data?.error || "Failed to update magazine status"
			);
		}
	};

	const handleFormSave = () => {
		setShowForm(false);
		setEditingMagazine(null);
		fetchMagazines(pagination.current);
	};

	const handleFormCancel = () => {
		setShowForm(false);
		setEditingMagazine(null);
	};

	if (showForm) {
		return (
			<MagazineForm
				magazine={editingMagazine || undefined}
				onSave={handleFormSave}
				onCancel={handleFormCancel}
			/>
		);
	}

	return (
		<div className="max-w-7xl mx-auto">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-white">
					Magazine Management
				</h1>
				<button
					onClick={handleCreate}
					className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition-colors"
				>
					Add New Magazine
				</button>
			</div>

			{error && (
				<div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-6">
					{error}
				</div>
			)}

			{/* Filters */}
			<div className="bg-gray-800 rounded-lg p-4 mb-6">
				<div className="grid md:grid-cols-3 gap-4">
					<div>
						<input
							type="text"
							placeholder="Search magazines..."
							value={filters.search}
							onChange={(e) =>
								setFilters({
									...filters,
									search: e.target.value,
								})
							}
							className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
						/>
					</div>
					<div>
						<select
							value={filters.year}
							onChange={(e) =>
								setFilters({ ...filters, year: e.target.value })
							}
							className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
						>
							<option value="">All Years</option>
							{Array.from(
								{ length: 10 },
								(_, i) => new Date().getFullYear() - i
							).map((year) => (
								<option key={year} value={year}>
									{year}
								</option>
							))}
						</select>
					</div>
					<div>
						<select
							value={filters.isActive}
							onChange={(e) =>
								setFilters({
									...filters,
									isActive: e.target.value,
								})
							}
							className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
						>
							<option value="">All Status</option>
							<option value="true">Active</option>
							<option value="false">Inactive</option>
						</select>
					</div>
				</div>
			</div>

			{/* Magazine List */}
			{loading ? (
				<div className="flex justify-center items-center h-64">
					<div className="text-white">Loading magazines...</div>
				</div>
			) : magazines.length === 0 ? (
				<div className="text-center py-12">
					<div className="text-gray-400 text-lg mb-4">
						No magazines found
					</div>
					<button
						onClick={handleCreate}
						className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition-colors"
					>
						Create Your First Magazine
					</button>
				</div>
			) : (
				<div className="space-y-4">
					{magazines.map((magazine) => (
						<div
							key={magazine._id}
							className="bg-gray-800 rounded-lg p-6"
						>
							<div className="flex justify-between items-start">
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-2">
										<h3 className="text-xl font-semibold text-white">
											{magazine.title}
										</h3>
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${
												magazine.isActive
													? "bg-green-500/20 text-green-400 border border-green-500"
													: "bg-red-500/20 text-red-400 border border-red-500"
											}`}
										>
											{magazine.isActive
												? "Active"
												: "Inactive"}
										</span>
									</div>

									<div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
										<span>
											📅 {magazine.month} {magazine.year}
										</span>
										<span>👀 {magazine.views} views</span>
										<span>
											⬇️ {magazine.downloadCount}{" "}
											downloads
										</span>
									</div>

									<p className="text-gray-300 mb-4">
										{magazine.description}
									</p>

									<div className="flex items-center gap-4 text-sm text-gray-400">
										<span>
											Created:{" "}
											{new Date(
												magazine.createdAt
											).toLocaleDateString()}
										</span>
										<span>
											Updated:{" "}
											{new Date(
												magazine.updatedAt
											).toLocaleDateString()}
										</span>
									</div>
								</div>

								<div className="flex items-center gap-2 ml-4">
									{magazine.coverImageUrl && (
										<img
											src={magazine.coverImageUrl}
											alt={magazine.title}
											className="w-16 h-20 object-cover rounded border border-gray-600"
										/>
									)}
								</div>
							</div>

							{/* Actions */}
							<div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
								<a
									href={magazine.pdfUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
								>
									View PDF
								</a>
								<button
									onClick={() => handleEdit(magazine)}
									className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
								>
									Edit
								</button>
								<button
									onClick={() =>
										handleToggleActive(magazine._id)
									}
									className={`px-3 py-1 text-white text-sm rounded transition-colors ${
										magazine.isActive
											? "bg-orange-500 hover:bg-orange-600"
											: "bg-green-500 hover:bg-green-600"
									}`}
								>
									{magazine.isActive
										? "Deactivate"
										: "Activate"}
								</button>
								<button
									onClick={() =>
										handleDelete(
											magazine._id,
											magazine.title
										)
									}
									className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
								>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Pagination */}
			{pagination.total > 1 && (
				<div className="flex justify-center items-center gap-4 mt-8">
					<button
						onClick={() => fetchMagazines(pagination.current - 1)}
						disabled={!pagination.hasPrev}
						className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Previous
					</button>

					<span className="text-gray-300">
						Page {pagination.current} of {pagination.total}
					</span>

					<button
						onClick={() => fetchMagazines(pagination.current + 1)}
						disabled={!pagination.hasNext}
						className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Next
					</button>
				</div>
			)}
		</div>
	);
};

export default MagazineManagement;
