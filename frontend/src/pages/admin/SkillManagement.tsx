import React, { useState, useEffect } from "react";
import { skillsAPI } from "../../services/api";
import Portal from "../../components/Portal";

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
			<div className="flex items-center justify-center py-16">
				<div className="relative bg-gradient-to-r from-slate-900/40 via-gray-900/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
					<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
					<div className="relative flex flex-col items-center gap-4">
						<div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
							<svg
								className="w-8 h-8 text-purple-300 animate-spin"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
						</div>
						<div className="text-center">
							<h3 className="text-purple-200 font-medium text-lg mb-1">
								Loading Skills
							</h3>
							<p className="text-gray-400 text-sm">
								Please wait while we fetch skill data...
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="relative bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
				<div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 rounded-2xl"></div>
				<div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
							<svg
								className="w-6 h-6 text-purple-300"
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
							<h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
								Skill Management
							</h2>
							<p className="text-gray-400 text-sm">
								Manage student skills and competencies
							</p>
						</div>
					</div>
					<button
						onClick={() => setShowForm(true)}
						className="flex items-center gap-2 w-full sm:w-auto bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 px-4 py-2 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200 backdrop-blur-sm border border-purple-500/30 text-sm sm:text-base"
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
								d="M12 4v16m8-8H4"
							/>
						</svg>
						Add New Skill
					</button>
				</div>
			</div>

			{error && (
				<div className="relative bg-gradient-to-r from-red-900/20 via-red-800/20 to-red-900/20 backdrop-blur-sm rounded-xl p-4 border border-red-500/30">
					<div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-red-400/5 to-red-500/5 rounded-xl"></div>
					<div className="relative flex items-center gap-3">
						<div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-red-500/30">
							<svg
								className="w-5 h-5 text-red-300"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z"
								/>
							</svg>
						</div>
						<div>
							<h3 className="text-red-300 font-medium">Error</h3>
							<p className="text-red-200 text-sm">{error}</p>
						</div>
					</div>
				</div>
			)}

			{/* Form Modal */}
			{showForm && (
				<Portal>
					<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
						<div className="relative bg-gradient-to-r from-slate-900/90 via-gray-900/90 to-slate-900/90 backdrop-blur-sm rounded-2xl w-full max-w-md my-8 border border-white/10">
							<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
							<div className="relative p-6">
								{/* Modal Header */}
								<div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10">
											<svg
												className="w-5 h-5 text-purple-300"
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
										<h3 className="text-lg sm:text-xl font-bold text-white">
											{editingSkill
												? "Edit Skill"
												: "Add New Skill"}
										</h3>
									</div>
									<button
										onClick={resetForm}
										className="w-8 h-8 bg-gradient-to-br from-gray-600/20 to-gray-700/20 text-gray-400 rounded-lg hover:from-gray-600/30 hover:to-gray-700/30 transition-all duration-200 backdrop-blur-sm border border-gray-600/30 flex items-center justify-center"
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
									</button>
								</div>

								<form
									onSubmit={handleSubmit}
									className="space-y-6"
								>
									<div>
										<label className="text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
											<svg
												className="w-4 h-4 text-blue-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
												/>
											</svg>
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
											className="w-full px-4 py-3 bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
											placeholder="Enter skill name"
											required
										/>
									</div>
									<div>
										<label className="text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
											<svg
												className="w-4 h-4 text-purple-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-4-8V3m0 3L8 9l4 4 4-4V6z"
												/>
											</svg>
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
											className="w-full px-4 py-3 bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
											placeholder="e.g., 🎨"
											required
										/>
										<div className="mt-3">
											<p className="text-xs text-gray-400 mb-2">
												Quick select:
											</p>
											<div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-32 overflow-y-auto">
												{commonIcons.map(
													(icon, index) => (
														<button
															key={index}
															type="button"
															onClick={() =>
																setFormData({
																	...formData,
																	icon,
																})
															}
															className="text-lg p-2 bg-gradient-to-br from-slate-700/50 to-gray-700/50 hover:from-purple-500/20 hover:to-pink-500/20 rounded-lg border border-white/10 hover:border-purple-500/30 transition-all duration-200 backdrop-blur-sm"
														>
															{icon}
														</button>
													)
												)}
											</div>
										</div>
									</div>
									<div>
										<label className="text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
											<svg
												className="w-4 h-4 text-green-400"
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
											className="w-full px-4 py-3 bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 resize-none"
											rows={3}
											placeholder="Brief description of the skill..."
										/>
									</div>
									<div>
										<label className="text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
											<svg
												className="w-4 h-4 text-orange-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
												/>
											</svg>
											Display Order
										</label>
										<input
											type="number"
											value={formData.displayOrder}
											onChange={(e) =>
												setFormData({
													...formData,
													displayOrder:
														parseInt(
															e.target.value
														) || 0,
												})
											}
											className="w-full px-4 py-3 bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
											placeholder="0"
										/>
									</div>
									<div className="flex gap-3 pt-4">
										<button
											type="submit"
											className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 py-3 rounded-xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200 backdrop-blur-sm border border-purple-500/30 font-medium"
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
													d="M5 13l4 4L19 7"
												/>
											</svg>
											{editingSkill ? "Update" : "Create"}
										</button>
										<button
											type="button"
											onClick={resetForm}
											className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600/20 to-gray-700/20 text-gray-300 py-3 rounded-xl hover:from-gray-600/30 hover:to-gray-700/30 transition-all duration-200 backdrop-blur-sm border border-gray-600/30 font-medium"
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
											Cancel
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</Portal>
			)}

			{/* Skills Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
				{skills.map((skill) => (
					<div
						key={skill._id}
						className={`group relative transition-all duration-300 hover:scale-[1.05] ${
							skill.isActive
								? "bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-purple-900/20"
								: "bg-gradient-to-r from-slate-900/20 via-gray-900/20 to-slate-900/20"
						} backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/5`}
					>
						<div
							className={`absolute inset-0 rounded-2xl ${
								skill.isActive
									? "bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5"
									: "bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5"
							}`}
						></div>

						<div className="relative">
							{/* Header */}
							<div className="flex justify-between items-start mb-3">
								<div
									className={`w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10 ${
										skill.isActive
											? "bg-gradient-to-br from-purple-500/20 to-pink-500/20"
											: "bg-gradient-to-br from-slate-500/20 to-gray-500/20"
									}`}
								>
									<span className="text-2xl">
										{skill.icon}
									</span>
								</div>

								{/* Action Buttons */}
								<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
									<button
										onClick={() => handleEdit(skill)}
										className="w-6 h-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 text-blue-300 rounded-lg hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-200 backdrop-blur-sm border border-blue-500/30 flex items-center justify-center text-xs"
										title="Edit Skill"
									>
										<svg
											className="w-3 h-3"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
											/>
										</svg>
									</button>
									<button
										onClick={() =>
											handleToggleStatus(skill._id)
										}
										className={`w-6 h-6 rounded-lg transition-all duration-200 backdrop-blur-sm border flex items-center justify-center text-xs ${
											skill.isActive
												? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30 hover:from-amber-500/30 hover:to-orange-500/30"
												: "bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30 hover:from-green-500/30 hover:to-emerald-500/30"
										}`}
										title={
											skill.isActive
												? "Deactivate"
												: "Activate"
										}
									>
										<svg
											className="w-3 h-3"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											{skill.isActive ? (
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
												/>
											) : (
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											)}
										</svg>
									</button>
									<button
										onClick={() => handleDelete(skill._id)}
										className="w-6 h-6 bg-gradient-to-br from-red-500/20 to-red-600/20 text-red-300 rounded-lg hover:from-red-500/30 hover:to-red-600/30 transition-all duration-200 backdrop-blur-sm border border-red-500/30 flex items-center justify-center text-xs"
										title="Delete Skill"
									>
										<svg
											className="w-3 h-3"
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
									</button>
								</div>
							</div>

							{/* Content */}
							<h3
								className={`font-bold text-sm mb-2 ${
									skill.isActive
										? "text-purple-100"
										: "text-gray-400"
								}`}
							>
								{skill.name}
							</h3>

							{skill.description && (
								<p
									className={`text-xs mb-3 line-clamp-2 ${
										skill.isActive
											? "text-gray-300"
											: "text-gray-500"
									}`}
								>
									{skill.description}
								</p>
							)}

							{/* Footer */}
							<div className="flex justify-between items-center pt-3 border-t border-white/5">
								<div className="flex items-center gap-1 text-xs text-gray-500">
									<svg
										className="w-3 h-3"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
										/>
									</svg>
									#{skill.displayOrder}
								</div>
								<span
									className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
										skill.isActive
											? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30"
											: "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/30"
									}`}
								>
									{skill.isActive ? "Active" : "Inactive"}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>

			{skills.length === 0 && (
				<div className="flex items-center justify-center py-16">
					<div className="relative bg-gradient-to-r from-slate-900/40 via-gray-900/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center max-w-md">
						<div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-2xl"></div>
						<div className="relative">
							<div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/10">
								<svg
									className="w-10 h-10 text-purple-300"
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
							<h3 className="text-xl font-bold text-gray-200 mb-2">
								No Skills Found
							</h3>
							<p className="text-gray-400 mb-6 leading-relaxed">
								Get started by adding your first student skill
								or competency.
							</p>
							<button
								onClick={() => setShowForm(true)}
								className="flex items-center gap-2 mx-auto bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 px-6 py-3 rounded-xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200 backdrop-blur-sm border border-purple-500/30 font-medium"
							>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4v16m8-8H4"
									/>
								</svg>
								Add First Skill
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default SkillManagement;
