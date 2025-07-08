import React, { useState } from "react";
import { magazineAPI } from "../../services/api";

interface Magazine {
	_id?: string;
	title: string;
	year: number;
	month: string;
	description: string;
	pdfUrl?: string;
	coverImageUrl?: string;
	isActive: boolean;
}

interface MagazineFormProps {
	magazine?: Magazine;
	onSave: () => void;
	onCancel: () => void;
}

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const MagazineForm: React.FC<MagazineFormProps> = ({
	magazine,
	onSave,
	onCancel,
}) => {
	const [formData, setFormData] = useState<Magazine>({
		title: "",
		year: new Date().getFullYear(),
		month: "January",
		description: "",
		isActive: true,
		...magazine,
	});

	const [pdfFile, setPdfFile] = useState<File | null>(null);
	const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const currentYear = new Date().getFullYear();
	const years = Array.from({ length: 10 }, (_, i) => currentYear - i + 1);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const submitFormData = new FormData();
			submitFormData.append("title", formData.title);
			submitFormData.append("year", formData.year.toString());
			submitFormData.append("month", formData.month);
			submitFormData.append("description", formData.description);
			submitFormData.append("isActive", formData.isActive.toString());

			if (pdfFile) {
				submitFormData.append("pdf", pdfFile);
			}

			if (coverImageFile) {
				submitFormData.append("coverImage", coverImageFile);
			}

			if (magazine?._id) {
				// Update existing magazine
				await magazineAPI.updateMagazine(magazine._id, submitFormData);
				setSuccess("Magazine updated successfully!");
			} else {
				// Create new magazine
				if (!pdfFile) {
					throw new Error("PDF file is required for new magazines");
				}
				await magazineAPI.createMagazine(submitFormData);
				setSuccess("Magazine created successfully!");
			}

			setTimeout(() => {
				onSave();
			}, 1500);
		} catch (err: any) {
			console.error("Error saving magazine:", err);
			setError(
				err.response?.data?.error ||
					err.message ||
					"Failed to save magazine"
			);
		} finally {
			setLoading(false);
		}
	};

	const handleFileChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		type: "pdf" | "cover"
	) => {
		const file = e.target.files?.[0];
		if (file) {
			if (type === "pdf") {
				if (file.type !== "application/pdf") {
					setError("Please select a PDF file");
					return;
				}
				if (file.size > 50 * 1024 * 1024) {
					setError("PDF file size must be less than 50MB");
					return;
				}
				setPdfFile(file);
			} else {
				if (!file.type.startsWith("image/")) {
					setError("Please select an image file");
					return;
				}
				if (file.size > 5 * 1024 * 1024) {
					setError("Image file size must be less than 5MB");
					return;
				}
				setCoverImageFile(file);
			}
			setError(null);
		}
	};

	return (
		<div className="min-h-screen bg-gray-900 py-8">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="bg-gradient-to-r from-purple-400/20 to-pink-400/20 backdrop-blur-lg rounded-xl p-6 border border-purple-400/30 mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-white mb-2">
								{magazine
									? "Edit Magazine"
									: "Create New Magazine"}
							</h1>
							<p className="text-gray-300">
								{magazine
									? "Update magazine details and manage content"
									: "Add a new magazine to showcase your digital publications"}
							</p>
						</div>
						<div className="hidden sm:flex items-center justify-center w-16 h-16 bg-purple-400/20 rounded-lg">
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
									d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
								/>
							</svg>
						</div>
					</div>
				</div>

				{/* Error Message */}
				{error && (
					<div className="mb-6 bg-red-900/50 border border-red-500 rounded-xl p-4 backdrop-blur-lg">
						<div className="flex items-center gap-3">
							<svg
								className="w-5 h-5 text-red-400"
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
							<p className="text-red-300 font-medium">{error}</p>
						</div>
					</div>
				)}

				{/* Success Message */}
				{success && (
					<div className="mb-6 bg-green-900/50 border border-green-500 rounded-xl p-4 backdrop-blur-lg">
						<div className="flex items-center gap-3">
							<svg
								className="w-5 h-5 text-green-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<p className="text-green-300 font-medium">
								{success}
							</p>
						</div>
					</div>
				)}

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Magazine Details */}
					<div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
						<h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
							<svg
								className="w-5 h-5 text-purple-400"
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
							Magazine Details
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Title */}
							<div className="md:col-span-2">
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Magazine Title *
								</label>
								<input
									type="text"
									value={formData.title}
									onChange={(e) =>
										setFormData({
											...formData,
											title: e.target.value,
										})
									}
									className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
									placeholder="e.g., Aamar Xopun - January Edition"
									required
								/>
							</div>

							{/* Year */}
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Year *
								</label>
								<select
									value={formData.year}
									onChange={(e) =>
										setFormData({
											...formData,
											year: parseInt(e.target.value),
										})
									}
									className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
									required
								>
									{years.map((year) => (
										<option key={year} value={year}>
											{year}
										</option>
									))}
								</select>
							</div>

							{/* Month */}
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Month *
								</label>
								<select
									value={formData.month}
									onChange={(e) =>
										setFormData({
											...formData,
											month: e.target.value,
										})
									}
									className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
									required
								>
									{months.map((month) => (
										<option key={month} value={month}>
											{month}
										</option>
									))}
								</select>
							</div>

							{/* Active Status */}
							<div className="md:col-span-2">
								<label className="block text-sm font-medium text-gray-300 mb-4">
									Status
								</label>
								<div className="flex items-center gap-3">
									<div className="relative">
										<input
											type="checkbox"
											checked={formData.isActive}
											onChange={(e) =>
												setFormData({
													...formData,
													isActive: e.target.checked,
												})
											}
											className="sr-only"
											id="active-status"
										/>
										<label
											htmlFor="active-status"
											className={`flex items-center cursor-pointer ${
												formData.isActive
													? "text-green-400"
													: "text-gray-400"
											}`}
										>
											<div
												className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-all duration-200 ${
													formData.isActive
														? "bg-green-500 border-green-500"
														: "border-gray-600"
												}`}
											>
												{formData.isActive && (
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
															d="M5 13l4 4L19 7"
														/>
													</svg>
												)}
											</div>
											<span className="font-medium">
												Active (visible to public)
											</span>
											<span
												className={`ml-2 px-2 py-1 text-xs rounded-full ${
													formData.isActive
														? "bg-green-500/20 text-green-400"
														: "bg-gray-600/20 text-gray-400"
												}`}
											>
												{formData.isActive
													? "ACTIVE"
													: "INACTIVE"}
											</span>
										</label>
									</div>
								</div>
							</div>

							{/* Description */}
							<div className="md:col-span-2">
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Description *
								</label>
								<textarea
									value={formData.description}
									onChange={(e) =>
										setFormData({
											...formData,
											description: e.target.value,
										})
									}
									rows={4}
									className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 resize-none"
									placeholder="Brief description of this magazine issue..."
									required
								/>
							</div>
						</div>
					</div>

					{/* PDF Upload */}
					<div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
						<h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
							<svg
								className="w-5 h-5 text-purple-400"
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
							PDF File{" "}
							{!magazine && (
								<span className="text-red-400">*</span>
							)}
						</h2>

						<div className="border-2 border-dashed border-gray-600 rounded-xl p-8 hover:border-purple-400 transition-all duration-200 bg-gray-700/30">
							<input
								type="file"
								accept=".pdf"
								onChange={(e) => handleFileChange(e, "pdf")}
								className="hidden"
								id="pdf-upload"
							/>
							<label
								htmlFor="pdf-upload"
								className="cursor-pointer flex flex-col items-center text-center"
							>
								<div className="w-16 h-16 bg-purple-400/20 rounded-full flex items-center justify-center mb-4">
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
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
								</div>
								<h3 className="text-lg font-semibold text-white mb-2">
									{pdfFile ? pdfFile.name : "Upload PDF File"}
								</h3>
								<p className="text-gray-300 mb-4">
									{pdfFile
										? "Click to select a different PDF file"
										: "Click to browse and select a PDF file"}
								</p>
								<div className="text-sm text-gray-400 space-y-1">
									<p>• Maximum file size: 50MB</p>
									<p>• Supported format: PDF</p>
									{!pdfFile && !magazine && (
										<p className="text-red-400">
											• Required for new magazines
										</p>
									)}
								</div>
								{magazine?.pdfUrl && !pdfFile && (
									<div className="mt-4 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm">
										Current PDF will be kept if no new file
										is selected
									</div>
								)}
							</label>
						</div>
					</div>

					{/* Cover Image Upload */}
					<div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
						<h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
							<svg
								className="w-5 h-5 text-purple-400"
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
							Cover Image (Optional)
						</h2>

						<div className="border-2 border-dashed border-gray-600 rounded-xl p-8 hover:border-purple-400 transition-all duration-200 bg-gray-700/30">
							<input
								type="file"
								accept="image/*"
								onChange={(e) => handleFileChange(e, "cover")}
								className="hidden"
								id="cover-upload"
							/>
							<label
								htmlFor="cover-upload"
								className="cursor-pointer flex flex-col items-center text-center"
							>
								<div className="w-16 h-16 bg-purple-400/20 rounded-full flex items-center justify-center mb-4">
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
											d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<h3 className="text-lg font-semibold text-white mb-2">
									{coverImageFile
										? coverImageFile.name
										: "Upload Cover Image"}
								</h3>
								<p className="text-gray-300 mb-4">
									{coverImageFile
										? "Click to select a different cover image"
										: "Click to browse and select a cover image"}
								</p>
								<div className="text-sm text-gray-400 space-y-1">
									<p>• Maximum file size: 5MB</p>
									<p>
										• Supported formats: JPG, PNG, GIF, WebP
									</p>
									<p>
										• Recommended size: 600x800px or similar
										aspect ratio
									</p>
								</div>
								{magazine?.coverImageUrl && !coverImageFile && (
									<div className="mt-4 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm">
										Current cover image will be kept if no
										new image is selected
									</div>
								)}
							</label>
						</div>
					</div>

					{/* Form Actions */}
					<div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
						<div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
							<button
								type="button"
								onClick={onCancel}
								className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 flex items-center justify-center gap-2"
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
										d="M10 19l-7-7m0 0l7-7m-7 7h18"
									/>
								</svg>
								Cancel
							</button>
							<button
								type="submit"
								disabled={loading}
								className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg font-semibold hover:from-purple-300 hover:to-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
							>
								{loading ? (
									<>
										<svg
											className="animate-spin w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 4.354a7.646 7.646 0 100 15.292 7.646 7.646 0 000-15.292zm0 0V1m0 3.354a7.646 7.646 0 100 15.292 7.646 7.646 0 000-15.292z"
											/>
										</svg>
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
										{magazine
											? "Update Magazine"
											: "Create Magazine"}
									</>
								)}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default MagazineForm;
