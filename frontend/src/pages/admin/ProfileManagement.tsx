import React, { useState, useEffect } from "react";
import { profileAPI } from "../../services/api";
import Portal from "../../components/Portal";

interface ProfileData {
	_id: string;
	name: string;
	title: string;
	tagline: string;
	missionStatement: string;
	profilePicture: {
		url: string;
		publicId: string | null;
	};
	organizationLogos: {
		eventLogo: {
			url: string;
			publicId: string | null;
		};
		schoolLogo: {
			url: string;
			publicId: string | null;
		};
	};
	stats: {
		majorEvents: number;
		fashionShows: number;
		skillsTaught: number;
		yearsExperience: number;
	};
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

interface ProfileFormData {
	name: string;
	title: string;
	tagline: string;
	missionStatement: string;
	majorEvents: number;
	fashionShows: number;
	skillsTaught: number;
	yearsExperience: number;
	profilePicture: File | null;
}

interface LogoFormData {
	eventLogo: File | null;
	schoolLogo: File | null;
}

const ProfileManagement: React.FC = () => {
	const [profile, setProfile] = useState<ProfileData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [showProfileForm, setShowProfileForm] = useState(false);
	const [showLogoForm, setShowLogoForm] = useState(false);
	const [saving, setSaving] = useState(false);

	const [profileFormData, setProfileFormData] = useState<ProfileFormData>({
		name: "",
		title: "",
		tagline: "",
		missionStatement: "",
		majorEvents: 0,
		fashionShows: 0,
		skillsTaught: 0,
		yearsExperience: 0,
		profilePicture: null,
	});

	const [logoFormData, setLogoFormData] = useState<LogoFormData>({
		eventLogo: null,
		schoolLogo: null,
	});

	useEffect(() => {
		fetchProfile();
	}, []);

	// Cleanup function for image preview URLs
	useEffect(() => {
		return () => {
			if (profileFormData.profilePicture) {
				URL.revokeObjectURL(
					URL.createObjectURL(profileFormData.profilePicture)
				);
			}
			if (logoFormData.eventLogo) {
				URL.revokeObjectURL(
					URL.createObjectURL(logoFormData.eventLogo)
				);
			}
			if (logoFormData.schoolLogo) {
				URL.revokeObjectURL(
					URL.createObjectURL(logoFormData.schoolLogo)
				);
			}
		};
	}, [
		profileFormData.profilePicture,
		logoFormData.eventLogo,
		logoFormData.schoolLogo,
	]);

	const fetchProfile = async () => {
		try {
			setLoading(true);
			const data = await profileAPI.getProfile();
			setProfile(data);
			setProfileFormData({
				name: data.name,
				title: data.title,
				tagline: data.tagline,
				missionStatement: data.missionStatement,
				majorEvents: data.stats.majorEvents,
				fashionShows: data.stats.fashionShows,
				skillsTaught: data.stats.skillsTaught,
				yearsExperience: data.stats.yearsExperience,
				profilePicture: null,
			});
		} catch (error: any) {
			setError(error.response?.data?.error || "Error fetching profile");
		} finally {
			setLoading(false);
		}
	};

	const handleProfileSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate file size
		if (profileFormData.profilePicture) {
			const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
			if (profileFormData.profilePicture.size > maxSizeInBytes) {
				setError(
					`Profile picture size must be less than 5MB. Your image is ${(
						profileFormData.profilePicture.size /
						(1024 * 1024)
					).toFixed(2)}MB.`
				);
				return;
			}
		}

		try {
			setSaving(true);
			const submitData = new FormData();
			submitData.append("name", profileFormData.name);
			submitData.append("title", profileFormData.title);
			submitData.append("tagline", profileFormData.tagline);
			submitData.append(
				"missionStatement",
				profileFormData.missionStatement
			);
			submitData.append(
				"majorEvents",
				profileFormData.majorEvents.toString()
			);
			submitData.append(
				"fashionShows",
				profileFormData.fashionShows.toString()
			);
			submitData.append(
				"skillsTaught",
				profileFormData.skillsTaught.toString()
			);
			submitData.append(
				"yearsExperience",
				profileFormData.yearsExperience.toString()
			);

			if (profileFormData.profilePicture) {
				submitData.append(
					"profilePicture",
					profileFormData.profilePicture
				);
			}

			await profileAPI.updateProfile(submitData);
			await fetchProfile();
			setShowProfileForm(false);
			setError("");
		} catch (error: any) {
			setError(error.response?.data?.error || "Error updating profile");
		} finally {
			setSaving(false);
		}
	};

