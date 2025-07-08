import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import EventManagement from "./EventManagement";
import MagazineManagement from "./MagazineManagement";
import StudentManagement from "./StudentManagement";
import CandidateManagement from "./CandidateManagement";
import SchoolManagement from "./SchoolManagement";
import AboutManagement from "./AboutManagement";
import ServiceManagement from "./ServiceManagement";
import ProfileManagement from "./ProfileManagement";

const AdminDashboard: React.FC = () => {
	const [activeTab, setActiveTab] = useState<
		| "events"
		| "magazines"
		| "students"
		| "candidates"
		| "school"
		| "about"
		| "services"
		| "profile"
	>("events");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const { user, logout } = useAuth();

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
			{/* Animated Background Elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/15 to-pink-600/15 rounded-full blur-3xl animate-pulse delay-500"></div>
				<div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-teal-600/10 rounded-full blur-2xl animate-pulse delay-700"></div>
				<div className="absolute bottom-20 right-1/4 w-72 h-72 bg-gradient-to-br from-rose-400/10 to-pink-600/10 rounded-full blur-2xl animate-pulse delay-300"></div>
			</div>

			{/* Main content */}
			<div className="relative z-10">
				{/* Header */}
				<div className="backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-2xl">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-6 sm:py-8">
							<div className="flex justify-between items-center">
								<div className="flex items-center gap-4">
									<div className="p-3 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-400/20 shadow-lg backdrop-blur-sm">
										<svg
											className="w-8 h-8 text-yellow-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
											/>
										</svg>
									</div>
									<div>
										<h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
											Content Management System
										</h1>
										<div className="flex items-center gap-2 mt-1">
											<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
											<p className="text-white/80 text-sm sm:text-base font-medium flex items-center gap-1">
												<span>Welcome back,</span>{" "}
												<span className="font-semibold bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
													{user?.username}
												</span>
											</p>
										</div>
									</div>
								</div>
								{/* Mobile menu button */}
								<button
									onClick={() =>
										setIsMobileMenuOpen(!isMobileMenuOpen)
									}
									className="sm:hidden p-3 bg-gradient-to-br from-gray-700/40 to-gray-600/30 backdrop-blur-sm border border-white/10 rounded-xl text-gray-300 hover:text-white hover:border-yellow-400/30 transition-all duration-200"
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
											d={
												isMobileMenuOpen
													? "M6 18L18 6M6 6l12 12"
													: "M4 6h16M4 12h16M4 18h16"
											}
										/>
									</svg>
								</button>
							</div>
							<div
								className={`${
									isMobileMenuOpen ? "block" : "hidden"
								} sm:block mt-6 sm:mt-0`}
							>
								<button
									onClick={logout}
									className="group relative w-full sm:w-auto overflow-hidden bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-400 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
								>
									<div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
									<div className="relative flex items-center justify-center gap-2">
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
												d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
											/>
										</svg>
										Logout
									</div>
								</button>
							</div>
						</div>

						{/* Tab Navigation */}
						<div className="border-t border-white/10 pt-6">
							{/* Mobile Dropdown */}
							<div className="sm:hidden">
								<div className="bg-gradient-to-br from-gray-700/40 to-gray-600/30 backdrop-blur-sm border border-white/10 rounded-xl p-1">
									<select
										value={activeTab}
										onChange={(e) =>
											setActiveTab(e.target.value as any)
										}
										className="w-full bg-transparent text-white border-0 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 font-medium"
									>
										<option
											value="events"
											className="bg-gray-800"
										>
											📅 Events Management
										</option>
										<option
											value="magazines"
											className="bg-gray-800"
										>
											📖 Magazine Management
										</option>
										<option
											value="students"
											className="bg-gray-800"
										>
											👨‍🎓 Student Management
										</option>
										<option
											value="candidates"
											className="bg-gray-800"
										>
											👤 Candidate Management
										</option>
										<option
											value="school"
											className="bg-gray-800"
										>
											🏫 School Management
										</option>
										<option
											value="about"
											className="bg-gray-800"
										>
											ℹ️ About Management
										</option>
										<option
											value="services"
											className="bg-gray-800"
										>
											🔧 Services Management
										</option>
										<option
											value="profile"
											className="bg-gray-800"
										>
											👤 Profile Management
										</option>
									</select>
								</div>
							</div>

							{/* Desktop Tabs */}
							<nav className="hidden sm:flex gap-2 overflow-x-auto pb-2">
								<button
									onClick={() => setActiveTab("events")}
									className={`group relative px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
										activeTab === "events"
											? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 text-yellow-400 shadow-lg"
											: "bg-gradient-to-r from-gray-700/30 to-gray-600/20 border border-white/5 text-gray-300 hover:text-white hover:border-yellow-400/20 hover:bg-gradient-to-r hover:from-gray-600/40 hover:to-gray-500/30"
									}`}
								>
									<div className="flex items-center gap-2">
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
										Events
									</div>
								</button>
								<button
									onClick={() => setActiveTab("magazines")}
									className={`group relative px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
										activeTab === "magazines"
											? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-blue-400 shadow-lg"
											: "bg-gradient-to-r from-gray-700/30 to-gray-600/20 border border-white/5 text-gray-300 hover:text-white hover:border-blue-400/20 hover:bg-gradient-to-r hover:from-gray-600/40 hover:to-gray-500/30"
									}`}
								>
									<div className="flex items-center gap-2">
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
												d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
											/>
										</svg>
										Magazines
									</div>
								</button>
								<button
									onClick={() => setActiveTab("students")}
									className={`group relative px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
										activeTab === "students"
											? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-green-400 shadow-lg"
											: "bg-gradient-to-r from-gray-700/30 to-gray-600/20 border border-white/5 text-gray-300 hover:text-white hover:border-green-400/20 hover:bg-gradient-to-r hover:from-gray-600/40 hover:to-gray-500/30"
									}`}
								>
									<div className="flex items-center gap-2">
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
												d="M12 14l9-5-9-5-9 5 9 5z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
											/>
										</svg>
										Students
									</div>
								</button>
								<button
									onClick={() => setActiveTab("candidates")}
									className={`group relative px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
										activeTab === "candidates"
											? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-400 shadow-lg"
											: "bg-gradient-to-r from-gray-700/30 to-gray-600/20 border border-white/5 text-gray-300 hover:text-white hover:border-purple-400/20 hover:bg-gradient-to-r hover:from-gray-600/40 hover:to-gray-500/30"
									}`}
								>
									<div className="flex items-center gap-2">
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
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
											/>
										</svg>
										Candidates
									</div>
								</button>
								<button
									onClick={() => setActiveTab("school")}
									className={`group relative px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
										activeTab === "school"
											? "bg-gradient-to-r from-indigo-500/20 to-blue-500/20 border border-indigo-400/30 text-indigo-400 shadow-lg"
											: "bg-gradient-to-r from-gray-700/30 to-gray-600/20 border border-white/5 text-gray-300 hover:text-white hover:border-indigo-400/20 hover:bg-gradient-to-r hover:from-gray-600/40 hover:to-gray-500/30"
									}`}
								>
									<div className="flex items-center gap-2">
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
												d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
											/>
										</svg>
										School
									</div>
								</button>
								<button
									onClick={() => setActiveTab("about")}
									className={`group relative px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
										activeTab === "about"
											? "bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-400/30 text-cyan-400 shadow-lg"
											: "bg-gradient-to-r from-gray-700/30 to-gray-600/20 border border-white/5 text-gray-300 hover:text-white hover:border-cyan-400/20 hover:bg-gradient-to-r hover:from-gray-600/40 hover:to-gray-500/30"
									}`}
								>
									<div className="flex items-center gap-2">
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
												d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										About
									</div>
								</button>
								<button
									onClick={() => setActiveTab("services")}
									className={`group relative px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
										activeTab === "services"
											? "bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 text-orange-400 shadow-lg"
											: "bg-gradient-to-r from-gray-700/30 to-gray-600/20 border border-white/5 text-gray-300 hover:text-white hover:border-orange-400/20 hover:bg-gradient-to-r hover:from-gray-600/40 hover:to-gray-500/30"
									}`}
								>
									<div className="flex items-center gap-2">
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
												d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
										Services
									</div>
								</button>
								<button
									onClick={() => setActiveTab("profile")}
									className={`group relative px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
										activeTab === "profile"
											? "bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-400/30 text-rose-400 shadow-lg"
											: "bg-gradient-to-r from-gray-700/30 to-gray-600/20 border border-white/5 text-gray-300 hover:text-white hover:border-rose-400/20 hover:bg-gradient-to-r hover:from-gray-600/40 hover:to-gray-500/30"
									}`}
								>
									<div className="flex items-center gap-2">
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
												d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										Profile
									</div>
								</button>
							</nav>
						</div>
					</div>
				</div>

				<div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8">
					<div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl min-h-[600px] relative overflow-hidden">
						{/* Inner background decoration */}
						<div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 rounded-2xl"></div>
						<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400/50 via-orange-400/50 to-pink-400/50 rounded-t-2xl"></div>

						{/* Content */}
						<div className="relative z-10">
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
							) : activeTab === "profile" ? (
								<ProfileManagement />
							) : null}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
