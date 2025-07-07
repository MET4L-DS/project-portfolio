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

	// Calculate statistics
	const stats = {
		total: magazines.length,
		active: magazines.filter((m) => m.isActive).length,
		inactive: magazines.filter((m) => !m.isActive).length,
		totalViews: magazines.reduce((sum, m) => sum + m.views, 0),
		totalDownloads: magazines.reduce((sum, m) => sum + m.downloadCount, 0),
	};

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
		<div className="space-y-6">
			{/* Header Section */}
			<div className="bg-gradient-to-r from-purple-400/20 to-pink-400/20 backdrop-blur-lg rounded-xl p-6 border border-purple-400/30">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
					<div>
						<h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
							Magazine Management
						</h3>
						<p className="text-gray-300 text-sm sm:text-base">
							Manage your digital publications, track downloads,
							and showcase your content to the world
						</p>
					</div>
					<button
						onClick={handleCreate}
						className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-300 hover:to-pink-300 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 text-center"
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
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						Add New Magazine
					</button>
				</div>
			</div>

			{/* Statistics */}
			{!loading && magazines.length > 0 && (
				<div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
					<div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 backdrop-blur-lg rounded-xl p-4 border border-blue-500/30">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
								<svg
									className="w-5 h-5 text-blue-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									/>
								</svg>
							</div>
							<div>
								<p className="text-2xl font-bold text-white">
									{stats.total}
								</p>
								<p className="text-blue-300 text-sm font-medium">
									Total Magazines
								</p>
							</div>
						</div>
					</div>
					<div className="bg-gradient-to-br from-green-600/20 to-green-700/20 backdrop-blur-lg rounded-xl p-4 border border-green-500/30">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
								<svg
									className="w-5 h-5 text-green-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<div>
								<p className="text-2xl font-bold text-white">
									{stats.active}
								</p>
								<p className="text-green-300 text-sm font-medium">
									Active
								</p>
							</div>
						</div>
					</div>
					<div className="bg-gradient-to-br from-red-600/20 to-red-700/20 backdrop-blur-lg rounded-xl p-4 border border-red-500/30">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
								<svg
									className="w-5 h-5 text-red-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
									/>
								</svg>
							</div>
							<div>
								<p className="text-2xl font-bold text-white">
									{stats.inactive}
								</p>
								<p className="text-red-300 text-sm font-medium">
									Inactive
								</p>
							</div>
						</div>
					</div>
					<div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-lg rounded-xl p-4 border border-yellow-500/30">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
								<svg
									className="w-5 h-5 text-yellow-400"
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
							</div>
							<div>
								<p className="text-2xl font-bold text-white">
									{stats.totalViews}
								</p>
								<p className="text-yellow-300 text-sm font-medium">
									Total Views
								</p>
							</div>
						</div>
					</div>
					<div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-lg rounded-xl p-4 border border-indigo-500/30">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
								<svg
									className="w-5 h-5 text-indigo-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
							<div>
								<p className="text-2xl font-bold text-white">
									{stats.totalDownloads}
								</p>
								<p className="text-indigo-300 text-sm font-medium">
									Downloads
								</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Filters */}
			<div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
				<h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
					<svg
						className="w-5 h-5 text-purple-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
						/>
					</svg>
					Filter Magazines
				</h4>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Search
						</label>
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
							className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Year
						</label>
						<select
							value={filters.year}
							onChange={(e) =>
								setFilters({ ...filters, year: e.target.value })
							}
							className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
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
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Status
						</label>
						<select
							value={filters.isActive}
							onChange={(e) =>
								setFilters({
									...filters,
									isActive: e.target.value,
								})
							}
							className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
						>
							<option value="">All Status</option>
							<option value="true">Active</option>
							<option value="false">Inactive</option>
						</select>
					</div>
				</div>
			</div>

			{/* Error Message */}
			{error && (
				<div className="bg-red-900/50 border border-red-500 rounded-xl p-4 backdrop-blur-lg">
					<div className="flex items-center gap-3">
						<svg
							className="w-5 h-5 text-red-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<p className="text-red-300 font-medium">{error}</p>
					</div>
				</div>
			)}

			{/* Magazine Grid */}
			{loading ? (
				<div className="text-center py-16">
					<div className="inline-flex items-center gap-4">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
						<span className="text-gray-300 text-lg">
							Loading magazines...
						</span>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{magazines.map((magazine) => (
						<div
							key={magazine._id}
							className={`bg-gray-800/50 backdrop-blur-lg rounded-xl overflow-hidden shadow-xl border-2 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl ${
								magazine.isActive
									? "border-green-500/50 hover:border-green-400"
									: "border-red-500/50 hover:border-red-400"
							}`}
						>
							<div className="relative group">
								{magazine.coverImageUrl ? (
									<img
										src={magazine.coverImageUrl}
										alt={magazine.title}
										className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
									/>
								) : (
									<div className="w-full h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
										<svg
											className="w-16 h-16 text-purple-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
											/>
										</svg>
									</div>
								)}
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
								<div className="absolute top-3 right-3 flex flex-col gap-2">
									<span
										className={`px-3 py-1 text-xs font-bold rounded-full backdrop-blur-lg ${
											magazine.isActive
												? "bg-green-500/80 text-white"
												: "bg-red-500/80 text-white"
										}`}
									>
										{magazine.isActive
											? "ACTIVE"
											: "INACTIVE"}
									</span>
								</div>
								<div className="absolute bottom-3 left-3">
									<span className="bg-purple-400 text-white px-3 py-1 rounded-full text-sm font-bold">
										{magazine.month} {magazine.year}
									</span>
								</div>
							</div>
							<div className="p-5">
								<h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors">
									{magazine.title}
								</h3>
								<p className="text-gray-300 text-sm mb-4 line-clamp-3">
									{magazine.description}
								</p>
								<div className="flex items-center justify-between text-sm text-gray-400 mb-4">
									<div className="flex items-center gap-1">
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
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
											/>
										</svg>
										{magazine.views}
									</div>
									<div className="flex items-center gap-1">
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
												d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
											/>
										</svg>
										{magazine.downloadCount}
									</div>
								</div>
								<div className="flex flex-col gap-3">
									<div className="flex gap-2">
										<a
											href={magazine.pdfUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center flex items-center justify-center gap-2"
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
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											</svg>
											View PDF
										</a>
										<button
											onClick={() => handleEdit(magazine)}
											className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
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
											Edit
										</button>
									</div>
									<div className="flex gap-2">
										<button
											onClick={() =>
												handleToggleActive(magazine._id)
											}
											className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
												magazine.isActive
													? "bg-orange-600 text-white hover:bg-orange-700"
													: "bg-green-600 text-white hover:bg-green-700"
											}`}
										>
											{magazine.isActive ? (
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
														d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.697 6.697m3.181 3.181l-1.06-1.06M15.121 14.121L12 17.243m3.121-3.122l1.879 1.879M15.121 14.121l1.06 1.06"
													/>
												</svg>
											) : (
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
														d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
													/>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
													/>
												</svg>
											)}
											{magazine.isActive
												? "Hide"
												: "Show"}
										</button>
										<button
											onClick={() =>
												handleDelete(
													magazine._id,
													magazine.title
												)
											}
											className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
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
											Delete
										</button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{magazines.length === 0 && !loading && (
				<div className="text-center py-16">
					<div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 max-w-md mx-auto border border-gray-700">
						<div className="w-20 h-20 bg-purple-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
							<svg
								className="w-10 h-10 text-purple-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-bold text-white mb-3">
							No Magazines Found
						</h3>
						<p className="text-gray-400 text-base mb-6">
							Start creating digital publications to showcase your
							content and engage with your audience.
						</p>
						<button
							onClick={handleCreate}
							className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-300 hover:to-pink-300 transition-all duration-300 transform hover:scale-105"
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
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
							Create Your First Magazine
						</button>
					</div>
				</div>
			)}

			{/* Pagination */}
			{pagination.total > 1 && (
				<div className="flex justify-center items-center gap-4 mt-8">
					<button
						onClick={() => fetchMagazines(pagination.current - 1)}
						disabled={!pagination.hasPrev}
						className="px-6 py-3 bg-gray-700/50 backdrop-blur-lg border border-gray-600 text-white rounded-lg font-medium hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
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
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Previous
					</button>

					<div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600 px-4 py-2 rounded-lg">
						<span className="text-gray-300 font-medium">
							Page {pagination.current} of {pagination.total}
						</span>
					</div>

					<button
						onClick={() => fetchMagazines(pagination.current + 1)}
						disabled={!pagination.hasNext}
						className="px-6 py-3 bg-gray-700/50 backdrop-blur-lg border border-gray-600 text-white rounded-lg font-medium hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
					>
						Next
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
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>
				</div>
			)}
		</div>
	);
};

export default MagazineManagement;
