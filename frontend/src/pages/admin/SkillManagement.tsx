import React, { useState, useEffect } from "react";
import { skillsAPI } from "../../services/api";

interface Skill {
	_id: string;
	name: string;
	icon: string;
	description?: string;
	displayOrder: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

interface SkillFormData {
	name: string;
	icon: string;
	description: string;
	displayOrder: number;
}

const SkillManagement: React.FC = () => {
	const [skills, setSkills] = useState<Skill[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
	const [formData, setFormData] = useState<SkillFormData>({
		name: "",
		icon: "",
		description: "",
		displayOrder: 0,
	});

	// Common emoji icons for skills
	const commonIcons = [
		"🎨",
		"💃",
		"🧵",
		"🎭",
		"🎤",
		"🕺",
		"🧘",
		"🥋",
		"💄",
		"✋",
		"👗",
		"📸",
		"📷",
		"🎯",
		"🎪",
		"🎼",
		"🖌️",
		"✂️",
		"🧶",
		"🎺",
		"🎻",
		"🏓",
		"⚽",
		"🏀",
	];

	// Load skills
	useEffect(() => {
		fetchSkills();
	}, []);

	const fetchSkills = async () => {
		try {
			setLoading(true);
			const data = await skillsAPI.getAllSkillsAdmin();
			setSkills(data);
		} catch (error: any) {
			setError(error.response?.data?.error || "Error fetching skills");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (editingSkill) {
				await skillsAPI.updateSkill(editingSkill._id, formData);
			} else {
				await skillsAPI.createSkill(formData);
			}
			await fetchSkills();
			resetForm();
		} catch (error: any) {
			setError(error.response?.data?.error || "Error saving skill");
		}
	};

	const handleEdit = (skill: Skill) => {
		setEditingSkill(skill);
		setFormData({
			name: skill.name,
			icon: skill.icon,
			description: skill.description || "",
			displayOrder: skill.displayOrder,
		});
		setShowForm(true);
	};

	const handleDelete = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this skill?")) {
			try {
				await skillsAPI.deleteSkill(id);
				await fetchSkills();
			} catch (error: any) {
				setError(error.response?.data?.error || "Error deleting skill");
			}
		}
	};

	const handleToggleStatus = async (id: string) => {
		try {
			await skillsAPI.toggleSkillStatus(id);
			await fetchSkills();
		} catch (error: any) {
			setError(
				error.response?.data?.error || "Error updating skill status"
			);
		}
	};