	const handleLogoSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!logoFormData.eventLogo && !logoFormData.schoolLogo) {
			setError("Please select at least one logo to update.");
			return;
		}

		// Validate file sizes
		const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
		if (
			logoFormData.eventLogo &&
			logoFormData.eventLogo.size > maxSizeInBytes
		) {
			setError(`Event logo size must be less than 5MB.`);
			return;
		}
		if (
			logoFormData.schoolLogo &&
			logoFormData.schoolLogo.size > maxSizeInBytes
		) {
			setError(`School logo size must be less than 5MB.`);
			return;
		}

		try {
			setSaving(true);
			const submitData = new FormData();

			if (logoFormData.eventLogo) {
				submitData.append("eventLogo", logoFormData.eventLogo);
			}
			if (logoFormData.schoolLogo) {
				submitData.append("schoolLogo", logoFormData.schoolLogo);
			}

			await profileAPI.updateOrganizationLogos(submitData);
			await fetchProfile();
			setShowLogoForm(false);
			setLogoFormData({ eventLogo: null, schoolLogo: null });
			setError("");
		} catch (error: any) {
			setError(error.response?.data?.error || "Error updating logos");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="text-center py-8">
				<p className="text-gray-400 text-lg mb-4">
					No profile data found
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
				<h2 className="text-xl sm:text-2xl font-bold text-white">
					Profile Management
				</h2>
				<div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
					<button
						onClick={() => setShowProfileForm(true)}
						className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors text-sm sm:text-base"
					>
						Edit Profile
					</button>
					<button
						onClick={() => setShowLogoForm(true)}
						className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition-colors text-sm sm:text-base"
					>
						Update Logos
					</button>
				</div>
			</div>

			{error && (
				<div className="bg-red-500/20 border border-red-500 text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base">
					{error}
				</div>
			)}

			{/* Current Profile Display */}
			<div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Profile Info */}
					<div className="space-y-4">
						<h3 className="text-lg font-bold text-yellow-400 mb-4">
							Profile Information
						</h3>
						<div className="flex items-center gap-4 mb-4">
							<img
								src={profile.profilePicture.url}
								alt="Profile"
								className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400"
							/>
							<div>
								<h4 className="text-white font-semibold text-lg">
									{profile.name}
								</h4>
								<p className="text-gray-300">{profile.title}</p>
							</div>
						</div>
						<div className="space-y-2">
							<div>
								<label className="text-gray-400 text-sm">
									Tagline:
								</label>
								<p className="text-white">{profile.tagline}</p>
							</div>
							<div>
								<label className="text-gray-400 text-sm">
									Mission:
								</label>
								<p className="text-white text-sm leading-relaxed">
									{profile.missionStatement}
								</p>
							</div>
						</div>
					</div>

					{/* Stats & Logos */}
					<div className="space-y-4">
						<h3 className="text-lg font-bold text-yellow-400 mb-4">
							Statistics & Logos
						</h3>
						<div className="grid grid-cols-2 gap-4 mb-4">
							<div className="text-center p-3 bg-gray-700 rounded-lg">
								<div className="text-2xl font-bold text-yellow-400">
									{profile.stats.majorEvents}+
								</div>
								<p className="text-gray-300 text-sm">
									Major Events
								</p>
							</div>
							<div className="text-center p-3 bg-gray-700 rounded-lg">
								<div className="text-2xl font-bold text-yellow-400">
									{profile.stats.fashionShows}
								</div>
								<p className="text-gray-300 text-sm">
									Fashion Shows
								</p>
							</div>
							<div className="text-center p-3 bg-gray-700 rounded-lg">
								<div className="text-2xl font-bold text-yellow-400">
									{profile.stats.skillsTaught}+
								</div>
								<p className="text-gray-300 text-sm">
									Skills Taught
								</p>
							</div>
							<div className="text-center p-3 bg-gray-700 rounded-lg">
								<div className="text-2xl font-bold text-yellow-400">
									{profile.stats.yearsExperience}+
								</div>
								<p className="text-gray-300 text-sm">
									Years Experience
								</p>
							</div>
						</div>
						<div className="flex gap-4">
							<div className="flex-1 text-center">
								<img
									src={
										profile.organizationLogos.eventLogo.url
									}
									alt="Event Logo"
									className="w-16 h-16 object-cover rounded-lg mx-auto mb-2"
								/>
								<p className="text-gray-300 text-xs">
									Event Logo
								</p>
							</div>
							<div className="flex-1 text-center">
								<img
									src={
										profile.organizationLogos.schoolLogo.url
									}
									alt="School Logo"
									className="w-16 h-16 object-cover rounded-lg mx-auto mb-2"
								/>
								<p className="text-gray-300 text-xs">
									School Logo
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Profile Edit Modal */}
			{showProfileForm && (
				<Portal>
					<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-2 sm:p-4 overflow-y-auto">
						<div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-4 sm:my-8">
							<h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
								Edit Profile
							</h3>
							<form
								onSubmit={handleProfileSubmit}
								className="space-y-3 sm:space-y-4"
							>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
									<div>
										<label className="block text-gray-300 mb-2 text-sm sm:text-base">
											Name
										</label>
										<input
											type="text"
											value={profileFormData.name}
											onChange={(e) =>
												setProfileFormData({
													...profileFormData,
													name: e.target.value,
												})
											}
											className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none text-sm sm:text-base"
											required
										/>
									</div>
									<div>
										<label className="block text-gray-300 mb-2 text-sm sm:text-base">
											Title
										</label>
										<input
											type="text"
											value={profileFormData.title}
											onChange={(e) =>
												setProfileFormData({
													...profileFormData,
													title: e.target.value,
												})
											}
											className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none text-sm sm:text-base"
											required
										/>
									</div>
								</div>
								<div>
									<label className="block text-gray-300 mb-2 text-sm sm:text-base">
										Tagline
									</label>
									<input
										type="text"
										value={profileFormData.tagline}
										onChange={(e) =>
											setProfileFormData({
												...profileFormData,
												tagline: e.target.value,
											})
										}
										className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none text-sm sm:text-base"
										required
									/>
								</div>
								<div>
									<label className="block text-gray-300 mb-2 text-sm sm:text-base">
										Mission Statement
									</label>
									<textarea
										value={profileFormData.missionStatement}
										onChange={(e) =>
											setProfileFormData({
												...profileFormData,
												missionStatement:
													e.target.value,
											})
										}
										className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none text-sm sm:text-base resize-none"
										rows={4}
										required
									/>
								</div>

								{/* Statistics */}
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
									<div>
										<label className="block text-gray-300 mb-2 text-sm">
											Major Events
										</label>
										<input
											type="number"
											value={profileFormData.majorEvents}
											onChange={(e) =>
												setProfileFormData({
													...profileFormData,
													majorEvents:
														parseInt(
															e.target.value
														) || 0,
												})
											}
											className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none text-sm"
											min="0"
										/>
									</div>
									<div>
										<label className="block text-gray-300 mb-2 text-sm">
											Fashion Shows
										</label>
										<input
											type="number"
											value={profileFormData.fashionShows}
											onChange={(e) =>
												setProfileFormData({
													...profileFormData,
													fashionShows:
														parseInt(
															e.target.value
														) || 0,
												})
											}
											className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none text-sm"
											min="0"
										/>
									</div>
									<div>
										<label className="block text-gray-300 mb-2 text-sm">
											Skills Taught
										</label>
										<input
											type="number"
											value={profileFormData.skillsTaught}
											onChange={(e) =>
												setProfileFormData({
													...profileFormData,
													skillsTaught:
														parseInt(
															e.target.value
														) || 0,
												})
											}
											className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none text-sm"
											min="0"
										/>
									</div>
									<div>
										<label className="block text-gray-300 mb-2 text-sm">
											Years Experience
										</label>
										<input
											type="number"
											value={
												profileFormData.yearsExperience
											}
											onChange={(e) =>
												setProfileFormData({
													...profileFormData,
													yearsExperience:
														parseInt(
															e.target.value
														) || 0,
												})
											}
											className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none text-sm"
											min="0"
										/>
									</div>
								</div>

								{/* Profile Picture Upload */}
								<div>
									<label className="block text-gray-300 mb-2 text-sm sm:text-base">
										Profile Picture (Optional)
									</label>
									<input
										type="file"
										accept="image/*"
										onChange={(e) => {
											const file =
												e.target.files?.[0] || null;
											if (file) {
												const maxSizeInBytes =
													5 * 1024 * 1024; // 5MB
												if (
													file.size > maxSizeInBytes
												) {
													setError(
														`Profile picture size must be less than 5MB. Your image is ${(
															file.size /
															(1024 * 1024)
														).toFixed(2)}MB.`
													);
													e.target.value = "";
													return;
												}
												setError("");
											}
											setProfileFormData({
												...profileFormData,
												profilePicture: file,
											});
										}}
										className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none text-sm sm:text-base"
									/>
									<p className="text-xs text-gray-500 mt-1">
										Leave empty to keep current profile
										picture. Max size: 5MB
									</p>
								</div>

								{/* Image Preview */}
								{profileFormData.profilePicture && (
									<div>
										<label className="block text-gray-300 mb-2 text-sm sm:text-base">
											Preview
										</label>
										<img
											src={URL.createObjectURL(
												profileFormData.profilePicture
											)}
											alt="Profile preview"
											className="w-20 h-20 object-contain bg-gray-700 rounded-full border-2 border-yellow-400"
										/>
									</div>
								)}

								<div className="flex flex-col sm:flex-row gap-3 pt-2">
									<button
										type="submit"
										disabled={saving}
										className="flex-1 bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-400 transition-colors text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{saving
											? "Saving..."
											: "Update Profile"}
									</button>
									<button
										type="button"
										onClick={() =>
											setShowProfileForm(false)
										}
										className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-500 transition-colors text-sm sm:text-base font-medium"
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				</Portal>
			)}

			{/* Logo Update Modal */}
			{showLogoForm && (
				<Portal>
					<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-2 sm:p-4 overflow-y-auto">
						<div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 w-full max-w-xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-4 sm:my-8">
							<h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
								Update Organization Logos
							</h3>
							<form
								onSubmit={handleLogoSubmit}
								className="space-y-3 sm:space-y-4"
							>
								<div>
									<label className="block text-gray-300 mb-2 text-sm sm:text-base">
										Event & Entertainment Logo (Optional)
									</label>
									<input
										type="file"
										accept="image/*"
										onChange={(e) => {
											const file =
												e.target.files?.[0] || null;
											if (file) {
												const maxSizeInBytes =
													5 * 1024 * 1024; // 5MB
												if (
													file.size > maxSizeInBytes
												) {
													setError(
														`Event logo size must be less than 5MB.`
													);
													e.target.value = "";
													return;
												}
												setError("");
											}
											setLogoFormData({
												...logoFormData,
												eventLogo: file,
											});
										}}
										className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none text-sm sm:text-base"
									/>
								</div>

								{logoFormData.eventLogo && (
									<div>
										<label className="block text-gray-300 mb-2 text-sm">
											Event Logo Preview
										</label>
										<img
											src={URL.createObjectURL(
												logoFormData.eventLogo
											)}
											alt="Event logo preview"
											className="w-16 h-16 object-cover rounded-lg"
										/>
									</div>
								)}

								<div>
									<label className="block text-gray-300 mb-2 text-sm sm:text-base">
										School Logo (Optional)
									</label>
									<input
										type="file"
										accept="image/*"
										onChange={(e) => {
											const file =
												e.target.files?.[0] || null;
											if (file) {
												const maxSizeInBytes =
													5 * 1024 * 1024; // 5MB
												if (
													file.size > maxSizeInBytes
												) {
													setError(
														`School logo size must be less than 5MB.`
													);
													e.target.value = "";
													return;
												}
												setError("");
											}
											setLogoFormData({
												...logoFormData,
												schoolLogo: file,
											});
										}}
										className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none text-sm sm:text-base"
									/>
								</div>

								{logoFormData.schoolLogo && (
									<div>
										<label className="block text-gray-300 mb-2 text-sm">
											School Logo Preview
										</label>
										<img
											src={URL.createObjectURL(
												logoFormData.schoolLogo
											)}
											alt="School logo preview"
											className="w-16 h-16 object-cover rounded-lg"
										/>
									</div>
								)}

								<p className="text-xs text-gray-500">
									Select at least one logo to update. Max
									size: 5MB each
								</p>

								<div className="flex flex-col sm:flex-row gap-3 pt-2">
									<button
										type="submit"
										disabled={saving}
										className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-400 transition-colors text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{saving
											? "Updating..."
											: "Update Logos"}
									</button>
									<button
										type="button"
										onClick={() => {
											setShowLogoForm(false);
											setLogoFormData({
												eventLogo: null,
												schoolLogo: null,
											});
										}}
										className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-500 transition-colors text-sm sm:text-base font-medium"
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				</Portal>
			)}
		</div>
	);
};

export default ProfileManagement;
