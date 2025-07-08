import React, { useState, useEffect } from "react";
import { studentAPI, skillsAPI } from "../../services/api";
import PDFPreviewModal from "../../components/PDFPreviewModal";

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

interface Skill {
	_id: string;
	name: string;
	icon?: string;
	displayOrder: number;
	isActive: boolean;
}

const StudentManagement: React.FC = () => {
	const [students, setStudents] = useState<Student[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(
		null
	);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [showPDFPreview, setShowPDFPreview] = useState(false);
	const [pdfStudent, setPdfStudent] = useState<Student | null>(null);
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
	const [skills, setSkills] = useState<Skill[]>([]);

	// Fetch skills for course filter
	const fetchSkills = async () => {
		try {
			const skillsData = await skillsAPI.getAllSkills();
			setSkills(skillsData);
		} catch (error) {
			console.error("Error fetching skills:", error);
		}
	};

	useEffect(() => {
		fetchSkills();
	}, []);

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

	const handleViewPDF = (student: Student) => {
		setPdfStudent(student);
		setShowPDFPreview(true);
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
		<div className="space-y-6">
			{/* Header */}
			<div className="bg-gradient-to-r from-blue-400/20 to-teal-400/20 backdrop-blur-lg rounded-xl p-6 border border-blue-400/30">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
							Student Registrations
						</h1>
						<p className="text-gray-300 text-sm sm:text-base">
							Manage student applications and track enrollment
							progress
						</p>
					</div>
					<div className="hidden sm:flex items-center justify-center w-16 h-16 bg-blue-400/20 rounded-lg">
						<svg
							className="w-8 h-8 text-blue-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 4.354a7.646 7.646 0 100 15.292 7.646 7.646 0 000-15.292zm0 0V1m0 3.354a7.646 7.646 0 100 15.292 7.646 7.646 0 000-15.292z"
							/>
						</svg>
					</div>
				</div>
			</div>

			{/* Statistics */}
			{statistics && (
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
										d="M12 4.354a7.646 7.646 0 100 15.292 7.646 7.646 0 000-15.292zm0 0V1m0 3.354a7.646 7.646 0 100 15.292 7.646 7.646 0 000-15.292z"
									/>
								</svg>
							</div>
							<div>
								<p className="text-2xl font-bold text-white">
									{statistics.totalStudents}
								</p>
								<p className="text-blue-300 text-sm font-medium">
									Total Students
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
									{statistics.approvedStudents}
								</p>
								<p className="text-green-300 text-sm font-medium">
									Approved
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
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<div>
								<p className="text-2xl font-bold text-white">
									{statistics.pendingStudents}
								</p>
								<p className="text-yellow-300 text-sm font-medium">
									Pending
								</p>
							</div>
						</div>
					</div>
					<div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-lg rounded-xl p-4 border border-purple-500/30">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
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
										d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
									/>
								</svg>
							</div>
							<div>
								<p className="text-lg font-bold text-white truncate">
									{statistics.courseStats[0]?._id || "N/A"}
								</p>
								<p className="text-purple-300 text-sm font-medium">
									Popular Course
								</p>
							</div>
						</div>
					</div>
				</div>
			)}

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

			{/* Filters */}
			<div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
				<h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
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
							d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
						/>
					</svg>
					Filter Students
				</h4>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Search
						</label>
						<input
							type="text"
							placeholder="Search students..."
							value={filters.search}
							onChange={(e) =>
								setFilters({
									...filters,
									search: e.target.value,
								})
							}
							className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Status
						</label>
						<select
							value={filters.status}
							onChange={(e) =>
								setFilters({
									...filters,
									status: e.target.value,
								})
							}
							className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
						>
							<option value="">All Status</option>
							<option value="Pending">Pending</option>
							<option value="Approved">Approved</option>
							<option value="Rejected">Rejected</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Course
						</label>
						<select
							value={filters.course}
							onChange={(e) =>
								setFilters({
									...filters,
									course: e.target.value,
								})
							}
							className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
						>
							<option value="">All Courses</option>
							{skills.map((skill) => (
								<option key={skill._id} value={skill.name}>
									{skill.name}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Sort By
						</label>
						<select
							value={filters.sortBy}
							onChange={(e) =>
								setFilters({
									...filters,
									sortBy: e.target.value,
								})
							}
							className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
						>
							<option value="createdAt">Registration Date</option>
							<option value="studentName">Name</option>
							<option value="age">Age</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Order
						</label>
						<select
							value={filters.sortOrder}
							onChange={(e) =>
								setFilters({
									...filters,
									sortOrder: e.target.value,
								})
							}
							className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
						>
							<option value="desc">Newest First</option>
							<option value="asc">Oldest First</option>
						</select>
					</div>
				</div>
			</div>

			{/* Student List */}
			{loading ? (
				<div className="text-center py-16">
					<div className="inline-flex items-center gap-4">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
						<span className="text-gray-300 text-lg">
							Loading registrations...
						</span>
					</div>
				</div>
			) : students.length === 0 ? (
				<div className="text-center py-16">
					<div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 max-w-md mx-auto border border-gray-700">
						<div className="w-20 h-20 bg-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
							<svg
								className="w-10 h-10 text-blue-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 4.354a7.646 7.646 0 100 15.292 7.646 7.646 0 000-15.292zm0 0V1m0 3.354a7.646 7.646 0 100 15.292 7.646 7.646 0 000-15.292z"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-bold text-white mb-3">
							No Registrations Found
						</h3>
						<p className="text-gray-400">
							No student registrations match your current filters.
						</p>
					</div>
				</div>
			) : (
				<div className="space-y-4">
					{students.map((student) => (
						<div
							key={student._id}
							className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-blue-400/50 transition-all duration-300"
						>
							<div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
								<div className="flex-1">
									<div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
										<div className="flex items-center gap-3">
											<div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center">
												<svg
													className="w-6 h-6 text-blue-400"
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
												<h3 className="text-lg sm:text-xl font-semibold text-white">
													{student.studentName}
												</h3>
												<div className="flex items-center gap-2 text-sm text-gray-400">
													<span>
														#{student.formNo}
													</span>
													<span>•</span>
													<span>
														Age: {student.age}
													</span>
												</div>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<span
												className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
													student.status
												)}`}
											>
												{student.status}
											</span>
										</div>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
										<div className="space-y-2">
											<div className="flex items-center gap-2 text-sm text-gray-300">
												<svg
													className="w-4 h-4 text-gray-400"
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
												<span>
													<strong>Gender:</strong>{" "}
													{student.gender}
												</span>
											</div>
											<div className="flex items-center gap-2 text-sm text-gray-300">
												<svg
													className="w-4 h-4 text-gray-400"
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
												<span>
													<strong>Phone:</strong>{" "}
													{student.phoneNumber}
												</span>
											</div>
										</div>
										<div className="space-y-2">
											<div className="flex items-center gap-2 text-sm text-gray-300">
												<svg
													className="w-4 h-4 text-gray-400"
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
												<span>
													<strong>Parents:</strong>{" "}
													{student.parentsName}
												</span>
											</div>
											<div className="flex items-center gap-2 text-sm text-gray-300">
												<svg
													className="w-4 h-4 text-gray-400"
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
												<span>
													<strong>
														Parents' Phone:
													</strong>{" "}
													{student.parentsNumber}
												</span>
											</div>
										</div>
									</div>

									<div className="mb-4">
										<div className="flex items-center gap-2 mb-2">
											<svg
												className="w-4 h-4 text-gray-400"
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
											<span className="text-sm text-gray-400 font-medium">
												Courses:
											</span>
										</div>
										<div className="flex flex-wrap gap-2">
											{student.courses.map(
												(course, index) => (
													<span
														key={index}
														className="bg-blue-400/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium"
													>
														{course}
													</span>
												)
											)}
										</div>
									</div>

									<div className="flex items-center gap-2 text-xs text-gray-400">
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
												d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
										<span>
											Registered:{" "}
											{new Date(
												student.createdAt
											).toLocaleDateString()}
										</span>
									</div>
								</div>

								<div className="flex items-center gap-4">
									{student.photoUrl && (
										<div className="relative group">
											<img
												src={student.photoUrl}
												alt={student.studentName}
												className="w-16 h-20 object-cover rounded-lg border border-gray-600 group-hover:border-blue-400 transition-all duration-300"
											/>
											<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-all duration-300"></div>
										</div>
									)}
								</div>
							</div>

							{/* Actions */}
							<div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-700">
								<button
									onClick={() => handleViewDetails(student)}
									className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
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
									View Details
								</button>
								<button
									onClick={() => handleViewPDF(student)}
									className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center gap-2"
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
									View PDF
								</button>
								<button
									onClick={() =>
										handleStatusUpdate(
											student._id,
											"Approved"
										)
									}
									disabled={student.status === "Approved"}
									className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
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
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
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
									className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
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
										handleDelete(
											student._id,
											student.studentName
										)
									}
									className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-2"
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
					))}
				</div>
			)}

			{/* Pagination */}
			{pagination.total > 1 && (
				<div className="flex justify-center items-center gap-4 mt-8">
					<button
						onClick={() => fetchStudents(pagination.current - 1)}
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
						onClick={() => fetchStudents(pagination.current + 1)}
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

			{/* Detail Modal */}
			{showDetailModal && selectedStudent && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-2 sm:p-4 z-50 overflow-y-auto">
					<div className="bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto my-4 sm:my-8">
						<div className="flex justify-between items-center mb-4 sm:mb-6">
							<h2 className="text-xl sm:text-2xl font-bold text-white">
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

			{/* PDF Preview Modal */}
			{pdfStudent && (
				<PDFPreviewModal
					student={pdfStudent}
					isOpen={showPDFPreview}
					onClose={() => {
						setShowPDFPreview(false);
						setPdfStudent(null);
					}}
				/>
			)}
		</div>
	);
};

export default StudentManagement;
