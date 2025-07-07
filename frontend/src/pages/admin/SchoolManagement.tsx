import React, { useState } from "react";
import LocationManagement from "./LocationManagement";
import SkillManagement from "./SkillManagement";
import GalleryManagement from "./GalleryManagement";

const SchoolManagement: React.FC = () => {
	const [activeTab, setActiveTab] = useState<
		"locations" | "skills" | "gallery"
	>("locations");

	return (
		<div className="min-h-screen bg-gray-900 p-2 sm:p-4 lg:p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-6 sm:mb-8">
					<h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">
						School Management
					</h1>
					<p className="text-gray-400 text-sm sm:text-base">
						Manage school locations and skills offered by Sankalp
						School of Art and Skills
					</p>
				</div>

				{/* Mobile Dropdown Navigation */}
				<div className="sm:hidden mb-6">
					<select
						value={activeTab}
						onChange={(e) => setActiveTab(e.target.value as any)}
						className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400"
					>
						<option value="locations">Locations</option>
						<option value="skills">Skills</option>
						<option value="gallery">Gallery</option>
					</select>
				</div>

				{/* Desktop Tab Navigation */}
				<div className="hidden sm:flex sm:space-x-1 mb-6 sm:mb-8 overflow-x-auto">
					<button
						onClick={() => setActiveTab("locations")}
						className={`px-4 sm:px-6 py-2 sm:py-3 font-medium rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap ${
							activeTab === "locations"
								? "bg-yellow-500 text-black"
								: "bg-gray-800 text-gray-300 hover:bg-gray-700"
						}`}
					>
						Locations
					</button>
					<button
						onClick={() => setActiveTab("skills")}
						className={`px-4 sm:px-6 py-2 sm:py-3 font-medium rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap ${
							activeTab === "skills"
								? "bg-yellow-500 text-black"
								: "bg-gray-800 text-gray-300 hover:bg-gray-700"
						}`}
					>
						Skills
					</button>
					<button
						onClick={() => setActiveTab("gallery")}
						className={`px-4 sm:px-6 py-2 sm:py-3 font-medium rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap ${
							activeTab === "gallery"
								? "bg-yellow-500 text-black"
								: "bg-gray-800 text-gray-300 hover:bg-gray-700"
						}`}
					>
						Gallery
					</button>
				</div>

				{/* Tab Content */}
				<div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-3 sm:p-4 lg:p-6">
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
