import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import EventManagement from "./EventManagement";
import MagazineManagement from "./MagazineManagement";
import StudentManagement from "./StudentManagement";
import CandidateManagement from "./CandidateManagement";
import SchoolManagement from "./SchoolManagement";
import AboutManagement from "./AboutManagement";
import ServiceManagement from "./ServiceManagement";

const AdminDashboard: React.FC = () => {
	const [activeTab, setActiveTab] = useState<
		| "events"
		| "magazines"
		| "students"
		| "candidates"
		| "school"
		| "about"
		| "services"
	>("events");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const { user, logout } = useAuth();

	return (
		<div className="min-h-screen bg-gray-900">
			{/* Header */}
			<div className="bg-gray-800 shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6">
						<div className="flex justify-between items-center">
							<div>
								<h1 className="text-2xl sm:text-3xl font-bold text-white">
									Content Management System
								</h1>
								<p className="text-gray-400 text-sm sm:text-base">
									Welcome, {user?.username}
								</p>
							</div>
							{/* Mobile menu button */}
							<button
								onClick={() =>
									setIsMobileMenuOpen(!isMobileMenuOpen)
								}
								className="sm:hidden text-gray-400 hover:text-white p-2"
							>
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							</button>
						</div>
						<div
							className={`${
								isMobileMenuOpen ? "block" : "hidden"
							} sm:block mt-4 sm:mt-0`}
						>
							<button
								onClick={logout}
								className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
							>
								Logout
							</button>
						</div>
					</div>

					{/* Tab Navigation */}
					<div className="border-b border-gray-700">
						{/* Mobile Dropdown */}
						<div className="sm:hidden">
							<select
								value={activeTab}
								onChange={(e) =>
									setActiveTab(e.target.value as any)
								}
								className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:border-yellow-400"
							>
								<option value="events">
									Events Management
								</option>
								<option value="magazines">
									Magazine Management
								</option>
								<option value="students">
									Student Management
								</option>
								<option value="candidates">
									Candidate Management
								</option>
								<option value="school">
									School Management
								</option>
								<option value="about">About Management</option>
								<option value="services">
									Services Management
								</option>
							</select>
						</div>

						{/* Desktop Tabs */}
						<nav className="hidden sm:flex -mb-px space-x-2 lg:space-x-8 overflow-x-auto">
							<button
								onClick={() => setActiveTab("events")}
								className={`py-2 px-1 border-b-2 font-medium text-xs lg:text-sm whitespace-nowrap ${
									activeTab === "events"
										? "border-yellow-400 text-yellow-400"
										: "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
								}`}
							>
								Events
							</button>
							<button
								onClick={() => setActiveTab("magazines")}
								className={`py-2 px-1 border-b-2 font-medium text-xs lg:text-sm whitespace-nowrap ${
									activeTab === "magazines"
										? "border-yellow-400 text-yellow-400"
										: "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
								}`}
							>
								Magazines
							</button>
							<button
								onClick={() => setActiveTab("students")}
								className={`py-2 px-1 border-b-2 font-medium text-xs lg:text-sm whitespace-nowrap ${
									activeTab === "students"
										? "border-yellow-400 text-yellow-400"
										: "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
								}`}
							>
								Students
							</button>
							<button
								onClick={() => setActiveTab("candidates")}
								className={`py-2 px-1 border-b-2 font-medium text-xs lg:text-sm whitespace-nowrap ${
									activeTab === "candidates"
										? "border-yellow-400 text-yellow-400"
										: "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
								}`}
							>
								Candidates
							</button>
							<button
								onClick={() => setActiveTab("school")}
								className={`py-2 px-1 border-b-2 font-medium text-xs lg:text-sm whitespace-nowrap ${
									activeTab === "school"
										? "border-yellow-400 text-yellow-400"
										: "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
								}`}
							>
								School
							</button>
							<button
								onClick={() => setActiveTab("about")}
								className={`py-2 px-1 border-b-2 font-medium text-xs lg:text-sm whitespace-nowrap ${
									activeTab === "about"
										? "border-yellow-400 text-yellow-400"
										: "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
								}`}
							>
								About
							</button>
							<button
								onClick={() => setActiveTab("services")}
								className={`py-2 px-1 border-b-2 font-medium text-xs lg:text-sm whitespace-nowrap ${
									activeTab === "services"
										? "border-yellow-400 text-yellow-400"
										: "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
								}`}
							>
								Services
							</button>
						</nav>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
				{activeTab === "events" ? (
					<EventManagement />
				) : activeTab === "magazines" ? (
					<MagazineManagement />
				) : activeTab === "students" ? (
					<StudentManagement />
				) : activeTab === "candidates" ? (
					<CandidateManagement />
				) : activeTab === "school" ? (
					<SchoolManagement />
				) : activeTab === "about" ? (
					<AboutManagement />
				) : activeTab === "services" ? (
					<ServiceManagement />
				) : null}
			</div>
		</div>
	);
};

export default AdminDashboard;
