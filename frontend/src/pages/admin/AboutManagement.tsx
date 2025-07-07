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
				<div className="mb-6 sm:mb-8">
					<h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">
						About Page Management
					</h1>
					<p className="text-gray-400 text-sm sm:text-base">
						Manage journey timeline, achievements, and school
						information for the About page
					</p>
				</div>

				{/* Mobile Dropdown Navigation */}
				<div className="sm:hidden mb-6">
					<select
						value={activeTab}
						onChange={(e) => setActiveTab(e.target.value as any)}
						className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400"
					>
						<option value="journey">Journey Timeline</option>
						<option value="achievements">Achievements</option>
						<option value="school">School Info</option>
					</select>
				</div>

				{/* Desktop Tab Navigation */}
				<div className="hidden sm:flex sm:space-x-1 mb-6 sm:mb-8 overflow-x-auto">
					<button
						onClick={() => setActiveTab("journey")}
						className={`px-4 sm:px-6 py-2 sm:py-3 font-medium rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap ${
							activeTab === "journey"
								? "bg-yellow-500 text-black"
								: "bg-gray-800 text-gray-300 hover:bg-gray-700"
						}`}
					>
						Journey Timeline
					</button>
					<button
						onClick={() => setActiveTab("achievements")}
						className={`px-4 sm:px-6 py-2 sm:py-3 font-medium rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap ${
							activeTab === "achievements"
								? "bg-yellow-500 text-black"
								: "bg-gray-800 text-gray-300 hover:bg-gray-700"
						}`}
					>
						Achievements
					</button>
					<button
						onClick={() => setActiveTab("school")}
						className={`px-4 sm:px-6 py-2 sm:py-3 font-medium rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap ${
							activeTab === "school"
								? "bg-yellow-500 text-black"
								: "bg-gray-800 text-gray-300 hover:bg-gray-700"
						}`}
					>
						School Info
					</button>
				</div>

				{/* Tab Content */}
				<div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-3 sm:p-4 lg:p-6">
					{activeTab === "journey" && <JourneyManagement />}
					{activeTab === "achievements" && <AchievementManagement />}
					{activeTab === "school" && <SchoolManagement />}
				</div>
			</div>
		</div>
	);
};

export default AboutManagement;
