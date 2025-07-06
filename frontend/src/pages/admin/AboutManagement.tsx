import React, { useState } from "react";
import JourneyManagement from "./JourneyManagement";
import AchievementManagement from "./AchievementManagement";
import SchoolManagement from "./SchoolManagement";

const AboutManagement: React.FC = () => {
	const [activeTab, setActiveTab] = useState<
		"journey" | "achievements" | "school"
	>("journey");

	return (
		<div className="min-h-screen bg-gray-900 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white mb-4">
						About Page Management
					</h1>
					<p className="text-gray-400">
						Manage journey timeline, achievements, and school
						information for the About page
					</p>
				</div>

				{/* Tab Navigation */}
				<div className="flex space-x-1 mb-8">
					<button
						onClick={() => setActiveTab("journey")}
						className={`px-6 py-3 font-medium rounded-lg transition-colors ${
							activeTab === "journey"
								? "bg-yellow-500 text-black"
								: "bg-gray-800 text-gray-300 hover:bg-gray-700"
						}`}
					>
						Journey Timeline
					</button>
					<button
						onClick={() => setActiveTab("achievements")}
						className={`px-6 py-3 font-medium rounded-lg transition-colors ${
							activeTab === "achievements"
								? "bg-yellow-500 text-black"
								: "bg-gray-800 text-gray-300 hover:bg-gray-700"
						}`}
					>
						Achievements
					</button>
					<button
						onClick={() => setActiveTab("school")}
						className={`px-6 py-3 font-medium rounded-lg transition-colors ${
							activeTab === "school"
								? "bg-yellow-500 text-black"
								: "bg-gray-800 text-gray-300 hover:bg-gray-700"
						}`}
					>
						School Info
					</button>
				</div>

				{/* Tab Content */}
				<div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
					{activeTab === "journey" && <JourneyManagement />}
					{activeTab === "achievements" && <AchievementManagement />}
					{activeTab === "school" && <SchoolManagement />}
				</div>
			</div>
		</div>
	);
};

export default AboutManagement;
