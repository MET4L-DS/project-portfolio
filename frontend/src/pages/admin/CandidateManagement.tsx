import React, { useState, useEffect } from "react";
import { candidatesAPI, eventsAPI } from "../../services/api";
import CandidatePDFPreviewModal from "../../components/CandidatePDFPreviewModal";

interface Event {
	_id: string;
	title: string;
	category: string;
	year: string;
}

interface Candidate {
	_id: string;
	formNo: string;
	eventId: {
		_id: string;
		title: string;
		category: string;
		year: string;
	};
	eventName: string;
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	address: string;
	educationalLevel: string;
	gender: string;
	height: string;
	parentFirstName: string;
	parentLastName: string;
	parentOccupation: string;
	parentContactNo: string;
	parentDeclaration: boolean;
	photoUrl?: string;
	registrationDate: string;
	status: "Pending" | "Approved" | "Rejected";
	notes?: string;
	createdAt: string;
}

const CandidateManagement: React.FC = () => {
	const [candidates, setCandidates] = useState<Candidate[]>([]);
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [selectedCandidate, setSelectedCandidate] =
		useState<Candidate | null>(null);
	const [showDetails, setShowDetails] = useState(false);
	const [showPDFPreview, setShowPDFPreview] = useState(false);
	const [pdfCandidate, setPdfCandidate] = useState<Candidate | null>(null);
	const [filters, setFilters] = useState({
		eventId: "",
		status: "",
		page: 1,
		limit: 10,
	});
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		fetchEvents();
		fetchCandidates();
	}, [filters]);

	const fetchEvents = async () => {
		try {
			const response = await eventsAPI.getAdminEvents();
			setEvents(response.events || []);
		} catch (err) {
			console.error("Error fetching events:", err);
		}
	};

	const fetchCandidates = async () => {
		try {
			setLoading(true);
			const params = {
				...(filters.eventId && { eventId: filters.eventId }),
				...(filters.status && { status: filters.status }),
				page: filters.page,
				limit: filters.limit,
			};
			const response = await candidatesAPI.getAllCandidates(params);

			setCandidates(response.data.candidates || []);
			setTotal(response.data.total || 0);
			setTotalPages(response.data.pages || 1);
		} catch (err: any) {
			setError("Failed to fetch candidates");
			console.error("Fetch candidates error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleStatusUpdate = async (
		candidateId: string,
		newStatus: string,
		notes?: string
	) => {
		try {
			await candidatesAPI.updateCandidateStatus(candidateId, {
				status: newStatus,
				...(notes && { notes }),
			});
			await fetchCandidates(); // Refresh the list
			setShowDetails(false);
		} catch (err) {
			console.error("Error updating candidate status:", err);
			alert("Failed to update candidate status");
		}
	};

	const handleDeleteCandidate = async (candidateId: string) => {
		if (
			!window.confirm(
				"Are you sure you want to delete this candidate application?"
			)
		) {
			return;
		}

		try {
			await candidatesAPI.deleteCandidate(candidateId);
			await fetchCandidates(); // Refresh the list
			setShowDetails(false);
		} catch (err) {
			console.error("Error deleting candidate:", err);
			alert("Failed to delete candidate");
		}
	};

	const handleViewDetails = (candidate: Candidate) => {
		setSelectedCandidate(candidate);
		setShowDetails(true);
	};

	const handlePDFPreview = (candidate: Candidate) => {
		setPdfCandidate(candidate);
		setShowPDFPreview(true);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Approved":
				return "text-green-400 bg-green-900/30";
			case "Rejected":
				return "text-red-400 bg-red-900/30";
			default:
				return "text-yellow-400 bg-yellow-900/30";
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString();
	};

	if (loading && candidates.length === 0) {
		return (
			<div className="flex items-center justify-center py-16">
				<div className="relative bg-gradient-to-r from-slate-900/40 via-gray-900/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
					<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
					<div className="relative flex flex-col items-center gap-4">
						<div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
							<svg
								className="w-8 h-8 text-purple-300 animate-spin"
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
							<h3 className="text-purple-200 font-medium text-lg mb-1">
								Loading Candidates
							</h3>
							<p className="text-gray-400 text-sm">
								Please wait while we fetch candidate data...
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Header */}
			<div className="relative bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-indigo-900/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
				<div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-indigo-500/5 rounded-2xl"></div>
				<div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
							<svg
								className="w-6 h-6 text-purple-300"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
								/>
							</svg>
						</div>
						<div>
							<h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
								Candidate Management
							</h2>
							<p className="text-gray-400 text-sm">
								Manage candidate applications and approvals
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-white/10">
						<svg
							className="w-4 h-4 text-purple-300"
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
						<span className="text-purple-200 font-medium">
							Total Applications: {total}
						</span>
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="relative bg-gradient-to-r from-slate-900/40 via-gray-900/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10">
				<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
				<div className="relative">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 bg-gradient-to-br from-slate-500/20 to-gray-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10">
							<svg
								className="w-5 h-5 text-slate-300"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
								/>
							</svg>
						</div>
						<h3 className="text-lg font-semibold bg-gradient-to-r from-slate-200 to-gray-200 bg-clip-text text-transparent">
							Filters & Search
						</h3>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
								Event
							</label>
							<div className="relative">
								<select
									value={filters.eventId}
									onChange={(e) =>
										setFilters({
											...filters,
											eventId: e.target.value,
											page: 1,
										})
									}
									className="w-full px-4 py-3 bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
								>
									<option value="">All Events</option>
									{events.map((event) => (
										<option
											key={event._id}
											value={event._id}
										>
											{event.title} ({event.year})
										</option>
									))}
								</select>
							</div>
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
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								Status
							</label>
							<div className="relative">
								<select
									value={filters.status}
									onChange={(e) =>
										setFilters({
											...filters,
											status: e.target.value,
											page: 1,
										})
									}
									className="w-full px-4 py-3 bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
								>
									<option value="">All Status</option>
									<option value="Pending">Pending</option>
									<option value="Approved">Approved</option>
									<option value="Rejected">Rejected</option>
								</select>
							</div>
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
										d="M4 6h16M4 10h16M4 14h16M4 18h16"
									/>
								</svg>
								Per Page
							</label>
							<div className="relative">
								<select
									value={filters.limit}
									onChange={(e) =>
										setFilters({
											...filters,
											limit: parseInt(e.target.value),
											page: 1,
										})
									}
									className="w-full px-4 py-3 bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
								>
									<option value={10}>10</option>
									<option value={25}>25</option>
									<option value={50}>50</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Candidates Table */}
			<div className="relative bg-gradient-to-r from-slate-900/40 via-gray-900/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
				<div className="relative">
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
									<h3 className="text-red-300 font-medium">
										Error
									</h3>
									<p className="text-red-200 text-sm">
										{error}
									</p>
								</div>
							</div>
						</div>
					)}

					{candidates.length === 0 && !loading ? (
						<div className="text-center py-12">
							<div className="w-20 h-20 bg-gradient-to-br from-slate-500/20 to-gray-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/10">
								<svg
									className="w-10 h-10 text-slate-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
									/>
								</svg>
							</div>
							<h3 className="text-slate-300 font-medium text-lg mb-2">
								No Candidates Found
							</h3>
							<p className="text-slate-400 text-sm">
								No candidate applications match your current
								filters.
							</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm">
									<tr>
										<th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
											<div className="flex items-center gap-2">
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
												Form No.
											</div>
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
											<div className="flex items-center gap-2">
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
														d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
													/>
												</svg>
												Candidate
											</div>
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
											<div className="flex items-center gap-2">
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
														d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
												Event
											</div>
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
											<div className="flex items-center gap-2">
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
														d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
												Applied Date
											</div>
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
											<div className="flex items-center gap-2">
												<svg
													className="w-4 h-4 text-yellow-400"
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
												Status
											</div>
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
											<div className="flex items-center gap-2">
												<svg
													className="w-4 h-4 text-indigo-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
													/>
												</svg>
												Actions
											</div>
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-white/10">
									{candidates.map((candidate) => (
										<tr
											key={candidate._id}
											className="hover:bg-gradient-to-r hover:from-slate-800/30 hover:to-gray-800/30 transition-all duration-200"
										>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center gap-2">
													<div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-blue-500/30">
														<svg
															className="w-4 h-4 text-blue-300"
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
													</div>
													<span className="text-sm font-medium text-white">
														{candidate.formNo}
													</span>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center gap-3">
													{candidate.photoUrl && (
														<img
															src={
																candidate.photoUrl
															}
															alt={`${candidate.firstName} ${candidate.lastName}`}
															className="w-10 h-10 rounded-full object-cover border-2 border-white/10"
														/>
													)}
													<div>
														<div className="text-sm font-medium text-white">
															{
																candidate.firstName
															}{" "}
															{candidate.lastName}
														</div>
														<div className="text-xs text-gray-400 flex items-center gap-1">
															<svg
																className="w-3 h-3"
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
																	d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
																/>
															</svg>
															{candidate.gender},{" "}
															{
																candidate.educationalLevel
															}
														</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-white font-medium">
													{candidate.eventName}
												</div>
												<div className="text-xs text-gray-400 flex items-center gap-1">
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
													{candidate.eventId?.year}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center gap-2">
													<div className="w-8 h-8 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-orange-500/30">
														<svg
															className="w-4 h-4 text-orange-300"
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
													<span className="text-sm text-gray-300">
														{formatDate(
															candidate.registrationDate
														)}
													</span>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
														candidate.status
													)}`}
												>
													{candidate.status ===
														"Approved" && (
														<svg
															className="w-3 h-3 mr-1"
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
													)}
													{candidate.status ===
														"Rejected" && (
														<svg
															className="w-3 h-3 mr-1"
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
													)}
													{candidate.status ===
														"Pending" && (
														<svg
															className="w-3 h-3 mr-1"
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
													)}
													{candidate.status}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center gap-2">
													<button
														onClick={() =>
															handleViewDetails(
																candidate
															)
														}
														className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 rounded-lg hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-200 backdrop-blur-sm border border-blue-500/30 text-sm"
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
														View
													</button>
													<button
														onClick={() =>
															handlePDFPreview(
																candidate
															)
														}
														className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 rounded-lg hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-200 backdrop-blur-sm border border-purple-500/30 text-sm"
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
																d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
															/>
														</svg>
														PDF
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="relative bg-gradient-to-r from-slate-900/40 via-gray-900/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
					<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
					<div className="relative flex flex-col sm:flex-row justify-between items-center gap-4">
						<div className="flex items-center gap-2 text-gray-400 text-sm">
							<div className="w-8 h-8 bg-gradient-to-br from-slate-500/20 to-gray-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10">
								<svg
									className="w-4 h-4 text-slate-300"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
							</div>
							<span>
								Showing {(filters.page - 1) * filters.limit + 1}{" "}
								to{" "}
								{Math.min(filters.page * filters.limit, total)}{" "}
								of {total} candidates
							</span>
						</div>
						<div className="flex items-center gap-2">
							<button
								onClick={() =>
									setFilters({
										...filters,
										page: filters.page - 1,
									})
								}
								disabled={filters.page <= 1}
								className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-700/50 to-gray-700/50 backdrop-blur-sm text-white rounded-lg hover:from-slate-600/50 hover:to-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 transition-all duration-200"
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
							<div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm text-white rounded-lg border border-white/10">
								<span className="text-sm text-gray-300">
									Page
								</span>
								<span className="font-medium text-white">
									{filters.page}
								</span>
								<span className="text-sm text-gray-300">
									of
								</span>
								<span className="font-medium text-white">
									{totalPages}
								</span>
							</div>
							<button
								onClick={() =>
									setFilters({
										...filters,
										page: filters.page + 1,
									})
								}
								disabled={filters.page >= totalPages}
								className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-700/50 to-gray-700/50 backdrop-blur-sm text-white rounded-lg hover:from-slate-600/50 hover:to-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 transition-all duration-200"
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
					</div>
				</div>
			)}

			{/* Candidate Details Modal */}
			{showDetails && selectedCandidate && (
				<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
					<div className="relative bg-gradient-to-r from-slate-900/90 via-gray-900/90 to-slate-900/90 backdrop-blur-sm rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-4 sm:my-8 border border-white/10">
						<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
						<div className="relative p-6">
							{/* Header */}
							<div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
										<svg
											className="w-6 h-6 text-purple-300"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
											/>
										</svg>
									</div>
									<div>
										<h3 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
											Candidate Details
										</h3>
										<p className="text-gray-400 text-sm">
											Application review and management
										</p>
									</div>
								</div>
								<button
									onClick={() => setShowDetails(false)}
									className="w-10 h-10 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg flex items-center justify-center text-red-300 hover:from-red-500/30 hover:to-red-600/30 transition-all duration-200 backdrop-blur-sm border border-red-500/30"
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
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{/* Photo */}
								<div className="text-center">
									<div className="relative bg-gradient-to-r from-slate-800/40 via-gray-800/40 to-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
										<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
										<div className="relative">
											{selectedCandidate.photoUrl ? (
												<img
													src={
														selectedCandidate.photoUrl
													}
													alt={`${selectedCandidate.firstName} ${selectedCandidate.lastName}`}
													className="w-40 h-48 object-cover rounded-xl mx-auto mb-4 border-2 border-white/10"
												/>
											) : (
												<div className="w-40 h-48 bg-gradient-to-br from-slate-700/50 to-gray-700/50 rounded-xl mx-auto mb-4 flex items-center justify-center backdrop-blur-sm border border-white/10">
													<svg
														className="w-16 h-16 text-slate-400"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
														/>
													</svg>
												</div>
											)}
											<div className="text-lg font-semibold text-white mb-1">
												{selectedCandidate.firstName}{" "}
												{selectedCandidate.lastName}
											</div>
											<div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg text-sm text-blue-200 backdrop-blur-sm border border-blue-500/30">
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
														d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
													/>
												</svg>
												Form No:{" "}
												{selectedCandidate.formNo}
											</div>
										</div>
									</div>
								</div>

								{/* Personal Details */}
								<div className="md:col-span-2 space-y-6">
									{/* Applicant Information */}
									<div className="relative bg-gradient-to-r from-slate-800/40 via-gray-800/40 to-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
										<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
										<div className="relative">
											<div className="flex items-center gap-3 mb-4">
												<div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-green-500/30">
													<svg
														className="w-5 h-5 text-green-300"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
														/>
													</svg>
												</div>
												<h4 className="text-lg font-semibold bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-transparent">
													Applicant Information
												</h4>
											</div>
											<div className="grid grid-cols-2 gap-4 text-sm">
												<div className="p-3 bg-gradient-to-r from-slate-700/30 to-gray-700/30 rounded-lg backdrop-blur-sm border border-white/10">
													<span className="text-gray-400 text-xs uppercase tracking-wide">
														Date of Birth
													</span>
													<div className="text-white font-medium">
														{formatDate(
															selectedCandidate.dateOfBirth
														)}
													</div>
												</div>
												<div className="p-3 bg-gradient-to-r from-slate-700/30 to-gray-700/30 rounded-lg backdrop-blur-sm border border-white/10">
													<span className="text-gray-400 text-xs uppercase tracking-wide">
														Gender
													</span>
													<div className="text-white font-medium">
														{
															selectedCandidate.gender
														}
													</div>
												</div>
												<div className="p-3 bg-gradient-to-r from-slate-700/30 to-gray-700/30 rounded-lg backdrop-blur-sm border border-white/10">
													<span className="text-gray-400 text-xs uppercase tracking-wide">
														Height
													</span>
													<div className="text-white font-medium">
														{
															selectedCandidate.height
														}
													</div>
												</div>
												<div className="p-3 bg-gradient-to-r from-slate-700/30 to-gray-700/30 rounded-lg backdrop-blur-sm border border-white/10">
													<span className="text-gray-400 text-xs uppercase tracking-wide">
														Education
													</span>
													<div className="text-white font-medium">
														{
															selectedCandidate.educationalLevel
														}
													</div>
												</div>
												<div className="col-span-2 p-3 bg-gradient-to-r from-slate-700/30 to-gray-700/30 rounded-lg backdrop-blur-sm border border-white/10">
													<span className="text-gray-400 text-xs uppercase tracking-wide">
														Address
													</span>
													<div className="text-white font-medium">
														{
															selectedCandidate.address
														}
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Parent Information */}
									<div className="relative bg-gradient-to-r from-slate-800/40 via-gray-800/40 to-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
										<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
										<div className="relative">
											<div className="flex items-center gap-3 mb-4">
												<div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-blue-500/30">
													<svg
														className="w-5 h-5 text-blue-300"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
														/>
													</svg>
												</div>
												<h4 className="text-lg font-semibold bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
													Parent/Guardian Information
												</h4>
											</div>
											<div className="grid grid-cols-2 gap-4 text-sm">
												<div className="p-3 bg-gradient-to-r from-slate-700/30 to-gray-700/30 rounded-lg backdrop-blur-sm border border-white/10">
													<span className="text-gray-400 text-xs uppercase tracking-wide">
														Name
													</span>
													<div className="text-white font-medium">
														{
															selectedCandidate.parentFirstName
														}{" "}
														{
															selectedCandidate.parentLastName
														}
													</div>
												</div>
												<div className="p-3 bg-gradient-to-r from-slate-700/30 to-gray-700/30 rounded-lg backdrop-blur-sm border border-white/10">
													<span className="text-gray-400 text-xs uppercase tracking-wide">
														Occupation
													</span>
													<div className="text-white font-medium">
														{
															selectedCandidate.parentOccupation
														}
													</div>
												</div>
												<div className="col-span-2 p-3 bg-gradient-to-r from-slate-700/30 to-gray-700/30 rounded-lg backdrop-blur-sm border border-white/10">
													<span className="text-gray-400 text-xs uppercase tracking-wide">
														Contact Number
													</span>
													<div className="text-white font-medium flex items-center gap-2">
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
																d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
															/>
														</svg>
														{
															selectedCandidate.parentContactNo
														}
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Event Information */}
									<div className="relative bg-gradient-to-r from-slate-800/40 via-gray-800/40 to-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
										<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
										<div className="relative">
											<div className="flex items-center gap-3 mb-4">
												<div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-purple-500/30">
													<svg
														className="w-5 h-5 text-purple-300"
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
												</div>
												<h4 className="text-lg font-semibold bg-gradient-to-r from-purple-200 to-violet-200 bg-clip-text text-transparent">
													Event Information
												</h4>
											</div>
											<div className="grid grid-cols-2 gap-4 text-sm">
												<div className="p-3 bg-gradient-to-r from-slate-700/30 to-gray-700/30 rounded-lg backdrop-blur-sm border border-white/10">
													<span className="text-gray-400 text-xs uppercase tracking-wide">
														Event
													</span>
													<div className="text-white font-medium">
														{
															selectedCandidate.eventName
														}
													</div>
												</div>
												<div className="p-3 bg-gradient-to-r from-slate-700/30 to-gray-700/30 rounded-lg backdrop-blur-sm border border-white/10">
													<span className="text-gray-400 text-xs uppercase tracking-wide">
														Applied Date
													</span>
													<div className="text-white font-medium flex items-center gap-2">
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
																d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
															/>
														</svg>
														{formatDate(
															selectedCandidate.registrationDate
														)}
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Status Management */}
									<div className="relative bg-gradient-to-r from-slate-800/40 via-gray-800/40 to-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
										<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
										<div className="relative">
											<div className="flex items-center gap-3 mb-4">
												<div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-yellow-500/30">
													<svg
														className="w-5 h-5 text-yellow-300"
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
												<h4 className="text-lg font-semibold bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
													Application Status
												</h4>
											</div>
											<div className="flex gap-3 mb-4">
												<button
													onClick={() =>
														handleStatusUpdate(
															selectedCandidate._id,
															"Approved"
														)
													}
													className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 rounded-lg hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-200 backdrop-blur-sm border border-green-500/30"
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
													Approve
												</button>
												<button
													onClick={() =>
														handleStatusUpdate(
															selectedCandidate._id,
															"Rejected"
														)
													}
													className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 rounded-lg hover:from-red-500/30 hover:to-red-600/30 transition-all duration-200 backdrop-blur-sm border border-red-500/30"
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
													Reject
												</button>
												<button
													onClick={() =>
														handleStatusUpdate(
															selectedCandidate._id,
															"Pending"
														)
													}
													className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 rounded-lg hover:from-yellow-500/30 hover:to-orange-500/30 transition-all duration-200 backdrop-blur-sm border border-yellow-500/30"
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
															d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
														/>
													</svg>
													Set Pending
												</button>
											</div>
											<div className="mb-4">
												<label className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
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
															d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
														/>
													</svg>
													Notes (optional)
												</label>
												<textarea
													id="notes"
													rows={3}
													className="w-full px-4 py-3 bg-gradient-to-r from-slate-700/50 to-gray-700/50 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
													placeholder="Add any notes about this application..."
												/>
											</div>
										</div>
									</div>

									{/* Danger Zone */}
									<div className="relative bg-gradient-to-r from-red-900/20 via-red-800/20 to-red-900/20 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30">
										<div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-red-400/5 to-red-500/5 rounded-2xl"></div>
										<div className="relative">
											<div className="flex items-center gap-3 mb-4">
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
													<h4 className="text-lg font-semibold text-red-300">
														Danger Zone
													</h4>
													<p className="text-red-200 text-sm">
														This action cannot be
														undone
													</p>
												</div>
											</div>
											<button
												onClick={() =>
													handleDeleteCandidate(
														selectedCandidate._id
													)
												}
												className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 rounded-lg hover:from-red-500/30 hover:to-red-600/30 transition-all duration-200 backdrop-blur-sm border border-red-500/30"
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
												Delete Application
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* PDF Preview Modal */}
			{pdfCandidate && (
				<CandidatePDFPreviewModal
					candidate={pdfCandidate}
					isOpen={showPDFPreview}
					onClose={() => {
						setShowPDFPreview(false);
						setPdfCandidate(null);
					}}
				/>
			)}
		</div>
	);
};

export default CandidateManagement;
