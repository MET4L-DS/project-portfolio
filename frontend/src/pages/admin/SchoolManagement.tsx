import React, { useState } from "react";
import LocationManagement from "./LocationManagement";
import SkillManagement from "./SkillManagement";
import GalleryManagement from "./GalleryManagement";

const SchoolManagement: React.FC = () => {
	const [activeTab, setActiveTab] = useState<
		"locations" | "skills" | "gallery"
	>("locations");

	return (
		<div className="min-h-screen bg-gray-900 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white mb-4">
						School Management
					</h1>
					<p className="text-gray-400">
						Manage school locations and skills offered by Sankalp
						School of Art and Skills
					</p>
				</div>

				{/* Tab Navigation */}
				<div className="flex space-x-1 mb-8">
					<button
						onClick={() => setActiveTab("locations")}
						className={`px-6 py-3 font-medium rounded-lg transition-colors ${
							activeTab === "locations"
								? "bg-yellow-500 text-black"
								: "bg-gray-800 text-gray-300 hover:bg-gray-700"
						}`}
					>
						Locations
					</button>
					<button
						onClick={() => setActiveTab("skills")}
						className={`px-6 py-3 font-medium rounded-lg transition-colors ${
							activeTab === "skills"
								? "bg-yellow-500 text-black"
								: "bg-gray-800 text-gray-300 hover:bg-gray-700"
						}`}
					>
						Skills
					</button>
					<button
						onClick={() => setActiveTab("gallery")}
						className={`px-6 py-3 font-medium rounded-lg transition-colors ${
							activeTab === "gallery"
								? "bg-yellow-500 text-black"
								: "bg-gray-800 text-gray-300 hover:bg-gray-700"
						}`}
					>
						Gallery
					</button>
				</div>

				{/* Tab Content */}
				<div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
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