	const resetForm = () => {
		setFormData({
			name: "",
			icon: "",
			description: "",
			displayOrder: 0,
		});
		setEditingSkill(null);
		setShowForm(false);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-white">
					Skill Management
				</h2>
				<button
					onClick={() => setShowForm(true)}
					className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
				>
					Add New Skill
				</button>
			</div>

			{error && (
				<div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
					{error}
				</div>
			)}

			{/* Form Modal */}
			{showForm && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-gray-800 p-6 rounded-xl border border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
						<h3 className="text-xl font-bold text-white mb-4">
							{editingSkill ? "Edit Skill" : "Add New Skill"}
						</h3>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-gray-300 mb-2">
									Name
								</label>
								<input
									type="text"
									value={formData.name}
									onChange={(e) =>
										setFormData({
											...formData,
											name: e.target.value,
										})
									}
									className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
									required
								/>
							</div>
							<div>
								<label className="block text-gray-300 mb-2">
									Icon
								</label>
								<input
									type="text"
									value={formData.icon}
									onChange={(e) =>
										setFormData({
											...formData,
											icon: e.target.value,
										})
									}
									className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
									placeholder="e.g., 🎨"
									required
								/>
								<div className="mt-2">
									<p className="text-sm text-gray-400 mb-2">
										Quick select:
									</p>
									<div className="grid grid-cols-8 gap-2">
										{commonIcons.map((icon, index) => (
											<button
												key={index}
												type="button"
												onClick={() =>
													setFormData({
														...formData,
														icon,
													})
												}
												className="text-xl p-2 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 hover:border-yellow-400 transition-colors"
											>
												{icon}
											</button>
										))}
									</div>
								</div>
							</div>
							<div>
								<label className="block text-gray-300 mb-2">
									Description (Optional)
								</label>
								<textarea
									value={formData.description}
									onChange={(e) =>
										setFormData({
											...formData,
											description: e.target.value,
										})
									}
									className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
									rows={3}
									placeholder="Brief description of the skill..."
								/>
							</div>
							<div>
								<label className="block text-gray-300 mb-2">
									Display Order
								</label>
								<input
									type="number"
									value={formData.displayOrder}
									onChange={(e) =>
										setFormData({
											...formData,
											displayOrder:
												parseInt(e.target.value) || 0,
										})
									}
									className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
								/>
							</div>
							<div className="flex gap-3">
								<button
									type="submit"
									className="flex-1 bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-400 transition-colors"
								>
									{editingSkill ? "Update" : "Create"}
								</button>
								<button
									type="button"
									onClick={resetForm}
									className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-500 transition-colors"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Skills Grid */}
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
				{skills.map((skill) => (
					<div
						key={skill._id}
						className={`p-4 rounded-xl border transition-all ${
							skill.isActive
								? "bg-gray-800 border-gray-700 hover:border-yellow-400"
								: "bg-gray-800/50 border-gray-600"
						}`}
					>
						<div className="flex justify-between items-start mb-3">
							<span className="text-3xl">{skill.icon}</span>
							<div className="flex gap-1">
								<button
									onClick={() => handleEdit(skill)}
									className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/20 p-1 text-sm rounded-md transition-all duration-200 transform hover:scale-110"
									title="Edit"
								>
									✏️
								</button>
								<button
									onClick={() =>
										handleToggleStatus(skill._id)
									}
									className={`p-1 text-sm rounded-md transition-all duration-200 transform hover:scale-110 ${
										skill.isActive
											? "text-green-400 hover:text-green-300 hover:bg-green-400/20"
											: "text-gray-400 hover:text-gray-300 hover:bg-gray-400/20"
									}`}
									title={
										skill.isActive
											? "Deactivate"
											: "Activate"
									}
								>
									{skill.isActive ? "👁️" : "👁️‍🗨️"}
								</button>
								<button
									onClick={() => handleDelete(skill._id)}
									className="text-red-400 hover:text-red-300 hover:bg-red-400/20 p-1 text-sm rounded-md transition-all duration-200 transform hover:scale-110"
									title="Delete"
								>
									🗑️
								</button>
							</div>
						</div>
						<h3
							className={`font-bold text-sm mb-2 ${
								skill.isActive ? "text-white" : "text-gray-400"
							}`}
						>
							{skill.name}
						</h3>
						{skill.description && (
							<p
								className={`text-xs mb-2 ${
									skill.isActive
										? "text-gray-300"
										: "text-gray-500"
								}`}
							>
								{skill.description}
							</p>
						)}
						<div className="flex justify-between items-center text-xs">
							<span className="text-gray-500">
								#{skill.displayOrder}
							</span>
							<span
								className={`px-2 py-1 rounded ${
									skill.isActive
										? "bg-green-500/20 text-green-400"
										: "bg-gray-500/20 text-gray-400"
								}`}
							>
								{skill.isActive ? "Active" : "Inactive"}
							</span>
						</div>
					</div>
				))}
			</div>

			{skills.length === 0 && (
				<div className="text-center py-12">
					<p className="text-gray-400 text-lg">No skills found</p>
					<button
						onClick={() => setShowForm(true)}
						className="mt-4 bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors"
					>
						Add First Skill
					</button>
				</div>
			)}
		</div>
	);
};

export default SkillManagement;
