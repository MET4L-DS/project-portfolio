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
			<div className="min-h-[400px] flex items-center justify-center">
				<div className="bg-gradient-to-br from-gray-800/40 via-gray-700/30 to-gray-600/20 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center shadow-2xl">
					<div className="flex items-center justify-center mb-6">
						<div className="relative">
							<div className="w-16 h-16 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
							<div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-yellow-400/50 rounded-full animate-spin animate-reverse"></div>
						</div>
					</div>
					<div className="flex items-center justify-center gap-3 mb-4">
						<svg
							className="w-8 h-8 text-purple-400"
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
						<h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent">
							Loading Profile
						</h3>
					</div>
					<p className="text-gray-300/80">
						Fetching profile information...
					</p>
				</div>
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="min-h-[400px] flex items-center justify-center">
				<div className="bg-gradient-to-br from-red-800/40 via-red-700/30 to-red-600/20 backdrop-blur-xl border border-red-400/20 rounded-2xl p-12 text-center shadow-2xl">
					<div className="flex items-center justify-center gap-3 mb-4">
						<svg
							className="w-8 h-8 text-red-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.348 15.5c-.77.833.192 2.5 1.732 2.5z"
							/>
						</svg>
						<h3 className="text-xl font-semibold text-red-400">
							No Profile Found
						</h3>
					</div>
					<p className="text-gray-300/80">
						No profile data available. Please contact administrator.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Header */}
			<div className="bg-gradient-to-br from-gray-800/60 via-gray-700/40 to-gray-600/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
					<div className="flex items-center gap-4">
						<div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-400/20">
							<svg
								className="w-8 h-8 text-purple-400"
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
							<h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-yellow-400 to-purple-400 bg-clip-text text-transparent">
								Profile Management
							</h2>
							<p className="text-gray-300/70 text-sm">
								Manage profile information and organization
								logos
							</p>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
						<button
							onClick={() => setShowProfileForm(true)}
							className="group relative overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-3 rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 font-semibold text-sm sm:text-base"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<div className="relative flex items-center gap-2">
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
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
									/>
								</svg>
								Edit Profile
							</div>
						</button>
						<button
							onClick={() => setShowLogoForm(true)}
							className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-400 hover:to-purple-400 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 font-semibold text-sm sm:text-base"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<div className="relative flex items-center gap-2">
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
								Update Logos
							</div>
						</button>
					</div>
				</div>
			</div>

			{error && (
				<div className="bg-gradient-to-br from-red-500/20 via-red-400/10 to-red-300/5 backdrop-blur-xl border border-red-400/30 rounded-xl p-4 shadow-lg">
					<div className="flex items-center gap-3">
						<svg
							className="w-5 h-5 text-red-400 flex-shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<p className="text-red-400 font-medium">{error}</p>
					</div>
				</div>
			)}

			{/* Current Profile Display */}
			<div className="bg-gradient-to-br from-gray-800/60 via-gray-700/40 to-gray-600/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Profile Info */}
					<div className="space-y-6">
						<div className="flex items-center gap-3 mb-6">
							<div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-400/20">
								<svg
									className="w-5 h-5 text-yellow-400"
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
							</div>
							<h3 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
								Profile Information
							</h3>
						</div>

						<div className="bg-gradient-to-br from-gray-700/40 to-gray-600/30 backdrop-blur-sm border border-white/5 rounded-xl p-5">
							<div className="flex items-center gap-4 mb-4">
								<div className="relative">
									<img
										src={profile.profilePicture.url}
										alt="Profile"
										className="w-20 h-20 rounded-full object-cover border-3 border-yellow-400/50 shadow-lg"
									/>
									<div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900"></div>
								</div>
								<div>
									<h4 className="text-white font-semibold text-lg mb-1">
										{profile.name}
									</h4>
									<p className="text-gray-300/80 font-medium">
										{profile.title}
									</p>
								</div>
							</div>

							<div className="space-y-4">
								<div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-lg p-4">
									<label className="text-gray-400 text-sm font-medium flex items-center gap-2 mb-2">
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
												d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1.586z"
											/>
										</svg>
										Tagline:
									</label>
									<p className="text-white/90 font-medium">
										{profile.tagline}
									</p>
								</div>
								<div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-lg p-4">
									<label className="text-gray-400 text-sm font-medium flex items-center gap-2 mb-2">
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
										Mission:
									</label>
									<p className="text-white/90 text-sm leading-relaxed">
										{profile.missionStatement}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Stats & Logos */}
					<div className="space-y-6">
						<div className="flex items-center gap-3 mb-6">
							<div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/20">
								<svg
									className="w-5 h-5 text-blue-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
								Statistics & Logos
							</h3>
						</div>

						<div className="bg-gradient-to-br from-gray-700/40 to-gray-600/30 backdrop-blur-sm border border-white/5 rounded-xl p-5">
							<div className="grid grid-cols-2 gap-4 mb-6">
								<div className="text-center p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-xl">
									<div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
										{profile.stats.majorEvents}+
									</div>
									<p className="text-gray-300/80 text-sm font-medium mt-1">
										Major Events
									</p>
								</div>
								<div className="text-center p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-xl">
									<div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
										{profile.stats.fashionShows}
									</div>
									<p className="text-gray-300/80 text-sm font-medium mt-1">
										Fashion Shows
									</p>
								</div>
								<div className="text-center p-4 bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-400/30 rounded-xl">
									<div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
										{profile.stats.skillsTaught}+
									</div>
									<p className="text-gray-300/80 text-sm font-medium mt-1">
										Skills Taught
									</p>
								</div>
								<div className="text-center p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl">
									<div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
										{profile.stats.yearsExperience}+
									</div>
									<p className="text-gray-300/80 text-sm font-medium mt-1">
										Years Experience
									</p>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="text-center p-4 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-400/30 rounded-xl">
									<div className="relative mb-3 mx-auto w-20 h-20">
										<img
											src={
												profile.organizationLogos
													.eventLogo.url
											}
											alt="Event Logo"
											className="w-20 h-20 object-cover rounded-xl shadow-lg border-2 border-indigo-400/30"
										/>
										<div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
											<svg
												className="w-3 h-3 text-white"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 3l14 9-14 9V3z"
												/>
											</svg>
										</div>
									</div>
									<p className="text-gray-300/80 text-sm font-medium">
										Event Logo
									</p>
								</div>
								<div className="text-center p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 rounded-xl">
									<div className="relative mb-3 mx-auto w-20 h-20">
										<img
											src={
												profile.organizationLogos
													.schoolLogo.url
											}
											alt="School Logo"
											className="w-20 h-20 object-cover rounded-xl shadow-lg border-2 border-emerald-400/30"
										/>
										<div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
											<svg
												className="w-3 h-3 text-white"
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
										</div>
									</div>
									<p className="text-gray-300/80 text-sm font-medium">
										School Logo
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Profile Edit Modal */}
			{showProfileForm && (
				<Portal>
					<div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-start justify-center z-50 p-2 sm:p-4 overflow-y-auto">
						<div className="bg-gradient-to-br from-gray-800/90 via-gray-700/80 to-gray-600/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-4 sm:my-8 shadow-2xl">
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-400/20">
										<svg
											className="w-6 h-6 text-yellow-400"
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
									</div>
									<h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
										Edit Profile
									</h3>
								</div>
								<button
									type="button"
									onClick={() => setShowProfileForm(false)}
									className="p-2 hover:bg-white/10 rounded-lg transition-colors"
								>
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
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>

							<form
								onSubmit={handleProfileSubmit}
								className="space-y-6"
							>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="bg-gradient-to-br from-gray-700/40 to-gray-600/30 backdrop-blur-sm border border-white/5 rounded-xl p-4">
										<label className="text-gray-300 mb-3 text-sm font-medium flex items-center gap-2">
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
													d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
												/>
											</svg>
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
											className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-600/50 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none transition-all duration-200"
											required
										/>
									</div>
									<div className="bg-gradient-to-br from-gray-700/40 to-gray-600/30 backdrop-blur-sm border border-white/5 rounded-xl p-4">
										<label className="text-gray-300 mb-3 text-sm font-medium flex items-center gap-2">
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
													d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
												/>
											</svg>
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
											className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-600/50 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-200"
											required
										/>
									</div>
								</div>

								<div className="bg-gradient-to-br from-gray-700/40 to-gray-600/30 backdrop-blur-sm border border-white/5 rounded-xl p-4">
									<label className="text-gray-300 mb-3 text-sm font-medium flex items-center gap-2">
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
												d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1.586z"
											/>
										</svg>
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
										className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-600/50 focus:border-green-400/50 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-200"
										required
									/>
								</div>

								<div className="bg-gradient-to-br from-gray-700/40 to-gray-600/30 backdrop-blur-sm border border-white/5 rounded-xl p-4">
									<label className="text-gray-300 mb-3 text-sm font-medium flex items-center gap-2">
										<svg
											className="w-4 h-4 text-indigo-400"
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
										className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-600/50 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20 focus:outline-none transition-all duration-200 resize-none"
										rows={4}
										required
									/>
								</div>

								{/* Statistics */}
								<div className="bg-gradient-to-br from-gray-700/40 to-gray-600/30 backdrop-blur-sm border border-white/5 rounded-xl p-4">
									<div className="flex items-center gap-3 mb-4">
										<div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-400/20">
											<svg
												className="w-5 h-5 text-cyan-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
												/>
											</svg>
										</div>
										<h4 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
											Statistics
										</h4>
									</div>

									<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
										<div>
											<label className="text-gray-300 mb-2 text-sm font-medium flex items-center gap-2">
												<svg
													className="w-3 h-3 text-yellow-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M5 3l14 9-14 9V3z"
													/>
												</svg>
												Major Events
											</label>
											<input
												type="number"
												value={
													profileFormData.majorEvents
												}
												onChange={(e) =>
													setProfileFormData({
														...profileFormData,
														majorEvents:
															parseInt(
																e.target.value
															) || 0,
													})
												}
												className="w-full bg-gray-800/50 text-white px-3 py-2 rounded-lg border border-gray-600/50 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none transition-all duration-200 text-sm"
												min="0"
											/>
										</div>
										<div>
											<label className="text-gray-300 mb-2 text-sm font-medium flex items-center gap-2">
												<svg
													className="w-3 h-3 text-blue-400"
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
												Fashion Shows
											</label>
											<input
												type="number"
												value={
													profileFormData.fashionShows
												}
												onChange={(e) =>
													setProfileFormData({
														...profileFormData,
														fashionShows:
															parseInt(
																e.target.value
															) || 0,
													})
												}
												className="w-full bg-gray-800/50 text-white px-3 py-2 rounded-lg border border-gray-600/50 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-200 text-sm"
												min="0"
											/>
										</div>
										<div>
											<label className="text-gray-300 mb-2 text-sm font-medium flex items-center gap-2">
												<svg
													className="w-3 h-3 text-green-400"
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
												Skills Taught
											</label>
											<input
												type="number"
												value={
													profileFormData.skillsTaught
												}
												onChange={(e) =>
													setProfileFormData({
														...profileFormData,
														skillsTaught:
															parseInt(
																e.target.value
															) || 0,
													})
												}
												className="w-full bg-gray-800/50 text-white px-3 py-2 rounded-lg border border-gray-600/50 focus:border-green-400/50 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-200 text-sm"
												min="0"
											/>
										</div>
										<div>
											<label className="text-gray-300 mb-2 text-sm font-medium flex items-center gap-2">
												<svg
													className="w-3 h-3 text-purple-400"
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
												className="w-full bg-gray-800/50 text-white px-3 py-2 rounded-lg border border-gray-600/50 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-200 text-sm"
												min="0"
											/>
										</div>
									</div>
								</div>

								{/* Profile Picture Upload */}
								{/* Profile Picture Upload */}
								<div className="bg-gradient-to-br from-gray-700/40 to-gray-600/30 backdrop-blur-sm border border-white/5 rounded-xl p-4">
									<label className="text-gray-300 mb-3 text-sm font-medium flex items-center gap-2">
										<svg
											className="w-4 h-4 text-pink-400"
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
										className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-600/50 focus:border-pink-400/50 focus:ring-2 focus:ring-pink-400/20 focus:outline-none transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500/20 file:text-pink-400 hover:file:bg-pink-500/30"
									/>
									<p className="text-xs text-gray-400/80 mt-2 flex items-center gap-1">
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
												d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										Leave empty to keep current profile
										picture. Max size: 5MB
									</p>
								</div>

								{/* Image Preview */}
								{profileFormData.profilePicture && (
									<div className="bg-gradient-to-br from-gray-700/40 to-gray-600/30 backdrop-blur-sm border border-white/5 rounded-xl p-4">
										<label className="text-gray-300 mb-3 text-sm font-medium flex items-center gap-2">
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
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											</svg>
											Preview
										</label>
										<div className="flex justify-center">
											<img
												src={URL.createObjectURL(
													profileFormData.profilePicture
												)}
												alt="Profile preview"
												className="w-24 h-24 object-cover rounded-full border-3 border-emerald-400/50 shadow-lg"
											/>
										</div>
									</div>
								)}

								<div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
									<button
										type="submit"
										disabled={saving}
										className="group relative flex-1 overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-500 text-black py-3 px-6 rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
										<div className="relative flex items-center justify-center gap-2">
											{saving ? (
												<>
													<div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
													Saving...
												</>
											) : (
												<>
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
													Update Profile
												</>
											)}
										</div>
									</button>
									<button
										type="button"
										onClick={() =>
											setShowProfileForm(false)
										}
										className="group relative flex-1 overflow-hidden bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-6 rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-lg font-semibold"
									>
										<div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-gray-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
											Cancel
										</div>
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
					<div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-start justify-center z-50 p-2 sm:p-4 overflow-y-auto">
						<div className="bg-gradient-to-br from-gray-800/90 via-gray-700/80 to-gray-600/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-4 sm:my-8 shadow-2xl">
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/20">
										<svg
											className="w-6 h-6 text-blue-400"
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
									<h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
										Update Organization Logos
									</h3>
								</div>
								<button
									type="button"
									onClick={() => {
										setShowLogoForm(false);
										setLogoFormData({
											eventLogo: null,
											schoolLogo: null,
										});
									}}
									className="p-2 hover:bg-white/10 rounded-lg transition-colors"
								>
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
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>

							<form
								onSubmit={handleLogoSubmit}
								className="space-y-6"
							>
								<div className="bg-gradient-to-br from-gray-700/40 to-gray-600/30 backdrop-blur-sm border border-white/5 rounded-xl p-4">
									<label className="text-gray-300 mb-3 text-sm font-medium flex items-center gap-2">
										<svg
											className="w-4 h-4 text-indigo-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 3l14 9-14 9V3z"
											/>
										</svg>
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
										className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-600/50 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20 focus:outline-none transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/20 file:text-indigo-400 hover:file:bg-indigo-500/30"
									/>
								</div>

								{logoFormData.eventLogo && (
									<div className="bg-gradient-to-br from-gray-700/40 to-gray-600/30 backdrop-blur-sm border border-white/5 rounded-xl p-4">
										<label className="text-gray-300 mb-3 text-sm font-medium flex items-center gap-2">
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
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											</svg>
											Event Logo Preview
										</label>
										<div className="flex justify-center">
											<img
												src={URL.createObjectURL(
													logoFormData.eventLogo
												)}
												alt="Event logo preview"
												className="w-20 h-20 object-cover rounded-xl border-2 border-indigo-400/50 shadow-lg"
											/>
										</div>
									</div>
								)}

								<div className="bg-gradient-to-br from-gray-700/40 to-gray-600/30 backdrop-blur-sm border border-white/5 rounded-xl p-4">
									<label className="text-gray-300 mb-3 text-sm font-medium flex items-center gap-2">
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
												d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
											/>
										</svg>
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
										className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-600/50 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/20 file:text-emerald-400 hover:file:bg-emerald-500/30"
									/>
								</div>

								{logoFormData.schoolLogo && (
									<div className="bg-gradient-to-br from-gray-700/40 to-gray-600/30 backdrop-blur-sm border border-white/5 rounded-xl p-4">
										<label className="text-gray-300 mb-3 text-sm font-medium flex items-center gap-2">
											<svg
												className="w-4 h-4 text-cyan-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											</svg>
											School Logo Preview
										</label>
										<div className="flex justify-center">
											<img
												src={URL.createObjectURL(
													logoFormData.schoolLogo
												)}
												alt="School logo preview"
												className="w-20 h-20 object-cover rounded-xl border-2 border-emerald-400/50 shadow-lg"
											/>
										</div>
									</div>
								)}

								<div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-xl p-4">
									<div className="flex items-center gap-2 mb-2">
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
												d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<p className="text-blue-400 text-sm font-medium">
											Select at least one logo to update
										</p>
									</div>
									<p className="text-gray-400 text-xs">
										Max size: 5MB each. Supported formats:
										JPG, PNG, WEBP
									</p>
								</div>

								<div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
									<button
										type="submit"
										disabled={saving}
										className="group relative flex-1 overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl hover:from-blue-400 hover:to-purple-400 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
										<div className="relative flex items-center justify-center gap-2">
											{saving ? (
												<>
													<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
													Updating...
												</>
											) : (
												<>
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
															d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
														/>
													</svg>
													Update Logos
												</>
											)}
										</div>
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
										className="group relative flex-1 overflow-hidden bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-6 rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-lg font-semibold"
									>
										<div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-gray-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
											Cancel
										</div>
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
