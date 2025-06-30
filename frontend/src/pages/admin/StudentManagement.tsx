import React, { useState, useEffect } from "react";
import { studentAPI } from "../../services/api";

interface Student {
	_id: string;
	formNo: string;
	studentName: string;
	address: {
		line1: string;
		line2: string;
		line3: string;
	};
	phoneNumber: string;
	gender: string;
	age: number;
	dateOfBirth: string;
	parentsName: string;
	parentsNumber: string;
	courses: string[];
	photoUrl?: string;
	registrationDate: string;
	status: "Pending" | "Approved" | "Rejected";
	notes?: string;
	createdAt: string;
	updatedAt: string;
}

const StudentManagement: React.FC = () => {
	const [students, setStudents] = useState<Student[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(
		null
	);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [filters, setFilters] = useState({
		search: "",
		status: "",
		course: "",
		sortBy: "createdAt",
		sortOrder: "desc",
	});
	const [pagination, setPagination] = useState({
		current: 1,
		total: 1,
		hasNext: false,
		hasPrev: false,
	});
	const [statistics, setStatistics] = useState<any>(null);

	const courses = [
		"Art",
		"Craft",
		"Acting",
		"Singing",
		"Yoga",
		"Dance",
		"Karate",
		"Stitching",
		"Mehendi",
		"Modelling",
		"Makeup",
		"Photography",
		"Beautician",
	];

	const fetchStudents = async (page = 1) => {
		try {
			setLoading(true);
			const params: any = { page, limit: 15 };

			if (filters.search) params.search = filters.search;
			if (filters.status) params.status = filters.status;
			if (filters.course) params.course = filters.course;
			if (filters.sortBy) params.sortBy = filters.sortBy;
			if (filters.sortOrder) params.sortOrder = filters.sortOrder;

			const response = await studentAPI.getAllRegistrations(params);
			setStudents(response.students);
			setPagination(response.pagination);
			setError(null);
		} catch (err: any) {
			console.error("Error fetching students:", err);
			setError(
				err.response?.data?.error || "Failed to fetch registrations"
			);
		} finally {
			setLoading(false);
		}
	};

	const fetchStatistics = async () => {
		try {
			const stats = await studentAPI.getStatistics();
			setStatistics(stats);
		} catch (err: any) {
			console.error("Error fetching statistics:", err);
		}
	};

	useEffect(() => {
		fetchStudents();
		fetchStatistics();
	}, [filters]);

	const handleStatusUpdate = async (
		id: string,
		status: string,
		notes?: string
	) => {
		try {
			await studentAPI.updateRegistrationStatus(id, { status, notes });
			fetchStudents(pagination.current);
			fetchStatistics();
			setShowDetailModal(false);
		} catch (err: any) {
			console.error("Error updating status:", err);
			setError(err.response?.data?.error || "Failed to update status");
		}
	};

	const handleDelete = async (id: string, studentName: string) => {
		if (
			!confirm(
				`Are you sure you want to delete the registration for "${studentName}"? This action cannot be undone.`
			)
		) {
			return;
		}

		try {
			await studentAPI.deleteRegistration(id);
			fetchStudents(pagination.current);
			fetchStatistics();
		} catch (err: any) {
			console.error("Error deleting registration:", err);
			setError(
				err.response?.data?.error || "Failed to delete registration"
			);
		}
	};

	const handleViewDetails = (student: Student) => {
		setSelectedStudent(student);
		setShowDetailModal(true);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Approved":
				return "bg-green-500/20 text-green-400 border-green-500";
			case "Rejected":
				return "bg-red-500/20 text-red-400 border-red-500";
			default:
				return "bg-yellow-500/20 text-yellow-400 border-yellow-500";
		}
	};

	return (
		<div className="max-w-7xl mx-auto">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-white">
					Student Registrations
				</h1>
			</div>

			{/* Statistics */}
			{statistics && (
				<div className="grid md:grid-cols-4 gap-4 mb-6">
					<div className="bg-gray-800 rounded-lg p-4">
						<h3 className="text-lg font-semibold text-white mb-2">
							Total Students
						</h3>
						<p className="text-2xl font-bold text-yellow-400">
							{statistics.totalStudents}
						</p>
					</div>
					<div className="bg-gray-800 rounded-lg p-4">
						<h3 className="text-lg font-semibold text-white mb-2">
							Approved
						</h3>
						<p className="text-2xl font-bold text-green-400">
							{statistics.approvedStudents}
						</p>
					</div>
					<div className="bg-gray-800 rounded-lg p-4">
						<h3 className="text-lg font-semibold text-white mb-2">
							Pending
						</h3>
						<p className="text-2xl font-bold text-yellow-400">
							{statistics.pendingStudents}
						</p>
					</div>
					<div className="bg-gray-800 rounded-lg p-4">
						<h3 className="text-lg font-semibold text-white mb-2">
							Popular Course
						</h3>
						<p className="text-lg font-bold text-blue-400">
							{statistics.courseStats[0]?._id || "N/A"}
						</p>
					</div>
				</div>
			)}

			{error && (
				<div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-6">
					{error}
				</div>
			)}

			{/* Filters */}
			<div className="bg-gray-800 rounded-lg p-4 mb-6">
				<div className="grid md:grid-cols-5 gap-4">
					<input
						type="text"
						placeholder="Search students..."
						value={filters.search}
						onChange={(e) =>
							setFilters({ ...filters, search: e.target.value })
						}
						className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
					/>
					<select
						value={filters.status}
						onChange={(e) =>
							setFilters({ ...filters, status: e.target.value })
						}
						className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
					>
						<option value="">All Status</option>
						<option value="Pending">Pending</option>
						<option value="Approved">Approved</option>
						<option value="Rejected">Rejected</option>
					</select>
					<select
						value={filters.course}
						onChange={(e) =>
							setFilters({ ...filters, course: e.target.value })
						}
						className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
					>
						<option value="">All Courses</option>
						{courses.map((course) => (
							<option key={course} value={course}>
								{course}
							</option>
						))}
					</select>
					<select
						value={filters.sortBy}
						onChange={(e) =>
							setFilters({ ...filters, sortBy: e.target.value })
						}
						className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
					>
						<option value="createdAt">Registration Date</option>
						<option value="studentName">Name</option>
						<option value="age">Age</option>
					</select>
					<select
						value={filters.sortOrder}
						onChange={(e) =>
							setFilters({
								...filters,
								sortOrder: e.target.value,
							})
						}
						className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
					>
						<option value="desc">Descending</option>
						<option value="asc">Ascending</option>
					</select>
				</div>
			</div>

			{/* Student List */}
			{loading ? (
				<div className="flex justify-center items-center h-64">
					<div className="text-white">Loading registrations...</div>
				</div>
			) : students.length === 0 ? (
				<div className="text-center py-12">
					<div className="text-gray-400 text-lg mb-4">
						No registrations found
					</div>
				</div>
			) : (
				<div className="space-y-4">
					{students.map((student) => (
						<div
							key={student._id}
							className="bg-gray-800 rounded-lg p-6"
						>
							<div className="flex justify-between items-start">
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-2">
										<h3 className="text-xl font-semibold text-white">
											{student.studentName}
										</h3>
										<span className="text-sm text-gray-400">
											#{student.formNo}
										</span>
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
												student.status
											)}`}
										>
											{student.status}
										</span>
									</div>

									<div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300 mb-3">
										<div>
											<p>
												<strong>Age:</strong>{" "}
												{student.age} years
											</p>
											<p>
												<strong>Gender:</strong>{" "}
												{student.gender}
											</p>
											<p>
												<strong>Phone:</strong>{" "}
												{student.phoneNumber}
											</p>
										</div>
										<div>
											<p>
												<strong>Parents:</strong>{" "}
												{student.parentsName}
											</p>
											<p>
												<strong>Parents' Phone:</strong>{" "}
												{student.parentsNumber}
											</p>
										</div>
									</div>

									<div className="mb-3">
										<p className="text-sm text-gray-400">
											<strong>Courses:</strong>{" "}
											{student.courses.join(", ")}
										</p>
									</div>

									<div className="text-xs text-gray-400">
										Registered:{" "}
										{new Date(
											student.createdAt
										).toLocaleDateString()}
									</div>
								</div>

								<div className="flex items-center gap-2 ml-4">
									{student.photoUrl && (
										<img
											src={student.photoUrl}
											alt={student.studentName}
											className="w-16 h-20 object-cover rounded border border-gray-600"
										/>
									)}
								</div>
							</div>

							{/* Actions */}
							<div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
								<button
									onClick={() => handleViewDetails(student)}
									className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
								>
									View Details
								</button>
								<button
									onClick={() =>
										handleStatusUpdate(
											student._id,
											"Approved"
										)
									}
									disabled={student.status === "Approved"}
									className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors disabled:opacity-50"
								>
									Approve
								</button>
								<button
									onClick={() =>
										handleStatusUpdate(
											student._id,
											"Rejected"
										)
									}
									disabled={student.status === "Rejected"}
									className="px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors disabled:opacity-50"
								>
									Reject
								</button>
								<button
									onClick={() =>
										handleDelete(
											student._id,
											student.studentName
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
						onClick={() => fetchStudents(pagination.current - 1)}
						disabled={!pagination.hasPrev}
						className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Previous
					</button>

					<span className="text-gray-300">
						Page {pagination.current} of {pagination.total}
					</span>

					<button
						onClick={() => fetchStudents(pagination.current + 1)}
						disabled={!pagination.hasNext}
						className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Next
					</button>
				</div>
			)}

			{/* Detail Modal */}
			{showDetailModal && selectedStudent && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold text-white">
								Registration Details
							</h2>
							<button
								onClick={() => setShowDetailModal(false)}
								className="text-gray-400 hover:text-white text-2xl"
							>
								×
							</button>
						</div>

						<div className="grid md:grid-cols-2 gap-6">
							<div className="space-y-4">
								<div>
									<h3 className="text-lg font-semibold text-white mb-3">
										Personal Information
									</h3>
									<div className="space-y-2 text-gray-300">
										<p>
											<strong>Form No:</strong>{" "}
											{selectedStudent.formNo}
										</p>
										<p>
											<strong>Name:</strong>{" "}
											{selectedStudent.studentName}
										</p>
										<p>
											<strong>Age:</strong>{" "}
											{selectedStudent.age} years
										</p>
										<p>
											<strong>Gender:</strong>{" "}
											{selectedStudent.gender}
										</p>
										<p>
											<strong>Date of Birth:</strong>{" "}
											{new Date(
												selectedStudent.dateOfBirth
											).toLocaleDateString()}
										</p>
										<p>
											<strong>Phone:</strong>{" "}
											{selectedStudent.phoneNumber}
										</p>
									</div>
								</div>

								<div>
									<h3 className="text-lg font-semibold text-white mb-3">
										Address
									</h3>
									<div className="text-gray-300">
										<p>{selectedStudent.address.line1}</p>
										{selectedStudent.address.line2 && (
											<p>
												{selectedStudent.address.line2}
											</p>
										)}
										{selectedStudent.address.line3 && (
											<p>
												{selectedStudent.address.line3}
											</p>
										)}
									</div>
								</div>

								<div>
									<h3 className="text-lg font-semibold text-white mb-3">
										Parents Information
									</h3>
									<div className="space-y-2 text-gray-300">
										<p>
											<strong>Name:</strong>{" "}
											{selectedStudent.parentsName}
										</p>
										<p>
											<strong>Phone:</strong>{" "}
											{selectedStudent.parentsNumber}
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-4">
								<div>
									<div className="space-y-2 text-gray-300">
										<h3 className="text-lg font-semibold text-white">
											Selected Courses:
										</h3>
										<div className="flex flex-wrap gap-2">
											{selectedStudent.courses.map(
												(course) => (
													<span
														key={course}
														className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded text-sm"
													>
														{course}
													</span>
												)
											)}
										</div>
									</div>
								</div>

								<div>
									<h3 className="text-lg font-semibold text-white mb-3">
										Registration Details
									</h3>
									<div className="space-y-2 text-gray-300">
										<p>
											<strong>Registration Date:</strong>{" "}
											{new Date(
												selectedStudent.registrationDate
											).toLocaleDateString()}
										</p>
										<p>
											<strong>Status:</strong>
											<span
												className={`ml-2 px-2 py-1 rounded text-sm ${getStatusColor(
													selectedStudent.status
												)}`}
											>
												{selectedStudent.status}
											</span>
										</p>
									</div>
								</div>

								{selectedStudent.photoUrl && (
									<div>
										<h3 className="text-lg font-semibold text-white mb-3">
											Photo
										</h3>
										<img
											src={selectedStudent.photoUrl}
											alt={selectedStudent.studentName}
											className="w-32 h-40 object-cover rounded border border-gray-600"
										/>
									</div>
								)}
							</div>
						</div>

						{selectedStudent.notes && (
							<div className="mt-6 pt-4 border-t border-gray-700">
								<h3 className="text-lg font-semibold text-white mb-2">
									Notes
								</h3>
								<p className="text-gray-300">
									{selectedStudent.notes}
								</p>
							</div>
						)}

						<div className="flex gap-2 mt-6 pt-4 border-t border-gray-700">
							<button
								onClick={() =>
									handleStatusUpdate(
										selectedStudent._id,
										"Approved"
									)
								}
								disabled={selectedStudent.status === "Approved"}
								className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
							>
								Approve
							</button>
							<button
								onClick={() =>
									handleStatusUpdate(
										selectedStudent._id,
										"Rejected"
									)
								}
								disabled={selectedStudent.status === "Rejected"}
								className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors disabled:opacity-50"
							>
								Reject
							</button>
							<button
								onClick={() => setShowDetailModal(false)}
								className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default StudentManagement;
