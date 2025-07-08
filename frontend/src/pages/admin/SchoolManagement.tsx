import React, { useState } from "react";
import LocationManagement from "./LocationManagement";
import SkillManagement from "./SkillManagement";
import GalleryManagement from "./GalleryManagement";

const SchoolManagement: React.FC = () => {
	const [activeTab, setActiveTab] = useState<
		"locations" | "skills" | "gallery"
	>("locations");

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="relative bg-gradient-to-r from-emerald-900/30 via-teal-900/30 to-cyan-900/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
				<div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 rounded-2xl"></div>
				<div className="relative">
					<div className="flex items-center gap-4 mb-4">
						<div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
							<svg
								className="w-8 h-8 text-emerald-300"
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
							<h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent">
								School Management
							</h1>
							<p className="text-gray-400 text-sm sm:text-base">
								Manage school locations and skills offered by
								Sankalp School of Art and Skills
							</p>
						</div>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl border border-emerald-500/20">
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
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							</div>
							<div>
								<div className="text-emerald-200 font-medium">
									Locations
								</div>
								<div className="text-gray-400 text-sm">
									Training Centers
								</div>
							</div>
						</div>
						<div className="flex items-center gap-3 p-3 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-xl border border-teal-500/20">
							<div className="w-10 h-10 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
								<svg
									className="w-5 h-5 text-teal-300"
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
								<div className="text-teal-200 font-medium">
									Skills
								</div>
								<div className="text-gray-400 text-sm">
									Art & Crafts
								</div>
							</div>
						</div>
						<div className="flex items-center gap-3 p-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20">
							<div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
								<svg
									className="w-5 h-5 text-cyan-300"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<div>
								<div className="text-cyan-200 font-medium">
									Gallery
								</div>
								<div className="text-gray-400 text-sm">
									School Images
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Mobile Dropdown Navigation */}
			<div className="sm:hidden">
				<div className="relative bg-gradient-to-r from-slate-900/40 via-gray-900/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
					<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
					<div className="relative">
						<label className="text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
							<svg
								className="w-4 h-4 text-emerald-400"
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
							Select Section
						</label>
						<select
							value={activeTab}
							onChange={(e) =>
								setActiveTab(e.target.value as any)
							}
							className="w-full px-4 py-3 bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
						>
							<option value="locations">📍 Locations</option>
							<option value="skills">🎨 Skills</option>
							<option value="gallery">🖼️ Gallery</option>
						</select>
					</div>
				</div>
			</div>

			{/* Desktop Tab Navigation */}
			<div className="hidden sm:block">
				<div className="relative bg-gradient-to-r from-slate-900/40 via-gray-900/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
					<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
					<div className="relative flex space-x-2">
						<button
							onClick={() => setActiveTab("locations")}
							className={`flex items-center gap-2 px-6 py-3 font-medium rounded-xl transition-all duration-200 text-sm sm:text-base whitespace-nowrap ${
								activeTab === "locations"
									? "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-200 border border-emerald-500/30 backdrop-blur-sm"
									: "text-gray-300 hover:bg-gradient-to-r hover:from-slate-700/30 hover:to-gray-700/30 hover:text-white"
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
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							Locations
						</button>
						<button
							onClick={() => setActiveTab("skills")}
							className={`flex items-center gap-2 px-6 py-3 font-medium rounded-xl transition-all duration-200 text-sm sm:text-base whitespace-nowrap ${
								activeTab === "skills"
									? "bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-200 border border-teal-500/30 backdrop-blur-sm"
									: "text-gray-300 hover:bg-gradient-to-r hover:from-slate-700/30 hover:to-gray-700/30 hover:text-white"
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
									d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
								/>
							</svg>
							Skills
						</button>
						<button
							onClick={() => setActiveTab("gallery")}
							className={`flex items-center gap-2 px-6 py-3 font-medium rounded-xl transition-all duration-200 text-sm sm:text-base whitespace-nowrap ${
								activeTab === "gallery"
									? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 border border-cyan-500/30 backdrop-blur-sm"
									: "text-gray-300 hover:bg-gradient-to-r hover:from-slate-700/30 hover:to-gray-700/30 hover:text-white"
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
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							Gallery
						</button>
					</div>
				</div>
			</div>

			{/* Tab Content */}
			<div className="relative bg-gradient-to-r from-slate-900/40 via-gray-900/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
				<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
				<div className="relative">
					{activeTab === "locations" && <LocationManagement />}
					{activeTab === "skills" && <SkillManagement />}
					{activeTab === "gallery" && (
						<GalleryManagement category="School" />
					)}
				</div>
			</div>
		</div>
	);
};

export default SchoolManagement;
