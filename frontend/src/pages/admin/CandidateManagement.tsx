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
			<div className="text-center py-8">
				<div className="text-white text-lg">Loading candidates...</div>
			</div>
		);
	}

	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
				<h2 className="text-xl sm:text-2xl font-bold text-white">
					Candidate Management
				</h2>
				<div className="text-gray-400 text-sm sm:text-base">
					Total Applications: {total}
				</div>
			</div>

			{/* Filters */}
			<div className="bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6">
				<h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
					Filters
				</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
					<div>
						<label className="block text-gray-300 text-sm font-medium mb-2">
							Event
						</label>
						<select
							value={filters.eventId}
							onChange={(e) =>
								setFilters({
									...filters,
									eventId: e.target.value,
									page: 1,
								})
							}
							className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
						>
							<option value="">All Events</option>
							{events.map((event) => (
								<option key={event._id} value={event._id}>
									{event.title} ({event.year})
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-gray-300 text-sm font-medium mb-2">
							Status
						</label>
						<select
							value={filters.status}
							onChange={(e) =>
								setFilters({
									...filters,
									status: e.target.value,
									page: 1,
								})
							}
							className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
						>
							<option value="">All Status</option>
							<option value="Pending">Pending</option>
							<option value="Approved">Approved</option>
							<option value="Rejected">Rejected</option>
						</select>
					</div>
					<div>
						<label className="block text-gray-300 text-sm font-medium mb-2">
							Per Page
						</label>
						<select
							value={filters.limit}
							onChange={(e) =>
								setFilters({
									...filters,
									limit: parseInt(e.target.value),
									page: 1,
								})
							}
							className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
						>
							<option value={10}>10</option>
							<option value={25}>25</option>
							<option value={50}>50</option>
						</select>
					</div>
				</div>
			</div>

			{/* Candidates Table */}
			<div className="bg-gray-800 rounded-lg overflow-hidden">
				{error && (
					<div className="bg-red-900/50 border border-red-600 rounded-lg p-4 mb-4">
						<p className="text-red-300">{error}</p>
					</div>
				)}

				{candidates.length === 0 && !loading ? (
					<div className="text-center py-8">
						<p className="text-gray-400">
							No candidate applications found
						</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-700">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
										Form No.
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
										Candidate
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
										Event
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
										Applied Date
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{candidates.map((candidate) => (
									<tr
										key={candidate._id}
										className="hover:bg-gray-700/50"
									>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-white">
												{candidate.formNo}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												{candidate.photoUrl && (
													<img
														src={candidate.photoUrl}
														alt={`${candidate.firstName} ${candidate.lastName}`}
														className="w-10 h-10 rounded-full object-cover mr-3"
													/>
												)}
												<div>
													<div className="text-sm font-medium text-white">
														{candidate.firstName}{" "}
														{candidate.lastName}
													</div>
													<div className="text-sm text-gray-400">
														{candidate.gender},{" "}
														{
															candidate.educationalLevel
														}
													</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-white">
												{candidate.eventName}
											</div>
											<div className="text-sm text-gray-400">
												{candidate.eventId?.year}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
											{formatDate(
												candidate.registrationDate
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
													candidate.status
												)}`}
											>
												{candidate.status}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<button
												onClick={() =>
													handleViewDetails(candidate)
												}
												className="text-yellow-400 hover:text-yellow-300 mr-3"
											>
												View Details
											</button>
											<button
												onClick={() =>
													handlePDFPreview(candidate)
												}
												className="text-blue-400 hover:text-blue-300"
											>
												Preview PDF
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex justify-between items-center">
					<div className="text-gray-400 text-sm">
						Showing {(filters.page - 1) * filters.limit + 1} to{" "}
						{Math.min(filters.page * filters.limit, total)} of{" "}
						{total} candidates
					</div>
					<div className="flex gap-2">
						<button
							onClick={() =>
								setFilters({
									...filters,
									page: filters.page - 1,
								})
							}
							disabled={filters.page <= 1}
							className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Previous
						</button>
						<span className="px-3 py-1 bg-yellow-600 text-white rounded">
							{filters.page}
						</span>
						<button
							onClick={() =>
								setFilters({
									...filters,
									page: filters.page + 1,
								})
							}
							disabled={filters.page >= totalPages}
							className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Next
						</button>
					</div>
				</div>
			)}

			{/* Candidate Details Modal */}
			{showDetails && selectedCandidate && (
				<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
					<div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-4 sm:my-8">
						<div className="p-6">
							{/* Header */}
							<div className="flex justify-between items-center mb-6">
								<h3 className="text-2xl font-bold text-white">
									Candidate Details
								</h3>
								<button
									onClick={() => setShowDetails(false)}
									className="text-gray-400 hover:text-white text-2xl font-bold"
								>
									×
								</button>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{/* Photo */}
								<div className="text-center">
									{selectedCandidate.photoUrl ? (
										<img
											src={selectedCandidate.photoUrl}
											alt={`${selectedCandidate.firstName} ${selectedCandidate.lastName}`}
											className="w-40 h-48 object-cover rounded-lg mx-auto mb-4"
										/>
									) : (
										<div className="w-40 h-48 bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
											<span className="text-gray-400">
												No Photo
											</span>
										</div>
									)}
									<div className="text-lg font-semibold text-white">
										{selectedCandidate.firstName}{" "}
										{selectedCandidate.lastName}
									</div>
									<div className="text-sm text-gray-400">
										Form No: {selectedCandidate.formNo}
									</div>
								</div>

								{/* Personal Details */}
								<div className="md:col-span-2 space-y-6">
									{/* Applicant Information */}
									<div>
										<h4 className="text-lg font-semibold text-white mb-3">
											Applicant Information
										</h4>
										<div className="grid grid-cols-2 gap-4 text-sm">
											<div>
												<span className="text-gray-400">
													Date of Birth:
												</span>
												<div className="text-white">
													{formatDate(
														selectedCandidate.dateOfBirth
													)}
												</div>
											</div>
											<div>
												<span className="text-gray-400">
													Gender:
												</span>
												<div className="text-white">
													{selectedCandidate.gender}
												</div>
											</div>
											<div>
												<span className="text-gray-400">
													Height:
												</span>
												<div className="text-white">
													{selectedCandidate.height}
												</div>
											</div>
											<div>
												<span className="text-gray-400">
													Education:
												</span>
												<div className="text-white">
													{
														selectedCandidate.educationalLevel
													}
												</div>
											</div>
											<div className="col-span-2">
												<span className="text-gray-400">
													Address:
												</span>
												<div className="text-white">
													{selectedCandidate.address}
												</div>
											</div>
										</div>
									</div>

									{/* Parent Information */}
									<div>
										<h4 className="text-lg font-semibold text-white mb-3">
											Parent/Guardian Information
										</h4>
										<div className="grid grid-cols-2 gap-4 text-sm">
											<div>
												<span className="text-gray-400">
													Name:
												</span>
												<div className="text-white">
													{
														selectedCandidate.parentFirstName
													}{" "}
													{
														selectedCandidate.parentLastName
													}
												</div>
											</div>
											<div>
												<span className="text-gray-400">
													Occupation:
												</span>
												<div className="text-white">
													{
														selectedCandidate.parentOccupation
													}
												</div>
											</div>
											<div className="col-span-2">
												<span className="text-gray-400">
													Contact Number:
												</span>
												<div className="text-white">
													{
														selectedCandidate.parentContactNo
													}
												</div>
											</div>
										</div>
									</div>

									{/* Event Information */}
									<div>
										<h4 className="text-lg font-semibold text-white mb-3">
											Event Information
										</h4>
										<div className="text-sm">
											<div className="mb-2">
												<span className="text-gray-400">
													Event:
												</span>
												<div className="text-white">
													{
														selectedCandidate.eventName
													}
												</div>
											</div>
											<div>
												<span className="text-gray-400">
													Applied Date:
												</span>
												<div className="text-white">
													{formatDate(
														selectedCandidate.registrationDate
													)}
												</div>
											</div>
										</div>
									</div>

									{/* Status Management */}
									<div>
										<h4 className="text-lg font-semibold text-white mb-3">
											Application Status
										</h4>
										<div className="flex gap-3 mb-4">
											<button
												onClick={() =>
													handleStatusUpdate(
														selectedCandidate._id,
														"Approved"
													)
												}
												className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
											>
												Approve
											</button>
											<button
												onClick={() =>
													handleStatusUpdate(
														selectedCandidate._id,
														"Rejected"
													)
												}
												className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
											>
												Reject
											</button>
											<button
												onClick={() =>
													handleStatusUpdate(
														selectedCandidate._id,
														"Pending"
													)
												}
												className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500"
											>
												Set Pending
											</button>
										</div>
										<div className="mb-4">
											<label className="block text-gray-300 text-sm font-medium mb-2">
												Notes (optional)
											</label>
											<textarea
												id="notes"
												rows={3}
												className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
												placeholder="Add any notes about this application..."
											/>
										</div>
									</div>

									{/* Danger Zone */}
									<div className="border-t border-gray-700 pt-4">
										<h4 className="text-lg font-semibold text-red-400 mb-3">
											Danger Zone
										</h4>
										<button
											onClick={() =>
												handleDeleteCandidate(
													selectedCandidate._id
												)
											}
											className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
										>
											Delete Application
										</button>
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
