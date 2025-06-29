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
				if (file.size > 10 * 1024 * 1024) {
					setError("Image file size must be less than 10MB");
					return;
				}
				setCoverImageFile(file);
			}
			setError(null);
		}
	};

	return (
		<div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-6">
			<h2 className="text-2xl font-bold text-white mb-6">
				{magazine ? "Edit Magazine" : "Add New Magazine"}
			</h2>

			{error && (
				<div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
					{error}
				</div>
			)}

			{success && (
				<div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded mb-4">
					{success}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid md:grid-cols-2 gap-6">
					{/* Title */}
					<div>
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
							className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
							className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
							className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Status
						</label>
						<label className="flex items-center">
							<input
								type="checkbox"
								checked={formData.isActive}
								onChange={(e) =>
									setFormData({
										...formData,
										isActive: e.target.checked,
									})
								}
								className="mr-2 h-4 w-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400"
							/>
							<span className="text-gray-300">
								Active (visible to public)
							</span>
						</label>
					</div>
				</div>

				{/* Description */}
				<div>
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
						className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
						placeholder="Brief description of this magazine issue..."
						required
					/>
				</div>

				{/* PDF Upload */}
				<div>
					<label className="block text-sm font-medium text-gray-300 mb-2">
						PDF File {!magazine && "*"}
					</label>
					<div className="border-2 border-dashed border-gray-600 rounded-lg p-6">
						<input
							type="file"
							accept=".pdf"
							onChange={(e) => handleFileChange(e, "pdf")}
							className="hidden"
							id="pdf-upload"
						/>
						<label
							htmlFor="pdf-upload"
							className="cursor-pointer flex flex-col items-center"
						>
							<div className="text-gray-400 mb-2">📄</div>
							<span className="text-gray-300">
								{pdfFile
									? pdfFile.name
									: "Click to upload PDF file (max 50MB)"}
							</span>
							{magazine?.pdfUrl && !pdfFile && (
								<span className="text-green-400 text-sm mt-2">
									Current PDF will be kept if no new file is
									selected
								</span>
							)}
						</label>
					</div>
				</div>

				{/* Cover Image Upload */}
				<div>
					<label className="block text-sm font-medium text-gray-300 mb-2">
						Cover Image (Optional)
					</label>
					<div className="border-2 border-dashed border-gray-600 rounded-lg p-6">
						<input
							type="file"
							accept="image/*"
							onChange={(e) => handleFileChange(e, "cover")}
							className="hidden"
							id="cover-upload"
						/>
						<label
							htmlFor="cover-upload"
							className="cursor-pointer flex flex-col items-center"
						>
							<div className="text-gray-400 mb-2">🖼️</div>
							<span className="text-gray-300">
								{coverImageFile
									? coverImageFile.name
									: "Click to upload cover image (max 10MB)"}
							</span>
							{magazine?.coverImageUrl && !coverImageFile && (
								<span className="text-green-400 text-sm mt-2">
									Current cover image will be kept if no new
									image is selected
								</span>
							)}
						</label>
					</div>
				</div>

				{/* Form Actions */}
				<div className="flex gap-4 pt-6">
					<button
						type="submit"
						disabled={loading}
						className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading
							? "Saving..."
							: magazine
							? "Update Magazine"
							: "Create Magazine"}
					</button>
					<button
						type="button"
						onClick={onCancel}
						className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 transition-colors"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

export default MagazineForm;
