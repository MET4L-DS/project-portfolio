import React, { useState } from "react";
import JourneyManagement from "./JourneyManagement";
import AchievementManagement from "./AchievementManagement";
import SchoolManagement from "./SchoolManagement";

const AboutManagement: React.FC = () => {
	const [activeTab, setActiveTab] = useState<
		"journey" | "achievements" | "school"
	>("journey");

	return (
		<div className="min-h-screen bg-gray-900 p-2 sm:p-4 lg:p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="relative bg-gradient-to-r from-amber-900/30 via-yellow-900/30 to-amber-900/30 backdrop-blur-sm rounded-2xl p-6 mb-6 sm:mb-8 border border-white/10">
					<div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-yellow-500/5 to-amber-500/5 rounded-2xl"></div>
					<div className="relative flex items-center gap-4">
						<div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
							<svg
								className="w-8 h-8 text-amber-300"
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
							<h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent mb-2">
								About Page Management
							</h1>
							<p className="text-gray-400 text-sm sm:text-base">
								Manage journey timeline, achievements, and
								school information for the About page
							</p>
						</div>
					</div>
				</div>

				{/* Section Overview Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 sm:mb-8">
					<div className="relative bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-blue-900/20 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
						<div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-blue-500/5 rounded-xl"></div>
						<div className="relative flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center">
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
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<div>
								<h3 className="font-semibold text-blue-200">
									Journey Timeline
								</h3>
								<p className="text-xs text-gray-400">
									Career milestones & experiences
								</p>
							</div>
						</div>
					</div>

					<div className="relative bg-gradient-to-r from-amber-900/20 via-yellow-900/20 to-amber-900/20 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
						<div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-yellow-500/5 to-amber-500/5 rounded-xl"></div>
						<div className="relative flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-lg flex items-center justify-center">
								<svg
									className="w-5 h-5 text-amber-300"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
									/>
								</svg>
							</div>
							<div>
								<h3 className="font-semibold text-amber-200">
									Achievements
								</h3>
								<p className="text-xs text-gray-400">
									Awards & accomplishments
								</p>
							</div>
						</div>
					</div>

					<div className="relative bg-gradient-to-r from-emerald-900/20 via-green-900/20 to-emerald-900/20 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
						<div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-emerald-500/5 rounded-xl"></div>
						<div className="relative flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg flex items-center justify-center">
								<svg
									className="w-5 h-5 text-emerald-300"
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
							</div>
							<div>
								<h3 className="font-semibold text-emerald-200">
									School Information
								</h3>
								<p className="text-xs text-gray-400">
									Training centers & programs
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Mobile Dropdown Navigation */}
				<div className="sm:hidden mb-6">
					<div className="relative bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-white/10">
						<select
							value={activeTab}
							onChange={(e) =>
								setActiveTab(e.target.value as any)
							}
							className="w-full bg-transparent text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 appearance-none cursor-pointer"
						>
							<option value="journey" className="bg-gray-800">
								🕐 Journey Timeline
							</option>
							<option
								value="achievements"
								className="bg-gray-800"
							>
								🏆 Achievements
							</option>
							<option value="school" className="bg-gray-800">
								🏢 School Info
							</option>
						</select>
						<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
							<svg
								className="w-5 h-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</div>
					</div>
				</div>

				{/* Desktop Tab Navigation */}
				<div className="hidden sm:flex sm:space-x-2 mb-6 sm:mb-8 overflow-x-auto">
					<button
						onClick={() => setActiveTab("journey")}
						className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 font-medium rounded-xl transition-all duration-200 text-sm sm:text-base whitespace-nowrap backdrop-blur-sm border ${
							activeTab === "journey"
								? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-200 border-blue-500/30"
								: "bg-gradient-to-r from-slate-700/20 to-gray-700/20 text-gray-300 border-gray-600/30 hover:from-slate-600/30 hover:to-gray-600/30"
						}`}
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
						Journey Timeline
					</button>
					<button
						onClick={() => setActiveTab("achievements")}
						className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 font-medium rounded-xl transition-all duration-200 text-sm sm:text-base whitespace-nowrap backdrop-blur-sm border ${
							activeTab === "achievements"
								? "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-200 border-amber-500/30"
								: "bg-gradient-to-r from-slate-700/20 to-gray-700/20 text-gray-300 border-gray-600/30 hover:from-slate-600/30 hover:to-gray-600/30"
						}`}
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
								d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
							/>
						</svg>
						Achievements
					</button>
					<button
						onClick={() => setActiveTab("school")}
						className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 font-medium rounded-xl transition-all duration-200 text-sm sm:text-base whitespace-nowrap backdrop-blur-sm border ${
							activeTab === "school"
								? "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-200 border-emerald-500/30"
								: "bg-gradient-to-r from-slate-700/20 to-gray-700/20 text-gray-300 border-gray-600/30 hover:from-slate-600/30 hover:to-gray-600/30"
						}`}
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
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
							/>
						</svg>
						School Info
					</button>
				</div>

				{/* Tab Content */}
				<div className="relative bg-gradient-to-r from-slate-900/40 via-gray-900/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-white/10 p-3 sm:p-4 lg:p-6">
					<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
					<div className="relative">
						{activeTab === "journey" && <JourneyManagement />}
						{activeTab === "achievements" && (
							<AchievementManagement />
						)}
						{activeTab === "school" && <SchoolManagement />}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AboutManagement;
